import React, { FC, useState, useEffect, useMemo } from "react";
import { Button, message, Spin, Tabs } from "antd";
import {
  RollbackOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import fetch from "@/fetch";
import apis from "@/api";
import { getUserLocalInfo, isNil } from "@/utils";
import { IModelDetail } from "./types";
import BaseInfo from "./components/BaseInfo";
import ModelShow from "./components/ModelShow";
import styles from "./index.less";
import { ICheckStatus } from "@/types";

interface IDetailPorps {
  mid?: number;
  onBack: () => void;
}

const Detail: FC<IDetailPorps> = (props) => {
  const { mid, onBack } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [modelDetail, setModelDetail] = useState<IModelDetail>();
  const [goodsLoading, setGoodsLoading] = useState<boolean>(false);

  const fetchModelDetail = async (mid: number) => {
    setLoading(true);

    const { data } = await fetch<IModelDetail>({
      api: apis.model.getModelDetail,
      params: {
        mid,
      },
    });

    setModelDetail(data);

    setLoading(false);
  };

  const tabsConfig = useMemo(
    () => [
      {
        key: "baseInfo",
        name: "基本信息",
        component: (
          <BaseInfo modelInfo={modelDetail} className={styles["content"]} />
        ),
      },
      {
        key: "modelShow",
        name: "模型展示",
        component: (
          <ModelShow
            url={modelDetail?.model_url}
            className={styles["content"]}
          />
        ),
      },
    ],
    [modelDetail],
  );

  const handleGoodsTo = async () => {
    setGoodsLoading(true);
    const { uid } = getUserLocalInfo();

    const { data } = await fetch<ICheckStatus>({
      api: apis.user.goodsTo,
      params: {
        uid,
        mid,
      },
    });

    if (data.status) {
      message.success("点赞成功！谢谢老板！");
    } else {
      message.success("🤔 已经点过啦～");
    }

    setGoodsLoading(false);
  };
  useEffect(() => {
    if (isNil(mid)) return;
    fetchModelDetail(mid as number);
  }, [mid]);

  return (
    <div className={styles["detail"]}>
      <Spin spinning={loading} wrapperClassName={styles["detail__spin"]}>
        <div className={styles["detail__header"]}>
          <div className={styles["detail__header__back"]}>
            <Button onClick={onBack} type="link">
              <RollbackOutlined color="#1890FF" size={14} />
              返回广场
            </Button>
          </div>
          <div className={styles["detail__header__title"]}>
            {modelDetail?.model_name}
          </div>
          <div className={styles["detail__header__desc"]}>
            {modelDetail?.model_desc}
          </div>
        </div>
        <Tabs
          className={styles["detail__tabs"]}
          tabBarExtraContent={
            <Button.Group className={styles["detail__operations"]}>
              <Button
                type="primary"
                onClick={handleGoodsTo}
                loading={goodsLoading}
              >
                
                <LikeOutlined />
                点赞
              </Button>
              <Button
                type="default"
                onClick={() => {
                  message.success("😊 正在紧张开发中，耐心等待哦～");
                }}
              >
                
                <ShareAltOutlined />
                分享
              </Button>
            </Button.Group>
          }
        >
          {tabsConfig.map((item) => (
            <Tabs.TabPane key={item.key} tab={item.name} tabKey={item.key}>
              {item.component}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Spin>
    </div>
  );
};

export default Detail;
