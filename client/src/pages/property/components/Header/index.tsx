import React, { FC, useState, useEffect } from "react";
import { Avatar, Spin, Statistic } from "antd";
import fetch from "@/fetch";
import apis from "@/api";
import { isNil } from "@/utils";
import classNames from "classnames";
import { TagOutlined, FileOutlined } from "@ant-design/icons";
import styles from "./index.less";

interface IUser {
  username: string;
  email: string;
  user_avatar: string;
  tag_num: number;
  model_num: number;
}

interface IHeaderProps {
  uid: number;
  className?: string;
}

const Header: FC<IHeaderProps> = (props) => {
  const { uid, className } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<IUser>();

  const fetchUserInfo = async () => {
    setLoading(true);
    const { data } = await fetch<IUser>({
      api: apis.user.getUserDeatil,
      params: {
        uid,
      },
    });
    setUserInfo(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isNil(uid)) return;
    fetchUserInfo();
  }, [uid]);

  return (
    <Spin spinning={loading}>
      <div className={classNames([className, styles["header"]])}>
        <div className={styles["header__left"]}>
          <Avatar src={userInfo?.user_avatar} size={48} />
          <div className={styles["header__left__detail"]}>
            <div className={styles["header__left__detail__title"]}>
              {userInfo?.username}
            </div>
            <div className={styles["header__left__detail__email"]}>
              {userInfo?.email}
            </div>
          </div>
        </div>
        <div className={styles["header__right"]}>
          <Statistic
            className={styles["header__right__item"]}
            title={"累计模型数(个)"}
            value={userInfo?.model_num}
            prefix={<FileOutlined />}
          />
          <Statistic
            className={styles["header__right__item"]}
            title={"累计标签数(个)"}
            value={userInfo?.tag_num}
            prefix={<TagOutlined />}
          />
        </div>
      </div>
    </Spin>
  );
};

export default Header;
