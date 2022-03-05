import React, { FC, useEffect, useState, useRef, ElementRef } from "react";
import classNames from "classnames";
import fetch from "@/fetch";
import apis from "@/api";
import { isNil } from "lodash";
import { Spin, Button, Avatar, Modal, message } from "antd";
import { Sex } from "@/types";
import {
  CalendarOutlined,
  MailOutlined,
  ManOutlined,
  WomanOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Form from "@/components/Form";
import { editFormFieldsConfig } from "./config";
import styles from "./index.less";

interface IHeaderProps {
  className?: string;
  uid: number;
}

interface IUserDetail {
  uid: number;
  username: string;
  create_time: string;
  user_avatar: string;
  email: string;
  sex: Sex;
}

const Header: FC<IHeaderProps> = (props) => {
  const { uid, className } = props;
  const [userInfo, setUserInfo] = useState<IUserDetail>();
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const editFormRef = useRef<ElementRef<typeof Form>>(null);

  const fetchUserInfo = async () => {
    if (isNil(uid)) return;
    setLoading(true);

    const { data } = await fetch<IUserDetail>({
      api: apis.user.getUserDeatil,
      params: {
        uid,
      },
    });

    setUserInfo(data);
    setLoading(false);
  };

  const handleEditBtnClick = () => {
    if (!userInfo) return;
    setEditModalVisible(true);
    process.nextTick(() => {
      editFormRef.current?.setFieldsValue(userInfo);
    });
  };

  const saveUserInfo = async () => {
    if (await editFormRef.current?.validateFields()) {
      setSaveLoading(true);
      const { data } = await fetch({
        api: apis.user.save,
        params: {
          uid,
          ...editFormRef.current?.getFieldsValue<IUserDetail>(),
        },
      });

      if (data.status) {
        message.success("更改成功");
        setEditModalVisible(false);
        fetchUserInfo();
      }

      setSaveLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [uid]);

  return (
    <Spin spinning={loading} wrapperClassName={styles["wrapper"]}>
      <Modal
        visible={editModalVisible}
        title={`编辑${userInfo?.username}的信息`}
        onCancel={setEditModalVisible.bind(this, false)}
        footer={
          <div className={styles["modal-footer"]}>
            <Button
              className={styles["modal-footer__btn"]}
              type="link"
              onClick={setEditModalVisible.bind(this, false)}
            >
              取消
            </Button>
            <Button
              className={styles["modal-footer__save-btn"]}
              type="primary"
              onClick={saveUserInfo}
              loading={saveLoading}
            >
              保存
            </Button>
          </div>
        }
      >
        <Form fieldsConfig={editFormFieldsConfig} ref={editFormRef} />
      </Modal>
      <div className={classNames([styles["header"], className])}>
        <div className={styles["header__avatar"]}>
          <Avatar
            icon={<UserOutlined />}
            src={userInfo?.user_avatar}
            size={64}
          />
        </div>
        <div className={styles["header__username"]}>
          {userInfo?.username}
          {userInfo?.sex === Sex.Male ? (
            <ManOutlined className={styles["header__username__sex"]} />
          ) : (
            <WomanOutlined className={styles["header__username__sex"]} />
          )}
        </div>
        <div className={styles["header__info"]}>
          <div className={styles["header__info__item"]}>
            <CalendarOutlined
              size={14}
              className={styles["header__info__item__icon"]}
            />
            {userInfo?.create_time}
          </div>
          <div className={styles["header__info__item"]}>
            <MailOutlined
              size={14}
              className={styles["header__info__item__icon"]}
            />
            {userInfo?.email}
          </div>
        </div>
        <Button
          onClick={handleEditBtnClick}
          className={styles["header__btn"]}
          type="primary"
        >
          编辑信息
        </Button>
      </div>
    </Spin>
  );
};

export default Header;
