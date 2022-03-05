import { IFieldConfig } from "@/components/Form";
import { Input } from "antd";
import Select from "@/components/Select";
import apis from "@/api";
import styles from "./index.less";

export const fieldsConfig: IFieldConfig[] = [
  {
    key: "name",
    name: "name",
    label: "模型名称",
    widget: (
      <Input
        className={styles["search__form__item"]}
        placeholder="请输入模型名称"
      />
    ),
  },
  {
    key: "model_tags",
    name: "model_tags",
    label: "模型标签",
    widget: (
      <Select
        mode="multiple"
        className={styles["search__form__item"]}
        placeholder="请选择模型标签"
        maxTagCount="responsive"
        apiConfig={apis.tag.getTagList}
        resFormatter={(data) => data.list}
        fields={{
          labelField: "tag_name",
          valueField: "tid",
        }}
        initSearch
        allowEmptySearch
      />
    ),
  },
  {
    key: "creators",
    name: "creators",
    label: "创作者",
    widget: (
      <Select
        mode="multiple"
        className={styles["search__form__item"]}
        placeholder="请选择创作者"
        maxTagCount="responsive"
        apiConfig={apis.user.getUserList}
        resFormatter={(data) => data.list}
        fields={{
          labelField: "username",
          valueField: "uid",
        }}
        initSearch
        allowEmptySearch
      />
    ),
  },
];
