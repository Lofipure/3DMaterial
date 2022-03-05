import React, { FC, CSSProperties } from "react";
import EChartsReact from "echarts-for-react";
import { max } from "lodash";

interface IRadarChartData {
  name: string;
  value: number;
}

interface IRadarChartProps {
  data: IRadarChartData[];
  style?: CSSProperties;
}

const Radar: FC<IRadarChartProps> = (props) => {
  const { data, style = {} } = props;

  const maxValue = max(data.map((item) => item.value)) ?? 0;

  const option = {
    radar: {
      indicator: data.map((item) => ({
        name: item.name,
        max: maxValue,
      })),
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: data?.map((item) => item.value),
          },
        ],
      },
    ],
  };
  return data.length ? (
    <EChartsReact option={option} style={{ height: 230, ...style }} />
  ) : (
    <div />
  );
};

export default Radar;
