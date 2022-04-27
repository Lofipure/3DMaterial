import React, { CSSProperties } from "react";
import ReactECharts from "echarts-for-react";
import _ from "lodash";
import { formatTenThousandNumber } from "@/utils";
import { splitString } from "@/utils";
import styles from "./index.less";
interface IBarChartData {
  name: string;
  value: number;
  is_highlight: boolean;
  tooltipText?: string;
  labelValue?: string;
}

interface IBarChartProps {
  data: IBarChartData[];
  type?: "vertical" | "horizontal"; // * 类型：水平 / 垂直
  normalColor?: string; // * 非高亮时的颜色
  highlightColor?: string; // * 高亮时的颜色
  axisColor?: string; // * 坐标轴的颜色
  rotateAngle?: number; // * 坐标轴上label的旋转角度
  barBorderRaduis?: Array<number>;
  height?: number;
  highlight?: boolean; // * hover bar 时是否高亮
  labelInBar?: boolean; // * 是否在bar中展示label，当label过长时展示在外面
  showTooltip?: boolean;
  showLabel?: boolean;
  yAxisName?: string;
  style?: CSSProperties;
  yAxisSplitLine?: boolean;
}

const BarChart: React.FC<IBarChartProps> = (props: IBarChartProps) => {
  const {
    data,
    type = "horizontal",
    axisColor = "#999999",
    normalColor = "#2F88FF",
    highlightColor = "#E0E0E0",
    rotateAngle = 50,
    barBorderRaduis = [2, 2, 0, 0],
    highlight = true,
    labelInBar = false,
    showTooltip = false,
    showLabel = false,
    yAxisName = "",
    height,
    style,
    yAxisSplitLine = false,
  } = props;
  const maxValue = _.max(data.map((item) => item.value)) || 0;
  let option = {
    height: height ? height : type === "horizontal" ? 130 : 200,
    xAxis: {
      type: "category",
      data: data.map((item) => item.name.replace("～", "~")), // ...后端返全角也是很无奈，就会有的字显示不粗来
      axisLine: {
        lineStyle: {
          color: "#DDDDDD",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        rotate: rotateAngle,
        formatter: (label: string) =>
          type === "horizontal" ? label : splitString(label, 4).join("\n"),
        verticalAlign: type === "horizontal" ? "top" : "middle",
        color: axisColor,
      },
    },
    yAxis: {
      name: yAxisName,
      // nameLocation: type === "horizontal" ? "end" : "center",
      nameLocation: "center",
      nameTextStyle: {
        color: axisColor,
      },
      splitLine: {
        show: yAxisSplitLine,
      },
      axisLine: {
        show: yAxisName.length,
        lineStyle: {
          color: "#DDDDDD",
        },
      },
      nameGap: 2,
      axisTick: {
        show: true,
        lineStyle: {
          show: false,
        },
      },
      axisLabel: {
        show: false,
      },
    },
    grid: {
      top: 14,
      left: type === "vertical" ? 0 : 20,
      right: type === "vertical" ? (labelInBar ? 0 : 30) : 16,
      bottom: 0,
      containLabel: type === "vertical",
    },
    series: [
      {
        data: data?.map((item) => ({
          ...item,
          itemStyle: {
            emphasis: {
              color: highlight
                ? item.is_highlight
                  ? normalColor
                  : highlightColor
                : normalColor,
            },
          },
          label: {
            show: showLabel,
            formatter: (label: any) => {
              return formatTenThousandNumber(
                Number(
                  (label.data as IBarChartData)?.labelValue ??
                    (label.data as IBarChartData)?.value,
                ),
                2,
              );
            },
            position: labelInBar
              ? (item.value / maxValue) * (type === "horizontal" ? 150 : 200) >
                20
                ? "inside"
                : type === "horizontal"
                ? "top"
                : "right"
              : type === "horizontal"
              ? "top"
              : "right",
          },
        })),
        type: "bar",
        itemStyle: {
          color: (item: any) =>
            highlight
              ? data.findIndex((ele) => ele.is_highlight) === item.dataIndex
                ? normalColor
                : highlightColor
              : normalColor,
          borderRadius: barBorderRaduis,
        },
        barWidth: type === "horizontal" ? 40 : 16,
      },
    ],
    tooltip: {
      show: showTooltip,
      trigger: "item",
      formatter: (params: any) => {
        return (params.data as IBarChartData)?.tooltipText;
      },
      position: (point: number[], params: any, dom: HTMLDivElement) => {
        const height = 36,
          width = dom.clientWidth;
        dom.style.display = "inline-block";
        dom.style.height = `${height}px`;
        return [point[0] - width / 2, point[1] - height - 6 - 10];
      },
      borderColor: "#fff",
      confine: true,
      transitionDuration: 0,
      padding: 8,
      testStyle: {
        fontSize: 12,
        lineHeight: 20,
      },
      renderMode: "html",
      className: styles["tooltip"],
    },
  };
  if (type === "vertical") {
    const xAxis: any = _.cloneDeep(option.yAxis),
      yAxis: any = _.cloneDeep(option.xAxis);
    option = { ...option, xAxis, yAxis };
  }
  return <ReactECharts style={{ height: "230px", ...style }} option={option} />;
};

export default BarChart;
