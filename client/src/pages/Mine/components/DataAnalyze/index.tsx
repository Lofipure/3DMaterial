import React, { FC, useEffect, useState, useRef } from "react";
import { Drawer, Empty, Spin } from "antd";
import classNames from "classnames";
import fetch from "@/fetch";
import apis from "@/api";
import BarChart from "@/components/Charts/BarChart";
import RadarChart from "@/components/Charts/RadarChart";
import { IGraphDataProps } from "@/packages/ForceGraph/types";
import ForceGraph from "@/packages/ForceGraph";
import { EntityType } from "@/types";
import CloseIcon from "../CloseIcon";
import { IDataAnalyzeProps, INode, ILink, ILabelValue } from "./types";
import { dataFormatter, entityStyleMap, relativeText } from "./config";
import styles from "./index.less";

const DataAnalyze: FC<IDataAnalyzeProps> = (props) => {
  const { uid, className } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false);
  const [powerData, setPowerData] = useState<ILabelValue[]>([]);
  const [tagData, setTagData] = useState<ILabelValue[]>([]);
  const [graphData, setGraphData] = useState<IGraphDataProps>();
  const [graphWidth, setGraphWidth] = useState<number>(500);
  const [drawerVisible, setDrawVisible] = useState<boolean>(false);
  const [currentSelectedUser, setCurrentSelectedUser] = useState<number>();
  const [currentSelectedUsername, setCurrentSelectedUsername] =
    useState<string>();
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchUserAnalyzeDetail = async (uid: number) => {
    setDrawerLoading(true);

    const { data } = await fetch<{
      tag_analyze: ILabelValue[];
      power_analyze: ILabelValue[];
    }>({
      api: apis.user.getAnalyzeDetail,
      params: {
        uid,
      },
    });

    setPowerData(data.power_analyze);
    setTagData(data.tag_analyze);

    setDrawerLoading(false);
  };

  const fetchUserAnalyzeGraph = async () => {
    setLoading(true);
    const { data } = await fetch<{
      nodes: INode[];
      links: ILink[];
    }>({
      api: apis.user.getAnalyzeGraph,
      params: {
        uid,
      },
    });

    setGraphData(dataFormatter(data, handleClickNode));
    setLoading(false);
  };

  const handleClickNode = (node: INode) => {
    setDrawVisible(true);
    if (node.type != EntityType.User) {
      setCurrentSelectedUser(undefined);
      return;
    }
    setCurrentSelectedUsername(node.name);
    setCurrentSelectedUser(node.uid);
    fetchUserAnalyzeDetail(node?.uid as number);
  };

  const handleWindowResize = () => {
    const width = containerRef.current?.getBoundingClientRect().width;
    if (width) {
      setGraphWidth(width);
    }
  };

  useEffect(() => {
    fetchUserAnalyzeGraph();
    window.addEventListener("resize", handleWindowResize, false);

    const width = containerRef.current?.getBoundingClientRect().width;
    if (width) {
      setGraphWidth(width);
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div
      className={classNames([styles["data-analyze"], className])}
      ref={containerRef}
    >
      <Spin spinning={loading}>
        {graphData && (
          <ForceGraph
            data={graphData}
            width={graphWidth}
            height={660}
            id="analyze"
          />
        )}
        <Drawer
          closeIcon={<CloseIcon drawerVisible={drawerVisible} />}
          closable={true}
          getContainer={false}
          className={styles["data-drawer"]}
          visible={drawerVisible}
          mask={false}
          bodyStyle={{
            padding: 0,
          }}
          contentWrapperStyle={{
            width: 360,
          }}
          onClose={setDrawVisible.bind(this, !drawerVisible)}
        >
          <Spin
            spinning={drawerLoading}
            wrapperClassName={currentSelectedUser ? "" : styles["center-item"]}
          >
            {currentSelectedUser ? (
              <>
                <div className={styles["data-drawer__header"]}>
                  {currentSelectedUsername}的详细信息
                </div>
                <div className={styles["data-drawer__color-board"]}>
                  {[
                    EntityType.Model,
                    EntityType.Tag,
                    EntityType.User,
                    EntityType.Root,
                  ].map((item) => (
                    <div
                      className={styles["data-drawer__color-board__item"]}
                      key={item}
                    >
                      <div
                        className={
                          styles["data-drawer__color-board__item__color"]
                        }
                        style={{
                          backgroundColor: `${entityStyleMap[item].color}`,
                        }}
                      ></div>
                      <div
                        className={
                          styles["data-drawer__color-board__item__text"]
                        }
                      >
                        {relativeText[item]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles["data-drawer__tag-analyze"]}>
                  <div className={styles["data-drawer__subtitle"]}>
                    {"模型/标签分布"}
                  </div>
                  <BarChart
                    showTooltip={false}
                    data={tagData.map((item) => ({
                      name: item.label,
                      value: item.value,
                      is_highlight: false,
                    }))}
                    yAxisName="模型数量"
                    showLabel
                    labelInBar
                    highlight={false}
                  />
                </div>
                <div className={styles["data-drawer__power-analyze"]}>
                  <div className={styles["data-drawer__subtitle"]}>
                    {"能力分布"}
                  </div>
                  <RadarChart
                    data={powerData.map((item) => ({
                      name: item.label,
                      value: item.value,
                    }))}
                  />
                </div>
              </>
            ) : (
              <Empty
                description="请选择关系图中「用户」实体 🤔"
                style={{ color: "#666666" }}
              />
            )}
          </Spin>
        </Drawer>
      </Spin>
    </div>
  );
};

export default DataAnalyze;
