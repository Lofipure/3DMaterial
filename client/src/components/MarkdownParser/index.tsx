import React, { FC, useRef } from "react";
import Vditor from "vditor";
import "vditor/src/assets/scss/index.scss";

interface IMarkdownParser {
  mode?: "view" | "edit";
  value?: string;
  onChange?: (value: string) => void;
}

const MarkdownParser: FC<IMarkdownParser> = (props) => {
  const { mode = "view", value, onChange } = props;
  const containerRef = useRef<HTMLDivElement>(null);
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

  if (mode === "edit") {
    new Vditor(containerRef.current as HTMLDivElement, {
      minHeight: 400,
      comment: {
        enable: false,
      },
      mode: "ir",
      toolbar: toolbarconfig,
      value: value || "请详细说明一下你的模型吧 ：）",
      cache: {
        enable: false,
      },
      input: (value) => {
        onChange?.(value);
      },
    });
  } else {
    if (value && value != undefined) {
      Vditor.preview(containerRef?.current as HTMLDivElement, value, {
        mode: "light",
      });
    }
  }
  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
      }}
    ></div>
  );
};

export default MarkdownParser;
