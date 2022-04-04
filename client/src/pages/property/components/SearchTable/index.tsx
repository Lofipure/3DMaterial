/** 这个组件写的是真他妈恶心 woc 🤮 */
import React, { FC, useMemo, useState, useRef, ElementRef } from "react";
import { Input, Button, Modal, message, Drawer } from "antd";
import apis from "@/api";
import fetch from "@/fetch";
import { isNil } from "@/utils";
import { ICheckStatus } from "@/types";
import Create, { ICreateHandler } from "@/pages/Create";
import Table, { ITableHandler, ITableProps } from "@/components/Table";
import Form from "@/components/Form";
import { IModelItem, ITagItem, PropertyType } from "@/pages/Property/types";
import ActionGroup from "../ActionGroup";
import AuthSetting from "../AuthSetting";
import {
  ModelTableColumnConfig,
  TagTableColumnConfig,
  TagTableWidth,
  ModelTableWidth,
  tagEditFormFieldsConfig,
} from "./config";
import styles from "./index.less";

type IDataType = IModelItem & ITagItem;

enum TagModalStatus {
  edit = "edit",
  create = "create",
}

interface ISearchTableProps {
  uid: number;
  type: PropertyType;
  onDetail?: (mid: number) => void;
}

const copywriting: Record<PropertyType, string> = {
  [PropertyType.model]: "模型",
  [PropertyType.tag]: "标签",
};

const SearchTable: FC<ISearchTableProps> = (props) => {
  const { uid, type, onDetail } = props;
  const [name, setName] = useState<string>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [currentOperatedModel, setCurrentOperatedModel] =
    useState<IModelItem>();
  const [authSettingVisible, setAuthSettingVisible] = useState<boolean>(false);
  const [editModelVisible, setEditModelVisible] = useState<boolean>(false);
  const [addTagLoading, setAddTagLoading] = useState<boolean>(false);
  const [tagEditModalVisible, setTagEditModalVisible] =
    useState<boolean>(false);
  const [currentEditModel, setCurrentEditModel] = useState<number>();
  const tableRef = useRef<ITableHandler>(null);
  const createTagRef = useRef<ElementRef<typeof Form>>(null);
  const createModalRef = useRef<ICreateHandler>(null);
  const tagModalStatus = useRef<TagModalStatus>(TagModalStatus.create); // 标记当前打开的框框是新建还是编辑
  const editTagId = useRef<number | undefined>(undefined);

  const deleteApi = useMemo(
    () =>
      type === PropertyType.model ? apis.model.deleteModel : apis.tag.deleteTag,
    [type],
  );

  const handleBatchModel = () => {
    Modal.confirm({
      content: `你确定要删除选中${copywriting[type]}吗`,
      onOk: async () => {
        const params =
          type === PropertyType.model
            ? { mid: selectedRowKeys }
            : { tid: selectedRowKeys };
        const { data } = await fetch<ICheckStatus>({
          api: deleteApi,
          params,
        });
        if (data.status) {
          setSelectedRowKeys([]);
          message.success("删除成功");
          tableRef.current?.refresh();
        }
      },
    });
  };

  const handleEditModelClose = () => {
    setEditModelVisible(false);
    setCurrentEditModel(undefined);
  };

  const handleAddItem = (type: PropertyType) => {
    if (type == PropertyType.model) {
      createModalRef.current?.open();
      setEditModelVisible(true);
    } else if (type == PropertyType.tag) {
      createTagRef.current?.resetFields();
      tagModalStatus.current = TagModalStatus.create;
      setTagEditModalVisible(true);
    }
    tableRef.current?.refresh();
  };

  const handleItemDelte = (type: PropertyType, record: IDataType) => {
    Modal.confirm({
      content: `你确定要删除 ${copywriting[type]}「${
        record.tag_name ?? record.model_name
      }」吗？`,
      onOk: async () => {
        const params =
          type === PropertyType.model
            ? { mid: [record.mid] }
            : { tid: [record.tid] };
        const { data } = await fetch<ICheckStatus>({
          api: deleteApi,
          params,
        });
        if (data.status) {
          message.success("删除成功");
          tableRef.current?.refresh();
        }
      },
    });
  };

  const handleItemEdit = async (type: PropertyType, record: IDataType) => {
    if (type == PropertyType.model) {
      setCurrentEditModel(record.mid);
      setEditModelVisible(true);
      setTimeout(() => {
        createModalRef.current?.open(record.mid);
      });
    } else if (type == PropertyType.tag) {
      tagModalStatus.current = TagModalStatus.edit;
      setTagEditModalVisible(true);
      setTimeout(() => {
        createTagRef.current?.setFieldsValue({
          tag_name: record.tag_name,
        });
        editTagId.current = record.tid;
      });
    }
    tableRef.current?.refresh();
  };

  const handleModelAuth = (record: IModelItem) => {
    setCurrentOperatedModel(record);
    setAuthSettingVisible(true);
  };

  const handleModelView = (record: IModelItem) => {
    if (!isNil(record?.mid)) {
      onDetail?.(record?.mid as number);
    }
  };

  const handleTagAdd = async () => {
    setAddTagLoading(true);

    const result = await createTagRef.current?.validateFields();

    if (result) {
      const { data } = await fetch<ICheckStatus>({
        api: apis.tag.addTag,
        params: {
          uid: uid,
          ...createTagRef.current?.getFieldsValue(),
          tid:
            tagModalStatus.current == TagModalStatus.edit
              ? editTagId.current
              : undefined,
        },
      });
      if (data.status) {
        message.success(
          `${
            tagModalStatus.current === TagModalStatus.create ? "新增" : "修改"
          }成功`,
        );
        tableRef.current?.refresh();
      } else {
        message.warn(
          `${
            tagModalStatus.current === TagModalStatus.create ? "新增" : "修改"
          }失败，请重试`,
        );
      }
    } else {
      message.error("请检查字段合理性");
    }

    setAddTagLoading(false);
    setTagEditModalVisible(false);
  };

  const modelColumn = ModelTableColumnConfig.map((item) => {
    if (item.key === "operation") {
      return {
        ...item,
        render: (text: string, record: IModelItem) => (
          <ActionGroup<IModelItem>
            data={record}
            type={PropertyType.model}
            onEdit={handleItemEdit.bind(this, PropertyType.model, record)}
            onDelete={handleItemDelte.bind(this, PropertyType.model, record)}
            onSettingAuth={handleModelAuth.bind(this, record)}
            onView={handleModelView.bind(this, record)}
          />
        ),
      };
    } else {
      return item;
    }
  });

  const tagColumn = TagTableColumnConfig.map((item) => {
    if (item.key === "operation") {
      return {
        ...item,
        render: (text: string, record: ITagItem) => (
          <ActionGroup<ITagItem>
            data={record}
            type={PropertyType.tag}
            onEdit={handleItemEdit.bind(this, PropertyType.tag, record)}
            onDelete={handleItemDelte.bind(this, PropertyType.tag, record)}
          />
        ),
      };
    } else {
      return item;
    }
  });

  const tableConfig = useMemo<ITableProps<any>>(
    () =>
      type == PropertyType.model
        ? {
            columns: modelColumn,
            apiConfig: apis.model.getModelList,
          }
        : {
            columns: tagColumn,
            apiConfig: apis.tag.getTagList,
          },
    [tagColumn, modelColumn],
  );

  return (
    <div className={styles["search-table"]}>
      <Modal
        onCancel={setTagEditModalVisible.bind(this, false)}
        visible={tagEditModalVisible}
        title={`${
          tagModalStatus.current === TagModalStatus.create ? "新建" : "修改"
        }标签`}
        footer={
          <div className={styles["create-tag__footer"]}>
            <Button
              className={styles["create-tag__btn"]}
              type="default"
              onClick={setTagEditModalVisible.bind(this, false)}
            >
              取消
            </Button>
            <Button
              className={styles["create-tag__btn"]}
              type="primary"
              onClick={handleTagAdd}
              loading={addTagLoading}
            >
              {`${
                tagModalStatus.current === TagModalStatus.create
                  ? "新建"
                  : "修改"
              }`}
            </Button>
          </div>
        }
      >
        <Form fieldsConfig={tagEditFormFieldsConfig} ref={createTagRef}></Form>
      </Modal>
      <AuthSetting
        mid={currentOperatedModel?.mid}
        creatorIds={currentOperatedModel?.creator_list?.map((item) => item.uid)}
        visible={authSettingVisible}
        onComplete={(tag) => {
          setAuthSettingVisible(false);
          if (tag == "save") {
            tableRef.current?.refresh();
          }
        }}
      />
      <Drawer
        visible={editModelVisible}
        title={isNil(currentEditModel) ? "新建模型" : "编辑模型"}
        width={980}
        onClose={handleEditModelClose}
        bodyStyle={{
          padding: 0,
        }}
        closable={false}
      >
        <Create
          onClose={setEditModelVisible.bind(this, false)}
          ref={createModalRef}
        />
      </Drawer>
      <div className={styles["search-table__header"]}>
        <Input.Search
          onSearch={(value) => setName(value)}
          placeholder={`请输入${copywriting[type]}名称`}
          className={styles["search-table__header__input"]}
        />
        <div className={styles["search-table__header__btn-group"]}>
          <Button
            type="primary"
            className={styles["search-table__header__btn-group__item"]}
            onClick={handleAddItem.bind(this, type)}
          >{`新增${copywriting[type]}`}</Button>
          <Button
            type="default"
            className={styles["search-table__header__btn-group__item"]}
            onClick={handleBatchModel}
            disabled={!selectedRowKeys.length}
          >
            批量删除
          </Button>
        </div>
      </div>
      <Table
        ref={tableRef}
        rowKey={type == PropertyType.model ? "mid" : "tid"}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (value) => setSelectedRowKeys(value as number[]),
        }}
        className={styles["search-table__table"]}
        size="middle"
        apiQuery={{ uid, name, is_self: true }}
        bordered={false}
        pagination={{
          position: ["bottomCenter"],
        }}
        scroll={{
          x: type == PropertyType.model ? ModelTableWidth : TagTableWidth,
        }}
        {...tableConfig}
      />
    </div>
  );
};

export default SearchTable;
