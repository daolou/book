const promisify = require('util').promisify;
const path = require('path');
const fs = require('fs');
const readFile = promisify(fs.readFile);

const gen = function*() {
  const res1 = yield readFile(path.resolve(__dirname, '../data/a.json'), { encoding: 'utf8' });
  console.log(res1);
  const res2 = yield readFile(path.resolve(__dirname, '../data/b.json'), { encoding: 'utf8' });
  console.log(res2);
};

const g = gen();

const g1 = g.next();
console.log('g1:', g1);

g1.value
  .then(res1 => {
    console.log('res1:', res1);
    const g2 = g.next(res1);
    console.log('g2:', g2);
    g2.value
      .then(res2 => {
        console.log('res2:', res2);
        g.next(res2);
      })
      .catch(err2 => {
        console.log(err2);
      });
  })
  .catch(err1 => {
    console.log(err1);
  });
// g1: { value: Promise { <pending> }, done: false }
// res1: {
//   "a": 1
// }

// {
//   "a": 1
// }

// g2: { value: Promise { <pending> }, done: false }
// res2: {
//   "b": 2
// }

// {
//   "b": 2
// }
