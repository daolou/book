/**
 * @description 判断当前环境是否支持webp格式
 * @returns {boolean} 返回true/false
 */
export const isSupportWebp = () => {
  const isSupport =
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  console.info(isSupport);
  return isSupport;
};
