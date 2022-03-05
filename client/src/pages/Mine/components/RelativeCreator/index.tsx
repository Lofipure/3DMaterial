import React, { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { Spin, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import fetch from "@/fetch";
import apis from "@/api";
import { isNil } from "@/utils";
import styles from "./index.less";
import Ellipsis from "@/components/Ellipsis";

interface IRelativeCreatorProps {
  className?: string;
  uid: number;
}

interface IRelativeCreator {
  uid: number;
  username: string;
  user_avatar: string;
  email: string;
}

const RelativeCreator: FC<IRelativeCreatorProps> = (props) => {
  const { uid, className } = props;
  const [userList, setUserList] = useState<IRelativeCreator[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRelativeUserList = async () => {
    setLoading(true);
    const { data } = await fetch({
      api: apis.user.getRelativeUserList,
      params: {
        uid,
      },
    });
    setUserList(data?.list ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isNil(uid)) return;
    fetchRelativeUserList();
  }, [uid]);

  return (
    <div className={classNames([styles["relative-creator"], className])}>
      <div className={styles["header"]}>我的协作者</div>
      <div className={styles["creator-list"]}>
        <Spin spinning={loading}>
          {userList.map((item) => (
            <div className={styles["creator"]} key={item.uid}>
              <div className={styles["creator__left"]}>
                <Avatar
                  icon={<UserOutlined />}
                  size={32}
                  src={item.user_avatar}
                />
              </div>
              <div className={styles["creator__right"]}>
                <div className={styles["creator__right__title"]}>
                  {item.username}
                </div>
                <div className={styles["creator__right__subtitle"]}>
                  <Ellipsis text={item.email} width={200} limit></Ellipsis>
                </div>
              </div>
            </div>
          ))}
        </Spin>
      </div>
    </div>
  );
};

export default RelativeCreator;
