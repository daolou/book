/**
 * @description 获取某个区间[min=0, max]的随机数
 * @param {number} max - 区间最大值
 * @param {number} min - 区间最小值,默认为0
 * @param {bool} int - 是否为整数,默认为true,即整数
 * @returns {number} - 返回随机数
 */
export const generateRandom = (max, min = 0, int = true) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const res = Math.random() * (max - min + 1) + min;
  return int ? Math.floor(res) : res;
};
