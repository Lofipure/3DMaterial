import React, { FC, useState } from "react";
import Vditor from "vditor";
import { Spin } from "antd";
import "vditor/src/assets/scss/index.scss";

interface IMarkdownParser {
  mode?: "view" | "edit";
  value?: string;
  onChange?: (value: string) => void;
}

const MarkdownParser: FC<IMarkdownParser> = (props) => {
  const { mode = "view", value, onChange } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const toolbarconfig = [
    "outline",
    "|",
    "headings",
    "bold",
    "strike",
    "|",
    "code",
    "link",
    "undo",
    "redo",
    "indent",
    "outdent",
    "fullscreen",
    "ordered-list",
  ];

  const render = (node: HTMLDivElement) => {
    if (mode == "edit") {
      new Vditor(node, {
        minHeight: 400,
        comment: {
          enable: false,
        },
        mode: "ir",
        toolbar: toolbarconfig,
        value: value ?? ":::",
        cache: {
          enable: false,
        },
        input: (value) => {
          onChange?.(value);
        },
      });
    } else {
      if (value && value != undefined) {
        Vditor.preview(node, value, {
          mode: "light",
        });
      }
    }
  };

  return (
    <Spin spinning={loading}>
      <div
        ref={(node) => {
          setLoading(!node);
          if (node) {
            render(node);
          }
        }}
        style={{
          height: "100%",
        }}
      ></div>
    </Spin>
  );
};

export default MarkdownParser;
