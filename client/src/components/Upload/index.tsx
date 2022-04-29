import React, { FC, useState, ReactNode, useEffect } from "react";
import { Upload, UploadProps, Image, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

interface ICustomerUpload extends UploadProps {
  api: string;
  dataKey: string;
  empty?: ReactNode;
  contentRender?: () => JSX.Element;
  onValueChange?: (data: string) => void;
  useCustomer?: boolean;
  value?: string;
  imageWidth?: number;
}

const CustomerUpload: FC<ICustomerUpload> = (props) => {
  const {
    api,
    dataKey,
    contentRender,
    onValueChange,
    useCustomer = true,
    value,
    imageWidth = 100,
  } = props;
  const [path, setPath] = useState<string>("");

  const uploadFile = async (options: any) => {
    const formData = new FormData();
    formData.append(dataKey, options.file);
    const { data: res } = await axios({
      url: api,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setPath(res.data.path ?? "");
    props.onChange?.(res.data.path ?? "");
    onValueChange?.(path);
  };

  const handleOnChange = () => {
    onValueChange?.(path);
    props.onChange?.(path as any);
  };

  useEffect(() => {
    if (value) {
      setPath(value);
    }
  }, [value]);

  return (
    <Upload
      {...props}
      customRequest={uploadFile}
      onChange={handleOnChange}
      name={dataKey}
    >
      {useCustomer ? (
        contentRender?.()
      ) : !path ? (
        <Button icon={<UploadOutlined />}>点击上传</Button>
      ) : (
        <Image src={path} preview={false} width={imageWidth} />
      )}
    </Upload>
  );
};

export default CustomerUpload;
