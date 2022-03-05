import {
  ILineLabelTextStyle,
  ILineStyle,
  INodeStyle,
  INodeTextStyle,
  ILineLabelIconStyle,
  IHoverHighlightProps,
} from "./config";

export const NODE_TEXT_STYLE: INodeTextStyle = {
  fontSize: 12,
  color: "#000000",
  fontFamily: "PingFangSC-Regular",
  lines: 2,
  padding: 0,
  position: "center",
};

export const NODE_STYLE: INodeStyle = {
  color: "#338AFF",
  radius: 30,
  borderColor: "#C6DFFF",
  borderWidth: 6,
  opacity: 0.5,
  hidden: false,
};

export const LINE_LABEL_TEXT_STYLE: ILineLabelTextStyle = {
  padding: 0,
  position: "middle",
  textDirection: "natural",
  color: "#000000",
  fontSize: 12,
  fontFamily: "PingFangSC-Regular",
  limit: 2,
};

export const LINE_LABEL_PATH_STYLE: ILineLabelIconStyle = {
  height: 12,
  width: 12,
};

export const LINE_STYLE: ILineStyle = {
  width: 2,
  color: "#000000",
  lineType: "solid",
  hidden: false,
};

export const FORCE_CONFIG = {
  nodeDistance: 200,
  forceStrength: -1500,
  scaleExtent: {
    max: 3,
    min: 0.2,
  },
};

export const HOVER_HIGHLIGHT: IHoverHighlightProps = {
  show: true,
  unHighlightBorderColor: "#E0E0E0",
  unHighlightContentColor: "#C1C1C1",
};

export const BACKGROUND_COLOR = "#ffffff";

export const TOOLTIP_CLASS = "graph-tooltip";
