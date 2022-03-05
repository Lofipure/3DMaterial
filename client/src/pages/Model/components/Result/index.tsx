import React, { FC } from "react";
import { Spin } from "antd";
import { IModel } from "@/pages/Model/types";
import ModelCard from "../ModelCard";
import styles from "./index.less";

interface IResult {
  loading: boolean;
  modelList: IModel[];
  onClick?: (mid: number) => void;
}

const Result: FC<IResult> = (props) => {
  const { loading, modelList, onClick } = props;
  return (
    <Spin spinning={loading}>
      <div className={styles["search"]}>
        {modelList.map((item) => (
          <ModelCard
            onClick={onClick}
            classname={styles["search__item"]}
            key={item.mid}
            modelInfo={item}
          />
        ))}
      </div>
    </Spin>
  );
};

export default Result;
