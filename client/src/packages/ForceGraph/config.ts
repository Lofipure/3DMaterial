import * as d3 from "d3";

export interface INodeTextStyle {
  fontSize: number;
  color: string;
  fontFamily: string;
  lines: number;
  padding: number;
  position: "center" | "right" | "left" | "bottom" | "top";
}

export interface INodeStyle {
  color: string;
  radius: number;
  borderColor: string;
  borderWidth: number;
  opacity: number;
  hidden: boolean;
}

export interface ILineStyle {
  width: number;
  color: string | string[];
  lineType: "dashed" | "solid";
  hidden: boolean;
}

export interface ILabelIcon {
  type: "fill" | "stroke";
  color: string;
  path: Path2D;
}

export interface ILineLabelTextStyle {
  padding: number;
  position: "top" | "middle" | "bottom";
  textDirection: "horizontal" | "natural";
  color: string;
  fontSize: number;
  fontFamily: string;
  limit: number;
}

export interface INodeTypes extends d3.SimulationNodeDatum {
  id: string;
  labelText: string;
  textStyle: INodeTextStyle;
  nodeStyle: INodeStyle;
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
  source: INodeTypes;
  target: INodeTypes;
  lineStyle: ILineStyle;
  labelType: "path" | "text";
  labelText: string;
  textStyle: ILineLabelTextStyle;
  labelIcon: ILabelIcon[];
  iconStyle: ILineLabelIconStyle;
  drawArrow: boolean;
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
  width: number;
  height: number;
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

export interface IGraphOptions extends IGraphProps {
  containerTarget: string;
  tooltipTarget: string;
  containerRect: Record<string, any>;
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
  forceConfig: IForceConfigProps;
  lineStyle: ILineStyle;
  lineTextStyle: ILineLabelTextStyle;
  lineIconStyle: ILineLabelIconStyle;
  nodeStyle: INodeStyle;
  nodeTextStyle: INodeTextStyle;
  highlightShowText: boolean;
  hoverHighlight: IHoverHighlightProps;
  backgroundColor: string;
}

export interface IHoverHighlightProps {
  show: boolean;
  unHighlightContentColor: string;
  unHighlightBorderColor: string;
}
export interface IForceConfigProps {
  nodeDistance: number;
  forceStrength: number;
  scaleExtent: {
    max: number;
    min: number;
  };
}

export const splitText = (
  ctx: CanvasRenderingContext2D | null | undefined,
  text: string,
  fontSize: number,
  width: number,
  maxLine: number,
): Array<{ text: string; width: number }> => {
  if (ctx) {
    maxLine += 1;
    const arr: Array<{ text: string; width: number }> = [];
    let remainText = text;
    while (
      arr.length < maxLine - 1 &&
      ctx.measureText(remainText).width > width
    ) {
      let assumTextNum = Math.floor(width / fontSize);
      let { width: assumTextWidth } = ctx.measureText(
        remainText.substr(0, assumTextNum),
      );
      if (assumTextWidth > width) {
        while (assumTextWidth > width) {
          assumTextWidth = ctx.measureText(
            remainText.substr(0, --assumTextNum),
          ).width;
        }
      } else {
        while (assumTextWidth <= width) {
          assumTextWidth = ctx.measureText(
            remainText.substr(0, ++assumTextNum),
          ).width;
        }

        assumTextWidth = ctx.measureText(
          remainText.substr(0, --assumTextNum),
        ).width;
      }
      arr.push({
        text: remainText.substr(0, assumTextNum),
        width: assumTextWidth,
      });
      remainText = remainText.substr(assumTextNum);
    }
    arr.push({
      text: remainText,
      width: ctx.measureText(remainText).width,
    });
    if (arr.length === maxLine) {
      arr[arr.length - 1].text = "...";
    }
    return arr;
  } else {
    return [];
  }
};

export const getRealTextLength = (
  str: string | undefined,
  fontSize: number,
): number => {
  if (str) {
    /* eslint-disable no-control-regex */
    const zhCnt = str.match(/[^\x00-\x80]/g)?.length || 0;
    const enCnt = str.length - zhCnt;
    return zhCnt * fontSize + (enCnt * fontSize) / 2;
  } else {
    return 0;
  }
};
