/**
 * @description 随机打乱数组
 * @param {array} arr - 要打乱的原数组
 * @returns 返回打乱后的新数组
 */
export const shuffle = (arr) => {
  const newArr = [...arr];
  let m = newArr.length;
  let i;
  while (m) {
    i = (Math.random() * m--) >>> 0; // 取整
    [newArr[m], newArr[i]] = [newArr[i], newArr[m]];
  }
  return newArr;
};
