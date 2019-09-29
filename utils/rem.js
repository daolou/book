/**
 * @description （多屏幕+手机系统字体+webview+750设计稿）适配方案
 * 1rem = 100px
 * [⚠️]：更改viewport会影响到iframe，若有使用iframe请忽略此方案，可以尝试用https://github.com/evrone/postcss-px-to-viewport
 */
(function(win, doc) {
  var docEl = doc.documentElement;
  var metaEl = doc.querySelector('meta[name="viewport"]');
  var _dpr = win.devicePixelRatio || 1;
  var _scale = 1 / _dpr;

  var setStyleFontSize = function(num) {
    var finalRem = num > 50 * _dpr ? 50 * _dpr : num;
    docEl.style.fontSize = finalRem + 'px';
    /* 给js调用的，某一dpr下rem和px之间的转换函数 */
    win.rem2px = function(v) {
      v = parseFloat(v);
      return v * finalRem;
    };
    win.px2rem = function(v) {
      v = parseFloat(v);
      return v / finalRem;
    };

    win.dpr = _dpr;
    win.rem = finalRem;
  };
  // 计算并设置根元素fontSize
  var calcRem = function() {
    var _rem = (docEl.clientWidth * _dpr) / 7.5;

    /* 设置viewport，进行缩放，达到高清效果 */
    // 此后获取宽度（clientWidth）无需在乘以 dpr
    metaEl.setAttribute(
      'content',
      'width=device-width' +
        ',initial-scale=' +
        _scale +
        ',maximum-scale=' +
        _scale +
        ', minimum-scale=' +
        _scale +
        ',user-scalable=no'
    );
    /* 设置data-dpr属性，留作的css hack之用 */
    docEl.setAttribute('data-dpr', _dpr);

    /* 动态写入样式 */
    setStyleFontSize(_rem);
  };

  /* 解决部分手机webview一开始获取的clientWidth为0，导致font-size为0即1rem=0 的bug */
  var canSetFontSize = function() {
    if (docEl.clientWidth === 0) {
      setTimeout(function() {
        canSetFontSize();
      }, 50);
      return;
    }
    calcRem();
  };
  canSetFontSize();

  /* 解决手机更改系统字体大小的适配问题 */
  var calcScale = function() {
    setTimeout(function() {
      (function() {
        try {
          var realFz = parseInt(win.getComputedStyle(docEl).fontSize.replace('px', ''), 10);

          var expectFz = parseInt(win.rem, 10);
          console.log(realFz, expectFz);

          if (realFz != expectFz && docEl.clientWidth < 750) {
            var realRem = expectFz / (realFz / expectFz);
            setStyleFontSize(realRem);
          }
        } catch (e) {
          console.error(e);
        }
      })();
    }, 50);
  };
  win.onload = function() {
    console.log('onload');
    calcScale();
  };

  var debounce = function(fn, delay, immediate) {
    if (!delay) {
      delay = 300;
    }
    if (!immediate) {
      immediate = false;
    }
    var timer = null;
    return function() {
      var that = this;
      var argumentsCopy = arguments;
      if (immediate && !timer) {
        console.log(immediate, timer);
        fn.apply(that, argumentsCopy);
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
  };
  win.onresize = debounce(function() {
    console.log('onresize');
    var _rem = docEl.clientWidth / 7.5;
    setStyleFontSize(_rem);
  });
})(window, document);
