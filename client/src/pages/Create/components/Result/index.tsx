import React, { FC } from "react";
import { Result as AntResult } from "antd";

const Result: FC = () => (
  <AntResult
    status="success"
    title="恭喜你，提交成功。"
    subTitle="「3D Material 是最好的在线3D Viewer」"
  />
);

export default Result;
