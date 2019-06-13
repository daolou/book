/**
 * @description （多屏幕+手机系统字体）适配方案
 */

/* 设置rem */
var dpr, rem, scale;
var docEl = document.documentElement;
var fontEl = document.createElement('style');
var metaEl = document.querySelector('meta[name="viewport"]');

dpr = window.devicePixelRatio || 1;
rem = (docEl.clientWidth * dpr) / 7.5;
scale = 1 / dpr;

/* 设置viewport，进行缩放，达到高清效果 */
metaEl.setAttribute(
  'content',
  'width=' +
    dpr * docEl.clientWidth +
    ',initial-scale=' +
    scale +
    ',maximum-scale=' +
    scale +
    ', minimum-scale=' +
    scale +
    ',user-scalable=no'
);

/* 设置data-dpr属性，留作的css hack之用 */
docEl.setAttribute('data-dpr', dpr);

/* 动态写入样式 */
docEl.firstElementChild.appendChild(fontEl);
fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';

/* 给js调用的，某一dpr下rem和px之间的转换函数 */
window.rem2px = function(v) {
  v = parseFloat(v);
  return v * rem;
};
window.px2rem = function(v) {
  v = parseFloat(v);
  return v / rem;
};

window.dpr = dpr;
window.rem = rem;

/* 解决手机系统字体更改后显示不正常的问题 */
window.onload = function() {
  setTimeout(function() {
    (function() {
      try {
        var html = document.querySelector('html');
        /* 1rem的实际展示px值 */
        var realFz = parseInt(window.getComputedStyle(html).fontSize.replace('px', ''), 10);

        /* 1rem的理论值 */
        var expectFz = parseInt(window.rem, 10);
        console.log(realFz, expectFz);

        /* 不相等 则被缩放了 */
        if (realFz != expectFz && document.documentElement.clientWidth < 750) {
          /* 将期望值除以放大倍率 */
          var realRem = expectFz / (realFz / expectFz);
          console.log(realRem);
          html.style.fontSize = realRem + 'px';
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, 50);
};
