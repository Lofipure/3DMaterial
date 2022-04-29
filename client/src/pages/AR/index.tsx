import React, { FC, useEffect, useState } from "react";
import { useLocation } from "umi";
import { parse } from "querystring";
import styles from "./index.less";

interface IModel {
  name: string;
  cover: string;
  url: string;
}

const createTemplate = (url: string): string => `
<!DOCTYPE html>
    <html>
    <script src="/aframe.min.js"></script>
    <script src="/aframe-ar.js"></script>
    <style>
        .a-enter-vr-button {
            display: none;
        }
    </style>
    <body style="margin : 0px; overflow: hidden;">
        <a-scene embedded arjs>
            <a-marker preset="hiro">
                <a-entity position="0 0 0" scale="0.01 0.01 0.01" rotation="0 0 0" id="entity" gltf-model="${url}">
                </a-entity>
            </a-marker>
            <a-entity camera></a-entity>
        </a-scene>
    </body>
    </html>`;

const AR: FC = () => {
  const { search } = useLocation();
  const [model, setModel] = useState<IModel>();

  useEffect(() => {
    if (search) {
      setModel(parse(search.slice(1)) as any);
    }
  }, [search]);

  return (
    <div>
      {model?.url && (
        <iframe
          frameBorder="0"
          className={styles["ar-frame"]}
          srcDoc={createTemplate(model.url)}
        />
      )}
    </div>
  );
};

export default AR;
