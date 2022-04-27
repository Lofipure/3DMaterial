import React, { FC, useEffect, useMemo, useState } from "react";
import { Statistic, Image, Spin, Table } from "antd";
import { Column, Pie, Area } from "@ant-design/charts";
import { cloneDeep } from "lodash";
import classNames from "classnames";
import fetch from "@/fetch";
import apis from "@/api";
import {
  IComprehensiveAnalyze,
  IModelTypeAnalyze,
  IModelVisitAnalyze,
  ITagPopularityAnalyze,
} from "./type";
import styles from "./indedx.less";
import Ellipsis from "@/components/Ellipsis";

const Analyze: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modelType, setModelType] = useState<IModelTypeAnalyze>();
  const [modelVisit, setModelVisit] = useState<IModelVisitAnalyze>();
  const [tagPopularity, setTagPopularity] = useState<ITagPopularityAnalyze>();
  const [comprehensive, setComprehensive] = useState<IComprehensiveAnalyze>();

  const fetchModelTypeAnalyze = async () =>
    fetch<IModelTypeAnalyze>({
      api: apis.analyze.getModelTypeAnalyze,
    });

  const fetchModelVisitAnaulyze = async () =>
    fetch<IModelVisitAnalyze>({
      api: apis.analyze.getModelVisitAnalyze,
    });

  const fetchTagPopularity = async () =>
    fetch<ITagPopularityAnalyze>({
      api: apis.analyze.getTagPopularity,
    });

  const fetchComprehensiveAnalyze = async () =>
    fetch<IComprehensiveAnalyze>({
      api: apis.analyze.getComprehensiveAnalyze,
    });

  const fetchData = async () => {
    setLoading(true);
    const fetchList = [
      fetchModelTypeAnalyze(),
      fetchModelVisitAnaulyze(),
      fetchTagPopularity(),
      fetchComprehensiveAnalyze(),
    ].map(async (item) => (await item).data);
    const [modelType, modelVisit, tagPopularity, comprehensive] =
      await Promise.all<
        [
          IModelTypeAnalyze,
          IModelVisitAnalyze,
          ITagPopularityAnalyze,
          IComprehensiveAnalyze,
        ]
      >(fetchList as any);

    setModelType(modelType);
    setModelVisit(modelVisit);
    setTagPopularity(tagPopularity);
    setComprehensive(comprehensive);

    console.log("[🔧 Debug 🔧]", "model visit", modelVisit);
    setLoading(false);
  };

  const TagPopularity = useMemo<JSX.Element>(
    () => (
      <div className={styles["card"]}>
        <div className={styles["card__title"]}>{"标签热度分布"}</div>
        <div className={styles["card__body"]}>
          <Column
            className={styles["chart"]}
            data={tagPopularity?.list ?? []}
            autoFit
            tooltip={false}
            xField={"name"}
            yField={"value"}
          />
        </div>
      </div>
    ),
    [tagPopularity],
  );

  const ModelType = useMemo<JSX.Element>(
    () => (
      <div className={styles["card"]}>
        <div className={styles["card__title"]}>模型类型占比</div>
        <div className={styles["card__body"]}>
          <Pie
            data={cloneDeep(modelType?.list) ?? []}
            angleField={"value"}
            colorField={"name"}
            radius={1}
            autoFit
            innerRadius={0.6}
            statistic={{
              title: {
                content: "模型总数",
              },
              content: {
                content: `${modelType?.total ?? 0}`,
              },
            }}
            tooltip={false}
            label={{
              type: "inner",
              offset: "-50%",
              content: "{value}",
              style: {
                textAlign: "center",
                fontSize: 14,
              },
            }}
          />
        </div>
      </div>
    ),
    [modelType],
  );

  const ModelVisit = useMemo<JSX.Element>(
    () => (
      <div className={styles["card"]}>
        <div className={styles["card__title"]}>模型访问情况汇总</div>
        <div
          className={classNames(styles["card__body"], styles["model-visit"])}
        >
          <div className={styles["model-visit__left"]}>
            <div className={styles["model-visit__title"]}>日访问量变化</div>
            <div>
              <Area
                height={350}
                data={cloneDeep(modelVisit?.daily_visit) ?? []}
                xField={"name"}
                yField={"value"}
                autoFit
                smooth
              />
            </div>
          </div>
          <div className={styles["model-visit__right"]}>
            <div className={styles["model-visit__title"]}>模型访问排行榜</div>
            <Table
              rowKey={"name"}
              size="small"
              dataSource={modelVisit?.model_visit.map((item, index) => ({
                index: index + 1,
                ...item,
              }))}
              columns={[
                {
                  key: "index",
                  title: "排名",
                  dataIndex: "index",
                },
                {
                  key: "name",
                  title: "名称",
                  dataIndex: "name",
                  width: 170,
                  render: (value) => <Ellipsis text={value} />,
                },
                {
                  key: "value",
                  title: "访问次数",
                  dataIndex: "value",
                  width: 100,
                  align: "right",
                },
              ]}
              pagination={false}
            />
          </div>
        </div>
      </div>
    ),
    [modelVisit],
  );

  const Comprehensive = useMemo<JSX.Element>(
    () => (
      <div className={styles["comprehensive"]}>
        <div className={styles["comprehensive__total"]}>
          <Statistic
            value={comprehensive?.model_cnt}
            title="总模型数"
            className={styles["comprehensive__total__item"]}
          />
          <Statistic
            title="总用户数"
            className={styles["comprehensive__total__item"]}
            value={comprehensive?.user_cnt}
          />
        </div>
        <div className={styles["comprehensive__popular"]}>
          <Image
            preview={false}
            className={styles["comprehensive__popular__image"]}
            src={comprehensive?.popular_model?.model_cover}
          />
          <div className={styles["comprehensive__popular__text"]}>
            最受欢迎模型 - 「{comprehensive?.popular_model?.model_name}」
          </div>
        </div>
      </div>
    ),
    [comprehensive],
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles["analyze"]}>
      <Spin spinning={loading}>
        <div className={styles["row"]}>
          <div className={styles["col"]}>{ModelType}</div>
          <div className={styles["col"]}>{ModelVisit}</div>
        </div>
        <div className={styles["row"]}>
          <div className={styles["col"]}>{TagPopularity}</div>
          <div className={styles["col"]}>{Comprehensive}</div>
        </div>
      </Spin>
    </div>
  );
};

export default Analyze;
