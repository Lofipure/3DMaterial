import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  ElementRef,
  useRef,
} from "react";
import classNames from "classnames";
import { Form, Input, message, Modal, Button } from "antd";
import Upload from "@/components/Upload";
import { last } from "lodash";
import { Rule } from "antd/lib/form";
import {
  DownloadOutlined,
  InboxOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import CustomerForm from "@/components/Form";
import Select from "@/components/Select";
import apis from "@/api";
import fetch from "@/fetch";
import { getUserLocalInfo } from "@/utils";
import { IBaseInfo } from "@/pages/Create/types";
import { tagEditFormFieldsConfig } from "@/pages/Property/components/SearchTable/config";
import { ICheckStatus } from "@/types";
import { UploadFileKey } from "@/constant/enums";
import { AuthControlOptions } from "./config";
import styles from "./index.less";

interface IBaseInfoProps {
  className?: string;
  mid?: number;
  baseInfo?: IBaseInfo;
}

export interface IBaseInfoHandler {
  validateFields: () => Promise<boolean>;
  getFieldsValue: () => IBaseInfo;
  setFieldsValue: (value: IBaseInfo) => void;
  resetFieldsValue: () => void;
}

const BaseInfo = forwardRef<IBaseInfoHandler, IBaseInfoProps>((props, ref) => {
  const { className, baseInfo } = props;
  const [baseInfoForm] = Form.useForm<IBaseInfo>();
  const [tagEditModalVisible, setTagEditModalVisible] =
    useState<boolean>(false);
  const [addTagLoading, setAddTagLoading] = useState<boolean>(false);
  const [modelFileURL, setModelFileURL] = useState<string>(
    baseInfo?.model_url ?? baseInfoForm.getFieldValue("model_url"),
  );
  const createTagRef = useRef<ElementRef<typeof CustomerForm>>(null);
  const selectRef = useRef<ElementRef<typeof Select>>(null);
  const baseRules = useMemo<Rule>(
    () => ({
      required: true,
      message: "请输入该字段",
    }),
    [],
  );

  const handleBeforeCoverUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("你只能上传 jpg / png 文件作为封面!");
      return false;
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error("文件必须小于3MB");
    }
    return isJpgOrPng && isLt3M;
  };

  const handleBeforeFileUpload = (file: File) => {
    const ext = last(file.name.split("."));
    if (ext != "gltf") {
      message.error("你只能上传后缀为 .gltf 的合法文件");
      return false;
    }
    return true;
  };

  const handleTagAdd = async () => {
    setAddTagLoading(true);

    if (await createTagRef.current?.validateFields()) {
      const { data } = await fetch<ICheckStatus>({
        api: apis.tag.addTag,
        params: {
          uid: getUserLocalInfo().uid,
          ...createTagRef.current?.getFieldsValue(),
        },
      });
      if (data.status) {
        message.success("新增成功");
        selectRef.current?.onRefresh();
      } else {
        message.warning("新增失败");
      }
    } else {
      message.error("请检查字段合理性");
    }
    setAddTagLoading(false);
    setTagEditModalVisible(false);
  };

  useImperativeHandle(ref, () => ({
    setFieldsValue: (value) => {
      setModelFileURL(value.model_url);
      baseInfoForm.setFieldsValue(value);
      // setCoverUrl(value.model_cover);
    },
    resetFieldsValue: () => {
      // setCoverUrl(undefined as any);
      setModelFileURL(undefined as any);
      baseInfoForm.resetFields();
    },
    validateFields: () => {
      return new Promise<boolean>((resolve) => {
        baseInfoForm
          .validateFields()
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      });
    },
    getFieldsValue: () => {
      return baseInfoForm.getFieldsValue();
    },
  }));

  return (
    <div className={classNames([className, styles["base-info"]])}>
      <Modal
        onCancel={setTagEditModalVisible.bind(this, false)}
        visible={tagEditModalVisible}
        title="创建标签"
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
              新增
            </Button>
          </div>
        }
      >
        <CustomerForm
          fieldsConfig={tagEditFormFieldsConfig}
          ref={createTagRef}
        />
      </Modal>
      <Form form={baseInfoForm} className={styles["base-info__form"]}>
        <Form.Item
          name="model_name"
          key={"model_name"}
          fieldKey={"model_name"}
          rules={[baseRules]}
          label={"模型名称"}
        >
          <Input placeholder={"请输入标签名称"} />
        </Form.Item>
        <Form.Item
          key={"tag_list"}
          fieldKey={"tag_list"}
          name="tag_list"
          label="标签列表"
          rules={[baseRules]}
        >
          <Select
            allowEmptySearch
            initSearch
            maxTagCount="responsive"
            mode="multiple"
            apiConfig={apis.tag.getTagList}
            resFormatter={(data) => data.list}
            fields={{
              labelField: "tag_name",
              valueField: "tid",
            }}
            ref={selectRef}
            placeholder="请选择标签"
            dropdownRender={(menu) => (
              <>
                <div
                  className={styles["base-info__add-tag"]}
                  onClick={setTagEditModalVisible.bind(this, true)}
                >
                  <PlusCircleOutlined
                    className={styles["base-info__add-tag__icon"]}
                  />
                  新增标签
                </div>
                {menu}
              </>
            )}
          />
        </Form.Item>
        <Form.Item
          key={"auth"}
          rules={[baseRules]}
          fieldKey={"auth"}
          name="auth"
          label="权限控制"
        >
          <Select
            options={AuthControlOptions}
            showSearch={false}
            placeholder="请选择可见范围"
          />
        </Form.Item>
        <Form.Item
          key={"model_url"}
          fieldKey={"model_url"}
          name={"model_url"}
          label={"模型文件"}
          rules={[baseRules]}
        >
          <Upload
            multiple={false}
            maxCount={1}
            showUploadList={false}
            beforeUpload={handleBeforeFileUpload}
            api={apis.tools.uploadModelUrl.url}
            dataKey={UploadFileKey.MODEL_URL}
            empty={<div>点击或拖拽文件到此处以上传</div>}
            onValueChange={(data) => setModelFileURL(data)}
            className={styles["base-info__form__upload"]}
            contentRender={() => (
              <>
                {modelFileURL?.length ? (
                  <Button
                    onClick={() => window.open(modelFileURL)}
                    icon={<DownloadOutlined />}
                  >
                    点击下载
                  </Button>
                ) : (
                  <div className={styles["upload"]}>
                    <InboxOutlined
                      size={48}
                      className={styles["upload__icon"]}
                    />
                    <p className={styles["upload__text"]}>
                      点击或拖拽文件到此处以上传
                    </p>
                    <p className={styles["upload__hint"]}>
                      请拖拽描述模型的 .glTF文件
                    </p>
                  </div>
                )}
              </>
            )}
          />
        </Form.Item>
        <Form.Item
          key={"model_cover"}
          fieldKey={"model_cover"}
          name={"model_cover"}
          label={"模型封面"}
          rules={[baseRules]}
          style={{ width: "100%" }}
        >
          <Upload
            useCustomer={false}
            name="model_cover"
            listType="picture"
            showUploadList={false}
            className={styles["cover-uploader"]}
            beforeUpload={handleBeforeCoverUpload}
            api={apis.tools.uploadModelCover.url}
            dataKey={UploadFileKey.MODEL_COVER}
            imageWidth={400}
          ></Upload>
        </Form.Item>
        <Form.Item
          key={"model_desc"}
          fieldKey={"model_desc"}
          name={"model_desc"}
          label="模型描述"
          rules={[
            {
              max: 50,
              message: "说几句就行啦~",
            },
            {
              min: 5,
              message: "咱高低多整两句?",
            },
            baseRules,
          ]}
        >
          <Input.TextArea
            placeholder="请用一句话简单介绍一下你的模型"
            showCount
          />
        </Form.Item>
      </Form>
    </div>
  );
});

export default BaseInfo;
