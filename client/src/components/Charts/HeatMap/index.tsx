import React, { FC } from "react";
import EChartsReact from "echarts-for-react";

export type HeatChartItemType = [string, number];

interface IHeatChartProps {
  className?: string;
  year: string;
  dataSource: HeatChartItemType[];
  onClick?: (date: string) => void;
}

const HeatChart: FC<IHeatChartProps> = (props) => {
  const { className, year, dataSource, onClick } = props;

  const option = {
    renderer: "svg",
    title: {
      show: false,
    },
    tooltip: {
      show: false,
    },
    visualMap: {
      show: false,
      inRange: {
        color: [
          "#E6F7FF",
          "#BAE7FF",
          "#91D5FF",
          "#69C0FF",
          "#40A9FF",
          "#1890FF",
          "#096DD9",
          "#0050B3",
          "#003A8C",
          "#002766",
        ],
      },
      pieces: [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: 9 },
      ],
    },
    calendar: {
      top: 18,
      left: 18,
      range: year,
      splitLine: false,
      itemStyle: {
        borderWidth: 2,
        borderColor: "#fff",
        borderType: "solid",
      },
      cellSize: [16, 16],
      dayLabel: {
        padding: 0,
        margin: 5,
        nameMap: ["日", "一", "二", "三", "四", "五", "六"],
        color: "#6E748E",
      },
      monthLabel: {
        nameMap: "cn",
        color: "#6E748E",
      },
      yearLabel: {
        show: false,
      },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: dataSource,
      selectedMode: true,
      select: {
        itemStyle: {
          borderColor: "#F65656",
          borderWidth: 1,
        },
      },
    },
  };
  return (
    <EChartsReact
      className={className}
      onEvents={{
        click: (params: Record<string, any>) => {
          onClick?.(params?.value[0]);
        },
      }}
      style={{ height: 140, width: 870, margin: "0 auto" }}
      option={option}
    />
  );
};

export default HeatChart;
