---
group:
  title: 关系图「ForceGraph」
---

# 💻 API

## 组件暴露的方法

### 1. highlight

- 描述: 高亮与某个节点相连的节点
- 参数:

  | 参数名 | 类型     | 描述          |
  | ------ | -------- | ------------- |
  | id     | `string` | 中心节点的 id |

### 2. renderTooltip

- 描述: 对外暴露渲染提示框的方法
- 参数:

  | 参数名      | 类型                 | 描述                             |
  | ----------- | -------------------- | -------------------------------- |
  | renderValue | `string \| string[]` | 渲染的值，如果是数组的话就是多行 |
  | className   | `string`             | 提示框包裹的类名                 |

### 3. update

- 描述: 更新关系图
- 参数:

  | 参数名 | 类型          | 描述           |
  | ------ | ------------- | -------------- |
  | data   | `IGraphProps` | 图的结构化数据 |

- 🚥 注意: 调用这个方法会对图进行 **重新布局**，常常用于添加了节点或者连线的场景

### 4. updateStyle

- 描述: 更新关系图的样式
- 参数:

  | 参数名 | 类型          | 描述           |
  | ------ | ------------- | -------------- |
  | data   | `IGraphProps` | 图的结构化数据 |

- 🚥 注意: 调用这个方法 **不会** 对图进行重布局，只是对已有节点进行配置的替换

## 相关属性

### 1. IForceGraphProps

| 属性名            | 类型                  | 是否必传 | 默认值 | 描述                                        |
| ----------------- | --------------------- | -------- | ------ | ------------------------------------------- |
| data              | `IGraphData`          | 是       |        | 关系图的「节点信息」和「连线信息」          |
| width             | `number`              | 是       |        | 宽度                                        |
| height            | `number`              | 是       |        | 高度                                        |
| forceConfig       | `IForceConfig`        | 否       |        | 关系图的通用信息                            |
| lineStyle         | `ILineStyle`          | 否       |        | 所有连线的默认样式                          |
| lineTextStyle     | `ILineLabelTextStyle` | 否       |        | 所有连线上的文字的默认样式                  |
| lineIconStyle     | `ILineLabelIconStyle` | 否       |        | 所有连线上的 Icon 的默认样式                |
| nodeStyle         | `INodeStyle`          | 否       |        | 所有节点的默认样式                          |
| nodeTextStyle     | `INodeTextStyle`      | 否       |        | 所有节点上的文字的默认样式                  |
| highlightShowText | `boolean`             | 否       | false  | 只有 hover 节点的时候才展示相关连线上的文字 |
| hoverHighlight    | `IHoverHighlight`     | 否       |        | hover 节点时的样式                          |

### 2. IGraphData

| 属性名 | 类型          | 是否必传 | 默认值 | 描述           |
| ------ | ------------- | -------- | ------ | -------------- |
| links  | `ILinkType[]` | 是       |        | 所有连线的信息 |
| nodes  | `INodeType[]` | 是       |        | 所有节点的信息 |

### 3. ILinkType

| 属性名    | 类型                                       | 是否必传 | 默认值 | 描述                         |
| --------- | ------------------------------------------ | -------- | ------ | ---------------------------- |
| source    | `INodeType \| string`                      | 是       |        | 连线起点的 id 或起点的信息   |
| target    | `INodeType \| string `                     | 是       |        | 连线终点的 id 或终点的信息   |
| lineStyle | `ILineStyle`                               | 否       |        | 连线的样式                   |
| labelType | `'path'\|'text' `                          | 否       | text   | 连线上小组件的类型           |
| labelText | `string`                                   | 否       |        | 连线上的文字内容             |
| textStyle | `ILineLabelTextStyle`                      |  否      |        | 连线上文字的样式             |
| labelIcon | `ILabelIcon[] `                            | 否       |        | 连线上图标的内容以及样式     |
| iconStyle | `ILineLabelIconStyle`                      | 否       |        | 连线上图标的整体样式         |
| drawArrow | `boolean`                                  | 否       | true   | 是否在连线的终点处渲染箭头   |
| onClick   | `(link: ILinkType, renderTooltip) => void` | 否       |        | 点击连线上小组件触发的回调   |
| onHover   | `(link: ILinkType, renderTooltip) => void` | 否       |        | hover 连线上小组件触发的回调 |

### 4. INodeType

| 属性名    | 类型                                       | 是否必传 | 默认值 | 描述                         |
| --------- | ------------------------------------------ | -------- | ------ | ---------------------------- |
| id        | `string`                                   | 是       |        | Node 的唯一标识              |
| labelText | `string`                                   | 否       |        | Node 上渲染的文字            |
| textStyle | `INodeTextStyle`                           | 否       |        | Node 上文字的样式            |
| nodeStyle | `INodeStyle`                               | 否       |        | Node 的样式                  |
| onClick   | `(link: ILinkType, renderTooltip) => void` | 否       |        | 点击连线上小组件触发的回调   |
| onHover   | `(link: ILinkType, renderTooltip) => void` | 否       |        | hover 连线上小组件触发的回调 |

### 5. ILineLabelTextStyle

| 属性名        | 类型                      | 是否必传 | 默认值                                                                                    | 描述                                   |
| ------------- | ------------------------- | -------- | ----------------------------------------------------------------------------------------- | -------------------------------------- |
| padding       | `number`                  | 否       | 0                                                                                         | 外边距                                 |
| textDirection | `'horizontal'\|'natural'` | 否       | natural                                                                                   | 边上文字的方向，默认为随着连线方向改变 |
| color         | `string`                  | 否       | <div style="background-color: #000000; color: #FFFFFF; text-align: center ">#000000</div> | 边上文字的颜色                         |
| fontSize      | `number`                  | 否       | 12                                                                                        | 边上文字的大小                         |
| fontFamily    | `string`                  | 否       | PingFangSC-Regular                                                                        | 边上文字的字体                         |
| limit         | `number`                  | 否       | 2                                                                                         | 边上文字显示的最大数量，超过则显示...  |

### 6. ILabelIcon

| 属性名 | 类型               | 是否必传 | 默认值 | 描述           |
| ------ | ------------------ | -------- | ------ | -------------- |
| type   | `'fill'\|'stroke'` | 否       | fill   | 该 Path 的模式 |
| color  | `string`           | 是       |        | 颜色           |
| path   | `Path2D`           | 是       |        | 渲染的路径对象 |

### 7. ILineLabelIconStyle

| 属性名 | 类型     | 是否必传 | 默认值 | 描述        |
| ------ | -------- | -------- | ------ | ----------- |
| width  | `number` | 否       | 12     | icon 的宽度 |
| height | `number` | 否       | 12     | icon 的高度 |

### 8. ILineStyle

| 属性名   | 类型                | 是否必传 | 默认值                                                                                    | 描述                               |
| -------- | ------------------- | -------- | ----------------------------------------------------------------------------------------- | ---------------------------------- |
| width    | `number`            | 否       | 2                                                                                         | 线的宽度                           |
| color    | `string\|string[]`  | 否       | <div style="background-color: #000000; color: #FFFFFF; text-align: center ">#000000</div> | 线的颜色，如果为数组的话则为渐变色 |
| lineType | `'dashed'\|'solid'` | 否       | solid                                                                                     | 线的类型                           |
| hidden   | `boolean`           | 否       | false                                                                                     | 是否渲染                           |

### 9. INodeStyle

| 属性名        | 类型      | 是否必传 | 默认值                                                                                    | 描述                                               |
| ------------- | --------- | -------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| color         | `string`  | 否       | <div style="background-color: #338AFF; color: #FFFFFF; text-align: center ">#338AFF</div> | 节点颜色                                           |
| radius        | `number`  | 否       | 30                                                                                        | 节点半径                                           |
| borderColor   | `string`  | 否       |                                                                                           | 节点边框颜色                                       |
| borderOpacity | `number`  | 否       | 0.5                                                                                       | 当未指定节点边框颜色时，边框相对于节点颜色的透明度 |
| hoverOpacity  | `number`  | 否       | 1                                                                                         | hover 节点时节点当透明度                           |
| hidden        | `boolean` | 否       | false                                                                                     | 是否隐藏节点                                       |

### 10 INodeTextStyle

| 属性名     | 类型                                                 | 是否必传 | 默认值                                                                                    | 描述                                            |
| ---------- | ---------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------- |
| color      | `string`                                             | 否       | <div style="background-color: #000000; color: #FFFFFF; text-align: center ">#000000</div> | 节点上文字的颜色                                |
| fontSize   | `number`                                             | 否       | 12                                                                                        | 节点上文字的大小                                |
| fontFamily | `string`                                             | 否       | PingFangSC-Regular                                                                        | 节点上文字的字体                                |
| lines      | `number`                                             | 否       | 2                                                                                         | 节点上文字显示的最大行数，超过则在下一行显示... |
| padding    | `number`                                             | 否       | 0                                                                                         | 内边距                                          |
| position   | `'center' \| 'right' \| 'left' \| 'bottom' \| 'top'` | 否       | center                                                                                    | 文字相对于节点的位置                            |

### 11. IForceConfig

| 属性名        | 类型                         | 是否必传 | 默认值             | 描述                     |
| ------------- | ---------------------------- | -------- | ------------------ | ------------------------ |
| nodeDistance  | `number`                     | 否       | 200                | 节点之间的距离           |
| forceStrength | `number`                     | 否       | -1500              | 节点之间的力             |
| scaleExtent   | `{max: number, min: number}` | 否       | {max: 3, min: 0.2} | 关系图的最大最小缩放倍数 |

### 12. IHoverHighlight

| 属性名                  | 类型      | 是否必传 | 默认值                                                                                    | 描述                             |
| ----------------------- | --------- | -------- | ----------------------------------------------------------------------------------------- | -------------------------------- |
| show                    | `boolean` | 否       | true                                                                                      | hover 节点是否高亮展示相关联节点 |
| unHighlightContentColor | `string`  | 否       | <div style="background-color: #E0E0E0; color: #000000; text-align: center ">#E0E0E0</div> | 非关联节点的颜色                 |
| unHighlightBorderColor  | `string`  | 否       | <div style="background-color: #C1C1C1; color: #000000; text-align: center ">#C1C1C1</div> | 非关联节点的边框颜色             |
