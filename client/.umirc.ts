import { defineConfig } from "umi";
import chainWebpack from "webpack-chain";

const _config = defineConfig({
  sass: {},
  favicon: "http://114.116.246.240:1188/3DMaterial/logo.ico",
  nodeModulesTransform: {
    type: "none",
  },
  fastRefresh: {},
  history: {
    type: "hash",
  },
  routes: [
    {
      exact: false,
      path: "/",
      component: "@/layouts/index",
      routes: [
        { path: "/", component: "Home", title: "首页 - 3DMaterial" },
        { path: "/mine", component: "Mine", title: "我的信息 - 3DMaterial" },
        {
          path: "/analyze",
          component: "Analyze",
          title: "分析面板 - 3DMaterial",
        },
        { path: "/model", component: "Model", title: "模型列表 - 3DMaterial" },
        {
          path: "/property",
          component: "Property",
          title: "我的资产 - 3DMaterial",
        },
      ],
      wrappers: ["@/plugins/Auth"],
    },
  ],
});

export default {
  chainWebpack(config: any) {
    config.module
      .rule("raw-loader")
      .test(/\.glsl$/)
      .use("raw-loader")
      .loader("raw-loader");
  },
  ..._config,
};
