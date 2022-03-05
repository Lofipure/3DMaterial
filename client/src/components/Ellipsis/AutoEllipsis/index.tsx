import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Tooltip } from "antd";
import { TEXT_PLACEHOLDER } from "@/constant";
import { isNil } from "@/utils";
import "./index.less";

export interface IAutoEllipsisProps {
  className?: string;
  width?: number;
  text?: string | number;
  showTooltip?: boolean;
  title?: React.ReactNode;
}

export const WithWidth = (
  WrappedComponent: React.JSXElementConstructor<any>,
) => {
  /* eslint-disable react-hooks/rules-of-hooks */
  return (props: Record<string, any>): JSX.Element => {
    const [width, setWidth] = useState(0);
    const eleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (eleRef.current) {
        const { offsetWidth } = eleRef.current;
        setWidth(offsetWidth);
      }
    });

    return (
      <div
        ref={eleRef}
        style={{
          overflow: "hidden",
          display: "flex",
        }}
      >
        {width ? <WrappedComponent {...props} width={width} /> : null}
      </div>
    );
  };
};

const AutoEllipsis = (props: IAutoEllipsisProps): JSX.Element => {
  const { className, width, text, showTooltip, title } = props;
  const [shouldEllipsis, setShouldEllipsis] = useState(false);
  const eleRef = useRef<HTMLDivElement>(null);

  const tips = showTooltip && shouldEllipsis ? title || text : null;

  useEffect(() => {
    if (eleRef.current && width) {
      const { scrollWidth } = eleRef.current;
      setShouldEllipsis(width < scrollWidth);
    }
  });

  return (
    <Tooltip {...props} title={tips}>
      <div
        className={classNames("auto-ellipsis", className)}
        style={{
          width,
        }}
        ref={eleRef}
      >
        {isNil(text) ? TEXT_PLACEHOLDER : text}
      </div>
    </Tooltip>
  );
};

AutoEllipsis.defaultProps = {
  showTooltip: true,
};

export default WithWidth(AutoEllipsis);
