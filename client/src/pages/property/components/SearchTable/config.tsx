import { Input, Tag } from "antd";
import apis from "@/api";
import fetch from "@/fetch";
import { formatNumber } from "@/utils";
import Ellipsis from "@/components/Ellipsis";
import { IColumnProps } from "@/components/Table";
import { IFieldConfig } from "@/components/Form";
import { ITag, ICreator, IModelItem, ITagItem } from "@/pages/Property/types";
import styles from "./index.less";
import { ICheckStatus } from "@/types";

const TagList = (list: Array<ITag & ICreator>): JSX.Element => (
  <div className={styles["tag-list"]}>
    {/* 为了把控宽度，给控制三个得了，可以说是很给面子了 */}
    {list.slice(0, 3).map((item, index) => (
      <Tag
        color={["blue", "volcano", "success"][index]}
        key={item.tid ?? item.uid}
      >
        {item.tag_name ?? item.username}
      </Tag>
    ))}
  </div>
);

export const ModelTableColumnConfig: IColumnProps<IModelItem>[] = [
  {
    title: "模型名称",
    dataIndex: "model_name",
    key: "model_name",
    render: (value: string) => <Ellipsis text={value} />,
    width: 210,
    fixed: "left",
  },
  {
    title: "创建时间",
    dataIndex: "model_create_time",
    key: "model_create_time",
    width: 140,
  },
  {
    title: "标签列表",
    dataIndex: "tag_list",
    key: "tag_list",
    render: (value) => TagList(value),
    width: 300,
  },
  {
    title: "点赞数",
    dataIndex: "model_goods",
    key: "model_goods",
    width: 120,
    align: "right",
    render: (value) => formatNumber(value),
  },
  {
    title: "浏览量",
    dataIndex: "model_visited",
    key: "model_visited",
    width: 120,
    align: "right",
    render: (value) => formatNumber(value),
  },
  {
    title: "操作",
    width: 240,
    key: "operation",
  },
];

export const TagTableColumnConfig: IColumnProps<ITagItem>[] = [
  {
    title: "标签名称",
    key: "tag_name",
    dataIndex: "tag_name",
    width: 140,
    fixed: "left",
  },
  {
    title: "创建时间",
    key: "tag_create_time",
    dataIndex: "tag_create_time",
    width: 140,
  },
  {
    title: "部分协作者",
    key: "relative_creator_list",
    dataIndex: "relative_creator_list",
    width: 300,
    render: (value) => TagList(value),
  },
  {
    title: "模型数",
    key: "model_num",
    dataIndex: "model_num",
    width: 120,
    align: "right",
    render: (value) => formatNumber(value),
  },
  {
    title: "操作",
    width: 180,
    key: "operation",
  },
];

const getTableWidth = (config: IColumnProps<any>[]) =>
  config.reduce((width, cur) => width + Number(cur.width ?? 0), 0);

export const ModelTableWidth = getTableWidth(ModelTableColumnConfig);
export const TagTableWidth = getTableWidth(TagTableColumnConfig);

export const validateName = async (
  rule: Record<string, any>,
  value: string,
  defaultValue?: string,
): Promise<any> => {
  const realValue = value?.trim();
  // 如果存在默认值，且当前值与默认值相等，则不做校重
  if (realValue === defaultValue) {
    return Promise.resolve();
  }
  if (realValue) {
    const { data } = await fetch<ICheckStatus>({
      api: apis.tag.checkName,
      params: {
        tag_name: realValue,
      },
    });
    if (!data.status) {
      return Promise.reject(new Error("标签已存在"));
    } else {
      return Promise.resolve();
    }
  }
};

export const tagEditFormFieldsConfig: IFieldConfig[] = [
  // {
  //   label: "标签ID",
  //   name: "tid",
  //   key: "tid",
  //   widget: <Input disabled />,
  //   rules: [
  //     {
  //       required: true,
  //       message: "标签名称都不填?",
  //     },
  //   ],
  // },
  {
    label: "标签名称",
    name: "tag_name",
    key: "tag_name",
    widget: <Input placeholder="请输入标签名称" />,
    rules: [
      {
        required: true,
        message: "标签名称都不填?",
      },
      {
        validator: (rule: Record<string, any>, value: string) =>
          validateName(rule, value),
      },
    ],
  },
];
