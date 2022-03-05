import React, { FC, useRef, useEffect, useState } from "react";
import { Spin } from "antd";
import { HEIGHT } from "./config";

interface IGLFWViewerProps {
  url: string;
}

const GLFWViewer: FC<IGLFWViewerProps> = (props) => {
  const { url } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (containerRef.current && url) {
      setLoading(true);
      // const { width } = containerRef.current.getBoundingClientRect();
      // new GLFTView({
      //   url,
      //   width,
      //   height: 600,
      //   container: containerRef.current,
      //   onLoad: () => {
      //     setLoading(false);
      //   },
      // });
    }
  }, []);
  return (
    <Spin spinning={loading} tip=".glTF 模型解析中，请耐心等待哦">
      <div ref={containerRef} style={{ height: HEIGHT }}></div>
    </Spin>
  );
};

export default GLFWViewer;
