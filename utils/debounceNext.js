/**
 * @description 防抖动：（decorator）可装饰类内箭头函数
 * @param {object} params - 配置
 * @param {number} params.delay - 时间阀值（单位：ms），默认：delay=300
 * @param {bool} params.immediate - 初始是否立刻执行，默认：immediate=false
 * @returns {function} - 返回装饰器方法
 */
export const debounceNext = (params = {}) => {
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
        const [argumentsCopy, that] = [arguments, this];

        if (immediate && !timer) {
          fn.apply(this, arguments);
        }
        if (timer) {
          clearTimeout(timer);
        }

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
