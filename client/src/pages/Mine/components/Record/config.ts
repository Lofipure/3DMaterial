import { HeatChartItemType } from "@/components/Charts/HeatMap";
import { EventType, IEvent } from "./types";
import { getDateInYear } from "@/utils";

const eventType2Name: Record<EventType, string> = {
  [EventType.create]: "创建",
  [EventType.modify]: "修改",
  [EventType.praise]: "点赞",
  [EventType.visit]: "访问",
};

export const createTabsConfig = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1].map((item) => ({
    label: item,
    value: item,
  }));
};

/**
 * 返回 HeatMap 可以接受的数据
 * @param {string} year 年份
 * @param {IEvent[]} source 有提交记录的数据
 * @returns 全量数据
 */
export const dataFormatter = (
  year: string,
  source: IEvent[],
): HeatChartItemType[] => {
  const days = getDateInYear(year);
  const curDate = source
    .map((item) => item.date)
    .reduce<Record<string, number>>((obj, date) => {
      date in obj ? obj[date]++ : (obj[date] = 1);
      return obj;
    }, {});
  // ? 如果没有数据的话这一天就不会在图中体现出来，所以给他们也要初始化成0
  const otherDate = days.reduce<Record<string, number>>((obj, date) => {
    !(date in curDate) && (obj[date] = 0);
    return obj;
  }, {});
  return Object.keys(Object.assign(curDate, otherDate)).map((item) => [
    `${year}-${item}`,
    curDate[item],
  ]);
};

export const createTimeLineText = (event: IEvent): string =>
  `${event.date} 「${event.username}」${eventType2Name[event.type]} ${
    event.model_name
  }`;
