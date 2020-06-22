class Deque {
  constructor() {
    this.list = {};
    this.count = 0;
    this.lowestrCount = 0;
  }
  //在双端队列前端添加
  addFront(el) {
    if (this.isEmpty()) {
      this.addBack(el);
    } else if (this.lowestrCount > 0) {
      this.lowestrCount--;
      this.list[this.lowestrCount] = el;
    } else {
      for (let i = this.count; i > 0; i--) {
        this.list[i] = this.list[i - 1];
      }
      this.count++;
      this.lowestrCount = 0;
      this.list[0] = el;
    }
  }
  //在双端队列后端添加
  addBack(el) {
    this.list[this.count] = el;
    this.count++;
  }
  //删除双端队列前端移除第一个元素
  removeFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    const result = this.list[this.lowestCount];
    delete this.list[this.lowestCount];
    this.lowestCount++;
    return result;
  }
  //删除双端队列后端移除最后一个元素
  removeBack() {
    if (this.isEmpty()) {
      return undefined;
    }
    const result = this.list[this.count];
    delete this.list[this.count];
    this.count--;
    return result;
  }
  //返回双端队列前端第一个元素
  peekFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.list[this.lowestCount];
  }
  //返回双端队列后端第一个元素
  peekBack() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.list[this.count];
  }
  //判断双端队列是不是为空
  isEmpty() {
    return this.count - this.lowestrCount === 0;
  }
  //清空队列
  clear() {
    this.list = {};
    this.count = 0;
    this.lowestCount = 0;
  }
  //字符串方法
  toString() {
    if (this.isEmpty()) {
      return '';
    }
    let str = `${this.list[this.lowestCount]}`;
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      str += `,${this.list[i]}`;
    }
    return str;
  }
}

new Deque();
