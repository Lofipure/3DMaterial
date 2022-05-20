/* eslint-disable @typescript-eslint/no-namespace */
import { NODE_STYLE } from "./constant";
import Graph from "./Graph";
import { getLinkAngle, getRealTextLength, splitText } from "./utils";
import { ILinkType, INodeType } from "./types";

namespace NodeRender {
  interface IParams {
    node: INodeType;
    that: Graph;
  }
  export const drawName = (params: IParams) => {
    const { node, that } = params;
    const { labelText = "" } = node;
    const INodeStyle = { ...that.nodeStyle, ...node.nodeStyle };
    const textStyle = { ...that.nodeTextStyle, ...node.textStyle };
    const { color, fontFamily, fontSize, lines, padding, position } = textStyle;
    const { radius, borderWidth } = INodeStyle;
    that.mainContext!.fillStyle = color;
    that.mainContext!.font = `${fontSize}px ${fontFamily}`;
    that.mainContext!.textAlign = "start";

    if (position === "center") {
      that.mainContext!.textAlign = "center";
      const renderText = splitText(
        that.mainContext,
        labelText ?? "",
        fontSize,
        radius * 2 - borderWidth,
        lines,
      );
      renderText.forEach((ele, index) => {
        if (renderText.length !== 1) {
          const offsetY = index * fontSize;
          that.mainContext?.fillText(
            ele.text,
            node.x || 0,
            (node.y || 0) + offsetY - 0.5 * renderText.length,
          );
        } else {
          that.mainContext?.fillText(
            ele.text,
            node.x || 0,
            (node.y || 0) + fontSize / 3,
          );
        }
      });
    } else if (position === "right") {
      that.mainContext?.fillText(
        labelText,
        (node.x || 0) + radius + borderWidth + padding,
        (node.y || 0) + fontSize / 2,
      );
    } else if (position === "left") {
      that.mainContext?.fillText(
        labelText,
        (node.x || 0) -
          fontSize * labelText.length -
          borderWidth -
          radius -
          padding,
        (node.y || 0) + fontSize / 2,
      );
    } else if (position === "top") {
      that.mainContext!.textAlign = "center";
      that.mainContext?.fillText(
        labelText,
        node.x || 0,
        (node.y || 0) - radius - borderWidth - padding,
      );
    } else if (position === "bottom") {
      that.mainContext!.textAlign = "center";
      that.mainContext?.fillText(
        labelText,
        node.x || 0,
        (node.y || 0) + radius + borderWidth + padding + fontSize,
      );
    }
  };

  export const drawBorder = (params: IParams) => {
    const { node, that } = params;
    let borderColor = "";
    const INodeStyle = { ...that.nodeStyle, ...node.nodeStyle };
    const highLightStatus = that.highlightNodeList.size === 0 ? false : true;
    if (
      node.nodeStyle?.borderColor === undefined &&
      that.nodeStyle?.borderColor === NODE_STYLE.borderColor
    ) {
      const contentColor = node.nodeStyle?.color || that.nodeStyle.color;
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
        highLightStatus && !that.highlightNodeList.has(node.index || 0)
          ? that.hoverHighlight.unHighlightBorderColor
          : borderColor;
    } else {
      borderColor =
        highLightStatus && !that.highlightNodeList.has(node.index || 0)
          ? that.hoverHighlight.unHighlightBorderColor
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    that.mainContext!.fillStyle = borderColor;
    that.mainContext?.fill(nodeBorder);
  };
}

namespace LinkRender {
  interface IParams {
    link: ILinkType;
    that: Graph;
  }
  export const drawWidget = (params: IParams) => {
    const { link, that } = params;
    if (typeof link.target == "string" || typeof link.source == "string")
      return;
    const { labelType = "text", labelIcon, labelText } = link;
    const { source, target } = link;
    const sourceX =
        source?.isFixed && that.draggingNode != source
          ? source.__last?.x
          : source.x,
      sourceY =
        source?.isFixed && that.draggingNode != source
          ? source.__last?.y
          : source.y,
      targetX =
        target?.isFixed && that.draggingNode != target
          ? target.__last?.x
          : target.x,
      targetY =
        target?.isFixed && that.draggingNode != target
          ? target.__last?.y
          : target.y;

    const labelTextStyle = { ...that.lineTextStyle, ...link.textStyle };
    const labelIconStyle = { ...that.lineIconStyle, ...link.iconStyle };
    const lineStyle = { ...that.lineStyle, ...link.lineStyle };
    that.mainContext!.fillStyle = that.backgroundColor;

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
      const angle = getLinkAngle(link);
      const x = ((sourceX || 0) + (targetX || 0)) / 2,
        y = ((sourceY || 0) + (targetY || 0)) / 2;

      that.mainContext?.save();
      that.mainContext?.translate(x, y);
      if (textStyle.textDirection === "natural") {
        that.mainContext?.rotate(
          angle > 0 ? angle + Math.PI / 2 + Math.PI : angle + Math.PI / 2,
        );
      }

      /*
       * 处理 Link上 label 的位置会因为node半径的大小不同而不居中的问题
       * 如果半径相同则不处理
       * 如果不同的话只需要判断是哪个节点比较小，然后将 label 向这个方向平移半径差值的「一半」即可
       */
      const sourceNodeStyle = {
        ...that.nodeStyle,
        ...link.source.nodeStyle,
      };
      const targetNodeStyle = {
        ...that.nodeStyle,
        ...link.target.nodeStyle,
      };
      let extraValue =
        ((sourceNodeStyle.radius > targetNodeStyle.radius ? 1 : -1) *
          Math.abs(sourceNodeStyle.radius - targetNodeStyle.radius)) /
        2;
      extraValue += angle > 0 ? -extraValue * 2 : 0;

      that.mainContext?.fillRect(
        -(
          getRealTextLength(renderTextForCnt, textStyle.fontSize) / 2 -
          textStyle.padding +
          extraValue
        ),
        textStyle.position === "middle"
          ? -(textStyle.fontSize / 2 + textStyle.padding)
          : -height - textStyle.padding / 2 - lineStyle.width / 2 - 1,
        width,
        height,
      );
      that.mainContext!.fillStyle = textStyle.color;
      that.mainContext!.font = `${textStyle.fontSize}px ${textStyle.fontFamily}`;
      that.mainContext?.fillText(
        renderTextForCnt,
        -getRealTextLength(renderTextForCnt, textStyle.fontSize) / 2 -
          extraValue,
        textStyle.position === "middle"
          ? textStyle.padding + textStyle.fontSize / 3
          : // * padding 兜底
            -lineStyle.width - (textStyle.padding || 2),
      );

      that.mainContext?.restore();
    } else if (labelType === "path") {
      if (!labelIcon) return;
      const x = ((sourceX || 0) + (targetX || 0)) / 2 - labelIconStyle.width,
        y = ((sourceY || 0) + (targetY || 0)) / 2 - labelIconStyle.height;
      that.mainContext?.save();
      that.mainContext!.lineWidth = 1;
      that.mainContext?.setLineDash([]);
      that.mainContext?.translate(x, y);
      that.mainContext?.beginPath();

      labelIcon.forEach((item) => {
        that.mainContext!.fillStyle = that.backgroundColor;
        if (item?.path) that.mainContext?.fill(item.path);
      });

      labelIcon.forEach((item) => {
        if (item?.path && item?.color) {
          if (item.type == "fill") {
            that.mainContext!.fillStyle = item.color;
            that.mainContext?.fill(item.path);
          } else {
            that.mainContext!.strokeStyle = item.color;
            that.mainContext?.stroke(item.path);
          }
        }
      });

      that.mainContext?.closePath();
      that.mainContext?.restore();
    }
  };

  export const drawArrow = (
    params: IParams & {
      color: string;
    },
  ) => {
    const { link, that, color } = params;
    if (typeof link.target == "string" || typeof link.source == "string")
      return;
    const { target } = link;
    const xt =
        target?.isFixed && that.draggingNode != target
          ? target.__last?.x
          : target.x,
      yt =
        target?.isFixed && that.draggingNode != target
          ? target.__last?.y
          : target.y;
    const radius = target.nodeStyle?.radius || that.nodeStyle.radius;
    const borderWidth =
      target.nodeStyle?.borderWidth || that.nodeStyle.borderWidth;
    const angle = getLinkAngle(link);

    that.mainContext?.save();
    that.mainContext?.beginPath();

    if (xt && yt) {
      that.mainContext?.translate(xt, yt);
      that.mainContext?.rotate(angle);

      const radiusAddBorderWidth = radius + borderWidth;
      that.mainContext?.moveTo(0, radiusAddBorderWidth + 5);
      that.mainContext?.lineTo(-3, radiusAddBorderWidth + 7);
      that.mainContext?.lineTo(0, radiusAddBorderWidth);
      that.mainContext?.lineTo(3, radiusAddBorderWidth + 7);
      that.mainContext?.lineTo(0, radiusAddBorderWidth + 5);

      that.mainContext?.restore();
      that.mainContext!.fillStyle = color;
      that.mainContext?.fill();
    }
  };

  export const drawBody = (params: IParams) => {
    const { link, that } = params;
    if (typeof link.target == "string" || typeof link.source == "string")
      return;
    that.mainContext?.beginPath();
    const highLightStatus = that.highlightLinkList.size === 0 ? false : true;

    const { drawArrow = true } = link;
    const { source, target } = link;
    const sourceX =
        source?.isFixed && that.draggingNode != source
          ? source.__last?.x
          : source.x,
      sourceY =
        source?.isFixed && that.draggingNode != source
          ? source.__last?.y
          : source.y,
      targetX =
        target?.isFixed && that.draggingNode != target
          ? target.__last?.x
          : target.x,
      targetY =
        target?.isFixed && that.draggingNode != target
          ? target.__last?.y
          : target.y;

    const angle = getLinkAngle(link);
    const sourceNodeStyle = { ...that.nodeStyle, ...link.source.nodeStyle };
    const targetNodeStyle = { ...that.nodeStyle, ...link.target.nodeStyle };
    const lineStyle = { ...that.lineStyle, ...link.lineStyle };

    const sourceRadius = sourceNodeStyle.radius,
      sourceBorderWidth = sourceNodeStyle.borderWidth,
      targetRadius = targetNodeStyle.radius,
      targetBorderWidth = targetNodeStyle.borderWidth;
    const lineColorRender =
      highLightStatus && !that.highlightLinkList.has(link.index || 0)
        ? that.hoverHighlight.unHighlightBorderColor
        : lineStyle.color;

    lineStyle.lineType === "dashed"
      ? that.mainContext?.setLineDash([2, 2])
      : that.mainContext?.setLineDash([]);
    that.mainContext!.lineWidth = lineStyle.width || that.lineStyle.width;

    if (sourceX && sourceY && targetX && targetY) {
      if (Array.isArray(lineColorRender)) {
        const g: CanvasGradient = that.mainContext!.createLinearGradient(
          sourceX,
          sourceY,
          targetX,
          targetY,
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
        that.mainContext?.moveTo(
          sourceX -
            (sourceRadius + sourceBorderWidth) * Math.cos(angle + Math.PI / 2),
          sourceY -
            (sourceRadius + sourceBorderWidth) * Math.sin(angle + Math.PI / 2),
        );
        that.mainContext?.lineTo(
          targetX +
            (targetBorderWidth + targetRadius + (drawArrow ? 4 : 0)) *
              Math.cos(angle + Math.PI / 2),
          targetY +
            (targetBorderWidth + targetRadius + (drawArrow ? 4 : 0)) *
              Math.sin(angle + Math.PI / 2),
        );
        that.mainContext!.strokeStyle = g;
        that.mainContext?.stroke();
      } else {
        that.mainContext?.save();
        that.mainContext?.translate(sourceX, sourceY);
        that.mainContext?.moveTo(
          -(sourceRadius + sourceBorderWidth) * Math.cos(angle + Math.PI / 2),
          -(sourceRadius + sourceBorderWidth) * Math.sin(angle + Math.PI / 2),
        );
        that.mainContext?.lineTo(
          targetX -
            sourceX +
            (targetRadius + targetBorderWidth + (drawArrow ? 4 : 0)) *
              Math.cos(angle + Math.PI / 2),
          targetY -
            sourceY +
            (targetRadius + targetBorderWidth + (drawArrow ? 4 : 0)) *
              Math.sin(angle + Math.PI / 2),
        );
        that.mainContext!.strokeStyle = lineColorRender;
        that.mainContext?.stroke();
        that.mainContext?.restore();
      }
    }
  };
}

export const drawNode = (node: INodeType, that: Graph) => {
  const highLightStatus = that.highlightNodeList.size === 0 ? false : true;
  const INodeStyle = { ...that.nodeStyle, ...node.nodeStyle };

  NodeRender.drawBorder({ node, that });

  const nodeContent = new window.Path2D();
  nodeContent.arc(node.x || 0, node.y || 0, INodeStyle.radius, 0, 2 * Math.PI);

  const color =
    highLightStatus && !that.highlightNodeList.has(node.index || 0)
      ? that.hoverHighlight.unHighlightContentColor
      : INodeStyle.color;
  that.mainContext!.fillStyle = color;
  that.mainContext?.fill(nodeContent);

  NodeRender.drawName({ node, that });
};

export const drawLink = (link: ILinkType, that: Graph) => {
  const highLightStatus = that.highlightLinkList.size === 0 ? false : true;
  const lineStyle = { ...that.lineStyle, ...link.lineStyle };
  const { drawArrow = true } = link;
  LinkRender.drawBody({ link, that });
  const lineColorRender =
    highLightStatus && !that.highlightLinkList.has(link.index || 0)
      ? that.hoverHighlight.unHighlightBorderColor
      : lineStyle.color || that.lineStyle.color;

  if (!that.highlightShowText || link.labelType === "path") {
    LinkRender.drawWidget({ link, that });
  } else {
    that.highlightLinkList.has(link.index || 0) &&
      LinkRender.drawWidget({ link, that });
  }

  if (Array.isArray(lineColorRender)) {
    drawArrow &&
      LinkRender.drawArrow({
        link,
        that,
        color: lineColorRender.sort(
          (a, b) =>
            parseInt(a.slice(1, a.length - 1), 16) -
            parseInt(b.slice(1, b.length - 1), 16),
        )[lineColorRender.length - 1],
      });
  } else {
    drawArrow &&
      LinkRender.drawArrow({
        link,
        that,
        color: lineColorRender,
      });
  }
};
