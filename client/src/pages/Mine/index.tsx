import React, { FC, useEffect, useState } from "react";
import { getUserLocalInfo, isNil } from "@/utils";
import Header from "./components/Header";
import RelativeCreator from "./components/RelativeCreator";
import Record from "./components/Record";
import DataAnalyze from "./components/DataAnalyze";
import styles from "./index.less";

const Mine: FC = () => {
  const [uid, setUid] = useState<number>();

  useEffect(() => {
    const { uid } = getUserLocalInfo();
    if (!isNil(uid)) {
      setUid(uid);
    }
  }, []);

  return uid ? (
    <div className={styles["mine"]}>
      <Header uid={uid} />
      <div className={styles["selection"]}>
        <Record uid={uid} className={styles["selection__record"]} />
        <RelativeCreator className={styles["selection__relative"]} uid={uid} />
      </div>
      <div className={styles["data-analyze"]}>
        <DataAnalyze uid={uid} />
      </div>
    </div>
  ) : null;
};

export default Mine;
