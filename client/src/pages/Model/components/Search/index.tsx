import React, {
  ElementRef,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { IParams } from "@/pages/Model/types";
import Form from "@/components/Form";
import { fieldsConfig } from "./config";
import styles from "./index.less";
import { Button } from "antd";

interface ISearchProps {
  onSearch: (params: IParams) => void;
}

interface ISearchHandler {
  getFieldsValue: () => IParams | undefined;
}

const Search = forwardRef<ISearchHandler, ISearchProps>((props, ref) => {
  const { onSearch } = props;
  const form = useRef<ElementRef<typeof Form>>(null);

  const handleSearch = () => {
    const value = form.current?.getFieldsValue<IParams>();
    if (value) {
      onSearch?.(value);
    }
  };

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => {
      return form.current?.getFieldsValue();
    },
  }));
  return (
    <div className={styles["search"]}>
      <Form
        ref={form}
        fieldsConfig={fieldsConfig}
        layout={{
          label: 12,
          wrapper: 12,
          labelAlign: "right",
          layout: "inline",
        }}
        className={styles["search__form"]}
      />
      <Button
        type="primary"
        className={styles["search__btn"]}
        onClick={handleSearch}
      >
        搜索
      </Button>
    </div>
  );
});

export default Search;
