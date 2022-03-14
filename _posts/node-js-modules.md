---
title: "Node.js 的模块加载"
date: "2021-07-15"
---

# Node.js 模块的加载

最初 JS 没有模块导入/导出的概念，想象我们在紧巴巴的一个文件里写一个 app，这简直是个噩梦啊！

后来，人们设想增添一些模块化的思维，它们是：CJS，AMD，UMD 和 ESM。
![](https://cdn.nlark.com/yuque/0/2021/jpeg/12362795/1626276928489-c227455f-13cf-429c-94b6-b6d19d9f249e.jpeg)Node.js 模块加载通常分为两种格式，【1】老早就支持的 CommonJS（CJS，模块格式，和【2】直到 v13.2 才支持的 ES Module （ESM，ES6 模块格式）。

> 二者语法区别：[https://juejin.cn/post/6938581764432461854](https://juejin.cn/post/6938581764432461854)

Node.js 加载 **ES6 模块**要求满足以下其中一点：

1. 添加 `.mjs`  后缀名，将被自动识别为 ES6 模块
1. 在 `package.json`  中指定 `"type":"module"`，所有 `.js`  文件将会被自动解释为 ES6 模块
1. 在命令行里，执行 `node --experimental-modules xx.js`

[https://irian.to/blogs/what-are-cjs-amd-umd-and-esm-in-javascript/](https://irian.to/blogs/what-are-cjs-amd-umd-and-esm-in-javascript/)

### CJS

全称 CommonJS

```javascript
// importing
const doSomething = require("./dosomething.js");

// exporting
module.exports = function doSomething(n) {
  // do something
};
```

- 你可能觉得似曾相识，因为 Node.js 默认的模块格式就是 CJS
- 你能够从 `node_modules`  或者本地目录中导入一个库来使用， 如通过 `const myLocalModule = require('./some/local/file.js')`  或者 `var React = require('react')`
- CJS 引入时，它会给你一份引入的对象的**拷贝**
- CJS 在浏览器中不起作用，它需要被转译和打包（transpiled and bundled）

### AMD

全称 Asynchronous Module Definition

```javascript
define(["dep1", "dep2"], function (dep1, dep2) {
  // Define the module value by returning a value
  // 在这里就可以使用上述引入的两个模块了
  return function () {};
});
```

或者如下（类似 CJS 的形式）

```javascript
// "simplified CommonJS wrapping" https://requirejs.org/docs/whyamd.html
define(function (require) {
  var dep1 = require("dep1"),
    dep2 = require("dep2");
  return function () {};
});
```

- AMD 异步地引入模块（Asynchronous ...）
- AMD 适用于前端（浏览器），它就是为这而设的，相对于用于后端的 CJS
- AMD 语法比起 CJS 没那么直观，实际上这正好和 CJS 相反。

### UMD

全称 Universal Module Definition

```javascript
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "underscore"], factory);
  } else if (typeof exports === "object") {
    module.exports = factory(require("jquery"), require("underscore"));
  } else {
    root.Requester = factory(root.$, root._);
  }
})(this, function ($, _) {
  // this is where I defined my module implementation

  var Requester = {
    // ...
  };
  return Requester;
});
```

- 前端后端都能用（所以 Universal ...）
- 不同于 CJS 和 AMD，UMD 更像一个约定俗成的代码写法（patterns），人们可以 polyfill 去配置满足多个模块系统的使用情景需求，更多 patterns 参考 [https://github.com/umdjs/umd/](https://github.com/umdjs/umd/)

### ESM

全称 ES Modules，是一个 JS 官方提议的标准

```js
import React from "react";
```

或者

```js
import {foo, bar} from './myLib';

...

export default function() {
	// do something...
}
export const function1() {...};
export const function2() {...};
```

- 在很多[现代浏览器](https://caniuse.com/#feat=es6-module)里都能使用
- 两全其美！跟 CJS 类似的语法，但是又能够用 AMD 的异步
- Tree-shakable！能够优化 webpack 打包的体积，得益于 ES6 的静态模块结构
- ESM 允许打包器如 Rollup 移除不必要的代码，从而减少打包后 js 文件的大小
- 能够在 HTML 中调用，只需要做：

```javascript
<script type="module">import {func1} from 'my-lib'; func1();</script>
```

> 以上代码不保证在所有浏览器中 100% 运行

### 总结

- ESM 是最好的模块格式，好语法+1，异步加载+1，可 tree-shake +1，满分！
- UMD 能够在所有地方运行，通常作为 ESM 不能使用的 fallback 替补
- CJS 同步且适用于后端
- AMD 异步且适用于前端
