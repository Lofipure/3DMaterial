import React, { FC } from "react";
import fetch from "@/fetch";
import apis from "@/api";
import { IModel } from "../../types";
import { Avatar, Tooltip, Image, Tag } from "antd";
import Ellipsis from "@/components/Ellipsis";
import classNames from "classnames";
import { LikeOutlined, EyeOutlined } from "@ant-design/icons";
import { getUserLocalInfo } from "@/utils";
import styles from "./index.less";

interface IModelCard {
  modelInfo: IModel;
  classname?: string;
  onClick?: (mid: number) => void;
}

const ModelCard: FC<IModelCard> = (props) => {
  const { modelInfo, classname, onClick } = props;

  const handleClickCard = () => {
    const { uid } = getUserLocalInfo();
    fetch({
      api: apis.user.visit,
      params: {
        uid,
        mid: props.modelInfo.mid,
      },
    });
    onClick?.(props.modelInfo.mid);
  };
  return (
    <div
      className={classNames([styles["model-card"], classname])}
      onClick={handleClickCard}
    >
      <Image
        src={modelInfo.model_cover}
        preview={false}
        className={styles["model-card__img"]}
      />
      <div className={styles["model-card__body"]}>
        <div className={styles["model-card__title"]}>
          {modelInfo.model_name}
        </div>
        <Ellipsis
          limit
          className={styles["model-card__desc"]}
          text={modelInfo.model_desc}
          lines={3}
        />
        <div className={styles["model-card__tags"]}>
          {modelInfo.tag_list.slice(0, 3).map((tag) => (
            <Tag
              key={tag.tid}
              color="blue"
              className={styles["model-card__tags__item"]}
            >
              {tag.tag_name}
            </Tag>
          ))}
        </div>
      </div>
      <div className={styles["model-card__footer"]}>
        <div className={styles["model-card__footer__left"]}>
          <div className={styles["model-card__footer__item"]}>
            <LikeOutlined
              size={16}
              color="#8f8f8f"
              className={styles["model-card__footer__icon"]}
            />
            <span className={styles["model-card__footer__text"]}>
              {modelInfo.model_goods}
            </span>
          </div>
          <div className={styles["model-card__footer__item"]}>
            <EyeOutlined
              size={16}
              color="#8f8f8f"
              className={styles["model-card__footer__icon"]}
            />
            <span className={styles["model-card__footer__text"]}>
              {modelInfo.model_visited}
            </span>
          </div>
        </div>
        <div className={styles["model-card__footer__right"]}>
          <Avatar.Group>
            {Array.from(modelInfo.creator_list).map((creator) => (
              <Tooltip overlay={creator.username} key={creator.uid}>
                <Avatar key={creator.uid} src={creator.user_avatar} />
              </Tooltip>
            ))}
          </Avatar.Group>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
