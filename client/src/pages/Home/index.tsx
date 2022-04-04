import React, { useState, FC, useMemo, ElementRef, useRef } from "react";
import { history } from "umi";
import { Modal, Button, message } from "antd";
import { STORAGE_KEY_FOR_USER, routes } from "@/constant";
import LandingPage from "@/layouts/components/Landing";
import { loginFormFields, registerFormFields } from "./config";
import Form from "@/components/Form";
import fetch from "@/fetch";
import apis from "@/api";
import { LoginUserStatus } from "./types";
import styles from "./index.less";

const Welcome: FC = () => {
  const [loginModalVisible, setLoginModalVisible] = useState<boolean>(false);
  const [registerModalVisible, setRegisterModalVisible] =
    useState<boolean>(false);
  const loginFormRef = useRef<ElementRef<typeof Form>>(null);
  const registerFormRef = useRef<ElementRef<typeof Form>>(null);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    const value = loginFormRef.current?.getFieldsValue();
    if (value && (await loginFormRef.current?.validateFields())) {
      setLoginLoading(true);
      const { data } = await fetch({
        api: apis.user.login,
        params: value,
      });
      const { uid, user_avatar, username, status } = data;
      if (status == LoginUserStatus.success) {
        localStorage.setItem(
          STORAGE_KEY_FOR_USER,
          JSON.stringify({
            email: value.email,
            avatar: user_avatar,
            uid,
            username,
          }),
        );
        message.success("登陆成功");
        history.push(routes.model);
      } else if (status == LoginUserStatus.noUser) {
        message.warn("用户不存在，请先注册");
      } else if (status == LoginUserStatus.passwordError) {
        message.error("密码错误");
      }
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    const value = registerFormRef.current?.getFieldsValue();
    if (value && (await registerFormRef.current?.validateFields())) {
      setRegisterLoading(true);
      const { data } = await fetch({
        api: apis.user.save,
        params: value,
      });
      const { uid, user_avatar, username } = data;
      localStorage.setItem(
        STORAGE_KEY_FOR_USER,
        JSON.stringify({
          email: value.email,
          avatar: user_avatar,
          uid,
          username,
        }),
      );
      setRegisterLoading(false);
      message.success("注册成功，请登录。");
      setRegisterModalVisible(false);
    }
  };

  const gotoRegister = () => {
    setLoginModalVisible(false);
    setRegisterModalVisible(true);
  };

  const LoginModal = useMemo<JSX.Element>(() => {
    return (
      <Form
        fieldsConfig={loginFormFields}
        className={styles["form"]}
        ref={loginFormRef}
      />
    );
  }, [loginModalVisible]);

  const RegisterModal = useMemo<JSX.Element>(() => {
    return (
      <Form
        fieldsConfig={registerFormFields}
        className={styles["form"]}
        ref={registerFormRef}
      />
    );
  }, [registerModalVisible]);

  return (
    <div>
      <Modal
        visible={loginModalVisible}
        onCancel={setLoginModalVisible.bind(this, false)}
        title="「3D Material」- 登录"
        wrapClassName={styles["form-modal__wrap"]}
        footer={
          <div className={styles["modal-footer"]}>
            <Button
              className={styles["modal-footer__btn"]}
              type="link"
              onClick={gotoRegister}
            >
              没有账号？立即注册！
            </Button>
            <Button
              className={styles["modal-footer__login-btn"]}
              type="primary"
              onClick={handleLogin}
              loading={loginLoading}
            >
              登录
            </Button>
          </div>
        }
      >
        {LoginModal}
      </Modal>
      <Modal
        title="「3D Material」- 注册"
        wrapClassName={styles["form-modal__wrap"]}
        visible={registerModalVisible}
        onCancel={setRegisterModalVisible.bind(this, false)}
        footer={
          <div className={styles["modal-footer"]}>
            <Button
              className={styles["modal-footer__cancel-btn"]}
              type="default"
              onClick={setRegisterModalVisible.bind(this, false)}
              loading={registerLoading}
            >
              取消
            </Button>
            <Button
              className={styles["modal-footer__register-btn"]}
              type="primary"
              onClick={handleRegister}
              loading={registerLoading}
            >
              注册
            </Button>
          </div>
        }
      >
        {RegisterModal}
      </Modal>
      <LandingPage
        handleLogin={setLoginModalVisible.bind(this, true)}
        handleRegister={setRegisterModalVisible.bind(this, true)}
      />
    </div>
  );
};

export default Welcome;
