import React, { useEffect, useState, FC, useMemo } from "react";
import { getUserLocalInfo, isNil } from "@/utils";
import Header from "./components/Header";
import Detail from "@/pages/Detail";
import styles from "./index.less";
import { Drawer, Tabs } from "antd";
import { getPropertyTabConfig } from "./config";

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

  const tabConfig = useMemo(
    () =>
      getPropertyTabConfig({ uid: uid as any, onDetail: handleModelDetail }),
    [uid, handleModelDetail],
  );

  return (
    <div className={styles["property"]}>
      {uid && (
        <>
          <Header uid={uid} />
          <div className={styles["property__board"]}>
            <Tabs tabPosition={"left"} className={styles["board__tabs"]}>
              {tabConfig?.map((item) => (
                <Tabs.TabPane tabKey={item.key} key={item.key} tab={item.label}>
                  {item.component}
                </Tabs.TabPane>
              ))}
            </Tabs>
          </div>
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
        headerStyle={{
          display: "none",
        }}
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
