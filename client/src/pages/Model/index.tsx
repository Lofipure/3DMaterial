import React, { FC, useState, useEffect } from "react";
import { Drawer } from "antd";
import fetch from "@/fetch";
import apis from "@/api";
import { getUserLocalInfo } from "@/utils";
import Detail from "@/pages/Detail";
import Search from "./components/Search";
import Result from "./components/Result";
import { IParams, IModel } from "./types";
import styles from "./index.less";

const Model: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modelList, setModelList] = useState<IModel[]>([]);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentModelId, setCurrentModelId] = useState<number>();

  const handleOnSearch = async (value: IParams) => {
    setLoading(true);
    const { uid } = getUserLocalInfo();
    const { data } = await fetch<{ list?: IModel[] }>({
      api: apis.model.getModelList,
      params: {
        ...value,
        uid,
        is_self: false, // 用于控制范围，如果是true的话只获取自己创建的，如果是false的话还会获取 auth == public 的
      },
    });
    setModelList(data?.list ?? []);
    setLoading(false);
  };

  const handleClickModel = (mid: number) => {
    setDetailVisible(true);
    setCurrentModelId(mid);
  };

  useEffect(() => {
    handleOnSearch({});
  }, []);

  return (
    <div className={styles["model-page"]}>
      <Drawer
        closeIcon={false}
        visible={detailVisible}
        onClose={setDetailVisible.bind(this, false)}
        className={styles["detail-drawer"]}
        contentWrapperStyle={{
          padding: 0,
          width: "100vw",
        }}
        bodyStyle={{
          padding: 0,
        }}
        headerStyle={{
          display: "none",
        }}
      >
        <Detail
          mid={currentModelId}
          onBack={setDetailVisible.bind(this, false)}
        />
      </Drawer>
      <div className={styles["model-page__header"]}>
        <Search onSearch={handleOnSearch} />
      </div>
      <div className={styles["model-page__body"]}>
        <Result
          loading={loading}
          onClick={handleClickModel}
          modelList={modelList}
        />
      </div>
    </div>
  );
};

export default Model;
