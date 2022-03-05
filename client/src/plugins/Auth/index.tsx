import React, { FC } from "react";
import { Button, Empty } from "antd";
import { history, useLocation } from "umi";
import { getCookieData } from "@/utils";
import styles from "./index.less";
import { LOGIN_COOKIE_KEY } from "@/constant";

const Auth: FC = (props) => (
  <div className={styles["no-auth"]}>
    {useLocation().pathname != "/" &&
    !getCookieData(LOGIN_COOKIE_KEY)?.length ? (
      <div className={styles["no-auth__content"]}>
        <Empty
          description="登陆态无效，请重新登陆"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button
          onClick={() => {
            history.push("/");
          }}
          type="primary"
        >
          点我去登陆
        </Button>
      </div>
    ) : (
      <>{props.children}</>
    )}
  </div>
);

export default Auth;
