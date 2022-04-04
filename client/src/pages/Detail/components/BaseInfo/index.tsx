import React, { FC, useMemo } from "react";
import classNames from "classnames";
import { List, Tag } from "antd";
import {
  UserOutlined,
  MailOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { IModelDetail } from "@/pages/Detail/types";
import MarkdownParser from "@/components/MarkdownParser";
import { Sex } from "@/types";
import styles from "./index.less";

interface IBaseInfoProps {
  modelInfo?: IModelDetail;
  className?: string;
}

const BaseInfo: FC<IBaseInfoProps> = (props) => {
  const { modelInfo, className } = props;

  const BaseInfoImageCover = useMemo<JSX.Element>(
    () => (
      <div className={styles["base-info__left__cover"]}>
        <img
          src={modelInfo?.model_cover}
          className={styles["base-info__left__cover__image"]}
        />
        <div className={styles["base-info__left__cover__banner"]}>
          {modelInfo?.creator.email}
        </div>
      </div>
    ),
    [modelInfo?.model_cover, modelInfo?.creator.email],
  );

  const BaseInfoRelativeModelList = useMemo<JSX.Element>(
    () => (
      <List
        className={styles["base-info__left__list"]}
        header={
          <div className={styles["base-info__left__list__header"]}>
            相关模型
          </div>
        }
      >
        {modelInfo?.relative_model_list.map((model) => (
          <List.Item
            className={styles["base-info__left__list__item"]}
            key={model.mid}
          >
            <Tag color="processing">{model.tag_name}</Tag>
            {model.model_name}
          </List.Item>
        ))}
      </List>
    ),
    [JSON.stringify(modelInfo?.relative_model_list)],
  );

  const BaseInfoCreator = useMemo<JSX.Element>(
    () => (
      <div className={styles["base-info__left__creator"]}>
        <div className={styles["base-info__left__creator__item"]}>
          <UserOutlined
            size={14}
            className={styles["base-info__left__creator__item__icon"]}
          />
          {modelInfo?.creator.username}
          {modelInfo?.creator.sex === Sex.Male ? (
            <ManOutlined
              size={14}
              className={styles["base-info__left__creator__item__man"]}
            />
          ) : (
            <WomanOutlined
              size={14}
              className={styles["base-info__left__creator__item__woman"]}
            />
          )}
        </div>
        <div className={styles["base-info__left__creator__item"]}>
          <MailOutlined
            size={14}
            className={styles["base-info__left__creator__item__icon"]}
          />
          <a href={`mailto:${modelInfo?.creator.email}`}>
            {modelInfo?.creator.email}
          </a>
        </div>
      </div>
    ),
    [JSON.stringify(modelInfo?.creator)],
  );

  return (
    <div className={classNames([className, styles["base-info"]])}>
      <div className={styles["base-info__left"]}>
        {BaseInfoImageCover}
        {BaseInfoRelativeModelList}
        {BaseInfoCreator}
      </div>
      <div className={styles["base-info__right"]}>
        <MarkdownParser mode="view" value={modelInfo?.model_intro} />
      </div>
    </div>
  );
};

export default BaseInfo;
