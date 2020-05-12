import { deepClone } from '../utils/index.js';
// import util from 'util';
// const util = require('util');

const date = '2020-05-10 00:00:00';

const obj1 = {
  a: 1,
  b: '2',
  c: new Date(date),
  d: [0, '1', { d1: 1 }],
  e: Symbol.for('eee'),
  f: function() {
    console.log(this);
  },
  g: {
    a: {
      b: {
        c: {
          d: 5,
        },
      },
    },
  },
};

const obj2 = [
  {
    id: 1,
    name: '111',
    value: [111],
  },
  {
    id: 2,
    name: '222',
    value: [222],
  },
  {
    id: 3,
    name: '333',
    value: [333],
  },
];

const dc1 = deepClone(obj1);
const dc2 = deepClone(obj2);

// console.log(util.inspect(dc1));
// console.log(util.inspect(dc2));
obj1.a = 2;
obj2.push({ id: 4, name: '444', value: [444] });
console.log(obj1, dc1);
console.log(obj2, dc2);
