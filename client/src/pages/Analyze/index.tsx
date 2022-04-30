import React, { FC, useEffect, useMemo, useState } from "react";
import { Statistic, Image, Spin, Table, Radio } from "antd";
import { LikeOutlined } from "@ant-design/icons";
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
import { ModelVisitMode, modelVisitOptions, tableColumns } from "./config";
import styles from "./indedx.less";

const Analyze: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modelType, setModelType] = useState<IModelTypeAnalyze>();
  const [modelVisit, setModelVisit] = useState<IModelVisitAnalyze>();
  const [tagPopularity, setTagPopularity] = useState<ITagPopularityAnalyze>();
  const [comprehensive, setComprehensive] = useState<IComprehensiveAnalyze>();
  const [modelVisitMode, setModelVisitMode] = useState<ModelVisitMode>(
    ModelVisitMode.area,
  );

  const fetchModelTypeAnalyze = async () =>
    fetch<IModelTypeAnalyze>({
      api: apis.analyze.getModelTypeAnalyze,
    });

  const fetchModelVisitAnalyze = async () =>
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
      fetchModelVisitAnalyze(),
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
            radius={0.8}
            autoFit
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
        <div className={styles["card__title"]}>
          模型访问情况汇总
          <Radio.Group
            options={modelVisitOptions}
            value={modelVisitMode}
            onChange={(e) =>
              setModelVisitMode(e.target.value as ModelVisitMode)
            }
          />
        </div>
        <div
          className={classNames(styles["card__body"], styles["model-visit"])}
        >
          {modelVisitMode == ModelVisitMode.table ? (
            <>
              <div className={styles["model-visit__title"]}>模型访问量排名</div>
              <Table
                rowKey={"name"}
                dataSource={modelVisit?.model_visit.map((item, index) => ({
                  index: index + 1,
                  ...item,
                }))}
                columns={tableColumns}
                pagination={false}
              />
            </>
          ) : (
            <>
              <div className={styles["model-visit__title"]}>日访问量变化</div>
              <div>
                <Area
                  height={240}
                  data={cloneDeep(modelVisit?.daily_visit) ?? []}
                  xField={"name"}
                  yField={"value"}
                  autoFit
                  smooth
                />
                <div className={styles["model-visit__popular"]}>
                  <div className={styles["model-visit__popular__header"]}>
                    最受欢迎模型：
                  </div>
                  <div className={styles["model-visit__popular__body"]}>
                    <LikeOutlined /> {modelVisit?.popular_model?.model_name}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    ),
    [modelVisit, modelVisitMode],
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
