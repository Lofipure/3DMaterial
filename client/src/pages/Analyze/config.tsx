import Ellipsis from "@/components/Ellipsis";
import { TableProps } from "antd";

export enum ModelVisitMode {
  area = "area",
  table = "table",
}

export const modelVisitOptions = [
  {
    label: "访问量变化",
    value: ModelVisitMode.area,
  },
  {
    label: "访问排行",
    value: ModelVisitMode.table,
  },
];

export const tableColumns: TableProps<any>["columns"] = [
  {
    key: "index",
    title: "排名",
    dataIndex: "index",
    width: 120,
  },
  {
    key: "name",
    title: "名称",
    dataIndex: "name",
    width: 170,
    render: (value) => <Ellipsis text={value} />,
  },
  {
    key: "value",
    title: "访问次数",
    dataIndex: "value",
    width: 160,
    align: "right",
  },
];
