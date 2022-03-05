import React, { forwardRef, useImperativeHandle, useState } from "react";
import MarkdownParser from "@/components/MarkdownParser";

interface IIntroduceProps {
  value?: string;
}

export interface IIntroduceHandler {
  getValue: () => string;
  setValue: (value: string) => void;
}

const Introduce = forwardRef<IIntroduceHandler, IIntroduceProps>(
  (props, ref) => {
    const { value } = props;
    const [markdown, setMarkdown] = useState<string>(
      value ?? "请详细说明一下你的模型吧 ：）",
    );

    useImperativeHandle(ref, () => ({
      getValue: () => markdown,
      setValue: (val) => {
        setMarkdown(val ?? "请详细说明一下你的模型吧 ：）");
      },
    }));

    return (
      <MarkdownParser
        mode="edit"
        value={markdown}
        onChange={(val) => setMarkdown(val)}
      />
    );
  },
);

export default Introduce;
