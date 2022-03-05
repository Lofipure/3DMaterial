import React, { FC, useState, ReactNode } from "react";
import { Upload, UploadProps } from "antd";
import axios from "axios";

interface ICustomerUpload extends UploadProps {
  api: string;
  dataKey: string;
  empty?: ReactNode;
  contentRender?: () => JSX.Element;
  onValueChange?: (data: string) => void;
  useCustomer?: boolean;
}

const CustomerUpload: FC<ICustomerUpload> = (props) => {
  const {
    api,
    dataKey,
    contentRender,
    onValueChange,
    useCustomer = true,
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

  return (
    <Upload
      {...props}
      customRequest={uploadFile}
      onChange={handleOnChange}
      name={dataKey}
    >
      {useCustomer ? contentRender?.() : <div>default</div>}
    </Upload>
  );
};

export default CustomerUpload;
