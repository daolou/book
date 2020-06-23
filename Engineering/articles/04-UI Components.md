# 如何开发一个 UI 组件库

> 介于要开发出一套完整的 UI 组件库要考虑的东西太多，譬如 主题、色彩、柵格化、布局、字体、图标，还有一些视觉/感官问题等，何况目前已有相对成熟和受欢迎的开源库：antd、MD 等，所以就不考虑这些设计因素，仅仅在代码组织方式，简单看看如何开发一个 UI 组件库，以及如何基于 antd 做二次封装。

那么需要考虑哪些点呢

- 组件拆分、隔离，实现分治

- 样式问题，要方便覆盖（不能用 cssModules）
- js 模块输出，esm、cjs、umd，打包工具的选择，webpack、rollup、babel
- 生成文档，typedoc、storybook、gitbook、dumi
- 单元测试，enzyme、@testing-library/react
- 使用时有 intellisense （ts 开发）
- 。。。

一番考虑，最终选择 [dumi](https://d.umijs.org/) 工具进行开发。

- 能看能用

- 集成文档生成、father 打包工具、jest 测试工具

### 组件分治

这个很好解决，约定好目录结构进行开发即可

- 组件用到的代码统一放在 `src` 目录下
- 样式统一存放在 `style(s)` 目录下
- 图片统一存放在 `image(s)` 目录下
- 组件目录统一首字母大写，一些静态方法的组件除外，例如 message、notification
- 组件统一在对应目录的 `index.ts(x)` 导出

```bash
src
├── _constants
│   └── base.ts
├── _utils
│   ├── index.ts
│   └── type.ts
├── Button
│   ├── style
│   │   ├── index.less
│   │   └── mixin.less
│   ├── index.md
│   ├── index.test.tsx
│   └── index.tsx
├── Foo
│   ├── images
│   │   ├── bg_coins.png
│   │   └── heart.png
│   ├── style
│   │   └── index.less
│   ├── index.md
│   ├── index.test.tsx
│   └── index.tsx
├── style
│   ├── base.less
│   ├── color.less
│   └── mixin.less
└── index.ts
```

- `src/index.ts`：入口文件，所有组件在这里统一导出
- `src/style`：组件公共样式
- `src/_constants`：用于存放常量
- `src/_utils`：用于存放工具函数、ts 类型
- `src/Button`：此文件夹是 button 组件，约定组件目录名首字母大写
- `src/Button/style`：button 组件的样式
- `src/Button/index.md`：button 组件的使用文档
- `src/Button/index.test.tsx`：button 组件的 unitTest
- `src/Button/index.ts(x)`：button 组件的入口文件，button 组件在这里导出

源码：<https://github.com/jsany/lean>
