/**
 * @description 个人常用工具函数封装
 */

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
    return o.replace(/^\[object\s(.*)\]$/, '$1');
  }
};

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

  keypath = keypath.replace(/\[(\d+)\]/g, '.$1').split('.');
  for (const key of keypath) {
    obj = Object(obj)[key];
    if (obj === undefined) {
      return defaultValue;
    }
  }
  return obj;
};

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

/**
 * @description 格式化名次：在数字后面加上st/nd/rd/th
 * @param {number} i - 数字
 * @param {bool} lower - 是否小写,默认:是
 * @returns {string} -返回格式化后的名次
 */
export const ordinalSuffixOf = (i, lower = true) => {
  let j = i % 10,
    k = i % 100,
    res = 'th';
  if (j == 1 && k != 11) {
    res = 'st';
  }
  if (j == 2 && k != 12) {
    res = 'nd';
  }
  if (j == 3 && k != 13) {
    res = 'rd';
  }
  return i + (lower ? res : res.toLocaleUpperCase());
};

/**
 * @description 随机打乱数组
 * @param {array} arr - 要打乱的原数组
 * @returns 返回打乱后的新数组
 */
export const shuffle = arr => {
  const newArr = [...arr];
  let m = newArr.length,
    i;
  while (m) {
    i = (Math.random() * m--) >>> 0; //取整
    [newArr[m], newArr[i]] = [newArr[i], newArr[m]];
  }
  return newArr;
};

/**
 * @description 将css转为驼峰对象
 * @param {string} str - css字符串
 * @param {object} opt - 将px转为rem配置
 * @param {bool} opt.rem - 是否转为rem，默认：rem=false
 * @param {number} opt.unit - rem与px比例，默认：1rem=100px
 * @param {number} opt.fixed - rem值保留几位小数，默认：fixed=2
 * @returns obj - 返回驼峰对象
 */
export const css2obj = (str, opt = {}) => {
  const obj = {};
  opt = Object.assign({ rem: false, unit: 100, fixed: 2 }, opt);
  // 去除;后面空格/回车/制表符
  str = str.replace(/;(\s|\r|\t)*/g, ';');
  // ;分割css属性
  const arr1 = str.split(';');
  // 去除最后一位空值
  arr1.pop();
  // 遍历得到的数组
  arr1.forEach(item => {
    // :分割得到['属性:属性值']
    const arr2 = item.split(':');
    // 将属性转为驼峰
    const key = arr2[0].replace(/-(\w)/g, (k, r) => r.toUpperCase());
    let value = arr2[1];
    if (opt.rem) {
      const reg = /\b(\d+(\.\d+)?)PX\b/gi;
      // 先test下有没有符合的如果有再进行替换
      if (reg.test(value)) {
        value.replace(reg, (k, r) => {
          let val = r / opt.unit;
          // 精确到几位
          val = parseFloat(val.toFixed(opt.fixed));
          return val === 0 ? val : val + 'rem';
        });
      }
    }
    // 合并到对象
    Object.assign(obj, { [key]: value });
  });
  return obj;
};

/**
 * @description 深拷贝
 * @param {(object|array)} oldObj - 要深拷贝的目标
 * @returns {(object|array)} - 返回 深拷贝
 */
export const deepCopy = oldObj => {
  // 如果是json格式,调用原生JSON方法
  if (JSON.stringify(oldObj)) {
    return JSON.parse(JSON.stringify(oldObj));
  }

  const newObj = Array.isArray(oldObj) ? [] : {};
  if (oldObj && typeof oldObj === 'object') {
    for (const key in oldObj) {
      if (oldObj.hasOwnProperty(key)) {
        // 判断子元素是否为对象,若是,递归复制
        if (oldObj[key] && typeof oldObj[key] === 'object') {
          newObj[key] = deepCopy(oldObj[key]);
        } else {
          // 若不是,简单复制
          newObj[key] = oldObj[key];
        }
      }
    }
  }
  return newObj;
};

/**
 * @description 防抖动：（decorator）可装饰类内箭头函数
 * @param {object} params - 配置
 * @param {number} params.delay - 时间阀值（单位：ms），默认：delay=300
 * @param {bool} params.immediate - 初始是否立刻执行，默认：immediate=false
 * @returns {function} - 返回装饰器方法
 */
export const debounce_next = (params = {}) => {
  // reference：http://es6.ruanyifeng.com/#docs/decorator#%E6%96%B9%E6%B3%95%E7%9A%84%E4%BF%AE%E9%A5%B0
  return function(target, name, descriptor) {
    let timer = null;
    const { delay = 300, immediate = false } = params;

    // high order function
    if (!descriptor || (arguments.length === 1 && typeof target === 'function')) {
      return createDebounce(target);
    }

    function createDebounce(fn) {
      return function debounce() {
        if (immediate && !timer) {
          fn.apply(this, arguments);
        }
        if (timer) {
          clearTimeout(timer);
        }

        let argumentsCopy = arguments;
        let that = this;

        timer = setTimeout(function() {
          if (!immediate) {
            fn.apply(that, argumentsCopy);
          }
          timer = null;
        }, delay);
      };
    }

    // 修饰类内的箭头函数
    if (descriptor.initializer) {
      return {
        enumerable: false,
        configurable: true,
        get: function() {
          return createDebounce(descriptor.initializer.call(this));
        },
      };
    }

    return descriptor;
  };
};

/**
 * @description 节流：（throttle）可装饰类内箭头函数
 * @param {object} params - 配置
 * @param {number} params.delay - 时间阀值（单位：ms），默认：delay=300
 * @returns {function} - 返回装饰器方法
 */
export const throttle_next = (params = {}) => {
  // reference：http://es6.ruanyifeng.com/#docs/decorator#%E6%96%B9%E6%B3%95%E7%9A%84%E4%BF%AE%E9%A5%B0
  return function(target, name, descriptor) {
    let timer = null,
      startTime = Date.now();
    const { delay = 300 } = params;

    // high order function
    if (!descriptor || (arguments.length === 1 && typeof target === 'function')) {
      return createThrottle(target);
    }

    function createThrottle(fn) {
      return function throttle() {
        let argumentsCopy = arguments;
        let that = this;
        let curTime = Date.now();
        let remainimg = delay - (curTime - startTime);

        if (remainimg <= 0) {
          if (timer) {
            clearTimeout(timer);
          }
          fn.apply(that, argumentsCopy);
          startTime = Date.now();
        } else {
          timer = setTimeout(fn, remainimg);
        }
      };
    }

    // 修饰类内的箭头函数
    if (descriptor.initializer) {
      return {
        enumerable: false,
        configurable: true,
        get: function() {
          return createThrottle(descriptor.initializer.call(this));
        },
      };
    }

    return descriptor;
  };
};

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

/**
 * @description 格式化日期
 * @param {(object|string)} date - 日期对象/字符串
 * @param {string} mask - 日期格式,默认：mask='yyyy-MM-dd HH:mm:ss'
 * @returns {string} 返回格式化后的日期
 */
export const dateFormat = (date, mask = 'yyyy-MM-dd HH:mm:ss') => {
  const d = typeof date !== 'object' ? new Date(date) : date;
  const zeroize = (value, length = 2) => {
    value = String(value);
    let zeros = '';
    for (let i = 0, len = length - value.length; i < len; i++) {
      zeros += '0';
    }
    return zeros + value;
  };
  return mask.replace(
    /"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g,
    function($0) {
      switch ($0) {
        case 'd':
          return d.getDate();
        case 'dd':
          return zeroize(d.getDate());
        case 'ddd':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
        case 'dddd':
          return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
            d.getDay()
          ];
        case 'M':
          return d.getMonth() + 1;
        case 'MM':
          return zeroize(d.getMonth() + 1);
        case 'MMM':
          return [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ][d.getMonth()];
        case 'MMMM':
          return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ][d.getMonth()];
        case 'yy':
          return String(d.getFullYear()).substr(2);
        case 'yyyy':
          return d.getFullYear();
        case 'h':
          return d.getHours() % 12 || 12;
        case 'hh':
          return zeroize(d.getHours() % 12 || 12);
        case 'H':
          return d.getHours();
        case 'HH':
          return zeroize(d.getHours());
        case 'm':
          return d.getMinutes();
        case 'mm':
          return zeroize(d.getMinutes());
        case 's':
          return d.getSeconds();
        case 'ss':
          return zeroize(d.getSeconds());
        case 'l':
          return zeroize(d.getMilliseconds(), 3);
        case 'L':
          var m = d.getMilliseconds();
          if (m > 99) m = Math.round(m / 10);
          return zeroize(m);
        case 'tt':
          return d.getHours() < 12 ? 'am' : 'pm';
        case 'TT':
          return d.getHours() < 12 ? 'AM' : 'PM';
        case 'Z':
          return d.toUTCString().match(/[A-Z]+$/);
        // Return quoted strings with the surrounding quotes removed
        default:
          return $0.substr(1, $0.length - 2);
      }
    }
  );
};

/**
 * @description 获取目标时区时间的utc时间戳
 * @param {string} date - 目标时区日期对象/字符串，默认：当前时间
 * @param {number} timezone - 目标时区，默认：本地时区timezone=-480（中国时区+0800）
 * @returns {number} 返回utc时间戳
 */
export const UTCTimestamp = (date = new Date(), timezone = new Date().getTimezoneOffset()) => {
  return new Date(date).getTime() + timezone * 60 * 1000;
};

/**
 * @description utc时间转目标时区的时间，默认为utc时间转本地时间
 * @param {object|string} date - utc时间，日期对象/字符串
 * @param {number} timezone - 目标时区，默认：本地时区timezone=-480（中国时区+0800）
 * @param {*} mask - 日期格式,默认：mask='yyyy-MM-dd HH:mm:ss'
 * @returns {string} 返回目标时区的时间
 */
export const UTC2Target = (
  date,
  timezone = new Date().getTimezoneOffset(),
  mask = 'yyyy-MM-dd HH:mm:ss'
) => {
  const utcTimestamp = new Date(date).getTime();
  date = dateFormat(new Date(utcTimestamp - timezone * 60 * 1000), mask);
  return date;
};

/**
 * @description 目标时区的时间转utc时间，默认为本地时间转utc时间
 * @param {object|string} date - 目标时区时间，日期对象/字符串
 * @param {number} timezone - 目标时区，默认：本地时区timezone=-480（中国时区+0800）
 * @param {*} mask - 日期格式,默认：mask='yyyy-MM-dd HH:mm:ss'
 * @returns {string} 返回目标时区的utc时间
 */
export const Target2UTC = (
  date,
  timezone = new Date().getTimezoneOffset(),
  mask = 'yyyy-MM-dd HH:mm:ss'
) => {
  let targetTimestamp = new Date(date).getTime();
  date = dateFormat(new Date(targetTimestamp + timezone * 60 * 1000), mask);
  return date;
};

/**
 * @description 扩展Error
 */
export class MyError extends Error {
  constructor(props) {
    super(props);
    this.code = props.code || 0;
    this.msg = props.msg || 'default msg';
    this.name = 'MyError';
    this.message = JSON.stringify(props);
  }
}
