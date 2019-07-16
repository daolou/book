// 节点模型
class LinkNode {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this._head = null;
    this._size = 0;
    this._errorBoundary = this._errorBoundary.bind(this);
    this._getNodeByIndex = this._getNodeByIndex.bind(this);
    this.append = this.append.bind(this);
    this.insert = this.insert.bind(this);
    this.remove = this.remove.bind(this);
    this.removeAt = this.removeAt.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.getElement = this.getElement.bind(this);
    this.setIndex = this.setIndex.bind(this);
    this.indexOf = this.indexOf.bind(this);
    this.clear = this.clear.bind(this);
    this.length = this.length.bind(this);
    this.printf = this.printf.bind(this);
  }

  // 边界检验
  _errorBoundary(index) {
    if (index < 0 || index >= this._size) {
      throw `超出边界(${0}~${this._size})，目标位置${index}不存在！`;
    }
  }
  // 根据索引获取目标对象
  _getNodeByIndex(index) {
    this._errorBoundary(index);
    let obj = this._head;
    for (let i = 0; i < index; i++) {
      obj = obj.next;
    }
    return obj;
  }
  // 追加节点
  append(element) {
    if (this._size === 0) {
      this._head = new LinkNode(element, null);
    } else {
      let obj = this._getNodeByIndex(this._size - 1);
      obj.next = new LinkNode(element, null);
    }
    this._size++;
  }
  // 在索引位置插入节点
  insert(element, index) {
    if (index === 0) {
      this._head = new LinkNode(element, this._head);
    } else {
      let obj = this._getNodeByIndex(index - 1);
      obj.next = new LinkNode(element, obj.next);
    }
    this._size++;
  }
  // 删除第一个匹配到的节点
  remove(element) {
    if (this._size < 1) return null;

    if (this._head.element == element) {
      this._head.element = this._head.next;
      this._size--;
      return element;
    } else {
      let temp = this._head;
      while (temp.next) {
        if (temp.next.element == element) {
          temp.next = temp.next.next;
          this._size--;
          return element;
        } else {
          temp = temp.next;
        }
      }
    }
    return null;
  }
  // 删除指定索引节点
  removeAt(index) {
    this._errorBoundary(index);
    let element = null;
    if (index === 0) {
      element = this._head.element;
      this._head = this._head.next;
    } else {
      let prev = this._getNodeByIndex(index - 1);
      element = prev.next.element;
      prev.next = prev.next.next;
    }
    this._size--;
    return element;
  }
  // 删除所有匹配的节点
  removeAll(element) {
    // 创建虚拟头节点，
    let v_head = new LinkNode(null, this._head);
    let tempNode = v_head;
    // let tempEle = null;
    while (tempNode.next) {
      if (tempNode.next.element == element) {
        tempNode.next = tempNode.next.next;
        this._size--;
        // tempEle = element;
      } else {
        tempNode = tempNode.next;
      }
    }
    this._head = v_head.next;
  }
  // 获取指定索引的节点信息
  getElement(index) {
    return this._getNodeByIndex(index).element;
  }
  // 修改指定索引的节点值
  setIndex(element, index) {
    this._errorBoundary(index);
    let obj = this._getNodeByIndex(index);
    obj.element = element;
  }
  // 获取某节点的索引位置
  indexOf(element) {
    let obj = this._head;
    let index = -1;
    for (let i = 0; i < this._size; i++) {
      if (obj.element == element) {
        index = i;
        break;
      }
      obj = obj.next;
    }
    return index;
  }
  // 清除所有节点
  clear() {
    this._head = null;
    this._size = 0;
  }
  // 返回节点长度
  length() {
    return this._size;
  }
  // 打印节点信息
  printf() {
    let obj = this._head;
    const arr = [];
    while (obj != null) {
      arr.push(obj.element);
      obj = obj.next;
    }
    const str = arr.join('->');
    return str || null;
  }
}

// test
const obj = new LinkedList();
obj.append(0);
obj.append(1);
obj.append(2);
obj.printf();
// "0->1->2"

obj.insert(3, 3);
obj.printf();
// "0->1->2->3"

obj.remove(3);
obj.printf();
// "0->1->2"

obj.removeAt(0);
obj.printf();
// "1->2"

obj.setIndex(0, 0);
obj.printf();
// "0->2"

obj.indexOf(2);
// 1

obj.length();
// 2

obj.clear();
obj.printf();
// null
