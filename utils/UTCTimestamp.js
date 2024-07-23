/**
 * @description 获取utc时间戳
 * @param {string} date - utc日期对象/字符串，默认：当前时间
 * @returns {number} 返回utc时间戳
 */
export const UTCTimestamp = (date = new Date()) => {
  return new Date(date).getTime() - new Date().getTimezoneOffset() * 60 * 1000;
};
