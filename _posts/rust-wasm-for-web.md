---
title: "手把手教学，使用 Rust + WASM 进行 Web 开发"
date: "2022-10-20"
---

## 背景

WebAssembly（WASM）是一个简单的机器模型和可执行格式，具有广泛的规范。它被设计为便携、紧凑，代码执行能够达到接近本机原生指令的执行速度。

作为一种编程语言，WebAssembly 由两种格式组成，它们以不同的方式表示相同的结构：
- 后缀为 `.wat` 的文本格式（称为“WebAssembly Text”），可以被人类理解，使用 [S-表达式](https://zh.wikipedia.org/wiki/S-%E8%A1%A8%E8%BE%BE%E5%BC%8F)。
- 后缀为 `.wasm` 的二进制格式是较低级别的，人无法读懂，它旨在供 wasm 虚拟机直接使用。

作为参考，下面是一个在 JS 中调用两数求和 WASM 函数的例子：

```js
const wasmInstance = new WebAssembly.Instance(wasmModule, {});
const { addTwo } = wasmInstance.exports;
for (let i = 0; i < 5; i++) {
  console.log(addTwo(i, i));
}
/**
 * output:
 * 0
 * 2
 * 4
 * 6
 * 8
 **/
```

`addTwo` 函数本身是由其他语言编写而成的，并且被编译成了 `.wat` 格式。以下是这个 `addTwo` 求和函数的 `.wat` 文件：

```wat
(module
  (func (export "addTwo") (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add))
```

> 可以通过这个网站将 `.wat` 生成对应的二进制 `.wasm` 文件：[wat2wasm demo](https://webassembly.github.io/wabt/demo/wat2wasm/)

## 环境配置

1. 安装 [rust 工具链](https://www.rust-lang.org/tools/install)（`rustup`，`rustc`，`cargo`）
2. 安装 [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)，一个构建、测试和发布 WASM 的 Rust CLI 工具，我们将使用 `wasm-pack` 相关的命令来构建 WASM 二进制内容。
3. npm，JS 包管理器

如果不安装 wasm-pack，使用打包工具 `webpack` 加上 `@wasm-tool/wasm-pack-plugin` 插件也能构建 WASM，后文会详细介绍。

> Tips：安装 [cargo-generate](https://github.com/cargo-generate/cargo-generate)，能够使用现有的 git 仓库生成一个新的 Rust 项目： `cargo install cargo-generate`

## 快速入门

### 项目初始化

首先我们执行 `cargo new wasm-demo` 初始化 Rust 项目，新建一个名为 `wasm-demo` 的文件夹（也可以选一个你喜欢的文件夹名），自动生成配置文件 `Cargo.toml`，结构如下。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6c6527aa05242f89cf3e6b63bd1f8d2~tplv-k3u1fbpfcp-watermark.image?)

### 配置包文件

我们可以在 `Cargo.toml` 文件中加上下列代码并保存，保存之后 Cargo 会自动下载依赖。

- `cdylib` 用来指明库的类型。
- `wasm-bindgen` 是一个简化 Rust WASM 与 JS 之间交互的库。
    - 它能够将如 DOM 操作、console.log 和 performance 等 JS 相关 API 暴露给 Rust 使用
    - 它能够将 Rust 功能导出到 JS 中，如类、函数等

```TOML
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2.83"
```

### 编写代码

接着开始编写一些简单的 Rust 代码。将模板文件中的 `src/main.rs` 改成 `src/lib.rs`，里面写上一个求斐波那契数列的 Rust 函数。需要加上`#[wasm_bindgen]`标注告诉 wasm-pack 需要将这个函数编译成 wasm 可执行文件。

```rust
use wasm_bindgen::prelude::*; // 用于加载 Prelude（预导入）模块

#[wasm_bindgen]
pub fn fib(n: u32) -> u32 {
    if n == 0 || n == 1 {
        return 1;
    }
    fib(n - 1) + fib(n - 2)
}

```

当前目录应该长这样：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f303627174104ca09db1fb7caa420487~tplv-k3u1fbpfcp-watermark.image?)

> Rust 中包管理系统中两个特殊文件名称，`main.js` 是二进制项目的入口，而 `lib.js` 是库项目的入口，二者不可同时存在。参考：[Rust modules confusion when there is main.rs and lib.rs - Stack Overflow](https://stackoverflow.com/questions/57756927/rust-modules-confusion-when-there-is-main-rs-and-lib-rs)

### 执行编译

只需要执行我们之前安装的 wasm-pack 即可将刚刚的 Rust 代码转换成能够被 JS 导入的模块。

```bash
wasm-pack build
```

编译完成后，我们会发现根目录下多了一个 `pkg/` 文件夹，里面就是我们的 WASM 产物所在的 npm 包了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3269892162f3491b94d0e2715f491875~tplv-k3u1fbpfcp-watermark.image?)

包的入口文件是不带 `_bg` 的 `.js` 文件，即 `wasm_demo2.js`。

`wasm_demo2.js` 的内容如下：

```js
import * as wasm from "./wasm_demo2_bg.wasm";
export * from "./wasm_demo2_bg.js";
```

`wasm_demo2_bg.js` 的内容如下：

```js
import * as wasm from './wasm_demo2_bg.wasm';

/**
* @param {number} n
* @returns {number}
*/
export function fib(n) {
    const ret = wasm.fib(n);
    return ret >>> 0;
}
```

`wasm_demo2.d.ts` 的内容如下：

```ts
/* tslint:disable */
/* eslint-disable */
/**
* @param {number} n
* @returns {number}
*/
export function fib(n: number): number;

```

> 可以看到，wasm-pack 打包不仅输出一个 ESM 规范的模块，而且还支持自动生成 d.ts 文件，对模块的使用者非常友好。

### 使用 WASM 包

下面我们就新建一个 html 页面去调用刚刚生成的模块。在根目录下生成 `index.html`，并输入以下内容。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rust WASM demo</title>
    <script>
        /**
         * 1. 通过使用 instantiateStreaming 调用流式实例化
         **/
        WebAssembly.instantiateStreaming(fetch("./pkg/wasm_demo2.wasm")).then((obj) => {
            const fib = obj.instance.exports.fib;
            const out = fib(20);
            console.log("rust output: ", out);
        })
        
        /**
         * 2. 不通过流式调用，直接读取二进制文件并对字节进行实例化
         **/
        fetch("./pkg/wasm_demo2.wasm")
        .then(res => res.arrayBuffer())
        .then(bytes => WebAssembly.instantiate(bytes))
        .then(results => {
            const fib = results.instance.exports.fib;
            const out = fib(20);
            console.log("rust output: ", out);
        })

    </script>
</head>
<body>
    
</body>
</html>
```
如上所示，可以通过流式与非流式两种原生 JS API 方式进行 `.wasm` 二进制文件的模块实例化。

接下来编写一个简单的服务 `server.js`：

```js
const http = require('http');
const fs = require('fs');

const reqListener = function(req, res) {
    f = req.url === '/' ? 'index.html' : './pkg/wasm_demo2_bg.wasm';
    if (f === './pkg/wasm_demo2_bg.wasm') {
        res.setHeader('Content-type', 'application/wasm')
      }
      res.writeHead(200)
      return fs.createReadStream(f).pipe(res)
}

const server = http.createServer(reqListener);
server.listen(8081);
console.log('listening: http://localhost:8081')
```

开启服务：

```bash
node server.js
```

打开 html 页面 http://localhost:8081/ ，在控制台可看到两份 `fib(20)` 的结果被打印出来了。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91d2f43d4d034ba7b0cd60e2307463ed~tplv-k3u1fbpfcp-watermark.image?)

## 进阶用法

### 配合 Webpack 使用

使用 Webpack + wasm-pack 插件的方式构建和测试，可以直接通过 npm scripts 运行代码，像前端开发一样调试。

用 `npm init -y` 新建一个项目，在 `package.json` 中新增如下代码：
```json
...
  "scripts": {
    "build": "webpack",
    "serve": "webpack serve"
  },
  "devDependencies": {
    "@wasm-tool/wasm-pack-plugin": "1.5.0",
    "html-webpack-plugin": "^5.3.2",
    "text-encoding": "^0.7.0",
    "webpack": "^5.49.0",
    "webpack-cli": "^4.7.2",
    "webpack-dev-server": "^3.11.2"
  },
  ...
```

执行 `npm i` 安装依赖。

新建 `index.js` 文件，作为 WASM 模块的执行文件。在里面写入如下内容：

```js
// 因为 webpack 的 bug（webpack/webpack#6615），这里暂时只能使用动态导入 import
const rust = import('./pkg');

rust.then(m => {
    const out = m.fib(20);
    console.log("rust output: ", out);
}).catch(console.error)
```

新建 `webpack.config.js` 文件，并进行如下配置：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin"); // 赋予 webpack 处理 wasm 能力的插件

/**
 * @type import('webpack').Configuration
 */
module.exports = {
    entry: './index.js',
    devServer: {
        port: '8082'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, ".")
        }),
        // Have this example work in Edge which doesn't ship `TextEncoder` or
        // `TextDecoder` at this time. 处理浏览器兼容问题
        new webpack.ProvidePlugin({
          TextDecoder: ['text-encoding', 'TextDecoder'],
          TextEncoder: ['text-encoding', 'TextEncoder']
        })
    ],
    mode: 'development',
    experiments: {
        asyncWebAssembly: true // 打开异步 WASM 功能
   }
};
```

执行 `npm run build` 构建出 WASM 二进制产物。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eac188d2836145829682f962c84429c4~tplv-k3u1fbpfcp-watermark.image?)

执行 `npm run serve` 即可进行开发，在浏览器的控制台中实时看到对应 `fib(20)` 的结果。我们可以在 `index.js` 中更改传入的参数，并查看控制台的新输出结果。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99c74f7c5cff4661b55104ba0982fc5a~tplv-k3u1fbpfcp-watermark.image?)

总结就是，使用 webpack 能够帮助能够更加高效地进行 Rust WASM 应用的开发和调试。

这一块借助了 webpack-dev-server 的 HMR 模块实现热更新：
1. 打包时将一块 webpack 脚本代码（JSONP 脚本）打包到客户端应用中。
2. 当本地 `lib.rs` 文件发生变化时，服务端 webpack-dev-server 通过 websocket 通知客户端应用代码中的 webpack 脚本代码，客户端向服务端请求最新编译好的 wasm 模块
3. 新的 WASM 模块以 JSONP 的方式从服务端传输到客户端
4. 通过 webpack 重写的 `__webpack_require__` 方法获取到新模块并加载、包裹、运行和缓存，实现模块的热替换。

### Rust 操纵 DOM

实现一个求斐波那契数的应用，如下所示：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8401845ba8424b8d806a3cf34e0923a3~tplv-k3u1fbpfcp-zoom-1.image)


需要先安装一个叫 `web-sys` 的 Crate，它为 Rust 提供了控制 DOM 的能力，在 `Cargo.toml` 中新增依赖：

```toml
[dependencies.web-sys]
version = "0.3.4"
features = [ 'Document', 'Element', 'HtmlElement', 'Node', 'Window', 'HtmlInputElement']
```

> `features` 需要开发者手动地声明需要使用到的模块，这样做的好处有二：一是避免不同模块下的 `features` 名字发生冲突；二是条件编译各个依赖中的特性，对不使用的 `features` 不编译。

在 `lib.rs` 函数中新增 `init()` 函数，用于生成 DOM 节点、挂载监听器并挂载 DOM 节点。

```rust

// start 标识 init() 在 WASM 加载时自动执行
#[wasm_bindgen(start)]
pub fn init() -> Result<(), JsValue> {
    // 使用 web_sys 的 window 全局对象
    let window = web_sys::window().expect("不存在全局 window 对象");
    let document = window.document().expect("需要在 window 上存在 document");
    let body = document.body().expect("document 中需要存在一个 body");

    // 生成 dom 元素
    let input = document
        .create_element("input")?
        .dyn_into::<web_sys::HtmlInputElement>()?;
    let btn = document.create_element("button")?;
    btn.set_text_content(Some(&"点击计算斐波那契数"));
    let out = document.create_element("h3")?;
    let input = Rc::new(input); // 为了不违背“一个变量只能有一个所有者”的规则，需要使用 Rc 包裹 input 元素，方便在闭包中拿到并使用它的值
    let out = Rc::new(RefCell::new(out)); // 因为需要改变 out 元素的 textContent，需要使用 RefCell 包裹方便去在闭包中把它当做可变变量来改变它
    {
        let out = out.clone(); // 复制一份智能指针
        let input = input.clone();
        // 使用到 wasm_bindgen::closure::Closure，它的作用是打通 Rust 中的闭包和 JS 中的闭包
        let closure = Closure::<dyn Fn()>::new(move || {
            let val = input.value();
            let num = val.parse::<u32>().unwrap();
            let res = fib(num);
            out.borrow_mut()
                .set_text_content(Some(res.to_string().as_str())); // 在这里使用 borrow_mut 把 out 当做可变变量获取出来，并设置 textContent
        });

        btn.add_event_listener_with_callback("click", closure.as_ref().unchecked_ref())?; // 挂载事件监听器，将闭包函数先转换为 JS 值，再跳过类型判断，再作为回调函数传给 btn
        closure.forget(); // 释放 Rust 对这片堆内存的管理，交给 JS 的 GC 去回收
    }

    body.append_child(&input)?;
    body.append_child(&btn)?;
    body.append_child(&out.borrow())?; // 挂载 DOM 元素节点
    Ok(())
}
```

上述 `init()` 添加了 `#[wasm_bindgen(start)]` 宏标注，`init()` 函数会在 WASM 模块初始化时自动执行。因此不再需要更改 `index.js` 文件。

直接运行服务：

```bash
npm run serve
```

打开 http://localhost:8082/ ，成功！

打开检查，我们可以发现 `body` 上正确地挂载了 DOM 元素。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/055d7fc6faf443c298d98c1799f6842d~tplv-k3u1fbpfcp-watermark.image?)

### 性能指标

我们先在 `lib.rs` 中加上以下代码，允许 Rust 代码中调用 `console.log` 。

```rust
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str); // 将 js 命名空间中的 console.log 方法定义在 Rust 中
}

// 定义 console.log! 宏
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}
```

接着，在刚刚的求斐波那契数的应用中加上 `performance` API 相关的代码。

在 `Cargo.toml` 中加上 Performance 的 features：

```toml
[dependencies.web-sys]
version = "0.3.4"
features = [
  'Document',
  'Element',
  'HtmlElement',
  'Node',
  'Window',
  'Performance', // 加上这一行
  'HtmlInputElement'
]
```

将求斐波那契数应用中的 `closure` 方法进行如下重写：

```rust
let closure = Closure::<dyn Fn()>::new(move || {
    let performance = window
        .performance()
        .expect("performance should be available"); // 获取 window.performance

    let val = input.value();
    let num = val.parse::<u32>().unwrap();
    let start = performance.now(); // 调用 performance.now() 获取当前时间
    console_log!("the start time (in ms) is {}", start);
    let res = fib(num);
    let end = performance.now();
    console_log!("the end time (in ms) is {}", end);
    console_log!("delta (in ms) is {}", end-start);
    out.borrow_mut()
        .set_text_content(Some(res.to_string().as_str()));
});
```

运行服务器：
```bash
npm run serve
```

现在在控制台就能够看到执行运算的耗时了。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2e5a10842de41929b2d101f2313c27b~tplv-k3u1fbpfcp-watermark.image?)

> 执行运算的[录屏](https://recordit.co/muajFCjHAR)

性能比较：

| fib(n) |  10    |   20   |   30   |   35   |   40   |   45   |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| wasm   |  0.30  |  0.90  |  69.90 | 726.59 |  8018  | 90918.79 |
| js     |  0.19  |  0.80  |  67.70 | 753.20 |  8061  | 91794.70 |

可以看到，*在 n 不大的场景下，WASM 的耗时比纯 JS 还要长*，这是因为浏览器需要在 VM 容器中对 WASM 模块进行实例化，可能这一部分会消耗相当的时间，导致性能不如纯 JS 的执行。随着运算规模变大，WASM 的优化越来越明显。

## 总结

WASM 从 2017 年 3 月推出以来，已然成了 Web 开发的未来发展趋势之一。

本文不仅介绍了 WASM 的背景、环境配置、Rust 项目初始化、编译和使用 WASM 等基本用法，还通过一个简单的应用介绍了 WASM 与 webpack 配合开发、与 DOM 之间交互以及性能指标分析等进阶用法。

## Ref
- [Rust and WebAssembly](https://rustwasm.github.io/docs/book/introduction.html)
- [hello-world](https://rustwasm.github.io/wasm-bindgen/examples/hello-world.html)
- [Using the WebAssembly JavaScript API](https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API)
- [Closure in wasm_bindgen::closure - Rust (rustwasm.github.io)](https://rustwasm.github.io/wasm-bindgen/api/wasm_bindgen/closure/struct.Closure.html)
- [start - The `wasm-bindgen` Guide (rustwasm.github.io)](https://rustwasm.github.io/wasm-bindgen/reference/attributes/on-rust-exports/start.html)