import React from "react";
import { throttle } from "lodash";
import Graph from "./Graph";
import { ILinkType } from "./types";
import { genColor, getLinkAngle, getRealTextLength } from "./utils";

export const updateLinkMap = throttle((that: Graph) => {
  that.colorNumber = 1;
  that.data.links?.forEach((item: ILinkType, index: number) => {
    if (typeof item.target != "string" && typeof item.source != "string") {
      const [x, y] = [
        ((item.source.x || 0) + (item.target.x || 0)) / 2,
        ((item.source.y || 0) + (item.target.y || 0)) / 2,
      ];
      // * 获取当前唯一的 key
      const nowColor = genColor(that.colorNumber, () => ++that.colorNumber);
      that.linkMap[nowColor] = {
        color: nowColor,
        position: { x, y },
        data: that.data.links[index],
      };
    }
  });

  // * 在 hiddenCanvas 上渲染
  that.hiddenContext?.clearRect(0, 0, that.width, that.height);
  for (const key in that.linkMap) {
    const currentItem = that.linkMap[key];
    that.hiddenContext?.beginPath();
    const { labelType = "text" } = currentItem.data;
    const labelIconStyle = {
      ...that.lineIconStyle,
      ...currentItem.data.iconStyle,
    };
    if (labelType === "path") {
      const [pathHeight, pathWidth] = [
        labelIconStyle.height,
        labelIconStyle.width,
      ];
      const x = that.currentTransform.applyX(
        currentItem.position.x - pathWidth,
      );
      const y = that.currentTransform.applyY(
        currentItem.position.y - pathHeight,
      );

      that.hiddenContext?.rect(
        x,
        y,
        pathWidth * that.currentTransform.k * 2,
        pathHeight * that.currentTransform.k * 2,
      );
      that.hiddenContext!.fillStyle = currentItem.color;
      that.hiddenContext?.fill();
    } else {
      if (
        !that.highlightShowText ||
        that.highlightLinkList.has(currentItem.data.index || 0)
      ) {
        const { labelText = "", textStyle } = currentItem.data;
        const { fontSize, padding, limit, textDirection, position } = {
          ...that.lineTextStyle,
          ...textStyle,
        };
        const renderTextForCnt =
          (labelText?.length || 0) > limit
            ? labelText.slice(0, limit) + "..."
            : labelText;
        const width =
          (getRealTextLength(renderTextForCnt, fontSize) + 2 * padding) *
          that.currentTransform.k;
        const height = (fontSize + 2 * padding) * that.currentTransform.k;
        that.hiddenContext?.save();
        const angle = getLinkAngle(currentItem.data);
        that.hiddenContext?.translate(
          that.currentTransform.applyX(currentItem.position.x),
          that.currentTransform.applyY(currentItem.position.y),
        );
        that.hiddenContext!.fillStyle = currentItem.color;

        const sourceNodeStyle = {
          ...that.nodeStyle,
          ...(typeof currentItem.data.source == "string"
            ? {}
            : currentItem.data.source?.nodeStyle),
        };
        const targetNodeStyle = {
          ...that.nodeStyle,
          ...(typeof currentItem.data.target == "string"
            ? {}
            : currentItem.data.target?.nodeStyle),
        };
        let extraValue =
          ((sourceNodeStyle.radius > targetNodeStyle.radius ? 1 : -1) *
            Math.abs(sourceNodeStyle.radius - targetNodeStyle.radius)) /
          2;
        extraValue += angle > 0 ? -extraValue * 2 : 0;

        textDirection === "natural" &&
          that.hiddenContext?.rotate(
            angle > 0 ? angle + Math.PI / 2 + Math.PI : angle + Math.PI / 2,
          );

        const rectPath = new window.Path2D();
        rectPath.rect(
          (-getRealTextLength(renderTextForCnt, fontSize) / 2 - extraValue) *
            that.currentTransform.k,
          position === "middle"
            ? -height / 2
            : -height - (padding / 2) * that.currentTransform.k,
          width,
          height,
        );
        that.hiddenContext?.fill(rectPath);
        that.hiddenContext?.restore();
      }
    }
    that.hiddenContext?.closePath();
  }
}, 500);

export const cleanHighlightRoad = (that: Graph) => {
  that.isHighlightRoad = false;
  that.highlightLinkList.clear();
  that.highlightNodeList.clear();
};

export const createElement = (value: string | string[]): JSX.Element => {
  return Array.isArray(value) ? (
    <div>
      {value.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  ) : (
    <div>{value}</div>
  );
};
