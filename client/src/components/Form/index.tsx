import React, { useImperativeHandle, forwardRef } from "react";
import { Form as AntForm } from "antd";
import { Rule } from "antd/lib/form";
import classNames from "classnames";
import { FormLayout } from "antd/lib/form/Form";

export interface ILayout {
  label?: number;
  labelAlign?: "left" | "right";
  wrapper?: number;
  layout?: FormLayout;
}

export interface IFieldConfig {
  name: string;
  key: Key;
  widget: React.ReactNode;
  label: string;
  options?: Record<string, any>;
  required?: boolean;
  rules?: Rule[];
  initialValue?: any;
}

interface IFormProps {
  className?: string;
  fieldsConfig: Array<IFieldConfig>;
  layout?: ILayout;
}

interface IFormHandler {
  getFieldsValue: <T extends Record<string, any>>() => T;
  setFieldsValue: (value: Record<string, any>) => void;
  resetFields: () => void;
  validateFields: () => Promise<boolean>;
}

const Form = forwardRef<IFormHandler, IFormProps>((props, ref) => {
  const { className, fieldsConfig, layout } = props;
  const [form] = AntForm.useForm();

  useImperativeHandle(ref, () => ({
    getFieldsValue: form.getFieldsValue,
    setFieldsValue: form.setFieldsValue,
    resetFields: form.resetFields,
    validateFields: () => {
      return new Promise<boolean>((resolve) => {
        form
          .validateFields()
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      });
    },
  }));

  return (
    <AntForm
      form={form}
      className={classNames([className])}
      labelAlign={layout?.labelAlign ?? "left"}
      layout={layout?.layout}
    >
      {fieldsConfig.map((field) => (
        <AntForm.Item
          initialValue={field.initialValue}
          labelCol={{
            span: layout?.label ?? 4,
          }}
          wrapperCol={{
            span: layout?.wrapper ?? 20,
          }}
          name={field.name}
          fieldKey={field.name}
          key={field.key}
          label={field.label}
          rules={field.rules}
          {...field.options}
        >
          {field.widget}
        </AntForm.Item>
      ))}
    </AntForm>
  );
});

export default Form;
