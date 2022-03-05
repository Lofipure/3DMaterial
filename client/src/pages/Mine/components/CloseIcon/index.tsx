import React, { FC } from "react";
import { Left, Right } from "@icon-park/react";
import classNames from "classnames";
import styles from "./index.less";

interface ICloseIconProps {
  drawerVisible?: boolean;
  className?: string;
}

const CloseIcon: FC<ICloseIconProps> = (props: ICloseIconProps) => {
  const { drawerVisible, className } = props;

  return (
    <div className={classNames(styles["drawer-close-icon"], className)}>
      {drawerVisible ? <Right /> : <Left />}
    </div>
  );
};

export default CloseIcon;
