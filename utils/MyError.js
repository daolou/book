/**
 * @description 集中式错误工厂，兼容 node 端和 浏览端（es6+、es5）
 * Error 扩展
 */
export class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;

    if (typeof Error.captureStackTrace === 'function') {
      // v8 引擎暴露的 api，nodejs 可用
      // https://devdocs.io/node/errors#errors_class_error
      Error.captureStackTrace(this, new.target);
    }

    if (typeof Object.setPrototypeOf === 'function') {
      // es6+
      Object.setPrototypeOf(this, new.target.prototype);
    } else {
      // es5
      this.__proto__ = new.target.prototype;
    }
  }
}

export class NodeError extends BaseError {}

export class WebError extends BaseError {}

export class ResponseError extends BaseError {}
