/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IForceConfigProps,
  getRealTextLength,
  IGraphDataProps,
  IGraphInterface,
  IGraphOptions,
  IHoverHighlightProps,
  ILineLabelTextStyle,
  ILineStyle,
  ILinkMapProps,
  ILinkTypes,
  INodeStyle,
  INodeTextStyle,
  INodeTypes,
  splitText,
} from "./config";
import * as d3 from "d3";
import {
  D3DragEvent,
  D3ZoomEvent,
  Simulation,
  zoomIdentity,
  ZoomTransform,
} from "d3";
import {
  LINE_STYLE,
  NODE_STYLE,
  NODE_TEXT_STYLE,
  TOOLTIP_CLASS,
} from "./constant";
import { judgeIn } from "./help";
// * 为了单独暴露 renderTooltip方法而存储 this 中的 tooltip 和 containerRect。
// * 因为独立调用 renderTooltip方法的话 this 下没有这两个属性。
let TOOL_TIP: HTMLDivElement | null;
let CONTAINER_RECT: Record<string, any>;
export default class Graph implements IGraphInterface {
  width: number;
  height: number;
  highlightShowText: boolean;
  hoverHighlight: IHoverHighlightProps;
  ILineStyle: ILineStyle;
  lineTextStyle: ILineLabelTextStyle;
  nodeStyle: INodeStyle;
  nodeTextStyle: INodeTextStyle;
  data: IGraphDataProps;
  containerTarget: string;
  containerRect: Record<string, any>;
  forceConfig: IForceConfigProps;
  tooltipTarget: string;
  linkMap: ILinkMapProps;
  colorNumber: number;
  highlightLinkList: Set<number>;
  highlightNodeList: Set<number>;
  mainCanvas: HTMLCanvasElement | null;
  mainContext: CanvasRenderingContext2D | null | undefined;
  hiddenContext: CanvasRenderingContext2D | null | undefined;
  hiddenCanvas: HTMLCanvasElement | null;
  tooltip: HTMLDivElement | null;
  simulation: d3.Simulation<INodeTypes, undefined> | undefined;
  currentTransform: ZoomTransform; // * 用于缩放和平移的变换矩阵
  backgroundColor: string;
  lineIconStyle: { width: number; height: number };
  radiusList: number[]; // * 所有节点半径的Set
  constructor(options: IGraphOptions) {
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
    this.backgroundColor = backgroundColor;
    this.currentTransform = zoomIdentity;
    this.width = width;
    this.height = height;
    this.highlightShowText = highlightShowText;
    this.hoverHighlight = hoverHighlight;
    this.ILineStyle = { ...LINE_STYLE, ...lineStyle };
    this.lineTextStyle = lineTextStyle;
    this.lineIconStyle = lineIconStyle;
    this.nodeStyle = { ...NODE_STYLE, ...nodeStyle };
    this.nodeTextStyle = { ...NODE_TEXT_STYLE, ...nodeTextStyle };
    this.data = data;
    this.containerTarget = containerTarget;
    this.containerRect = containerRect;
    CONTAINER_RECT = containerRect;
    this.forceConfig = forceConfig;
    this.tooltipTarget = tooltipTarget;
    this.linkMap = {};
    this.colorNumber = 1;
    this.highlightLinkList = new window.Set<number>();
    this.highlightNodeList = new window.Set<number>();

    (d3.select(containerTarget).node() as HTMLDivElement).innerHTML = "";
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
      .attr("class", TOOLTIP_CLASS)
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

    this.drawGraph();
  }

  // ? 将 十六进制的颜色值转换为 rgb的格式 。
  hex2Rgb(color: string): string {
    const arr = color.slice(1, color.length).split("");
    const rgb = [];
    for (let i = 0; i < arr.length; i += 2) {
      rgb.push(parseInt(arr[i] + arr[i + 1], 16));
    }
    return `rgb(${rgb.join(",")})`;
  }

  update(data: IGraphDataProps): void {
    this.data = data;
    this.mainContext?.clearRect(0, 0, this.width, this.height);
    this.drawGraph();
  }

  updateStyle(data: IGraphDataProps): void {
    // * 更新策略:
    // * update的时候不再使用draw Graph重新初始化力布局，而是使用tick更新节点信息。
    // ? 这样就不会导致页面闪烁。
    this.data.links.forEach((item, index) => {
      item.textStyle = data.links[index].textStyle;
      item.lineStyle = data.links[index].lineStyle;
      item.iconStyle = data.links[index].iconStyle;
      item.drawArrow = data.links[index].drawArrow;
    });
    this.data.nodes.forEach((item, index) => {
      item.textStyle = data.nodes[index].textStyle;
      item.nodeStyle = data.nodes[index].nodeStyle;
    });
    this.mainContext?.clearRect(0, 0, this.width, this.height);
    this.tick();
  }

  // * 单独暴露的渲染 tooltip的方法。
  // * 如果传递的是一个数组，则多行渲染
  renderTooltip(renderValue: string | string[], className?: string): void {
    let renderHtml = "";
    const event: any = window.event;
    if (event) {
      if (Array.isArray(renderValue)) {
        renderValue.forEach((item: string) => {
          renderHtml += item + "<br/>";
        });
      } else {
        renderHtml = renderValue;
      }

      d3.select(this?.tooltip || TOOL_TIP)
        .attr(
          "class",
          `${TOOLTIP_CLASS} ${className === undefined ? "" : className}`,
        )
        .html(`<span class="graph-tooltip-span">${renderHtml}</span>`)
        .style("display", "block")
        .style("opacity", 0);
      const contentRect = d3
        .select(this?.tooltip || TOOL_TIP)
        .node()!
        .getBoundingClientRect();
      let x = event.pageX - contentRect.width / 2;
      const y =
        event.clientY -
        contentRect.height -
        (this?.nodeTextStyle.fontSize || NODE_TEXT_STYLE.fontSize);
      if (
        contentRect.width / 2 + event.pageX >
        (this?.containerRect.rightPageX || CONTAINER_RECT.rightPageX)
      ) {
        x = event.pageX - contentRect.width;
      }
      d3.select(this?.tooltip || TOOL_TIP)
        .style("left", x + "px")
        .style("top", y + "px")
        .style("opacity", 1);
    }
  }

  // * 高亮与节点相关联的节点与连线
  // TODO: 自定义高亮深度(层数)
  highlight(id?: string): void {
    if (id) {
      // * 🧹清除副作用
      this.highlightLinkList.clear();
      this.highlightNodeList.clear();
      this.data.links?.forEach((item: ILinkTypes) => {
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
      });
    } else {
      this.highlightNodeList.clear();
      this.highlightLinkList.clear();
    }
    this.tick();
  }

  drawGraph(): void {
    const { nodeDistance, forceStrength } = this.forceConfig;
    this.simulation = d3
      .forceSimulation(this.data.nodes)
      .alphaDecay(0.03)
      .force(
        "link",
        d3
          .forceLink(this.data?.links)
          .id((d: Record<string, any>) => d.id)
          .distance(nodeDistance),
      )
      .force("charge", d3.forceManyBody().strength(forceStrength))
      .force(
        "collide",
        d3.forceCollide().radius(() => 60),
      )
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .on("tick", () => this.tick());
    d3.select(this.mainCanvas)
      .call(this.drag(this.simulation))
      .call(this.zoom())
      .on("dblclick.zoom", null)
      .on("mousemove", (event: MouseEvent) => {
        const x = this.currentTransform.invertX(event.offsetX),
          y = this.currentTransform.invertY(event.offsetY);
        /*
         * simulation.find() 只能抓取固定半径内的节点的信息，但是渲染的节点半径是不同的。
         * 所以在「构造函数中」初始化所有节点半径的 集合 并且 「从小到大排序」。
         * 每次抓取节点信息的时候，遍历这个集合中的元素作为半径抓取。
         * 如果可以使用抓取到信息，再判断「可以抓取到节点信息的半径」和「被抓取到的节点的半径」进行比较。
         * 如果前者大于后者，说明此时「并未在节点半径内抓取到元素」，而是沾到了半径较大节点的光，将这种情况判定为「未抓取到」。
         */
        for (let i = 0; i < this.radiusList.length; ++i) {
          const catchRadius = this.radiusList[i]; // * 获取当前抓取的半径
          const nodeInfo = this.simulation?.find(x, y, catchRadius);
          const INodeStyle = { ...this.nodeStyle, ...nodeInfo?.nodeStyle };
          if (
            nodeInfo !== undefined && // ? 可以抓取到
            !INodeStyle.hidden && // ? 不是隐藏节点
            catchRadius <= INodeStyle.radius // ? 抓取半径 <= 节点半径
          ) {
            const hightLightStatus = this.hoverHighlight;
            if (hightLightStatus) {
              this.hoverHighlight.show && this.highlight(nodeInfo.id);
              const namePosition =
                nodeInfo?.textStyle?.position || this.nodeTextStyle.position;
              namePosition === "center" &&
                this.renderNodeTooltip(nodeInfo, event);
            }
            nodeInfo.onHover?.(nodeInfo);
            break;
          } else {
            d3.select(this.tooltip).style("display", "none");
            this.highlight();
          }
        }

        /*
         * 在第一个canvas上触发 MouseEvent，拿到 offsetX 和 offsetY。
         * 然后获取第二个canvas上这个点对应的 rgb 的值。
         * 通过 rgb 可以在 linkMap 中索引到唯一的节点信息。
         */
        const hiddenCanvasColor = this.hiddenContext
          ?.getImageData(event.offsetX, event.offsetY, 1, 1)
          .data.slice(0, 3);
        const key = `rgb(${hiddenCanvasColor?.join(",")})`;
        if (key != "rgb(0,0,0)" && this.hiddenContext) {
          if (
            judgeIn(this.hiddenContext, { x: event.offsetX, y: event.offsetY })
          ) {
            if (this.linkMap[key].data?.onHover) {
              this.linkMap[key].data.onHover?.(
                this.linkMap[key].data,
                this.renderTooltip,
              );
            } else {
              const currentLink = this.linkMap[key].data;
              const { textStyle, labelText } = currentLink;
              labelText.length >
                (textStyle?.limit || this.lineTextStyle.limit) &&
                this.renderTooltip(labelText);
            }
          }
        }
      })
      .on("mouseout", (event: MouseEvent) => {
        const x = this.currentTransform.invertX(event.offsetX),
          y = this.currentTransform.invertY(event.offsetY);
        const nodeInfo = this.simulation?.find(x, y, 35);
        if (nodeInfo) {
          d3.select(this.tooltip).style("display", "none");
          this.highlight();
        }
      })
      .on("click", (event: MouseEvent) => {
        const x = this.currentTransform.invertX(event.offsetX),
          y = this.currentTransform.invertY(event.offsetY);
        for (let i = 0; i < this.radiusList.length; ++i) {
          const catchRadius = this.radiusList[i];
          const nodeInfo = this.simulation?.find(x, y, catchRadius);
          const INodeStyle = { ...this.nodeStyle, ...nodeInfo?.nodeStyle };
          if (
            nodeInfo &&
            !INodeStyle.hidden &&
            catchRadius <= INodeStyle.radius
          ) {
            nodeInfo?.onClick?.(nodeInfo);
          }
          const hiddenCanvasColor = this.hiddenContext
            ?.getImageData(event.offsetX, event.offsetY, 1, 1)
            .data.slice(0, 3);
          const key = `rgb(${hiddenCanvasColor?.join(",")})`;
          if (key != "rgb(0,0,0)") {
            this.linkMap[key].data?.onClick?.(this.linkMap[key].data);
          }
        }
      });
  }

  drag(simulation: Simulation<INodeTypes, ILinkTypes>): any {
    const dragSubject = (
      event: D3DragEvent<HTMLCanvasElement, IGraphDataProps, INodeTypes>,
    ): INodeTypes | undefined => {
      d3.select(this.tooltip).style("display", "none");
      // ? 原理同「mousemove」
      for (let i = 0; i < this.radiusList.length; ++i) {
        const item = this.radiusList[i];
        const nodeInfo = simulation.find(
          this.currentTransform.invertX(event.x),
          this.currentTransform.invertY(event.y),
          item,
        );
        if (
          nodeInfo &&
          (nodeInfo.nodeStyle?.radius ?? this.nodeStyle.radius) >= item
        ) {
          const INodeStyle = { ...this.nodeStyle, ...nodeInfo?.nodeStyle };
          return INodeStyle.hidden ? undefined : nodeInfo;
        }
      }
    };

    const dragStart = (
      event: D3DragEvent<HTMLCanvasElement, IGraphDataProps, INodeTypes>,
    ): void => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };

    const dragged = (
      event: D3DragEvent<HTMLCanvasElement, IGraphDataProps, INodeTypes>,
    ): void => {
      if (event.subject.x && event.subject.y) {
        // * 根据当前变换矩阵对移动的距离进行变换
        event.subject.fx =
          event.subject.x + event.dx * (1 / this.currentTransform.k);
        event.subject.fy =
          event.subject.y + event.dy * (1 / this.currentTransform.k);
      }
    };

    const dragended = (
      event: D3DragEvent<HTMLCanvasElement, IGraphDataProps, INodeTypes>,
    ): void => {
      if (!event.active) {
        this.simulation?.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;

      // ! 每次拖拽结束后会导致节点位置的变化，需要更新 LinkMap
      this.updateLinkMap();
    };

    return d3
      .drag()
      .subject(dragSubject)
      .on("start", dragStart)
      .on("drag", dragged)
      .on("end", dragended);
  }

  // * 获取唯一的 rgb 值
  genColor(): string {
    if (this.colorNumber > 255 * 255 * 255 - 1) {
      return "";
    }
    const ret: number[] = [];
    ret.push(this.colorNumber & 0xff);
    ret.push((this.colorNumber & 0xff00) >> 8);
    ret.push((this.colorNumber & 0xff0000) >> 16);
    this.colorNumber++;

    return `rgb(${ret.join(",")})`;
  }

  updateLinkMap(): void {
    this.colorNumber = 1;
    this.data.links?.forEach((item: ILinkTypes, index: number) => {
      const [x, y] = [
        ((item.source.x || 0) + (item.target.x || 0)) / 2,
        ((item.source.y || 0) + (item.target.y || 0)) / 2,
      ];
      // * 获取当前唯一的 key
      const nowColor = this.genColor();
      this.linkMap[nowColor] = {
        color: nowColor,
        position: { x, y },
        data: this.data.links[index],
      };
    });

    // * 在 hiddenCanvas 上渲染
    this.hiddenContext?.clearRect(0, 0, this.width, this.height);
    for (const key in this.linkMap) {
      const currentItem = this.linkMap[key];
      const ILineStyle = { ...this.ILineStyle, ...currentItem.data.lineStyle };
      if (ILineStyle.hidden) continue;
      this.hiddenContext?.beginPath();
      const { labelType = "text" } = currentItem.data;
      const labelIconStyle = {
        ...this.lineIconStyle,
        ...currentItem.data.iconStyle,
      };
      if (labelType === "path") {
        const [pathHeight, pathWidth] = [
          labelIconStyle.height,
          labelIconStyle.width,
        ];
        const x = this.currentTransform.applyX(
          currentItem.position.x - pathWidth,
        );
        const y = this.currentTransform.applyY(
          currentItem.position.y - pathHeight,
        );

        this.hiddenContext?.rect(
          x,
          y,
          pathWidth * this.currentTransform.k * 2,
          pathHeight * this.currentTransform.k * 2,
        );
        this.hiddenContext!.fillStyle = currentItem.color;
        this.hiddenContext?.fill();
      } else {
        if (
          !this.highlightShowText ||
          this.highlightLinkList.has(currentItem.data.index || 0)
        ) {
          const { labelText, textStyle } = currentItem.data;
          const { fontSize, padding, limit, textDirection, position } = {
            ...this.lineTextStyle,
            ...textStyle,
          };
          const renderTextForCnt =
            (labelText?.length || 0) > limit
              ? labelText.slice(0, limit) + "..."
              : labelText;
          const width =
            (getRealTextLength(renderTextForCnt, fontSize) + 2 * padding) *
            this.currentTransform.k;
          const height = (fontSize + 2 * padding) * this.currentTransform.k;
          this.hiddenContext?.save();
          const angle = this.getLinkAngle(currentItem.data);
          this.hiddenContext?.translate(
            this.currentTransform.applyX(currentItem.position.x),
            this.currentTransform.applyY(currentItem.position.y),
          );
          this.hiddenContext!.fillStyle = currentItem.color;

          const sourceNodeStyle = {
            ...this.nodeStyle,
            ...currentItem.data.source.nodeStyle,
          };
          const targetNodeStyle = {
            ...this.nodeStyle,
            ...currentItem.data.target.nodeStyle,
          };
          let extraValue =
            ((sourceNodeStyle.radius > targetNodeStyle.radius ? 1 : -1) *
              Math.abs(sourceNodeStyle.radius - targetNodeStyle.radius)) /
            2;
          extraValue += angle > 0 ? -extraValue * 2 : 0;

          textDirection === "natural" &&
            this.hiddenContext?.rotate(
              angle > 0 ? angle + Math.PI / 2 + Math.PI : angle + Math.PI / 2,
            );

          const rectPath = new window.Path2D();
          rectPath.rect(
            (-getRealTextLength(renderTextForCnt, fontSize) / 2 - extraValue) *
              this.currentTransform.k,
            position === "middle"
              ? -height / 2
              : -height - (padding / 2) * this.currentTransform.k,
            width,
            height,
          );
          this.hiddenContext?.fill(rectPath);
          this.hiddenContext?.restore();
        }
      }
      this.hiddenContext?.closePath();
    }
  }

  zoom(): any {
    const { scaleExtent } = this.forceConfig;
    return d3
      .zoom<HTMLCanvasElement, IGraphDataProps>()
      .scaleExtent([scaleExtent.min, scaleExtent.max])
      .on("zoom", (event: D3ZoomEvent<HTMLCanvasElement, IGraphDataProps>) => {
        this.currentTransform = event.transform;
        this.tick();
      });
  }

  tick(): void {
    this.mainContext?.save();
    this.mainContext?.clearRect(
      0,
      0,
      this.width * window.devicePixelRatio,
      this.height * window.devicePixelRatio,
    );

    this.mainContext?.translate(
      this.currentTransform.x * window.devicePixelRatio,
      this.currentTransform.y * window.devicePixelRatio,
    );
    this.mainContext?.scale(
      this.currentTransform.k * window.devicePixelRatio,
      this.currentTransform.k * window.devicePixelRatio,
    );

    this.data.links?.forEach((item) => {
      const linkStyle = { ...this.ILineStyle, ...item.lineStyle };
      if (!linkStyle.hidden) this.drawLink(item);
    });

    this.data.nodes?.forEach((item) => {
      const INodeStyle = { ...this.nodeStyle, ...item.nodeStyle };
      if (!INodeStyle.hidden) this.drawNode(item);
    });

    this.updateLinkMap();
    this.mainContext?.restore();
  }

  drawLink(link: ILinkTypes): void {
    const highLightStatus = this.highlightLinkList.size === 0 ? false : true;
    const ILineStyle = { ...this.ILineStyle, ...link.lineStyle };
    const { drawArrow = true } = link;
    this.drawLinkBody(link);
    const lineColorRender =
      highLightStatus && !this.highlightLinkList.has(link.index || 0)
        ? this.hoverHighlight.unHighlightBorderColor
        : ILineStyle.color || this.ILineStyle.color;

    if (!this.highlightShowText || link.labelType === "path") {
      this.drawWidgetOnLink(link);
    } else {
      this.highlightLinkList.has(link.index || 0) &&
        this.drawWidgetOnLink(link);
    }

    if (Array.isArray(lineColorRender)) {
      drawArrow &&
        this.drawArrow(
          link,
          lineColorRender.sort(
            (a, b) =>
              parseInt(a.slice(1, a.length - 1), 16) -
              parseInt(b.slice(1, b.length - 1), 16),
          )[lineColorRender.length - 1],
        );
    } else {
      drawArrow && this.drawArrow(link, lineColorRender);
    }
  }

  drawWidgetOnLink(link: ILinkTypes): void {
    const { labelType = "text", labelIcon, labelText } = link;
    const labelTextStyle = { ...this.lineTextStyle, ...link.textStyle };
    const labelIconStyle = { ...this.lineIconStyle, ...link.iconStyle };
    const ILineStyle = { ...this.ILineStyle, ...link.lineStyle };
    this.mainContext!.fillStyle = this.backgroundColor;

    if (labelType === "text") {
      const textStyle = labelTextStyle;
      if (!labelText) return;
      const len = labelText.length;
      const renderTextForCnt =
        len > textStyle.limit
          ? labelText.slice(0, textStyle.limit) + "..."
          : labelText;
      const width =
          getRealTextLength(renderTextForCnt, textStyle.fontSize) +
          4 * textStyle.padding,
        height = textStyle.fontSize + 2 * textStyle.padding;
      const angle = this.getLinkAngle(link);
      const x = ((link.source.x || 0) + (link.target.x || 0)) / 2,
        y = ((link.source.y || 0) + (link.target.y || 0)) / 2;

      this.mainContext?.save();
      this.mainContext?.translate(x, y);
      if (textStyle.textDirection === "natural") {
        this.mainContext?.rotate(
          angle > 0 ? angle + Math.PI / 2 + Math.PI : angle + Math.PI / 2,
        );
      }

      /*
       * 处理 Link上 label 的位置会因为node半径的大小不同而不居中的问题
       * 如果半径相同则不处理
       * 如果不同的话只需要判断是哪个节点比较小，然后将 label 向这个方向平移半径差值的「一半」即可
       */
      const sourceNodeStyle = {
        ...this.nodeStyle,
        ...link.source.nodeStyle,
      };
      const targetNodeStyle = {
        ...this.nodeStyle,
        ...link.target.nodeStyle,
      };
      let extraValue =
        ((sourceNodeStyle.radius > targetNodeStyle.radius ? 1 : -1) *
          Math.abs(sourceNodeStyle.radius - targetNodeStyle.radius)) /
        2;
      extraValue += angle > 0 ? -extraValue * 2 : 0;

      this.mainContext?.fillRect(
        -(
          getRealTextLength(renderTextForCnt, textStyle.fontSize) / 2 -
          textStyle.padding +
          extraValue
        ),
        textStyle.position === "middle"
          ? -(textStyle.fontSize / 2 + textStyle.padding)
          : -height - textStyle.padding / 2 - ILineStyle.width / 2 - 1,
        width,
        height,
      );
      this.mainContext!.fillStyle = textStyle.color;
      this.mainContext!.font = `${textStyle.fontSize}px ${textStyle.fontFamily}`;
      this.mainContext?.fillText(
        renderTextForCnt,
        -getRealTextLength(renderTextForCnt, textStyle.fontSize) / 2 -
          extraValue,
        textStyle.position === "middle"
          ? textStyle.padding + textStyle.fontSize / 3
          : // * padding 兜底
            -ILineStyle.width - (textStyle.padding || 2),
      );

      this.mainContext?.restore();
    } else if (labelType === "path") {
      const x =
          ((link.source.x || 0) + (link.target.x || 0)) / 2 -
          labelIconStyle.width,
        y =
          ((link.source.y || 0) + (link.target.y || 0)) / 2 -
          labelIconStyle.height;
      this.mainContext?.save();
      this.mainContext!.lineWidth = 1;
      this.mainContext?.setLineDash([]);
      this.mainContext?.translate(x, y);
      this.mainContext?.beginPath();

      labelIcon.forEach((item) => {
        this.mainContext!.fillStyle = this.backgroundColor;
        this.mainContext?.fill(item.path);
      });

      labelIcon.forEach((item) => {
        if (item.type == "fill") {
          this.mainContext!.fillStyle = item.color;
          this.mainContext?.fill(item.path);
        } else {
          this.mainContext!.strokeStyle = item.color;
          this.mainContext?.stroke(item.path);
        }
      });

      this.mainContext?.closePath();
      this.mainContext?.restore();
    }
  }

  drawArrow(link: ILinkTypes, color: string): void {
    const { target } = link;
    const xt = target.x,
      yt = target.y;
    const radius = target.nodeStyle?.radius || this.nodeStyle.radius;
    const borderWidth =
      target.nodeStyle?.borderWidth || this.nodeStyle.borderWidth;
    const angle = this.getLinkAngle(link);

    this.mainContext?.save();
    this.mainContext?.beginPath();

    if (xt && yt) {
      this.mainContext?.translate(xt, yt);
      this.mainContext?.rotate(angle);

      const radiusAddBorderWidth = radius + borderWidth;
      this.mainContext?.moveTo(0, radiusAddBorderWidth + 5);
      this.mainContext?.lineTo(-3, radiusAddBorderWidth + 7);
      this.mainContext?.lineTo(0, radiusAddBorderWidth);
      this.mainContext?.lineTo(3, radiusAddBorderWidth + 7);
      this.mainContext?.lineTo(0, radiusAddBorderWidth + 5);

      this.mainContext?.restore();
      this.mainContext!.fillStyle = color;
      this.mainContext?.fill();
    }
  }

  getLinkAngle(link: ILinkTypes): number {
    const { source, target } = link;
    const xt = target.x,
      yt = target.y;
    const xs = source.x,
      ys = source.y;
    if (xs && xt && ys && yt) {
      let angle = Math.atan((yt - ys) / (xt - xs));
      angle += ((xt > xs ? 90 : -90) * Math.PI) / 180;
      return angle;
    } else {
      return 0;
    }
  }
  drawLinkBody(link: ILinkTypes): void {
    this.mainContext?.beginPath();
    const highLightStatus = this.highlightLinkList.size === 0 ? false : true;

    const { drawArrow = true } = link;
    const angle = this.getLinkAngle(link);
    const sourceNodeStyle = { ...this.nodeStyle, ...link.source.nodeStyle };
    const targetNodeStyle = { ...this.nodeStyle, ...link.target.nodeStyle };
    const ILineStyle = { ...this.ILineStyle, ...link.lineStyle };
    const sourceRadius = sourceNodeStyle.radius,
      sourceBorderWidth = sourceNodeStyle.borderWidth,
      targetRadius = targetNodeStyle.radius,
      targetBorderWidth = targetNodeStyle.borderWidth;
    const lineColorRender =
      highLightStatus && !this.highlightLinkList.has(link.index || 0)
        ? this.hoverHighlight.unHighlightBorderColor
        : ILineStyle.color;

    ILineStyle.lineType === "dashed"
      ? this.mainContext?.setLineDash([2, 2])
      : this.mainContext?.setLineDash([]);
    this.mainContext!.lineWidth = ILineStyle.width || this.ILineStyle.width;

    if (link.source.x && link.source.y && link.target.x && link.target.y) {
      if (Array.isArray(lineColorRender)) {
        const g: CanvasGradient = this.mainContext!.createLinearGradient(
          link.source.x,
          link.source.y,
          link.target.x,
          link.target.y,
        );
        lineColorRender
          .sort(
            (a, b) =>
              parseInt(a.slice(1, a.length - 1), 16) -
              parseInt(b.slice(1, b.length - 1), 16),
          )
          .forEach((item, index: number) => {
            g?.addColorStop((index + 1) / lineColorRender.length, item);
          });
        this.mainContext?.moveTo(
          link.source.x -
            (sourceRadius + sourceBorderWidth) * Math.cos(angle + Math.PI / 2),
          link.source.y -
            (sourceRadius + sourceBorderWidth) * Math.sin(angle + Math.PI / 2),
        );
        this.mainContext?.lineTo(
          link.target.x +
            (targetBorderWidth + targetRadius + (drawArrow ? 4 : 0)) *
              Math.cos(angle + Math.PI / 2),
          link.target.y +
            (targetBorderWidth + targetRadius + (drawArrow ? 4 : 0)) *
              Math.sin(angle + Math.PI / 2),
        );
        this.mainContext!.strokeStyle = g;
        this.mainContext?.stroke();
      } else {
        this.mainContext?.save();
        this.mainContext?.translate(link.source.x, link.source.y);
        this.mainContext?.moveTo(
          -(sourceRadius + sourceBorderWidth) * Math.cos(angle + Math.PI / 2),
          -(sourceRadius + sourceBorderWidth) * Math.sin(angle + Math.PI / 2),
        );
        this.mainContext?.lineTo(
          link.target.x -
            link.source.x +
            (targetRadius + targetBorderWidth + (drawArrow ? 4 : 0)) *
              Math.cos(angle + Math.PI / 2),
          link.target.y -
            link.source.y +
            (targetRadius + targetBorderWidth + (drawArrow ? 4 : 0)) *
              Math.sin(angle + Math.PI / 2),
        );
        this.mainContext!.strokeStyle = lineColorRender;
        this.mainContext?.stroke();
        this.mainContext?.restore();
      }
    }
  }

  drawNodeBorder(node: INodeTypes): void {
    let borderColor = "";
    const INodeStyle = { ...this.nodeStyle, ...node.nodeStyle };
    const highLightStatus = this.highlightNodeList.size === 0 ? false : true;
    if (
      node.nodeStyle?.borderColor === undefined &&
      this.nodeStyle?.borderColor === NODE_STYLE.borderColor
    ) {
      const contentColor = node.nodeStyle?.color || this.nodeStyle.color;
      if (contentColor[0] == "#") {
        const arr = contentColor.slice(1, contentColor.length).split("");
        const rgb = [];
        for (let i = 0; i < arr.length; i += 2) {
          rgb.push(parseInt(arr[i] + arr[i + 1], 16));
        }
        borderColor = `rgba(${rgb.join(",")}, ${INodeStyle.opacity})`;
      } else {
        borderColor = `rgba(${contentColor.slice(
          4,
          contentColor.length - 1,
        )}, 0.5)`;
      }
      borderColor =
        highLightStatus && !this.highlightNodeList.has(node.index || 0)
          ? this.hoverHighlight.unHighlightBorderColor
          : borderColor;
    } else {
      borderColor =
        highLightStatus && !this.highlightNodeList.has(node.index || 0)
          ? this.hoverHighlight.unHighlightBorderColor
          : INodeStyle.borderColor;
    }
    const nodeBorder = new window.Path2D();
    nodeBorder.arc(
      node.x || 0,
      node.y || 0,
      INodeStyle.radius + INodeStyle.borderWidth,
      0,
      2 * Math.PI,
    );
    this.mainContext!.fillStyle = borderColor;
    this.mainContext?.fill(nodeBorder);
  }

  drawNode(node: INodeTypes): void {
    const highLightStatus = this.highlightNodeList.size === 0 ? false : true;
    const INodeStyle = { ...this.nodeStyle, ...node.nodeStyle };

    this.drawNodeBorder(node);

    const nodeContent = new window.Path2D();
    nodeContent.arc(
      node.x || 0,
      node.y || 0,
      INodeStyle.radius,
      0,
      2 * Math.PI,
    );

    const color =
      highLightStatus && !this.highlightNodeList.has(node.index || 0)
        ? this.hoverHighlight.unHighlightContentColor
        : INodeStyle.color;
    this.mainContext!.fillStyle = color;
    this.mainContext?.fill(nodeContent);

    this.drawNodeName(node);
  }

  drawNodeName(node: INodeTypes): void {
    const { labelText } = node;
    const INodeStyle = { ...this.nodeStyle, ...node.nodeStyle };
    const textStyle = { ...this.nodeTextStyle, ...node.textStyle };
    const { color, fontFamily, fontSize, lines, padding, position } = textStyle;
    const { radius, borderWidth } = INodeStyle;
    this.mainContext!.fillStyle = color;
    this.mainContext!.font = `${fontSize}px ${fontFamily}`;
    this.mainContext!.textAlign = "start";

    if (position === "center") {
      this.mainContext!.textAlign = "center";
      const renderText = splitText(
        this.mainContext,
        node.labelText,
        fontSize,
        radius * 2 - borderWidth,
        lines,
      );
      renderText.forEach((ele, index) => {
        if (renderText.length !== 1) {
          const offsetY = index * fontSize;
          this.mainContext?.fillText(
            ele.text,
            node.x || 0,
            (node.y || 0) + offsetY - 0.5 * renderText.length,
          );
        } else {
          this.mainContext?.fillText(
            ele.text,
            node.x || 0,
            (node.y || 0) + fontSize / 3,
          );
        }
      });
    } else if (position === "right") {
      this.mainContext?.fillText(
        labelText,
        (node.x || 0) + radius + borderWidth + padding,
        (node.y || 0) + fontSize / 2,
      );
    } else if (position === "left") {
      this.mainContext?.fillText(
        labelText,
        (node.x || 0) -
          fontSize * labelText.length -
          borderWidth -
          radius -
          padding,
        (node.y || 0) + fontSize / 2,
      );
    } else if (position === "top") {
      this.mainContext!.textAlign = "center";
      this.mainContext?.fillText(
        labelText,
        node.x || 0,
        (node.y || 0) - radius - borderWidth - padding,
      );
    } else if (position === "bottom") {
      this.mainContext!.textAlign = "center";
      this.mainContext?.fillText(
        labelText,
        node.x || 0,
        (node.y || 0) + radius + borderWidth + padding + fontSize,
      );
    }
  }

  renderNodeTooltip(info: INodeTypes, event: MouseEvent): void {
    const textStyle = { ...this.nodeTextStyle, ...info.textStyle };

    d3.select(this.tooltip)
      .attr("class", TOOLTIP_CLASS)
      .html(`<span class="graph-tooltip-span">${info.labelText}</span>`)
      .style("display", "block")
      .style("opacity", 0);
    const contentRect = d3.select(this.tooltip).node()!.getBoundingClientRect();
    let x = event.pageX - contentRect.width / 2;
    const y =
      event.clientY -
      contentRect.height -
      (textStyle?.fontSize || this.nodeTextStyle.fontSize);
    if (contentRect.width / 2 + event.pageX > this.containerRect.rightPageX) {
      x = event.pageX - contentRect.width;
    }

    d3.select(this.tooltip)
      .style("left", x + "px")
      .style("top", y + "px")
      .style("opacity", 1);
  }
}
