/**
 * @description 扩展Error
 */
export class MyError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
  }
}
