import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { SelectProps } from "antd/lib/select";
import fetch, { API } from "@/fetch";
import { debounce } from "lodash";
import { Spin, Select as AntSelect } from "antd";
interface IFields {
  valueField: string;
  labelField: string;
}
type FilterFunc = (
  inputValue: string,
  options?: Record<string, any>,
) => boolean;

export interface ISelectProps extends SelectProps<any> {
  apiConfig?: API;
  apiQuery?: Record<string, any>;
  keyField?: string;
  fields?: IFields;
  autoSearch?: boolean;
  initSearch?: boolean;
  value?: string;
  delay?: number;
  notFoundContent?: boolean;
  allowEmptySearch?: boolean;
  updateWithoutValue?: boolean;
  searchWithoutValue?: boolean;
  customerRendering?: boolean;
  onSuccess?: (data: any) => void;
  resFormatter?: (data: any) => Record<string, any>[];
  onChange?: (value: string, option?: Record<string, any>) => void;
  renderFunction?: (option: Record<string, any>) => React.ReactNode;
}

export interface ISelectHandler {
  onRefresh: () => void;
}
const DEFAULT_FIELDS: IFields = {
  valueField: "value",
  labelField: "label",
};

const Select = forwardRef<ISelectHandler, ISelectProps>((props, ref) => {
  const {
    apiConfig,
    apiQuery,
    keyField = "keyword",
    fields = DEFAULT_FIELDS,
    autoSearch,
    initSearch,
    allowEmptySearch,
    delay,
    notFoundContent,
    options,
    value,
    resFormatter,
    onChange,
    onSuccess,
    updateWithoutValue = false,
    searchWithoutValue = false,
    ...restProps
  } = props;

  const { labelField, valueField } = fields;
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const firstValueFetched = useRef<boolean>(false);

  const fetchData = (value?: string) => {
    if (!apiConfig || (!allowEmptySearch && !value)) return;
    setLoading(true);
    fetch({
      api: apiConfig,
      params: {
        [keyField]: value,
        ...apiQuery,
      },
    })
      .then((res) => {
        const { data } = res || {};
        const formatData = resFormatter
          ? resFormatter?.(data)
          : (data as Record<string, any>[]);
        setData(formatData ?? []);
        onSuccess?.(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = debounce((value?: string) => {
    autoSearch && fetchData(value);
  }, delay);

  const handleChange = (value: string, option?: Record<string, any>) => {
    onChange?.(value, option);
  };

  const handleFilterOption: FilterFunc = (
    input: string,
    options?: Record<string, any>,
  ): boolean =>
    (options?.label as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  useEffect(() => {
    if (!firstValueFetched.current && firstValueFetched && value) {
      fetchData(value);
      firstValueFetched.current = true;
    }
  }, [value]);

  useEffect(() => {
    initSearch &&
      fetchData(updateWithoutValue || searchWithoutValue ? undefined : value);
    updateWithoutValue && handleChange(undefined as unknown as string, []);
  }, [JSON.stringify(apiQuery || {})]);

  const formatOptions = data.length
    ? data.map((item) => ({
        label: item[labelField],
        value: item[valueField],
      }))
    : [];

  useImperativeHandle(ref, () => ({
    onRefresh: () => {
      fetchData();
    },
  }));
  return (
    <AntSelect
      placeholder="请输入"
      style={{ width: "100%" }}
      showArrow={!autoSearch}
      filterOption={autoSearch ? false : handleFilterOption}
      allowClear
      showSearch
      notFoundContent={
        loading ? <Spin size="small" /> : (notFoundContent as any)
      }
      getPopupContainer={(trigger) => trigger.parentNode}
      {...restProps}
      value={value}
      options={options || formatOptions}
      onSearch={autoSearch ? handleSearch : undefined}
      onChange={handleChange}
    />
  );
});
// const Select: FC<ISelectProps> = ;

// Select.defaultProps = {
//   keyField: "keyword",
//   fields: DEFAULT_FIELDS,
//   delay: 200,
// };

export default Select;
