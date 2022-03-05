import React, { useEffect, useState, FC } from "react";
import { getUserLocalInfo, isNil } from "@/utils";
import Header from "./components/Header";
import Board from "./components/Board";
import Detail from "@/pages/Detail";
import styles from "./index.less";
import { Drawer } from "antd";

const Property: FC = () => {
  const [uid, setUid] = useState<number>();
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentModelId, setCurrentModelId] = useState<number>();

  const handleModelDetail = (mid: number) => {
    setCurrentModelId(mid);
    setDetailVisible(true);
  };

  useEffect(() => {
    const { uid } = getUserLocalInfo();
    if (!isNil(uid)) {
      setUid(uid);
    }
  }, []);

  return (
    <div className={styles["property"]}>
      {uid && (
        <>
          <Header uid={uid} />
          <Board
            uid={uid}
            className={styles["property__board"]}
            onDetail={handleModelDetail}
          />
        </>
      )}
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
        getContainer={false}
      >
        <Detail
          mid={currentModelId}
          onBack={setDetailVisible.bind(this, false)}
        />
      </Drawer>
    </div>
  );
};

export default Property;
