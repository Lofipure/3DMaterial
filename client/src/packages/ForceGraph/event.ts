import Graph from "./Graph";
import * as d3 from "d3";
import { judgeIn } from "./utils";
import { IGraphDataProps, INodeType } from "./types";
import { updateLinkMap } from "./help";
import { drawLink, drawNode } from "./render";

export const handleMouseMove = (event: MouseEvent, that: Graph) => {
  const x = that.currentTransform.invertX(event.offsetX),
    y = that.currentTransform.invertY(event.offsetY);
  /*
   * simulation.find() 只能抓取固定半径内的节点的信息，但是渲染的节点半径是不同的。
   * 所以在「构造函数中」初始化所有节点半径的 集合 并且 「从小到大排序」。
   * 每次抓取节点信息的时候，遍历这个集合中的元素作为半径抓取。
   * 如果可以使用抓取到信息，再判断「可以抓取到节点信息的半径」和「被抓取到的节点的半径」进行比较。
   * 如果前者大于后者，说明此时「并未在节点半径内抓取到元素」，而是沾到了半径较大节点的光，将这种情况判定为「未抓取到」。
   */
  for (let i = 0; i < that.radiusList.length; ++i) {
    const catchRadius = that.radiusList[i]; // * 获取当前抓取的半径
    const nodeInfo = that.simulation?.find(x, y, catchRadius);
    const INodeStyle = { ...that.nodeStyle, ...nodeInfo?.nodeStyle };
    if (
      nodeInfo !== undefined && // ? 可以抓取到
      catchRadius <= INodeStyle.radius // ? 抓取半径 <= 节点半径
    ) {
      const hightLightStatus = that.hoverHighlight;
      if (hightLightStatus) {
        that.hoverHighlight.show && that.highlight(nodeInfo.id);
        const namePosition =
          nodeInfo?.textStyle?.position || that.nodeTextStyle.position;
        namePosition == "center" &&
          nodeInfo?.labelText &&
          that.renderTooltip(nodeInfo.labelText);
      }
      nodeInfo.onHover?.(nodeInfo);
      break;
    } else {
      d3.select(that.tooltip).style("display", "none");
      if (
        (that.highlightLinkList.size || that.highlightNodeList.size) &&
        !that.isHighlightRoad
      ) {
        that.highlight();
      }
    }
  }

  /*
   * 在第一个canvas上触发 MouseEvent，拿到 offsetX 和 offsetY。
   * 然后获取第二个canvas上这个点对应的 rgb 的值。
   * 通过 rgb 可以在 linkMap 中索引到唯一的节点信息。
   */
  const hiddenCanvasColor = that.hiddenContext
    ?.getImageData(event.offsetX, event.offsetY, 1, 1)
    .data.slice(0, 3);
  const key = `rgb(${hiddenCanvasColor?.join(",")})`;
  if (key != "rgb(0,0,0)" && that.hiddenContext) {
    if (judgeIn(that.hiddenContext, { x: event.offsetX, y: event.offsetY })) {
      console.log("[🔧 Debug 🔧]", "link", that.linkMap[key].data?.onHover);
      if (that.linkMap[key].data?.onHover) {
        that.linkMap[key].data.onHover?.(
          that.linkMap[key].data,
          that.renderTooltip,
        );
      } else {
        const currentLink = that.linkMap[key].data;
        const { textStyle, labelText = "" } = currentLink;
        labelText.length > (textStyle?.limit || that.lineTextStyle.limit) &&
          that.renderTooltip(labelText);
      }
    }
  }
};

export const handleMouseOut = (event: MouseEvent, that: Graph) => {
  const x = that.currentTransform.invertX(event.offsetX),
    y = that.currentTransform.invertY(event.offsetY);
  const nodeInfo = that.simulation?.find(x, y, 35);
  if (nodeInfo) {
    d3.select(that.tooltip).style("display", "none");
    that.highlight();
  }
};

export const handleClick = async (event: MouseEvent, that: Graph) => {
  const x = that.currentTransform.invertX(event.offsetX),
    y = that.currentTransform.invertY(event.offsetY);
  for (let i = 0; i < that.radiusList.length; ++i) {
    const catchRadius = that.radiusList[i];
    const nodeInfo = that.simulation?.find(x, y, catchRadius);
    const INodeStyle = { ...that.nodeStyle, ...nodeInfo?.nodeStyle };
    if (nodeInfo && catchRadius <= INodeStyle.radius) {
      await nodeInfo?.onClick?.(nodeInfo);
    }
    const hiddenCanvasColor = that.hiddenContext
      ?.getImageData(event.offsetX, event.offsetY, 1, 1)
      .data.slice(0, 3);
    const key = `rgb(${hiddenCanvasColor?.join(",")})`;
    if (key != "rgb(0,0,0)") {
      that.linkMap[key].data?.onClick?.(that.linkMap[key].data);
    }
  }
};

export const handleDoubleClick = async (event: MouseEvent, that: Graph) => {
  const x = that.currentTransform.invertX(event.offsetX),
    y = that.currentTransform.invertY(event.offsetY);
  for (let i = 0; i < that.radiusList.length; ++i) {
    const catchRadius = that.radiusList[i];
    const nodeInfo = that.simulation?.find(x, y, catchRadius);
    const INodeStyle = { ...that.nodeStyle, ...nodeInfo?.nodeStyle };
    if (nodeInfo && catchRadius <= INodeStyle.radius) {
      await nodeInfo?.onDoubleClick?.(nodeInfo);
    }
  }
};

export const handleDrag = (that: Graph): any => {
  const { simulation } = that;
  if (!simulation) return;
  const dragSubject = (
    event: d3.D3DragEvent<HTMLCanvasElement, IGraphDataProps, INodeType>,
  ): INodeType | undefined => {
    d3.select(that.tooltip).style("display", "none");
    // ? 原理同「mousemove」
    for (let i = 0; i < that.radiusList.length; ++i) {
      const item = that.radiusList[i];
      const nodeInfo = simulation.find(
        that.currentTransform.invertX(event.x),
        that.currentTransform.invertY(event.y),
        item,
      );
      if (
        nodeInfo &&
        (nodeInfo.nodeStyle?.radius ?? that.nodeStyle.radius) >= item
      )
        return nodeInfo;
    }
  };

  const dragStart = async (
    event: d3.D3DragEvent<HTMLCanvasElement, IGraphDataProps, INodeType>,
  ) => {
    that.draggingNode = event.subject;
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.x;
    event.subject.fy = event.y;

    event.subject?.onDragStart?.(event.subject);
  };

  const dragged = async (
    event: d3.D3DragEvent<HTMLCanvasElement, IGraphDataProps, INodeType>,
  ) => {
    if (event.subject.x && event.subject.y) {
      // * 根据当前变换矩阵对移动的距离进行变换
      event.subject.fx =
        event.subject.x + event.dx * (1 / that.currentTransform.k);
      event.subject.fy =
        event.subject.y + event.dy * (1 / that.currentTransform.k);

      event.subject?.onDragged?.(event.subject);
    }
  };

  const dragended = async (
    event: d3.D3DragEvent<HTMLCanvasElement, IGraphDataProps, INodeType>,
  ) => {
    that.draggingNode = undefined;
    if (!event.active) {
      that.simulation?.alphaTarget(0);
    }
    event.subject.__last = {
      x: event.subject.x,
      y: event.subject.y,
    };
    event.subject.fx = null;
    event.subject.fy = null;

    // ! 每次拖拽结束后会导致节点位置的变化，需要更新 LinkMap
    updateLinkMap(that);

    event.subject.onDragEnd?.(event.subject);
  };

  return d3
    .drag()
    .subject(dragSubject)
    .on("start", dragStart)
    .on("drag", dragged)
    .on("end", dragended);
};

export const handleTick = (that: Graph) => {
  that.mainContext?.save();
  that.mainContext?.clearRect(
    0,
    0,
    that.width * window.devicePixelRatio,
    that.height * window.devicePixelRatio,
  );

  that.mainContext?.translate(
    that.currentTransform.x * window.devicePixelRatio,
    that.currentTransform.y * window.devicePixelRatio,
  );
  that.mainContext?.scale(
    that.currentTransform.k * window.devicePixelRatio,
    that.currentTransform.k * window.devicePixelRatio,
  );

  that.data.links?.forEach((item) => {
    drawLink(item, that);
  });

  that.data.nodes?.forEach((item) => {
    if (item.isFixed && that.draggingNode != item) {
      item.x = item.__last?.x;
      item.y = item.__last?.y;
    }
    drawNode(item, that);
  });

  updateLinkMap(that);
  that.mainContext?.restore();
};

export const handleZoom = (that: Graph): any => {
  const { scaleExtent } = that.forceConfig;
  return d3
    .zoom<HTMLCanvasElement, IGraphDataProps>()
    .scaleExtent([scaleExtent.min, scaleExtent.max])
    .on("zoom", (event: d3.D3ZoomEvent<HTMLCanvasElement, IGraphDataProps>) => {
      that.currentTransform = event.transform;
      handleTick(that);
    });
};
