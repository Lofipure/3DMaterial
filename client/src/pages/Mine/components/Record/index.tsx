import React, { FC, useState, useEffect, useMemo } from "react";
import { Spin, Tabs, Timeline, Empty } from "antd";
import classNames from "classnames";
import fetch from "@/fetch";
import apis from "@/api";
import { isNil } from "@/utils";
import Select from "@/components/Select";
import HeatMap from "@/components/Charts/HeatMap";
import { createTabsConfig, dataFormatter, createTimeLineText } from "./config";
import { IEvent, IRecord, IRecordProps } from "./types";
import styles from "./index.less";

const Record: FC<IRecordProps> = (props) => {
  const { uid, className } = props;

  const yearConfig = useMemo(createTabsConfig, []);
  const [userRecord, setUserRecord] = useState<IRecord>({
    commit: [],
    visit: [],
  });
  const [timeLineShow, setTimeLineShow] = useState<IEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );

  const fetchUserRecord = async () => {
    if (!currentYear) return;
    setLoading(true);
    const { data } = await fetch<IRecord>({
      api: apis.user.getRecord,
      params: {
        uid,
        year: currentYear,
      },
    });

    setUserRecord(data);
    setLoading(false);
  };

  const handleCommitClick = (_date: string) => {
    const date = `${_date.split("-")[1]}-${_date.split("-")[2]}`;
    setSelectedDate(date);
    setTimeLineShow(
      userRecord.commit.reduce<IEvent[]>((arr, cur) => {
        if (cur.date == date) {
          arr.push(cur);
        }
        return arr;
      }, []),
    );
  };

  const handleVisitClick = (_date: string) => {
    const date = `${_date.split("-")[1]}-${_date.split("-")[2]}`;
    setSelectedDate(date);
    setTimeLineShow(
      userRecord.visit.reduce<IEvent[]>((arr, cur) => {
        if (cur.date == date) {
          arr.push(cur);
        }
        return arr;
      }, []),
    );
  };

  const handleTabChange = () => {
    setTimeLineShow([]);
    setSelectedDate("");
  };

  const tabsConfig = useMemo(
    () => [
      // {
      //   key: "visit",
      //   label: "访问记录",
      //   dataSource: userRecord.visit,
      //   handClickElement: handleVisitClick,
      // },
      {
        key: "commit",
        label: "提交记录",
        dataSource: userRecord.commit,
        handClickElement: handleCommitClick,
      },
    ],
    [userRecord, handleCommitClick, handleVisitClick],
  );

  useEffect(() => {
    if (isNil(uid)) return;
    fetchUserRecord();
  }, [uid]);

  useEffect(() => {
    fetchUserRecord();
  }, [currentYear]);

  return (
    <div className={classNames([styles["record"], className])}>
      <Spin spinning={loading} wrapperClassName={styles["spin"]}>
        <Tabs
          onChange={handleTabChange}
          tabBarExtraContent={{
            right: (
              <Select
                className={styles["year-select"]}
                allowClear={false}
                options={yearConfig}
                value={currentYear.toString()}
                onChange={(value) => {
                  setCurrentYear(Number(value));
                  setSelectedDate("");
                  setTimeLineShow([]);
                }}
                showSearch={false}
              />
            ),
          }}
        >
          {tabsConfig.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.key}>
              <div className={styles["record__wrap"]}>
                <div className={styles["record__heatmap"]}>
                  <HeatMap
                    year={currentYear.toString()}
                    dataSource={dataFormatter(
                      currentYear.toString(),
                      item.dataSource,
                    )}
                    onClick={item.handClickElement}
                  />
                </div>
                <div className={styles["record__timeline"]}>
                  {timeLineShow.length == 0 ? (
                    <Empty
                      description={`${selectedDate} 没有记录可以给你看吖😣~`}
                    />
                  ) : (
                    <Timeline>
                      {timeLineShow.map((item, index) => (
                        <Timeline.Item key={index}>
                          {createTimeLineText(item)}
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  )}
                </div>
              </div>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Spin>
    </div>
  );
};

export default Record;
