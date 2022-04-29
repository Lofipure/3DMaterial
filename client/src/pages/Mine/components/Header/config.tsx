import { Input, Radio } from "antd";
import apis from "@/api";
import { IFieldConfig } from "@/components/Form";
import Upload from "@/components/Upload";
import { UploadFileKey } from "@/constant/enums";

export const editFormFieldsConfig: IFieldConfig[] = [
  {
    key: "user_avatar",
    name: "user_avatar",
    label: "头像",
    widget: (
      <Upload
        api={apis.tools.uploadUserAvatar.url}
        dataKey={UploadFileKey.USER_AVATAR}
        listType="picture"
        showUploadList={false}
        empty={<div>点击上传</div>}
        useCustomer={false}
      />
    ),
  },
  {
    key: "email",
    name: "email",
    label: "邮箱",
    widget: <Input />,
    rules: [
      {
        required: true,
        message: "请输入邮箱哦～",
      },
      {
        pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
        message: "请检查邮箱格式～",
      },
    ],
  },
  {
    key: "sex",
    name: "sex",
    label: "性别",
    widget: (
      <Radio.Group>
        <Radio value={1}>男</Radio>
        <Radio value={2}>女</Radio>
      </Radio.Group>
    ),
    rules: [
      {
        required: true,
        message: "请选择性别哦～",
      },
    ],
  },
  {
    key: "username",
    name: "username",
    label: "用户名",
    widget: <Input />,
    rules: [
      {
        required: true,
        message: "请输入用户名哦～",
      },
    ],
  },
  {
    key: "password",
    name: "password",
    label: "密码",
    widget: <Input.Password />,
  },
  {
    key: "confirmPassword",
    name: "comfirmPassword",
    label: "确认密码",
    widget: <Input.Password />,
    rules: [
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error("两次的密码不一样哦～"));
        },
      }),
    ],
  },
];
