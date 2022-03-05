import { IFieldConfig } from "@/components/Form";
import { Input, Radio } from "antd";
import { Sex } from "@/types";
import Upload from "@/components/Upload";
import apis from "@/api";
import { UploadFileKey } from "@/constant/enums";

export const loginFormFields: IFieldConfig[] = [
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
    key: "password",
    name: "password",
    label: "密码",
    widget: <Input.Password />,
    rules: [
      {
        required: true,
        message: "不输入密码可是不行哦～",
      },
    ],
  },
];

export const registerFormFields: IFieldConfig[] = [
  {
    key: "user_avatar",
    name: "user_avatar",
    label: "头像",
    rules: [
      {
        required: true,
        message: "选一张好看的图片作为头像吧",
      },
    ],
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
        <Radio value={Sex.Male}>男</Radio>
        <Radio value={Sex.Female}>女</Radio>
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
    rules: [
      {
        required: true,
        message: "请输入密码哦～",
      },
    ],
  },
  {
    key: "confirmPassword",
    name: "comfirmPassword",
    label: "确认密码",
    widget: <Input.Password />,
    rules: [
      {
        required: true,
        message: "请确认你的密码哦～",
      },
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
