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
  opt = { rem: false, unit: 100, fixed: 2, ...opt };
  // 去除;后面空格/回车/制表符
  str = str.replace(/;(\s|\r|\t)*/g, ';');
  // ;分割css属性
  const arr1 = str.split(';');
  // 去除最后一位空值
  arr1.pop();
  // 遍历得到的数组
  arr1.forEach((item) => {
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
