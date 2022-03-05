import { STORAGE_KEY_FOR_USER } from "@/constant";
import { IUserForStorage } from "@/types";
import numeral from "numeral";
import { last } from "lodash";
import moment from "moment";

/**
 * 判断某一值是否为空
 * @param {any} val 任意值
 * @returns {boolean} 判断结果
 */
export const isNil = (val: any): boolean => {
  return ["", null, undefined].includes(val);
};

/**
 * 获取 local storage 中存储的用户数据
 * @returns {IUserForStorage} 本地存储的用户数据
 */
export const getUserLocalInfo = (): IUserForStorage =>
  JSON.parse(localStorage.getItem(STORAGE_KEY_FOR_USER) || "{}");

/**
 * 格式化数字，千分位置加逗号
 * @param {any} text 要格式化的数据
 * @param {string} format 格式
 * @returns {string} 格式化之后的结果
 */
export const formatNumber = (text: any, format?: string): string =>
  isNil(text) ? 0 : isNaN(text) ? text : numeral(text).format(format || "0,0");

/**
 * 判断字符串中是否含有中文
 * @param {string} str 字符串
 * @returns {boolean} 是否含有中文
 */
export const hasChinese = (str: string): boolean => /[\u4e00-\u9fa5]/.test(str);

/**
 * 格式化数据：当数据小于1w时不处理，当大于1w时处理成「a.bcw」的格式。
 * @param {number} num 要格式化的数据
 * @param {number} accuracy 当数字超过1w时，保留的位数
 */
export const formatTenThousandNumber = (
  num: number,
  accuracy: number,
): string => {
  const numString = num.toFixed().toString();
  return num >= 10000
    ? `${formatNumber(`${numString.slice(0, numString.length - 4)}`)}.${
        (num / 10000).toFixed(accuracy).split(".")[1]
      }w`
    : formatNumber(numString);
};

/**
 * 将字符串按照每一行指定个数分割为多行
 * @param {string} str 要分割的字符串
 * @param {number} limit 每一行字符串最多有几个字符
 */
export const splitString = (str: string, limit: number): string[] => {
  // * 中英文的字符宽度不同，定义以中文为标准的转化比例
  const type2Len = {
    EN: 0.75,
    CN: 1,
  };

  const getStringLength = (_str: string): number => {
    let strLength = 0;
    _str.split("").forEach((item) => {
      strLength += hasChinese(item) ? type2Len["CN"] : type2Len["EN"];
    });
    return strLength;
  };

  const newStringArr: string[] = []; // 最终返回的数组，每一个元素是一行
  const rowLength = limit * type2Len["CN"]; // 一行的宽度
  if (getStringLength(str) > rowLength) {
    let remainStr = str;
    //  let start = 0, end = 0;
    let end = 0;
    while (getStringLength(remainStr) > rowLength) {
      let currentLine = "";
      do {
        currentLine += str?.[end++];
      } while (getStringLength(currentLine) < rowLength);
      newStringArr.push(currentLine);
      remainStr = remainStr
        .split("")
        .splice(end, remainStr.length - 1)
        .join("");
      //  start = end;
    }
    newStringArr.push(remainStr);
  } else {
    // 如果不需要分割，直接返回一个长度为1的数组
    newStringArr.push(str);
  }

  // 因为EN是0.75所以可能会存在小数的情况，就可能会导致最后一行是个空行，给他整没
  if (last(newStringArr)?.length === 0) {
    newStringArr.pop();
  }
  return newStringArr;
};

/**
 * 获取图片的base64字符串
 * @param img 图片的blob
 * @returns 图片的base64
 */
export const getBase64 = (img: Blob) => {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (reader.result) {
        resolve(reader.result);
      } else {
        reject();
      }
    });
    reader.readAsDataURL(img);
  });
};

/**
 * 获取某一年的所有的日期
 * @param year 年份
 * @returns 这一年所有的日期
 */
export const getDateInYear = (year: string): string[] => {
  const daysCounts = moment([year]).isLeapYear() ? 366 : 365;
  return Array.from(new Array(daysCounts).keys()).map((item) => {
    const arr = moment(year)
      .dayOfYear(item + 1)
      .format("YYYY-MM-DD")
      .split("-");
    return `${arr[1]}-${arr[2]}`;
  });
};

/**
 * 获取cookie值
 * @param ckname cookie key name
 * @returns cookie
 */
export const getCookieData = (ckname: string): string => {
  const cookies = document.cookie;
  const name = ckname + "=";
  const name_s = cookies.indexOf(name);
  let s, e;
  if (name_s > -1) {
    s = name_s + name.length;
    e = cookies.indexOf(";", s);
    if (e == -1) {
      e = cookies.length;
    }
    return unescape(cookies.substring(s, e));
  } else {
    return "";
  }
};
