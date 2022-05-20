import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const HEIGHT = 580;

interface IGLFWViewerProps {
  url: string;
}

interface ISize {
  width: number;
  height: number;
}

const GLFWViewer: FC<IGLFWViewerProps> = (props) => {
  const { url } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const Scene = useRef<THREE.Scene>();
  const loader = new GLTFLoader();
  const [size, setSize] = useState<ISize>({
    width: 0,
    height: 0,
  });
  const initLightFunc = useRef<() => void>();

  const initThree = (
    width = window.innerWidth,
    height = window.innerHeight,
  ) => {
    let renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera;
    const scene: THREE.Scene = new THREE.Scene();
    const init = () => {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      document.getElementById("canvas-frame")?.appendChild(renderer.domElement);
      renderer.setClearColor(0xafafaf, 1.0);
    };

    const initCamera = () => {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);
    };

    const initLight = () => {
      const light = new THREE.AmbientLight(0xffffff);
      scene.add(light);

      const point = new THREE.PointLight(0xffffff);
      point.position.set(0, 100, 100);
      scene.add(point);
    };

    const initController = () => {
      new OrbitControls(camera, renderer.domElement);
    };

    function animation() {
      renderer.render(scene, camera);
      requestAnimationFrame(animation);
    }

    const threeStart = () => {
      init();
      initCamera();
      initLight();
      animation();
      initController();
    };

    threeStart();

    return {
      scene,
      initLight,
    };
  };

  const updateSize = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    const { width, height } = node.getBoundingClientRect();
    console.log(width, height);
    setSize({ width, height });
  }, []);

  useEffect(() => {
    if (size.height && size.width) {
      const { scene, initLight } = initThree(size.width, size.height);
      initLightFunc.current = initLight;
      Scene.current = scene;
    }
  }, [size]);

  useEffect(() => {
    setLoading(true);
    loader.load(url, (gltf) => {
      setLoading(false);
      Scene.current?.clear();
      initLightFunc.current?.();
      Scene.current?.add(gltf.scene);
    });
  }, [url]);

  return (
    <Spin spinning={loading} tip=".glTF 模型解析中，请耐心等待哦">
      <div
        style={{ height: HEIGHT, width: "100%" }}
        id={"canvas-frame"}
        ref={updateSize}
      />
    </Spin>
  );
};

export default GLFWViewer;
