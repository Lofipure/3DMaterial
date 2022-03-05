import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
} from "react";
import { Table as AntTable, TablePaginationConfig, TableProps } from "antd";
import fetch, { API } from "@/fetch";
import classNames from "classnames";
import { SorterResult } from "antd/lib/table/interface";
import { ColumnProps } from "antd/lib/table";
import styles from "./index.less";

export type IColumnProps<T = Record<string, any>> = ColumnProps<T>;

export interface ITableHandler {
  refresh: () => void;
}

export interface ITableProps<T = Record<string, any>> extends TableProps<T> {
  showPagination?: boolean;
  className?: string;
  apiConfig?: API;
  apiQuery?: Record<string, any>;
  pagination?: TablePaginationConfig;
  columns: IColumnProps<T>[];
  resFormatter?: (values: Record<string, any>) => T[];
}

const Table = <T extends Record<string, any>>(
  props: ITableProps<T>,
  ref: Ref<ITableHandler>,
) => {
  const {
    className,
    apiConfig,
    apiQuery,
    pagination,
    resFormatter,
    onChange,
    showPagination = true,
    ...restProps
  } = props;
  const [fetching, setFetching] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);

  const fetchTableData = (values?: Record<string, any>, reset = true) => {
    if (!apiConfig) return;
    const page = values?.page_num || (reset ? 1 : currentPage);
    const size = values?.page_size || pageSize;
    const params = {
      ...values,
      ...apiQuery,
      page_num: page,
      page_size: size,
    };
    setFetching(true);
    setCurrentPage(page);
    setPageSize(size);

    fetch({
      api: apiConfig,
      params,
    })
      .then(({ data }) => {
        const { list, total } = data;
        const finalData = resFormatter ? resFormatter(data) : list;
        setTotal(total ?? 0);
        setDataSource(finalData ?? []);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, (string | number | boolean)[] | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: any,
  ) => {
    const { field, order } = (sorter as SorterResult<T>) || {};
    onChange?.(pagination, filters, sorter, extra);
    fetchTableData({
      page_num: pagination.current,
      page_size: pagination.pageSize,
      sorter: order
        ? {
            field,
            order,
          }
        : {},
      filters,
    });
  };
  useEffect(() => {
    fetchTableData();
  }, [JSON.stringify(apiQuery)]);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      fetchTableData();
    },
  }));
  return (
    <AntTable
      className={classNames([className, styles["table"]])}
      bordered
      rowKey="id"
      showSorterTooltip={false}
      {...restProps}
      loading={fetching}
      dataSource={dataSource}
      onChange={handleTableChange}
      pagination={
        showPagination
          ? {
              total,
              current: currentPage,
              pageSize,
              showTotal: (total) => `共${total}条记录`,
              showSizeChanger: false,
              showQuickJumper: true,
              ...pagination,
            }
          : false
      }
    />
  );
};

export default forwardRef<ITableHandler, ITableProps>(Table);
