/**
 * 将一维数组（arr）按一定数量（num）分为二维数组
 * @param {array} arr - 一维数组
 * @param {number} num - 以num个为一组
 * @returns {array} 二维数组
 */
export const antiFlat = (arr, num) => {
  const anti = [];
  const len = arr.length;
  for (let i = 0; i < len; i += num) {
    const inner = arr.slice(i, i + num);
    anti.push(inner);
  }
  return anti;
};
