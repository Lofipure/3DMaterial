import React, { useMemo, useCallback } from "react";
import { IModelItem, ITagItem } from "@/pages/Property/types";
import { PropertyType } from "@/pages/Property/types";
import styles from "./index.less";
import { Button } from "antd";

interface IActionGroupProps<T> {
  data: T;
  type: PropertyType;
  onEdit?: (record: T) => void;
  onSuccess?: (record: T) => void;
  onDelete?: (record: T) => void;
  onView?: (record: T) => void;
  onSettingAuth?: (record: T) => void;
}

const ActionGroup = <T extends ITagItem & IModelItem>(
  props: IActionGroupProps<T>,
): JSX.Element => {
  const { data, type, onEdit, onDelete, onSettingAuth, onView } = props;

  const emptyHandler = useCallback(() => null, []);

  const config = useMemo(() => {
    const baseOperations = [
      {
        key: "edit",
        name: "编辑",
        eventHandler: onEdit?.bind(this, data),
      },
      {
        key: "delete",
        name: "删除",
        eventHandler: onDelete?.bind(this, data),
      },
    ];
    const extraOperations = [
      {
        key: "view",
        name: "查看",
        eventHandler: onView?.bind(this, data),
      },
      {
        key: "auth",
        name: "设置权限",
        eventHandler: onSettingAuth?.bind(this, data),
      },
    ];

    return type == PropertyType.model
      ? [...baseOperations, ...extraOperations]
      : baseOperations;
  }, [type, data]);

  return (
    <div className={styles["action-group"]}>
      {config.map((item) => (
        <Button
          key={item.key}
          type="link"
          size="small"
          className={styles["action-group__item"]}
          onClick={item.eventHandler ?? emptyHandler}
          disabled={
            ["auth", "delete"].includes(item.key) &&
            // item.key === "auth"
            PropertyType.model
              ? !data.is_owner
              : false
          }
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default ActionGroup;
