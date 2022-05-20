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

export interface INodeType extends d3.SimulationNodeDatum {
  [key: string]: any;
  id: string;
  labelText?: string;
  textStyle?: INodeTextStyle;
  nodeStyle?: INodeStyle;
  isFixed?: boolean;
  __last?: {
    x?: number;
    y?: number;
  };
  onDoubleClick?: (
    node?: INodeType,
    renderTooltip?: (
      renderValue: string | string[] | (() => JSX.Element),
    ) => void,
  ) => Promise<void>;
  onClick?: (
    node?: INodeType,
    renderTooltip?: (
      renderValue: string | string[] | (() => JSX.Element),
    ) => void,
  ) => Promise<void>;
  onHover?: (
    node?: INodeType,
    renderTooltip?: (
      renderValue: string | string[] | (() => JSX.Element),
    ) => void,
  ) => void;
  onDragStart?: (node?: INodeType) => void;
  onDragEnd?: (node?: INodeType) => void;
  onDragged?: (node?: INodeType) => void;
}

export interface ILinkType extends d3.SimulationLinkDatum<INodeType> {
  [key: string]: any;
  source: string | INodeType;
  target: string | INodeType;
  lineStyle?: ILineStyle;
  labelType?: "path" | "text";
  labelText?: string;
  textStyle?: ILineLabelTextStyle;
  labelIcon?: ILabelIcon[];
  iconStyle?: ILineLabelIconStyle;
  drawArrow?: boolean;
  onClick?: (
    link?: ILinkType,
    renderTooltip?: (
      renderValue: string | string[] | (() => JSX.Element),
    ) => void,
  ) => void;
  onHover?: (
    link?: ILinkType,
    renderTooltip?: (
      renderValue: string | string[] | (() => JSX.Element),
    ) => void,
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
    data: ILinkType;
  };
}

export interface IGraphDataProps {
  links: ILinkType[];
  nodes: INodeType[];
}

export interface IGraphOptions extends IGraphProps {
  containerTarget: string;
  tooltipTarget: string;
  containerRect: Record<string, any>;
}

export interface IGraphInterface {
  updateStyle: (data: IGraphDataProps) => void;
  update: (data: IGraphDataProps) => void;
  highlight: (id?: string) => void;
  renderTooltip: (
    renderValue: string | string[] | (() => JSX.Element),
    className?: string,
  ) => void;
  addRelationNodes: (sourceNode: INodeType, nodeList: INodeType[]) => void;
  removeNode: (node: INodeType) => void;
  toggleFixNode: (node: INodeType, cb?: (node: INodeType) => void) => void;
  getNodeBuffer: (
    method: (node: INodeType) => boolean,
  ) => INodeType | undefined;
  highlightRoad: (nodes: INodeType[] | string[]) => void;
  getRelationNode: (node: INodeType) => {
    node: INodeType;
    type: "source" | "target";
  }[];
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
  nodeDistance?: number | ((link: ILinkType) => number);
  forceStrength?: number;
  alphaDecay?: number;
  scaleExtent?: {
    max: number;
    min: number;
  };
}

export type FilterUnRequiredType<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined | null>;
};
