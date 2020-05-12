import { getDataType, MyError } from './index';

/**
 * @description 深拷贝
 * @param {(object|array)} target - 要深拷贝的目标
 * @returns {(object|array)} - 返回 深拷贝
 */
export const deepClone = target => {
  // 如果是json格式,调用原生JSON方法,
  // NOTES: 会忽略函数、symbol等属性,弃用
  // if (JSON.stringify(target)) {
  //   return JSON.parse(JSON.stringify(target));
  // }
  const limitTypes = ['Object', 'Array'];
  const dataType = getDataType(target);
  if (!limitTypes.includes(dataType))
    throw new MyError('params invalid', 'it must one of ["Object, "Array]');
  let count = 0;
  const _clone = originObj => {
    if (count > 50) return;
    count++;
    const newObj = getDataType(originObj) === 'Array' ? [] : {};
    Object.keys(originObj).forEach(key => {
      const originValue = originObj[key];
      const originType = getDataType(originValue);
      switch (originType) {
        case 'Array':
          newObj[key] = [...originValue];
          break;
        case 'Object':
          newObj[key] = _clone(originValue);
          break;
        case 'Date':
          newObj[key] = new Date(originValue.getTime());
          break;
        case 'Function':
        case 'AsyncFunction':
        case 'GeneratorFunction':
          // console.log('key:::', key);
          // console.log('value:::', originValue.toString());
          newObj[key] = new Function(`return ${originValue.toString()};`)();
          break;
        default:
          newObj[key] = originValue;
      }
    });
    return newObj;
  };
  const duplicate = _clone(target);
  console.log(count);
  return duplicate;
};
