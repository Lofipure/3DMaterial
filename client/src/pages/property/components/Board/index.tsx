import React, { FC } from "react";
import classNames from "classnames";
import { Tabs } from "antd";
import SearchTable from "../SearchTable";
import { PropertyType } from "@/pages/Property/types";
import styles from "./index.less";

interface IBoardProps {
  uid: number;
  className?: string;
  onDetail?: (mid: number) => void;
}

const Board: FC<IBoardProps> = (props) => {
  const { uid, className, onDetail } = props;

  const tabConfig = [
    {
      key: "model_property",
      label: "我的模型",
      component: (
        <SearchTable uid={uid} type={PropertyType.model} onDetail={onDetail} />
      ),
    },
    {
      key: "tag_property",
      label: "我的标签",
      component: (
        <SearchTable uid={uid} type={PropertyType.tag} onDetail={onDetail} />
      ),
    },
  ];

  return (
    <div className={classNames([className, styles["board"]])}>
      <Tabs tabPosition={"left"} className={styles["board__tabs"]}>
        {tabConfig.map((item) => (
          <Tabs.TabPane tabKey={item.key} key={item.key} tab={item.label}>
            {item.component}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Board;
