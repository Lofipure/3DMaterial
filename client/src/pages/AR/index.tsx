import React, { FC, useState } from "react";
import { Button, message, Result, Tag } from "antd";
import { history, useLocation } from "umi";
import { parse } from "querystring";
import styles from "./index.less";
import { copyString, createTemplate } from "./help";
import {
  DownloadOutlined,
  LikeOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface IModel {
  name: string;
  url: string;
  creator: string;
  like: number;
}

const AR: FC = () => {
  const { search } = useLocation();
  const model: IModel = parse(search.slice(1)) as any;
  const isMobile = /mobile/i.test(navigator.userAgent);
  const [forceShow, setForceShow] = useState<boolean>(false);

  const ARFrame = model?.url ? (
    <div className={styles["ar-container"]}>
      {model?.url && (
        <>
          <div className={styles["ar-container__header"]}>
            <div className={styles["ar-container__header__title"]}>
              {model.name}
            </div>
            <div className={styles["ar-container__header__tags"]}>
              <Tag color="processing" icon={<UserOutlined />}>
                {model.creator}
              </Tag>
              <Tag color="red" icon={<LikeOutlined />}>
                {model.like}
              </Tag>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => {
                  window.open("/ar.jpeg");
                }}
                size="small"
              >
                下载识别图
              </Button>
            </div>
          </div>
          <iframe
            frameBorder="0"
            className={styles["ar-container__frame"]}
            srcDoc={createTemplate(model.url)}
          />
        </>
      )}
    </div>
  ) : (
    <div />
  );

  return (
    <div className={styles["ar"]}>
      {isMobile || forceShow ? (
        <div className={styles["ar-container"]}>{ARFrame}</div>
      ) : (
        <div className={styles["ar-tip"]}>
          <Result
            title="为了您的体验，请使用移动设备访问。"
            status={"404"}
            extra={[
              <Button
                key={"copy"}
                type="primary"
                onClick={() => {
                  copyString(window.location.href)
                    ? message.success("复制成功")
                    : message.error("复制失败");
                }}
              >
                复制URL
              </Button>,
              <Button
                key={"go_back"}
                onClick={() => {
                  history.goBack();
                }}
              >
                返回列表
              </Button>,
              <Button
                key={"force"}
                onClick={() => {
                  setForceShow(true);
                }}
              >
                强行在网页上显示
              </Button>,
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default AR;
