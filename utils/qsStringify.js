/**
 * @description url query json对象转参数字符串
 * @param {object} obj - json对象
 * @param {bool} encode - 是否进行encode编码，默认false
 * @returns {string} - 返回 参数字符串
 */
export const qsStringify = (obj = {}, encode = false) => {
  const str = Object.keys(obj)
    .filter(k => obj[k] || +obj[k] === 0)
    .map(k => {
      let value = obj[k];
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      return `${k}=${value}`;
    })
    .join('&');
  return encode ? encodeURIComponent(str) : str;
};
