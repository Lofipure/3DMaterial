import React, { FC } from "react";
import classNames from "classnames";
import GLFWViewer from "@/packages/GLFWViewer";
import styles from "./index.less";
interface IModelShow {
  className?: string;
  url?: string;
}

const ModelShow: FC<IModelShow> = (props) => {
  const { className, url } = props;
  return (
    <div className={classNames([className, styles["model-show"]])}>
      {url && <GLFWViewer url={url} />}
    </div>
  );
};

export default ModelShow;
