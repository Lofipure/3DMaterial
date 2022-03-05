---
group:
  title: 关系图「ForceGraph」
---

# 💁🏻‍♀️ 功能展示

支持功能 💪 如下：

- 🚀 「**数据展示**」支持 Tooltip, LableOnLine 等数据展示方式，支持连线颜色渐变 🌈
- 🚀 「**交互体验**」丝滑的操作反馈，给你德芙般的体验
- 🚀 「**事件注册**」灵活的事件绑定机制

## 基本用法

```tsx
import { ForceGraph } from 'cdp_charts';
import React, { useRef, useState, useEffect } from 'react';

const getData = (n: number) => ({
  nodes: [...Array(n).keys()].map((i) => ({
    labelText: `🤔 Node ${i.toString()}${i == 0 ? '就我离大谱' : ''}`,
    id: i.toString(),
  })),
  links: [...Array(n).keys()]
    .filter((id) => id)
    .map((id, index) => ({
      source: id.toString(),
      target: Math.round(Math.random() * (id - 1)).toString(),
      drawArrow: false,
      lineStyle: {
        color: index == 0 ? ['#f00', '#0f0', '#00f'] : '#afafaf',
      },
      textStyle: {
        limit: 14,
      },
      labelText: `I am No.${index} line${index == 0 ? '我也离大谱' : ''}`,
    })),
});
const Basic = () => {
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientRect = containerRef.current?.getBoundingClientRect();
    if (clientRect) {
      const { width } = clientRect;
      setWidth(width);
    }
  }, [containerRef.current?.getBoundingClientRect()?.width]);
  return (
    <div ref={containerRef}>
      <ForceGraph
        id={'basic'}
        width={width}
        height={400}
        data={getData(10)}
        nodeTextStyle={{
          color: '#ffffff',
        }}
      />
    </div>
  );
};

export default Basic;
```

## 节点属性

```tsx
import { ForceGraph } from 'cdp_charts';
import React, { useRef, useState, useEffect } from 'react';

import { Select, Slider, message } from 'antd';
import 'antd/dist/antd.min.css';

enum Position {
  center = 'center',
  right = 'right',
  left = 'left',
  bottom = 'bottom',
  top = 'top',
}
const color = [
  '#1B1E23',
  '#AD0909',
  '#3F7126',
  '#0A8383',
  '#976500',
  '#004AAB',
];
const light = [
  '#C6DFFF',
  '#FFE9BC',
  '#BCFAFA',
  '#D8EECD',
  '#FCCECE',
  '#464A4E',
];
const NodeDemo = () => {
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodeColor, setNodeColor] = useState<string>('#338AFF');
  const [radius, setRadius] = useState<number>(30);
  const [borderColor, setBorderColor] = useState<string>('#C6DFFF');
  const [borderWidth, setBorderWidth] = useState<number>(6);
  const [fontSize, setFontSize] = useState<number>(12);
  const [fontColor, setFontColor] = useState<string>('#333333');
  const [position, setPosition] = useState<Position>(Position.center);
  const [padding, setPadding] = useState<number>(0);

  useEffect(() => {
    const clientRect = containerRef.current?.getBoundingClientRect();
    if (clientRect) {
      const { width } = clientRect;
      setWidth(width);
    }
  }, [containerRef.current?.getBoundingClientRect()?.width]);
  return (
    <div style={{ display: 'flex', height: '400px' }}>
      <div ref={containerRef} style={{ width: '70%' }}>
        <ForceGraph
          id={'node'}
          isStatic={true}
          width={width}
          height={400}
          forceConfig={{
            scaleExtent: {
              min: 1,
              max: 1,
            },
          }}
          data={{
            nodes: [
              {
                labelText: `节点`,
                id: 'node',
                nodeStyle: {
                  color: nodeColor,
                  radius,
                  borderColor,
                  borderWidth,
                },
                textStyle: {
                  fontSize,
                  color: fontColor,
                  position,
                  padding,
                },
                onClick: () => message.success('🙅 别点我。'),
              },
            ],
            links: [],
          }}
        />
      </div>
      <div style={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 8 }}>
          文字位置
          <Select
            style={{ marginLeft: 8, width: 110 }}
            value={position}
            options={[
              {
                label: Position.center,
                value: Position.center,
              },
              {
                label: Position.bottom,
                value: Position.bottom,
              },
              {
                label: Position.left,
                value: Position.left,
              },
              {
                label: Position.right,
                value: Position.right,
              },
              {
                value: Position.top,
                label: Position.top,
              },
            ]}
            allowClear
            onChange={(value) => value != undefined && setPosition(value)}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          文字颜色
          <Select
            style={{ marginLeft: 8, width: 110 }}
            allowClear
            value={fontColor}
            onChange={(value) => value != undefined && setFontColor(value)}
          >
            {color.map((item) => (
              <Select.Option
                value={item}
                key={item}
                style={{ background: item, color: '#ffffff' }}
              >
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: 8 }}>
          边框颜色
          <Select
            style={{ marginLeft: 8, width: 110 }}
            allowClear
            value={borderColor}
            onChange={(value) => value != undefined && setBorderColor(value)}
          >
            {color.map((item) => (
              <Select.Option
                value={item}
                key={item}
                style={{ background: item, color: '#ffffff' }}
              >
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: 8 }}>
          节点颜色
          <Select
            style={{ marginLeft: 8, width: 110 }}
            allowClear
            value={nodeColor}
            onChange={(value) => value != undefined && setNodeColor(value)}
          >
            {light.map((item) => (
              <Select.Option
                value={item}
                key={item}
                style={{ background: item, color: '#333333' }}
              >
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: 8 }}>
          节点半径
          <Slider
            min={10}
            value={radius}
            onChange={(value) => value && setRadius(Number(value))}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          边框宽度
          <Slider
            min={3}
            max={30}
            value={borderWidth}
            onChange={(value) => value && setBorderWidth(Number(value))}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          文字大小
          <Slider
            min={3}
            max={30}
            value={fontSize}
            onChange={(value) => value && setFontSize(Number(value))}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          文字间距
          <Slider
            min={3}
            max={40}
            value={padding}
            onChange={(value) => value && setPadding(Number(value))}
          />
        </div>
      </div>
    </div>
  );
};

export default NodeDemo;
```

## 连线属性

```tsx
import { ForceGraph } from 'cdp_charts';
// import ForceGraph from '@/components/ForceGraph';
import React, { useRef, useState, useEffect } from 'react';

import { Select, Slider, Switch } from 'antd';
import 'antd/dist/antd.min.css';

const color = [
  '#1B1E23',
  '#AD0909',
  '#3F7126',
  '#0A8383',
  '#976500',
  '#004AAB',
];
const light = [
  '#C6DFFF',
  '#FFE9BC',
  '#BCFAFA',
  '#D8EECD',
  '#FCCECE',
  '#464A4E',
];

enum LineType {
  dashed = 'dashed',
  solid = 'solid',
}

enum TextPosition {
  top = 'top',
  middle = 'middle',
}

enum TextDirection {
  horizontal = 'horizontal',
  natural = 'natural',
}

const LinkDemo = () => {
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawArrow, setDrawArrow] = useState<boolean>(true);
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string[] | string>('#333333');
  const [lineType, setLineType] = useState<LineType>(LineType.solid);
  const [padding, setPadding] = useState<number>(0);
  const [position, setPosition] = useState<TextPosition>(TextPosition.middle);
  const [textDirection, setTextDirection] = useState<TextDirection>(
    TextDirection.natural,
  );
  const [fontSize, setFontSize] = useState<number>(12);
  const [limit, setLimit] = useState<number>(5);
  const [fontColor, setFontColor] = useState<string>('#333333');
  useEffect(() => {
    const clientRect = containerRef.current?.getBoundingClientRect();
    if (clientRect) {
      const { width } = clientRect;
      setWidth(width);
    }
  }, [containerRef.current?.getBoundingClientRect()?.width]);
  return (
    <div style={{ display: 'flex', height: '400px' }}>
      <div ref={containerRef} style={{ width: '70%' }}>
        <ForceGraph
          id={'link'}
          width={width}
          height={400}
          isStatic={true}
          nodeTextStyle={{
            color: '#EFEFEF',
          }}
          forceConfig={{
            scaleExtent: {
              min: 1,
              max: 1,
            },
          }}
          data={{
            nodes: [
              {
                id: 'source',
                labelText: '节点一',
              },
              {
                id: 'target',
                labelText: '节点二',
              },
            ],
            links: [
              {
                source: 'source',
                target: 'target',
                labelText: '节点一指向节点二',
                lineStyle: {
                  width: lineWidth,
                  color: lineColor,
                  lineType,
                },
                textStyle: {
                  color: fontColor,
                  padding,
                  position,
                  textDirection,
                  fontSize,
                  limit,
                },
                drawArrow,
              },
            ],
          }}
        />
      </div>
      <div style={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 8 }}>
          是否展示箭头
          <Switch
            style={{ marginLeft: 8 }}
            checked={drawArrow}
            onChange={(value) => value != undefined && setDrawArrow(value)}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          文字颜色
          <Select
            style={{ marginLeft: 8, width: 110 }}
            value={fontColor}
            onChange={(value) => value != undefined && setFontColor(value)}
          >
            {color.map((item) => (
              <Select.Option
                value={item}
                key={item}
                style={{ background: item, color: '#ffffff' }}
              >
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: 8 }}>
          文字位置
          <Select
            style={{ marginLeft: 8, width: 110 }}
            value={position}
            onChange={(value) => value != undefined && setPosition(value)}
            options={[
              {
                label: TextPosition.top,
                value: TextPosition.top,
              },
              {
                label: TextPosition.middle,
                value: TextPosition.middle,
              },
            ]}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          文字方向
          <Select
            style={{ marginLeft: 8, width: 110 }}
            value={textDirection}
            onChange={(value) => value != undefined && setTextDirection(value)}
            options={[
              {
                label: TextDirection.horizontal,
                value: TextDirection.horizontal,
              },
              {
                label: TextDirection.natural,
                value: TextDirection.natural,
              },
            ]}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          连线类型
          <Select
            style={{ marginLeft: 8, width: 110 }}
            value={lineType}
            onChange={(value) => value != undefined && setLineType(value)}
            options={[
              {
                label: LineType.dashed,
                value: LineType.dashed,
              },
              {
                label: LineType.solid,
                value: LineType.solid,
              },
            ]}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          连线颜色
          <Select
            mode={'multiple'}
            maxTagCount={'responsive' as const}
            style={{ marginLeft: 8, width: 110 }}
            value={lineColor}
            onChange={(value) => value != undefined && setLineColor(value)}
          >
            {[...color, ...light].map((item) => (
              <Select.Option
                value={item}
                key={item}
                style={{
                  background: item,
                  color: light.includes(item) ? '#333333' : '#ffffff',
                }}
              >
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: 8 }}>
          文字大小
          <Slider
            min={3}
            max={40}
            value={fontSize}
            onChange={(value) => value && setFontSize(Number(value))}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          文字字数限制
          <Slider
            min={2}
            max={40}
            value={limit}
            onChange={(value) => value && setLimit(Number(value))}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          连线线宽
          <Slider
            min={1}
            max={5}
            value={lineWidth}
            onChange={(value) => value && setLineWidth(Number(value))}
          />
        </div>
      </div>
    </div>
  );
};

export default LinkDemo;
```
