import React, { FC } from "react";
import classNames from "classnames";
import { Button, Image } from "antd";
import balloonMan from "@/assets/svg/balloonMan.svg";
import goMan from "@/assets/svg/goMan.svg";
import logo from "@/assets/svg/logo.svg";
import { modularConfigs } from "./config";
import styles from "./index.less";

interface ILandingPage {
  handleLogin?: () => void;
  handleRegister?: () => void;
}

const LandingPage: FC<ILandingPage> = (props) => {
  const { handleLogin, handleRegister } = props;
  return (
    <div className={styles["landing-page"]}>
      <div className={styles["landing-page__header"]}>
        <div className={styles["left"]}>
          <Image src={logo} className={styles["logo"]} preview={false} />
          <span className={styles["title"]}>3D Material</span>
        </div>
        <div className={styles["right"]}>
          <Button.Group className={styles["btn-group"]}>
            <Button
              className={styles["btn"]}
              onClick={handleLogin?.bind(this)}
              type="primary"
            >
              登录
            </Button>
            <Button
              className={classNames(styles["btn"], styles["btn-register"])}
              onClick={handleRegister?.bind(this)}
              type="default"
            >
              注册
            </Button>
          </Button.Group>
        </div>
      </div>
      <div className={styles["landing-page__body"]}>
        <div className={styles["landing-page__body__banner"]}>
          <div className={styles["content"]}>
            <div className={styles["title"]}>制作到呈现，只需一键</div>
            <div className={styles["desc"]}>
              提供专业的渲染器，满足各种环境下的展示
            </div>
            <Button
              className={styles["btn"]}
              onClick={handleRegister?.bind(this)}
            >
              立即注册
            </Button>
          </div>
          <Image
            preview={false}
            src={balloonMan}
            className={styles["img"]}
          ></Image>
        </div>
        <div className={styles["landing-page__body__desc"]}>
          <div className={styles["content"]}>
            <div className={styles["title"]}>让人们轻松展示3D建模的结果</div>
            <div className={styles["desc"]}>
              无需任何计算机图形学的知识，任何人都可以轻松展示
            </div>
          </div>
          <Image preview={false} src={goMan} />
        </div>
        {modularConfigs.map((modular, index) => (
          <div className={styles["landing-page__body__modular"]} key={index}>
            <div className={styles["modular-title"]}>{modular.title}</div>
            <div className={styles["modular-content"]}>
              {modular.configs.map((block, index) => (
                <div className={styles["block"]} key={index}>
                  <div className={styles["block-content"]}>
                    <Image
                      className={styles["block-icon"]}
                      preview={false}
                      src={block.icon}
                    />
                    <div className={styles["block-title"]}>{block.title}</div>
                    <div className={styles["block-desc"]}>{block.desc}</div>
                  </div>
                  <Image preview={false} src={block.img} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles["landing-page__footer"]}>
        <div className={styles["footer-header"]}>
          <Image src={logo} preview={false} className={styles["icon"]} />
          <span className={styles["title"]}>3D Material</span>
        </div>
        <div className={styles["footer-desc"]}>
          3DMaterial 是一个基于 WebGL的自研GLFT Render Platform
        </div>
        <div className={styles["footer-desc"]}>
          使用它你将可以在Web场景下向同学、同事、合作方展示你的建模结果
        </div>
        <div className={styles["footer-copyright"]}>©2022 3D Material</div>
      </div>
    </div>
  );
};

export default LandingPage;
