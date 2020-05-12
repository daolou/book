/**
 * @description 获取数据的具体类型
 * @param {any} o - 要判断的数据
 * @returns {string} - 返回该数据的具体类型
 */
export const getDataType = o => {
  // 映射数据类型
  const map2DataType = {
    '[object String]': 'String',
    '[object Number]': 'Number',
    '[object Undefined]': 'Undefined',
    '[object Boolean]': 'Boolean',
    '[object Array]': 'Array',
    '[object Function]': 'Function',
    '[object Object]': 'Object',
    '[object Symbol]': 'Symbol',
    '[object Set]': 'Set',
    '[object Map]': 'Map',
    '[object WeakSet]': 'WeakSet',
    '[object WeakMap]': 'WeakMap',
    '[object Null]': 'Null',
    '[object Promise]': 'Promise',
    '[object NodeList]': 'NodeList',
    '[object Date]': 'Date',
    '[object FormData]': 'FormData',
  };
  o = Object.prototype.toString.call(o);
  if (map2DataType[o]) {
    return map2DataType[o];
  } else {
    // return o.replace(/^\[object\s(.*)\]$/, '$1');
    // FIXED: slice instated of regExp to improve performance，look at [jsperf](https://jsperf.com/slice-replace-reg)
    return o.slice(8, -1);
  }
};
