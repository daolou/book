/**
 * @description url query 参数字符串转json对象
 * @param {string} str - 参数字符串
 * @returns {object} 返回 json对象
 */
export const qsParse = str => {
  const obj = {};
  decodeURIComponent(str)
    .split('&')
    .forEach(item => {
      const arr = item.split('=');
      obj[arr[0]] = arr[1];
    });
  return obj;
};
