import React, {
  FC,
  useState,
  useRef,
  ElementRef,
  useEffect,
  useMemo,
} from "react";
import { Modal, Button, message } from "antd";
import Form, { IFieldConfig } from "@/components/Form";
import Select from "@/components/Select";
import fetch from "@/fetch";
import apis from "@/api";
import { ICheckStatus } from "@/types";
import { isNil } from "@/utils";
import styles from "./index.less";

interface IAuthSetting {
  mid?: number;
  visible?: boolean;
  creatorIds?: number[];
  onComplete?: (tag: "save" | "cancel") => void;
}

const AuthSetting: FC<IAuthSetting> = (props) => {
  const { visible, creatorIds, onComplete, mid } = props;
  const [modalVisible, setModalVisible] = useState<boolean>(visible ?? false);
  const [loading, setLoading] = useState<boolean>(false);

  const formRef = useRef<ElementRef<typeof Form>>(null);

  const handleSave = async () => {
    const { creator_id } = formRef.current?.getFieldsValue() ?? {};
    setLoading(true);

    const { data } = await fetch<ICheckStatus>({
      api: apis.model.setAuth,
      params: {
        mid,
        creator_id,
      },
    });

    if (data.status) {
      message.success("保存成功");
    } else {
      message.error("保存失败");
    }
    setLoading(false);
    setModalVisible(false);
    onComplete?.("save");
  };

  const handleClose = () => {
    onComplete?.("cancel");
  };

  const AuthFormFieldsConfig = useMemo<IFieldConfig[]>(
    () => [
      {
        key: "creator_id",
        name: "creator_id",
        label: "协作者",
        initialValue: creatorIds,
        widget: (
          <Select
            apiConfig={apis.user.getUserList}
            fields={{
              labelField: "username",
              valueField: "uid",
            }}
            resFormatter={(data) => data.list}
            mode="multiple"
            initSearch
            allowEmptySearch
            maxTagCount="responsive"
          />
        ),
      },
    ],
    [creatorIds],
  );

  useEffect(() => {
    if (!isNil(creatorIds)) {
      formRef.current?.setFieldsValue({
        creator_id: creatorIds,
      });
    }
  }, [JSON.stringify(creatorIds)]);

  useEffect(() => {
    if (isNil(visible)) return;
    setModalVisible(!!visible);
  }, [visible]);
  return (
    <Modal
      wrapClassName={styles["auth-setting"]}
      visible={modalVisible}
      title="权限设置"
      footer={
        <div className={styles["auth-setting__footer"]}>
          <Button
            type="default"
            className={styles["auth-setting__btn"]}
            onClick={handleClose}
          >
            取消
          </Button>
          <Button
            type="primary"
            className={styles["auth-setting__btn"]}
            onClick={handleSave}
            loading={loading}
          >
            保存
          </Button>
        </div>
      }
    >
      <Form
        className={styles["auth-form"]}
        ref={formRef}
        fieldsConfig={AuthFormFieldsConfig}
      ></Form>
    </Modal>
  );
};

export default AuthSetting;
