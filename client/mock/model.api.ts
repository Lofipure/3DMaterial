import mock from "mockjs";

export default {
  "POST /api/model/list": mock.mock({
    code: 1,
    data: {
      "list|30": [
        {
          "mid|+1": 1,
          model_cover: "http://114.116.246.240:1188/img/bg.png",
          model_name: "@cword(5, 10)",
          model_desc: "@cword(90, 100)",
          "tag_list|3-5": [
            {
              "tid|+1": 0,
              tag_name: "@cword(3, 5)",
            },
          ],
          model_goods: "@integer(100, 200)",
          model_visited: "@integer(500, 1000)",
          model_create_time: "@date(yyyy-mm-dd)",
          "creator_list|1-3": [
            {
              "uid|+1": 0,
              user_avatar:
                "http://114.116.246.240:1188/img/8bcw89ktrgocbazftjf917sn123.jpg",
              username: "@cname(2)",
            },
          ],
        },
      ],
      total: 30,
    },
  }),
  "GET /api/model/detail": mock.mock({
    code: 1,
    data: {
      mid: 1,
      "auth|1": [1, 2, 3],
      model_cover: "http://114.116.246.240:1188/img/bg.png",
      model_name: "@cword(5, 10)",
      "tag_list|3-5": [
        {
          "tid|+1": 0,
          tag_name: "@cword(3, 5)",
        },
      ],
      model_desc: "@cword(30, 50)",
      model_goods: "@integer(100, 200)",
      model_visited: "@integer(500, 1000)",
      creator: {
        uid: 1,
        username: "@cname(2)",
        "sex|1": [1, 2],
        email: "@email",
      },
      "relative_model_list|3-5": [
        {
          "mid|+1": 0,
          model_name: "@cword(3, 5)",
          tid: 0,
          tag_name: "@cword(3, 5)",
        },
      ],
      model_url: "http://114.116.246.240:1188/cow_brown/scene.gltf",
      model_intro: `
# 3D Material Platform

> 对没错我就是先写前端再写后端

基于 WebGL 的一个 .gltf 渲染平台，提供 **日趋完备** 的「权限管理」和「社交」功能。

支持 \`mermaid\` 渲染~刘陈图~流程图。
\`\`\`mermaid
graph LR
A --> B --> C
D --> C
\`\`\`

\`\`\`tsx
import React from "react";

const App = () => {
  return (
    <div>Hello Material</div>
  )
}

export default App;
\`\`\`

### How To Config \`.umirc.ts\`

\`\`\`ts
import { defineConfig } from "umi";

export default defineConfig({
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
          title: "我的物料库 - 3DMaterial",
        },
      ],
    },
  ],
});

\`\`\`
`,
    },
  }),
  "POST /api/model/delete": {
    code: 1,
    data: {
      status: 1,
    },
  },
  "POST /api/model/set_auth": {
    code: 1,
    data: {
      status: 1,
    },
  },
  "POST /api/model/save": {
    code: 1,
    data: {
      status: 1,
    },
  },
};
