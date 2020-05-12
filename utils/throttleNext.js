/**
 * @description 节流：（throttle）可装饰类内箭头函数
 * @param {object} params - 配置
 * @param {number} params.delay - 时间阀值（单位：ms），默认：delay=300
 * @returns {function} - 返回装饰器方法
 */
export const throttleNext = (params = {}) => {
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
