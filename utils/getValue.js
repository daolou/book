import { getDataType } from './index';

/**
 * @description 根据路径获取对象的值（也可用插件@babel/plugin-proposal-optional-chaining）
 * @param {object} obj - 对象
 * @param {string} keypath - 路径
 * @param {any} defaultValue - 默认值
 */
export const getValue = (obj, keypath, defaultValue = undefined) => {
  if (!obj) {
    throw new Error('the first param obj is required');
  }
  if (!keypath) {
    throw new Error('the second param keypath is required');
  }
  if (getDataType(obj) !== 'Object') {
    throw new Error('the first param obj must be object');
  }
  if (getDataType(keypath) !== 'String') {
    throw new Error('the second param keypath must be string');
  }
  // return String.prototype.split.call(keypath, /[,[\].]+?/)
  //   .filter(Boolean)
  //   .reduce((a, c) => (Object.hasOwnProperty.call(a,c) ? a[c] : defaultValue), obj)

  keypath = keypath
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(item => !['', null, undefined].includes(item));
  for (const key of keypath) {
    obj = Object(obj)[key];
    if (obj === undefined) {
      return defaultValue;
    }
  }
  return obj;
};
