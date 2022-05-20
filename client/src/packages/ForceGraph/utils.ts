/* eslint-disable @typescript-eslint/ban-types */
import { ILinkType } from "./types";

type PositionType = {
  x: number;
  y: number;
};

const Direction = [
  [-1, 0, 1, 0],
  [0, -1, 0, 1],
];

export const judgeIn = (
  context: CanvasRenderingContext2D,
  currentPosition: PositionType,
): boolean => {
  const nextPosition: PositionType = currentPosition;
  const currentColor = context
    .getImageData(currentPosition.x, currentPosition.y, 1, 1)
    .data.slice(0, 3)
    .join(",");
  for (let i = 0; i < 4; ++i) {
    nextPosition.x += Direction[0][i];
    nextPosition.y += Direction[1][i];
    const nextColor = context
      .getImageData(nextPosition.x, nextPosition.y, 1, 1)
      .data.slice(0, 3)
      .join(",");
    if (currentColor != nextColor) {
      return false;
    }
  }
  return true;
};

export const hex2Rgb = (color: string): string => {
  const arr = color.slice(1, color.length).split("");
  const rgb = [];
  for (let i = 0; i < arr.length; i += 2) {
    rgb.push(parseInt(arr[i] + arr[i + 1], 16));
  }
  return `rgb(${rgb.join(",")})`;
};

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

export const genColor = (
  colorNumber: number,
  cb?: (colorNumber: number) => void,
) => {
  if (colorNumber > 255 * 255 * 255 - 1) return "";
  const ret: number[] = [];
  ret.push(colorNumber & 0xff);
  ret.push((colorNumber & 0xff00) >> 8);
  ret.push((colorNumber & 0xff0000) >> 16);
  cb?.(++colorNumber);
  return `rgb(${ret.join(",")})`;
};

export const getLinkAngle = (link: ILinkType): number => {
  const { source, target } = link;
  if (typeof target == "string" || typeof source == "string") return 0;
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
};

export const is = {
  string: (data: unknown): data is string => typeof data === "string",
  boolean: (data: unknown): data is boolean => typeof data === "boolean",
  number: (data: unknown): data is number => typeof data === "number",

  null: (data: unknown): data is null => data === null,
  undefined: (data: unknown): data is undefined => data === undefined,

  nil: (data: unknown): data is null | undefined =>
    data === null || data === undefined,

  func: (data: unknown): data is Function | undefined =>
    typeof data == "function",
};
