import * as React from "react";
import Graph from "./Graph";
import { IGraphProps, IGraphInterface } from "./types";
import * as CONSTANT from "./constant";
import "./index.less";

const ForceGraph = React.forwardRef<IGraphInterface, IGraphProps>(
  (props: IGraphProps, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const graphInstance = React.useRef<any>();
    const { width, height, data, id, isStatic = false } = props;
    const graphData: any = data;
    React.useEffect(() => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      if (!width || !height) return;
      const instance = new Graph({
        id,
        width,
        height,
        data: graphData,
        containerTarget: `#force-graph__container__${id}`,
        tooltipTarget: "#force-graph__tooltip",
        containerRect: {
          leftPageX: containerRect.x,
          rightPageX: containerRect.x + width,
          topPageY: containerRect.y,
          bottomPageY: containerRect.y + height,
        },
        backgroundColor: props.backgroundColor || CONSTANT.BACKGROUND_COLOR,
        lineStyle: { ...CONSTANT.LINE_STYLE, ...props.lineStyle },
        lineTextStyle: {
          ...CONSTANT.LINE_LABEL_TEXT_STYLE,
          ...props.lineTextStyle,
        },
        lineIconStyle: {
          ...CONSTANT.LINE_LABEL_PATH_STYLE,
          ...props.lineIconStyle,
        },
        nodeStyle: { ...CONSTANT.NODE_STYLE, ...props.nodeStyle },
        nodeTextStyle: { ...CONSTANT.NODE_TEXT_STYLE, ...props.nodeTextStyle },
        highlightShowText: props.highlightShowText || false,
        hoverHighlight: {
          ...CONSTANT.HOVER_HIGHLIGHT,
          ...props.hoverHighlight,
        },
        forceConfig: { ...CONSTANT.FORCE_CONFIG, ...props.forceConfig },
      });
      graphInstance.current = instance;
    }, [width, height]);

    React.useEffect(() => {
      if (!containerRef.current?.getBoundingClientRect()) return;
      if (!width || !height) return;
      if (isStatic) {
        graphInstance.current?.updateStyle(data);
      } else {
        graphInstance.current?.update(data);
      }
    }, [data]);

    React.useImperativeHandle(ref, () => ({
      highlight: (id) => graphInstance.current?.highlight(id),
      renderTooltip: (renderValue) =>
        graphInstance.current?.renderTooltip(renderValue),
      update: (data) => graphInstance.current?.update(data),
      updateStyle: (data) => graphInstance.current?.updateStyle(data),
      addRelationNodes: (sourceNode, targetNodeList) =>
        graphInstance.current?.addRelationNodes(sourceNode, targetNodeList),
      removeNode: (node) => graphInstance.current?.removeNode(node),
      toggleFixNode: (node, cb) =>
        graphInstance.current?.toggleFixNode(node, cb),
      getNodeBuffer: (method) => graphInstance.current?.getNodeBuffer(method),
      highlightRoad: (nodes) => graphInstance.current?.highlightRoad(nodes),
      getRelationNode: (node) => graphInstance.current?.getRelationNode(node),
    }));

    return (
      <div className="force-graph" ref={containerRef}>
        <div
          className="force-graph__container"
          id={`force-graph__container__${props.id}`}
        />
        <div className="force-graph__tooptip" id="force-graph__tooltip" />
      </div>
    );
  },
);
export default ForceGraph;
