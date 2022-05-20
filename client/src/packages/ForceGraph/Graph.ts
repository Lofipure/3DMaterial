import * as d3 from "d3";
import { render as ReactRender } from "react-dom";
import * as Types from "./types";
import * as Constant from "./constant";
import * as Event from "./event";
import * as Help from "./help";
import { is } from "./utils";

// * 为了单独暴露 renderTooltip方法而存储 this 中的 tooltip 和 containerRect。
// * 因为独立调用 renderTooltip方法的话 this 下没有这两个属性。
let TOOL_TIP: HTMLDivElement | null;
let CONTAINER_RECT: Record<string, any>;

export default class Graph implements Types.IGraphInterface {
  width: number;
  height: number;
  highlightShowText: boolean;
  containerTarget: string;
  containerRect: Record<string, any>;
  tooltipTarget: string;
  colorNumber: number;
  highlightLinkList: Set<number>;
  highlightNodeList: Set<number>;
  mainCanvas: HTMLCanvasElement | null;
  mainContext: CanvasRenderingContext2D | null | undefined;
  hiddenContext: CanvasRenderingContext2D | null | undefined;
  hiddenCanvas: HTMLCanvasElement | null;
  tooltip: HTMLDivElement | null;
  simulation: d3.Simulation<Types.INodeType, undefined> | undefined;
  currentTransform: d3.ZoomTransform; // * 用于缩放和平移的变换矩阵
  backgroundColor: string;
  radiusList: number[]; // * 所有节点半径的Set
  hoverHighlight: Types.FilterUnRequiredType<Types.IHoverHighlightProps>;
  lineStyle: Types.FilterUnRequiredType<Types.ILineStyle>;
  lineTextStyle: Types.FilterUnRequiredType<Types.ILineLabelTextStyle>;
  nodeStyle: Types.FilterUnRequiredType<Types.INodeStyle>;
  nodeTextStyle: Types.FilterUnRequiredType<Types.INodeTextStyle>;
  data: Types.FilterUnRequiredType<Types.IGraphDataProps>;
  forceConfig: Types.FilterUnRequiredType<Types.IForceConfigProps>;
  linkMap: Types.FilterUnRequiredType<Types.ILinkMapProps>;
  lineIconStyle: Types.FilterUnRequiredType<Types.ILineLabelIconStyle>;
  draggingNode?: Types.INodeType;
  isHighlightRoad?: boolean;
  constructor(options: Types.IGraphOptions) {
    const {
      width,
      height,
      highlightShowText,
      hoverHighlight,
      lineStyle,
      lineTextStyle,
      nodeStyle,
      nodeTextStyle,
      data,
      containerTarget,
      containerRect,
      forceConfig,
      tooltipTarget,
      backgroundColor,
      lineIconStyle,
    } = options;
    this.backgroundColor = backgroundColor ?? Constant.BACKGROUND_COLOR;
    this.currentTransform = d3.zoomIdentity;
    this.width = width;
    this.height = height;
    this.highlightShowText = !!highlightShowText;
    this.hoverHighlight = { ...Constant.HOVER_HIGHLIGHT, ...hoverHighlight };
    this.lineStyle = { ...Constant.LINE_STYLE, ...lineStyle };
    this.lineTextStyle = {
      ...Constant.LINE_LABEL_TEXT_STYLE,
      ...lineTextStyle,
    };
    this.lineIconStyle = {
      ...Constant.LINE_LABEL_PATH_STYLE,
      ...lineIconStyle,
    };
    this.nodeStyle = { ...Constant.NODE_STYLE, ...nodeStyle };
    this.nodeTextStyle = { ...Constant.NODE_TEXT_STYLE, ...nodeTextStyle };
    this.data = data;
    this.containerTarget = containerTarget;
    this.containerRect = containerRect;
    CONTAINER_RECT = containerRect;
    this.forceConfig = { ...Constant.FORCE_CONFIG, ...forceConfig };
    this.tooltipTarget = tooltipTarget;
    this.linkMap = {};
    this.colorNumber = 1;
    this.highlightLinkList = new window.Set<number>();
    this.highlightNodeList = new window.Set<number>();

    (<HTMLDivElement>d3.select(containerTarget).node()).innerHTML = "";
    this.mainCanvas = d3
      .select(containerTarget)
      .append("canvas")
      .attr("width", width * window.devicePixelRatio)
      .attr("height", height * window.devicePixelRatio)
      .style("width", width + "px")
      .style("height", height + "px")
      .attr("id", "main-canvas")
      .node();
    this.mainContext = this.mainCanvas?.getContext("2d");

    this.hiddenCanvas = d3
      .select(containerTarget)
      .append("canvas")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "hidden-canvas")
      .node();
    this.hiddenContext = this.hiddenCanvas?.getContext("2d");

    this.tooltip = d3
      .select(tooltipTarget)
      .append("div")
      .attr("class", Constant.TOOLTIP_CLASS)
      .attr("id", "TOOLTIP_BOX")
      .node();
    TOOL_TIP = this.tooltip;

    // * Set 后转换为数组然后排序，为了精准获取节点。
    this.radiusList = Array.from(
      new window.Set(
        this.data.nodes.map(
          (item) => item.nodeStyle?.radius ?? this.nodeStyle.radius,
        ),
      ),
    ).sort();

    this.drawGraph(true);
  }

  update(data: Types.IGraphDataProps): void {
    this.data = data;
    this.mainContext?.clearRect(0, 0, this.width, this.height);
    this.drawGraph();
  }

  updateStyle(data: Types.IGraphDataProps): void {
    // * 更新策略:
    // * update的时候不再使用draw Graph重新初始化力布局，而是使用tick更新节点信息。
    // ? 这样就不会导致页面闪烁。
    this.data.links.forEach((item, index) => {
      item.textStyle = data.links[index]?.textStyle;
      item.lineStyle = data.links[index]?.lineStyle;
      item.iconStyle = data.links[index]?.iconStyle;
      item.drawArrow = data.links[index]?.drawArrow;
    });
    this.data.nodes.forEach((item, index) => {
      item.textStyle = data.nodes[index]?.textStyle;
      item.nodeStyle = data.nodes[index]?.nodeStyle;
    });
    this.mainContext?.clearRect(0, 0, this.width, this.height);
    Event.handleTick(this);
  }

  // * 单独暴露的渲染 tooltip的方法。
  // * 如果传递的是一个数组，则多行渲染
  renderTooltip(
    renderValue: string | string[] | (() => JSX.Element),
    className?: string,
  ): void {
    // const renderHtml = "";
    const event: any = window.event;
    if (event) {
      const tooltipNode = d3
        .select(this?.tooltip ?? TOOL_TIP)
        .attr(
          "class",
          `${Constant.TOOLTIP_CLASS} ${
            className === undefined ? "" : className
          }`,
        )
        .style("display", "block")
        .style("opacity", 0)
        .node();
      const contentRect = tooltipNode!.getBoundingClientRect();
      let x = event.pageX - contentRect.width / 2;
      const y =
        event.clientY -
        contentRect.height -
        (this?.nodeTextStyle.fontSize || Constant.NODE_TEXT_STYLE.fontSize);
      if (
        contentRect.width / 2 + event.pageX >
        (this?.containerRect.rightPageX || CONTAINER_RECT.rightPageX)
      ) {
        x = event.pageX - contentRect.width;
      }
      d3.select(tooltipNode)
        .style("left", x + "px")
        .style("top", y + "px")
        .style("opacity", 1);
      if (typeof renderValue == "function") {
        ReactRender(renderValue(), tooltipNode);
      } else {
        ReactRender(Help.createElement(renderValue), tooltipNode);
      }
    }
  }

  // * 高亮与节点相关联的节点与连线
  highlight(id?: string): void {
    if (id) {
      // * 🧹清除副作用
      Help.cleanHighlightRoad(this);
      this.data.links?.forEach((item: Types.ILinkType) => {
        if (typeof item.source != "string" && typeof item.target != "string") {
          if (item.source.id === id || item.target.id === id) {
            if (
              item.index != undefined &&
              item.source.index != undefined &&
              item.target.index != undefined
            ) {
              // * 将高亮渲染的「节点」和「连线」添加到 list 中
              this.highlightLinkList.add(item.index);
              this.highlightNodeList.add(item.source.index);
              this.highlightNodeList.add(item.target.index);
            }
          }
        }
      });
    } else {
      this.highlightNodeList.clear();
      this.highlightLinkList.clear();
    }
    this.updateStyle(this.data);
  }

  drawGraph(init?: boolean): void {
    const { nodeDistance, forceStrength, alphaDecay } = this.forceConfig;
    this.simulation = d3
      .forceSimulation(this.data.nodes)
      .alphaDecay(alphaDecay)
      .force(
        "link",
        d3
          .forceLink(this.data?.links)
          .id((d: Record<string, any>) => d.id)
          .distance((link) => {
            if (is.func(nodeDistance)) {
              return nodeDistance?.(link);
            } else if (is.number(nodeDistance)) {
              return nodeDistance;
            }
            return Constant.FORCE_CONFIG.nodeDistance;
          }),
      )
      .force("charge", d3.forceManyBody().strength(forceStrength))
      .force(
        "collide",
        d3.forceCollide().radius(() => 60),
      )
      .force(
        "center",
        init ? d3.forceCenter(this.width / 2, this.height / 2) : null,
      )
      .on("tick", () => Event.handleTick(this));
    d3.select(this.mainCanvas)
      .call(Event.handleDrag(this))
      .call(Event.handleZoom(this))
      .on("dblclick.zoom", null)
      .on("mousemove", (event: MouseEvent) =>
        Event.handleMouseMove(event, this),
      )
      .on("mouseout", (event: MouseEvent) => Event.handleMouseOut(event, this))
      .on("dblclick", (event: MouseEvent) =>
        Event.handleDoubleClick(event, this),
      )
      .on("click", (event: MouseEvent) => Event.handleClick(event, this));
  }

  addRelationNodes(
    sourceNode: Types.INodeType,
    targetNodeList: Types.INodeType[],
  ) {
    if (!targetNodeList?.length) return;

    const __data = this.data,
      nodeList = targetNodeList;
    const linkList = nodeList.map<Types.ILinkType>((item) => ({
      source: sourceNode.id,
      target: item.id,
    }));
    __data.nodes.push(...nodeList);
    __data.links = [
      ...__data.links.map((item) => ({
        ...item,
        source: is.string(item.source) ? item.source : item.source.id,
        target: is.string(item.target) ? item.target : item.target.id,
      })),
      ...linkList,
    ];

    this.update(__data);
  }

  removeNode(node: Types.INodeType) {
    this.data.nodes = this.data.nodes.filter((item) => item != node);
    this.data.links = this.data.links.filter((item) => {
      if (is.string(item.source) || is.string(item.target)) {
        return !(item.source == node.id || item.target == node.id);
      } else {
        return !(item.source.id == node.id || item.target.id == node.id);
      }
    });

    this.update(this.data);
  }

  toggleFixNode(node: Types.INodeType, cb?: (node: Types.INodeType) => void) {
    if (!node.__last)
      node.__last = {
        x: node.x,
        y: node.y,
      };
    node.isFixed = !node.isFixed;
    cb?.(node);
  }

  getNodeBuffer(method: (node: Types.INodeType) => boolean) {
    return this.data.nodes.find(method);
  }

  highlightRoad(nodes: Array<Types.INodeType | string>) {
    const getNode = (node: Types.INodeType | string) =>
      is.string(node) ? this.getNodeBuffer((item) => item.id == node) : node;

    const getNodeId = (node: Types.INodeType | string) =>
      is.string(node) ? node : node.id;

    const getHighlightInfo = (
      source: Types.INodeType | string,
      target: Types.INodeType | string,
    ) => {
      const [sourceNode, targetNode] = [getNode(source), getNode(target)];

      const linkIndex = this.data.links.findIndex(
        (item) =>
          getNodeId(item.source) == getNodeId(source) &&
          getNodeId(item.target) == getNodeId(target),
      );
      return [
        this.data.nodes.findIndex((item) => item == sourceNode),
        this.data.nodes.findIndex((item) => item == targetNode),
        linkIndex,
      ];
    };

    Help.cleanHighlightRoad(this);
    for (let i = 1; i < nodes.length; ++i) {
      const [source, target, link] = getHighlightInfo(nodes[i - 1], nodes[i]);
      this.highlightNodeList.add(source);
      this.highlightNodeList.add(target);
      this.highlightLinkList.add(link);
    }

    this.isHighlightRoad = true;
    this.updateStyle(this.data);
  }

  getRelationNode(
    node: Types.INodeType,
  ): { node: Types.INodeType; type: "source" | "target" }[] {
    const result: { node: Types.INodeType; type: "source" | "target" }[] = [];
    this.data.links.forEach((link) => {
      const { source, target } = link;
      if (source == node) {
        const node = is.string(target)
          ? this.getNodeBuffer((node) => node.id == target)
          : target;
        node &&
          result.push({
            node,
            type: "source",
          });
      } else if (target == node) {
        const node = is.string(source)
          ? this.getNodeBuffer((node) => node.id == source)
          : source;
        node &&
          result.push({
            node,
            type: "target",
          });
      }
    });
    return result;
  }
}
