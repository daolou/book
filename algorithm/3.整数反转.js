/*
 *
 * 整数反转
 *
 * 给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。
 *
 * 假设我们的环境只能存储得下 32 位的有符号整数，则其数值范围为 [−2^31,  2^31 − 1]。请根据这个假设，如果反转后整数溢出那么就返回 0。
 *
 * 示例:
 *
 * 输入: 123
 * 输出: 321
 *
 * 输入: -123
 * 输出: -321
 *
 * 输入: 120
 * 输出: 21
 *
 */

/**
 * @param {number} x
 * @return {number}
 */
let reverse = function (x) {
  let MAX = 2147483647;
  let MIN = -2147483648;
  let spill = function (num) {
    if (num >= MAX || num <= MIN) {
      return 0;
    } else {
      return num;
    }
  };
  // x = spill(x);
  let sign = x < 0;
  if (sign) {
    x = -x;
  }
  let y = 0;
  while (x > 9) {
    y = y * 10 + (x % 10) * 10;
    x = parseInt(x / 10, 10);
  }
  y += x;

  return sign ? spill(-y) : spill(y);
};

reverse(123);
reverse(-123);
reverse(120);
reverse(-120);
