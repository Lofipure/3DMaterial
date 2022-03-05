import React from "react";
import LimitEllipsis, { ILimitEllipsisProps } from "./LimitEllipsis";
import AutoEllipsis, { IAutoEllipsisProps } from "./AutoEllipsis";

interface IEllipsisProps
  extends ILimitEllipsisProps,
    IAutoEllipsisProps,
    Record<string, any> {
  limit?: boolean;
}

const Ellipsis: React.FC<IEllipsisProps> = (props: IEllipsisProps) => {
  const { limit, ...restProps } = props;

  return limit ? (
    <LimitEllipsis {...restProps} />
  ) : (
    <AutoEllipsis {...restProps} />
  );
};

Ellipsis.defaultProps = {
  limit: false,
};

export default Ellipsis;
