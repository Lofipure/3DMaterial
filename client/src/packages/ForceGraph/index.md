---
group:
  title: 关系图「ForceGraph」
---

## 💁🏻‍♀️ 功能展示

**支持功能 💪 如下:**

- 🚀 「**数据展示**」支持 Tooltip, LableOnLine 等数据展示方式，支持连线颜色渐变 🌈
- 🚀 「**交互体验**」丝滑的操作反馈，给你德芙般的体验
- 🚀 「**事件注册**」全流程灵活的事件绑定机制
- 🚀 「**数据变更**」支持动态新增 / 删除节点

## 🤔 如何使用

### 基本用法

<code src="./demo/base.tsx" />

### 节点属性

<code src="./demo/node.tsx" />

### 连线属性

<code src="./demo/link/index.tsx" />

### 数据动态变更

<code src="./demo/dynamic/index.tsx" />

### CDP 关联识别引擎\[关系图谱\]

<code src="./demo/AutoCase/index.tsx" />

因为每一个节点都有不同关联类型的节点，所以我们 **假设** 每个节点的关联节点有 `影响`、`归属`、`成就` 三种类型。

> 概念及交互逻辑来自 [Google - 关系图谱 - 全历史](https://www.allhistory.com/relation?id=5910422f55b542257a001a7b)。

后端接口返回的类型就可以是

```typescript | pure
enum AttrType {
  effect = 'effect',
  achievement = 'achievement',
  ascription = 'ascription',
}

type Response = Record<
  AttrType,
  Array<{
    id: string;
    name: string;
    [otherAttr: string]: any;
  }>
>;
```

### CDP 关联识别引擎\[AB 路径\]

<code src="./demo/ABRoad/index.tsx" />

前端发送的请求中携带有想要查询路径的 **起点节点 ID** 和 **终点节点 ID**。

```typescript | pure
interface IRequest {
  sourceNodeId: string;
  targetNodeId: string;
}
```

在后端完成查询之后，可以将每一条可到达的路径的节点按照顺序返回给前端，前端会根据返回的节点自动构建一张图。

```typescript | pure
export interface ILink {
  fromId: string;
  fromName: string;
  relationName: string;
  toId: string;
  toName: string;
}

export type Response = ILink[];
```


<code src="./demo/test/index.tsx" />