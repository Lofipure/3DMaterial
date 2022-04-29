import React, { useState, Fragment, useEffect, useMemo } from "react";
import { history } from "umi";
import { Avatar, Popover, Menu } from "antd";
import ProLayout from "@ant-design/pro-layout";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { IUserForStorage } from "@/types";
import {
  STORAGE_KEY_FOR_USER,
  SITE_NAME,
  routes as routesPath,
} from "@/constant";
import { getUserLocalInfo } from "@/utils";
import { routes, layoutConfig, Logo, excludeRoutes } from "./config";
import styles from "./index.less";

const BaseLayout: React.FC = (props) => {
  const [pathname, setPathname] = useState<string>("/model");
  const [userInfo, setUserInfo] = useState<IUserForStorage>();

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_FOR_USER); // 清空本地存储的userInfo
    // TODO clear customer cookie
    document.cookie = ""; // 清除本地cookie
    history.push("/");
    setPathname("/");
  };

  const gotoMine = () => {
    history.push(routesPath.mine);
    setPathname(routesPath.mine);
  };

  const UserPopover = useMemo<JSX.Element>(
    () => (
      <div className={styles["user-pop__container"]}>
        <Menu>
          <Menu.Item
            className={styles["user-pop__container__content"]}
            onClick={gotoMine}
            key="mine"
          >
            <UserOutlined />
            <span className={styles["user-pop__container__content__text"]}>
              我的主页
            </span>
          </Menu.Item>
          <Menu.Item
            className={styles["user-pop__container__content"]}
            onClick={handleLogout}
            key="logout"
          >
            <LogoutOutlined />
            <span className={styles["user-pop__container__content__text"]}>
              退出登录
            </span>
          </Menu.Item>
        </Menu>
      </div>
    ),
    [userInfo],
  );

  useEffect(() => {
    const _userInfo = getUserLocalInfo();
    if (_userInfo?.email) {
      setPathname(history.location.pathname);
      setUserInfo(_userInfo);
    }
  }, [history.location.pathname]);

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      {excludeRoutes.includes(history.location.pathname) ? (
        <Fragment>{props.children}</Fragment>
      ) : (
        <ProLayout
          {...layoutConfig}
          route={{
            path: pathname,
            routes,
          }}
          location={{
            pathname,
          }}
          menuItemRender={(item, dom) => (
            <a
              onClick={() => {
                if (!item.path) return;
                setPathname(item.path || "/login");
                history.push(item.path);
              }}
            >
              {dom}
            </a>
          )}
          logo={Logo}
          title={SITE_NAME}
          rightContentRender={() => (
            <Popover
              content={UserPopover}
              placement="bottomLeft"
              overlayClassName={styles["user-pop__container"]}
            >
              <Avatar
                src={userInfo?.avatar}
                className={styles["header-avatar"]}
              />
            </Popover>
          )}
          contentStyle={{
            margin: 0,
          }}
        >
          {props.children}
        </ProLayout>
      )}
    </div>
  );
};

export default BaseLayout;
