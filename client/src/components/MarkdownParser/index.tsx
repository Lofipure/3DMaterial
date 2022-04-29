import React, { FC, useCallback } from "react";
import Vditor from "vditor";
import "vditor/src/assets/scss/index.scss";

interface IMarkdownParser {
  mode?: "view" | "edit";
  value?: string;
  onChange?: (value: string) => void;
}

const MarkdownParser: FC<IMarkdownParser> = (props) => {
  const { mode = "view", value, onChange } = props;
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

  const containerRef = useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        if (mode === "edit") {
          new Vditor(node, {
            minHeight: 400,
            comment: {
              enable: false,
            },
            mode: "ir",
            toolbar: toolbarconfig,
            value:
              value || "请开始你的创作吧，编辑器已全面支持 `markdown` 语法",
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
      }
    },
    [mode, value, onChange],
  );
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
