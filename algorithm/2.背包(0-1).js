/*
 *有编号分别为a,b,c,d,e的 N=5 件物品，它们的重量 w 分别是 2,2,6,5,4，它们的价值 v 分别是 6,3,5,4,6，每件物品数量只有一个，现在给你个承重为 M=10 的背包，如何让背包里装入的物品具有最大的价值总和 sum_v？
 *
 *
 * 示例:
 *
 * 给定 w = [2,2,6,5,4], v = [6,3,5,4,6]
 *
 * 因为在重量不超过10时，
 * 6 + 3 + 6 = 15 最大
 * v(0) + v(1) + v(4) = 15
 * 所以返回w(0)、w(1)、w(4)、15
 */

/**
 *
 * @param {array} w - 物品重量
 * @param {array} v - 物品价值
 * @param {number} c - 背包承重
 */
function getResult(w, v, c) {
  let i;
  let j;
  let n = w.length;
  let m = [];
  m[0] = [];
  for (i = 1; i < n + 1; i++) {
    m[i] = [];
    m[i][0] = 0;
  }

  for (j = 0; j < c + 1; j++) {
    m[0][j] = 0;
  }

  let count = 0;

  for (i = 1; i <= n; i++) {
    for (j = 1; j <= c; j++) {
      m[i][j] = m[i - 1][j];
      if (w[i - 1] <= j) {
        m[i][j] = Math.max(m[i - 1][j], m[i - 1][j - w[i - 1]] + v[i - 1]);
      }
      count++;
    }
  }
  console.log(count);
  return m;
}

function buileSolution(m, w, c) {
  let i;
  let j = c;
  let n = w.length;
  let x = [];
  for (i = 1; i <= n; i++) {
    if (m[i][j] === m[i - 1][j]) {
      x[i - 1] = 0;
    } else {
      x[i - 1] = 1;
      j -= w[i - 1];
    }
  }
  return x;
}

// test
let w = [4, 6, 2, 2, 5, 1];
let v = [8, 10, 6, 3, 7, 2];
let c = 12;

let m = getResult(w, v, c);
let pos = buileSolution(m, w, c);

console.log(m, pos);
