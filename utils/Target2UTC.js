import { dateFormat } from './index';
/**
 * @description 目标时区的时间转utc时间，默认为本地时间转utc时间
 * @param {object|string} date - 目标时区时间，日期对象/字符串
 * @param {number} timezone - 目标时区，默认：本地时区timezone=-480（中国时区+0800）
 * @param {*} mask - 日期格式,默认：mask='yyyy-MM-dd HH:mm:ss'
 * @returns {string} 返回目标时区的utc时间
 */
export const Target2UTC = (
  date,
  timezone = new Date().getTimezoneOffset(),
  mask = 'yyyy-MM-dd HH:mm:ss'
) => {
  let targetTimestamp = new Date(date).getTime();
  date = dateFormat(new Date(targetTimestamp + timezone * 60 * 1000), mask);
  return date;
};
