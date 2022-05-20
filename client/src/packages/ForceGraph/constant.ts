import {
  ILineLabelTextStyle,
  ILineStyle,
  INodeStyle,
  INodeTextStyle,
  ILineLabelIconStyle,
  IHoverHighlightProps,
  FilterUnRequiredType,
} from "./types";

export const NODE_TEXT_STYLE: FilterUnRequiredType<INodeTextStyle> = {
  fontSize: 12,
  color: "#000000",
  fontFamily: "PingFangSC-Regular",
  lines: 2,
  padding: 0,
  position: "center",
};

export const NODE_STYLE: FilterUnRequiredType<INodeStyle> = {
  color: "#338AFF",
  radius: 30,
  borderColor: "#C6DFFF",
  borderWidth: 6,
  opacity: 0.5,
};

export const LINE_LABEL_TEXT_STYLE: FilterUnRequiredType<ILineLabelTextStyle> =
  {
    padding: 0,
    position: "middle",
    textDirection: "natural",
    color: "#000000",
    fontSize: 12,
    fontFamily: "PingFangSC-Regular",
    limit: 2,
  };

export const LINE_LABEL_PATH_STYLE: FilterUnRequiredType<ILineLabelIconStyle> =
  {
    height: 12,
    width: 12,
  };

export const LINE_STYLE: FilterUnRequiredType<ILineStyle> = {
  width: 2,
  color: "#000000",
  lineType: "solid",
};

export const FORCE_CONFIG = {
  nodeDistance: 200,
  forceStrength: -1500,
  alphaDecay: 0.07,
  scaleExtent: {
    max: 3,
    min: 0.2,
  },
};

export const HOVER_HIGHLIGHT: FilterUnRequiredType<IHoverHighlightProps> = {
  show: true,
  unHighlightBorderColor: "#E0E0E0",
  unHighlightContentColor: "#C1C1C1",
};

export const BACKGROUND_COLOR = "#ffffff";

export const TOOLTIP_CLASS = "graph-tooltip";
