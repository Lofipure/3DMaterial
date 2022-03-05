import * as d3 from "d3";

export interface INodeTextStyle {
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  lines?: number;
  padding?: number;
  position?: "center" | "right" | "left" | "bottom" | "top";
}

export interface INodeStyle {
  color?: string;
  radius?: number;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
}

export interface ILineStyle {
  width?: number;
  color?: string | string[];
  lineType?: "dashed" | "solid";
}

export interface ILabelIcon {
  type?: "fill" | "stroke";
  color?: string;
  path?: Path2D;
}

export interface ILineLabelTextStyle {
  padding?: number;
  position?: "top" | "middle" | "bottom";
  textDirection?: "horizontal" | "natural";
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  limit?: number;
}

export interface INodeTypes extends d3.SimulationNodeDatum {
  [key: string]: any;
  id: string;
  labelText?: string;
  textStyle?: INodeTextStyle;
  nodeStyle?: INodeStyle;
  onClick?: (
    node?: INodeTypes,
    renderTooltip?: (renderValue: string | string[]) => void,
  ) => void;
  onHover?: (
    node?: INodeTypes,
    renderTooltip?: (renderValue: string | string[]) => void,
  ) => void;
}

export interface ILinkTypes extends d3.SimulationLinkDatum<INodeTypes> {
  [key: string]: any;
  source: string | INodeTypes;
  target: string | INodeTypes;
  lineStyle?: ILineStyle;
  labelType?: "path" | "text";
  labelText?: string;
  textStyle?: ILineLabelTextStyle;
  labelIcon?: ILabelIcon[];
  iconStyle?: ILineLabelIconStyle;
  drawArrow?: boolean;
  onClick?: (
    link?: ILinkTypes,
    renderTooltip?: (renderValue: string | string[]) => void,
  ) => void;
  onHover?: (
    link?: ILinkTypes,
    renderTooltip?: (renderValue: string | string[]) => void,
  ) => void;
}

export interface ILineLabelIconStyle {
  width?: number;
  height?: number;
}

export interface ILinkMapProps {
  [key: string]: {
    position: {
      x: number;
      y: number;
    };
    color: string;
    data: ILinkTypes;
  };
}

export interface IGraphDataProps {
  links: ILinkTypes[];
  nodes: INodeTypes[];
}

export interface IGraphInterface {
  updateStyle: (data: IGraphDataProps) => void;
  update: (data: IGraphDataProps) => void;
  highlight: (id?: string) => void;
  renderTooltip: (renderValue: string | string[], className?: string) => void;
}

export interface IGraphProps {
  id: string;
  data: IGraphDataProps;
  width: number;
  height: number;
  forceConfig?: IForceConfigProps;
  lineStyle?: ILineStyle;
  lineTextStyle?: ILineLabelTextStyle;
  lineIconStyle?: ILineLabelIconStyle;
  nodeStyle?: INodeStyle;
  nodeTextStyle?: INodeTextStyle;
  highlightShowText?: boolean;
  hoverHighlight?: IHoverHighlightProps;
  backgroundColor?: string;
  isStatic?: boolean;
}

export interface IHoverHighlightProps {
  show?: boolean;
  unHighlightContentColor?: string;
  unHighlightBorderColor?: string;
}
export interface IForceConfigProps {
  nodeDistance?: number;
  forceStrength?: number;
  scaleExtent?: {
    max: number;
    min: number;
  };
}
