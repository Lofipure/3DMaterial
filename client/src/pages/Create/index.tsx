import React, { useImperativeHandle, useState, useRef } from "react";
import { Button, message, Steps, Spin } from "antd";
import { cloneDeep } from "lodash";
import fetch from "@/fetch";
import apis from "@/api";
import { getUserLocalInfo, isNil } from "@/utils";
import { ICheckStatus } from "@/types";
import { IBaseInfo, STEP_KEY } from "./types";
import BaseInfo, { IBaseInfoHandler } from "./components/BaseInfo";
import Introduce, { IIntroduceHandler } from "./components/Introduce";
import Result from "./components/Result";
import styles from "./index.less";

interface ICreateProps {
  onClose?: () => void;
}

export interface ICreateHandler {
  open: (mid?: number) => void;
}

const Create = React.forwardRef<ICreateHandler, ICreateProps>((props, ref) => {
  const { onClose } = props;
  const [currentStep, setCurrentStep] = useState<STEP_KEY>(STEP_KEY.baseInfo);
  const baseInfoRef = useRef<IBaseInfoHandler>(null);
  const introduceRef = useRef<IIntroduceHandler>(null);
  const [fetchDetailLoading, setFetchDetailLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [mid, setMid] = useState<number>();

  const fetchModelDetail = async (_mid: number) => {
    setFetchDetailLoading(true);
    const { data } = await fetch<IBaseInfo>({
      api: apis.model.getModelDetail,
      params: {
        mid: _mid,
      },
    });
    const _data = Object.keys(data).reduce<Record<string, any>>((obj, key) => {
      if (key === "tag_list") {
        obj.tag_list = data.tag_list.map((item) => item.tid);
      } else {
        obj[key] = data[key];
      }
      return obj;
    }, {});

    baseInfoRef.current?.setFieldsValue(_data as any);
    introduceRef.current?.setValue(data.model_intro);
    setFetchDetailLoading(false);
  };

  const handleCancel = () => {
    setCurrentStep(STEP_KEY.baseInfo);
    baseInfoRef.current?.resetFieldsValue();
    introduceRef.current?.setValue("请详细说明一下你的模型吧 ：）");
    setMid(undefined);
    onClose?.();
  };

  const handleNextStep = async () => {
    switch (currentStep) {
      case STEP_KEY.baseInfo: {
        const status = await baseInfoRef.current?.validateFields();
        if (status) {
          setCurrentStep(STEP_KEY.introduce);
        }
        break;
      }
      case STEP_KEY.introduce: {
        const value = introduceRef.current?.getValue();
        if (value?.length) {
          const modelValue = {
            ...cloneDeep(baseInfoRef.current?.getFieldsValue()),
            model_intro: value,
          };
          setSubmitLoading(true);
          setFetchDetailLoading(true);
          const { data } = await fetch<ICheckStatus>({
            api: apis.model.saveModel,
            params: {
              ...modelValue,
              mid,
              uid: getUserLocalInfo().uid,
            },
          });
          setSubmitLoading(false);
          setFetchDetailLoading(false);

          if (data.status) {
            setCurrentStep(STEP_KEY.result);
          }
        } else {
          message.warn("至少写上一个字？");
        }
        break;
      }
      case STEP_KEY.result: {
        handleCancel();
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "基本信息",
      key: STEP_KEY.baseInfo,
      component: <BaseInfo ref={baseInfoRef} />,
    },
    {
      title: "详细介绍",
      key: STEP_KEY.introduce,
      component: <Introduce ref={introduceRef} />,
    },
    {
      title: "提交状态",
      key: STEP_KEY.result,
      component: <Result />,
    },
  ];

  useImperativeHandle(ref, () => ({
    open: (mid?: number) => {
      setMid(mid);
      if (!isNil(mid)) {
        fetchModelDetail(mid as number);
      } else {
        introduceRef.current?.setValue("");
      }
    },
  }));
  return (
    <div className={styles["create"]}>
      <div className={styles["create__content"]}>
        <Spin spinning={fetchDetailLoading}>
          <Steps current={currentStep}>
            {steps.map((item) => (
              <Steps.Step key={item.key} title={item.title} />
            ))}
          </Steps>
          <div className={styles["create__content-wrapper"]}>
            {steps.map((item) => (
              <div
                style={{
                  display: item.key === currentStep ? "unset" : "none",
                }}
              >
                {/* 大坑，step每换一步都会把上一个给unmounted，不会存之前的状态，切换回上一步东西就没了，很他妈奇怪 */}
                {/* 所以就粗暴一点给他都render，然后用display控制可见性 */}
                {item.component}
              </div>
            ))}
          </div>
        </Spin>
      </div>
      <div className={styles["create__footer"]}>
        {currentStep != STEP_KEY.result && (
          <Button
            type="default"
            className={styles["create__footer__btn"]}
            onClick={handleCancel}
            loading={submitLoading}
          >
            取消
          </Button>
        )}
        {currentStep == STEP_KEY.introduce && (
          <Button
            type="default"
            className={styles["create__footer__btn"]}
            onClick={handlePreviousStep}
            loading={submitLoading}
          >
            上一步
          </Button>
        )}
        <Button
          type="primary"
          onClick={handleNextStep}
          className={styles["create__footer__btn"]}
          loading={submitLoading}
        >
          {currentStep === STEP_KEY.result ? "完成" : "下一步"}
        </Button>
      </div>
    </div>
  );
});

export default Create;
