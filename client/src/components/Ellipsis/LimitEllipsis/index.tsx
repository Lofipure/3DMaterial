import React from "react";
import { Tooltip } from "antd";
import classNames from "classnames";
import { TEXT_PLACEHOLDER } from "@/constant";
import { isNil } from "@/utils";
import styles from "./index.less";

const getStrFullLength = (str = ""): number => {
  return str.split("").reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      if (charCode >= 48 && charCode <= 57) {
        return pre + 1.3;
      }
      return pre + 1;
    } else {
      return pre + 2;
    }
  }, 0);
};

const cutStrByFullLength = (str = "", maxLength: number): string => {
  let showLength = 0;
  return str.split("").reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1;
    } else {
      showLength += 2;
    }
    if (showLength <= maxLength) {
      return pre + cur;
    } else {
      return pre;
    }
  }, "");
};

export interface ILimitEllipsisProps {
  text?: string | number;
  width?: number;
  lines?: number;
  className?: string;
  style?: Record<string, string>;
  toolTip?: string;
  fontSize?: number;
  title?: React.ReactNode;
  padding?: number;
  alwaysShowTips?: boolean; // tooltips不受内容宽度影响，总是hover展示
}

const LimitEllipsis: React.FC<ILimitEllipsisProps> = (
  props: ILimitEllipsisProps,
) => {
  const {
    className,
    text = "",
    width = 160,
    title = "",
    lines = 1,
    fontSize = 12,
    padding = 0,
    alwaysShowTips,
    ...restProps
  } = props;
  const validText = text?.toString() || "";
  const wrapWidth =
    Math.floor((width - padding * 2) / (fontSize / 2) - 5) * lines;
  const textWidth = getStrFullLength(validText);
  const shouldEllipsis = wrapWidth < textWidth;
  const tips = alwaysShowTips || shouldEllipsis ? title || text : null;

  const getDisplayText = (): string =>
    cutStrByFullLength(validText, wrapWidth - 2) + "…";

  return (
    <Tooltip title={tips} {...restProps}>
      <span className={classNames(styles["ellipsis"], className)}>
        {shouldEllipsis
          ? getDisplayText()
          : isNil(text)
          ? TEXT_PLACEHOLDER
          : text}
      </span>
    </Tooltip>
  );
};

LimitEllipsis.defaultProps = {
  width: 160,
  lines: 1,
  fontSize: 12,
};

export default LimitEllipsis;
