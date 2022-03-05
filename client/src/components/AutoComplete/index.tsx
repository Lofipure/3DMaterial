import React, { useEffect, useRef, useState } from "react";
import { AutoComplete as AntAutoComplete, Spin } from "antd";
import { AutoCompleteProps } from "antd/lib/auto-complete";
import fetch, { API } from "@/fetch";

type FieldsType = {
  valueField: string;
  labelField: string;
};

interface IAutoCompleteProps extends AutoCompleteProps {
  apiConfig?: API;
  apiQuery?: Record<string, any>;
  keyField?: string;
  fields?: FieldsType;
  initSearch?: boolean;
  value?: string;
  defaultValue?: string;
  delay?: number;
  allowEmptySearch?: boolean;
  resFormatter?: (data?: any) => Record<string, any>[];
  onChange?: (value: string, option?: Record<string, any>) => void;
  onSelect?: (value: string, option?: Record<string, any>) => void;
}

const DEFAULT_FELDS = {
  valueField: "id",
  labelField: "name",
};

const AutoComplete: React.FC<IAutoCompleteProps> = (
  props: IAutoCompleteProps,
) => {
  const {
    apiConfig,
    apiQuery,
    keyField = "keyword",
    fields = DEFAULT_FELDS,
    initSearch,
    value,
    delay,
    children,
    defaultValue,
    allowEmptySearch,
    resFormatter,
    onChange,
    onSelect,
    ...restProps
  } = props;
  const { valueField, labelField } = fields;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || defaultValue);
  const timer = useRef<any>(null);
  const firstValueFetched = useRef(false);

  const setDefaultValue = (data: Record<string, any>[]): void => {
    if (defaultValue && !firstValueFetched.current) {
      const current = data?.find((item) => item[valueField] == defaultValue);
      setCurrentValue(current?.[labelField] || defaultValue);
      firstValueFetched.current = true;
    }
  };

  const fetchData = async (value?: string) => {
    if (!apiConfig || (!allowEmptySearch && !value)) return;
    setLoading(true);
    const { data } = await fetch<any>({
      api: apiConfig,
      params: {
        ...apiQuery,
        [keyField]: value,
      },
    });
    const formatData = resFormatter ? resFormatter?.(data) : data;
    setData(formatData ?? []);
    setDefaultValue(formatData);
    setLoading(false);
  };

  const handleSearch = (value?: string): void => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(function () {
      fetchData(value);
    }, delay);
  };

  const handleChange = (value: string, option: Record<string, any>): void => {
    const fieldName = valueField;
    const realValue = data.find((item) => item[fieldName] === value)?.[
      valueField
    ];
    setCurrentValue(value);
    onChange?.(realValue || value, option);
  };

  const handleSelect = (value: string, option: Record<string, any>): void => {
    const fieldName = valueField;
    const realValue = data.find((item) => item[fieldName] === value)?.[
      valueField
    ];
    setCurrentValue(value);
    onSelect?.(realValue || "", option);
  };

  useEffect(() => {
    initSearch && handleSearch(defaultValue || value);
  }, []);

  const options = data.length
    ? data.map((item) => ({
        label: item[labelField],
        value: item[valueField],
      }))
    : [];

  return (
    <AntAutoComplete
      style={{ width: "100%" }}
      allowClear
      showSearch
      notFoundContent={loading ? <Spin size="small" /> : null}
      {...restProps}
      value={currentValue}
      options={options}
      onSearch={handleSearch}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {children}
    </AntAutoComplete>
  );
};

AutoComplete.defaultProps = {
  keyField: "keyword",
  fields: DEFAULT_FELDS,
  delay: 400,
};

export default AutoComplete;
