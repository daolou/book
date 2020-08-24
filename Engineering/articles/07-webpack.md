# 打包工具--webpack

## 插件机制 plugin

### 开发一个插件

#### 注册:

```js
class MyPlugin {
  apply = (compiler)=>{
    compiler.hooks.someHook.tap('MyPlugin', (params) => {
      /* ... */
    });
  }
}
```

这里的 `someHook` 是[生命周期钩子函数](https://webpack.docschina.org/api/compiler-hooks/#hooks)

#### 使用:

```js
module.exports = {
  /* ... */
  plugins: [
    /* ... */
    new MyPlugin(),
  ],
  /* ... */
}
```
