# 打包工具--webpack

## 插件核心 tapable (v2.0.0-beta.11)

> 事件流（类似发布订阅模式）

![tapable](../snapshots/06/Tapable%20(v2.0.0-beta.11).png)

- Sync*: 同步钩子
- Async*: 异步钩子
  - AsyncParallel*: 异步并行
  - AsyncSeries*: 异步串行

### 源码分析

> 这里以 SyncHook 为例

#### 使用:

```js
const hook = new SyncHook(['firstname'，'lastname']);
// 通过 tap 注册监听函数
hook.tap('welcome', (...name)=>{
  console.log(`Welcome ${name.join(' ')}!`)
})
hook.tap('goodbye', (...name)=>{
  console.log(`Goodbye ${name.join(' ')}!`)
})
// 通过 call 发布事件并把参数传给 监听函数
hook.call('bob','weil')
// "Welcome bob weil!"
// "Goodbye bob weil!"
```

[在线尝试](https://runkit.com/mr-jiangzhiguo/5dde2bd134cea4001a6db5ab)

`SyncHook` 代码:

```js
const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
  content({ onError, onDone, rethrowIfPossible }) {
    return this.callTapsSeries({
      onError: (i, err) => onError(err),
      onDone,
      rethrowIfPossible
    });
  }
}

const factory = new SyncHookCodeFactory();

const TAP_ASYNC = () => {
  throw new Error("tapAsync is not supported on a SyncHook");
};

const TAP_PROMISE = () => {
  throw new Error("tapPromise is not supported on a SyncHook");
};

const COMPILE = function(options) {
  factory.setup(this, options);
  return factory.create(options);
};

function SyncHook(args = [], name = undefined) {
  const hook = new Hook(args, name);
  hook.constructor = SyncHook;
  hook.tapAsync = TAP_ASYNC;
  hook.tapPromise = TAP_PROMISE;
  hook.compile = COMPILE;
  return hook;
}

SyncHook.prototype = null;

module.exports = SyncHook;
```

可以看到 `SyncHook` 方法很简单:

- 内部将类 `Hook` 实例化为 `hook`
- 在 `hook` 实例上挂载❶了属性 `tapAsync`, 属性值是 `TAP_ASYNC` 方法
- 在 `hook` 实例上挂载❶了属性 `tapPromise`, 属性值是 `TAP_PROMISE` 方法
- 在 `hook` 实例上挂载❶了属性 `compile`, 属性值是 `COMPILE` 方法

❶: 挂载不准确, 其实这里是重写, 在下文分析 Hook 类的时候就会发现, 是重写了实例的方法

下面来继续看一下这个 `Hook` 类:
