---
title: "富文本编辑器框架 ProseMirror、Slate 和 Lexical 横向比较"
date: "2022-09-08"
---

## 富文本编辑器的实现

通常使用 [L1](https://static001.geekbang.org/con/44/pdf/3673881710/file/%E5%AF%8C%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91%E5%99%A8%E7%9A%84%E6%8A%80%E6%9C%AF%E6%BC%94%E8%BF%9B-%E7%BD%97%E9%BE%99%E6%B5%A9.pdf) 方案的富文本编辑器都是基于浏览器自身 `contentEditable` 属性实现的，共用了浏览器的光标和选区；对数据层进行了抽象，依赖 DOM 对内容进行渲染。

L1 富文本编辑器的重点在于实现视图层和数据层的双向绑定，确保视图层的改动。

本文将对以下三个的 L1 富文本编辑器进行横向比较。

- [ProseMirror](https://github.com/ProseMirror/prosemirror) @0.6.0
- [Slate](https://github.com/ianstormtaylor/slate) @v0.60.17
- [Lexical](https://github.com/facebook/lexical) @0.3.11

三者对于视图层绑定到数据层的实现各不一样。
- ProseMirror 通过 JS 的原生 DOM 操作做了一层封装实现渲染。 
- Slate 通过插件化管理，将所有功能抽象成插件，不限定渲染框架。官方给出的是 `slate-react` 进行渲染，但是也可以用 [Angular](https://github.com/worktile/slate-angular)、[Vue](https://github.com/marsprince/slate-vue) 等前端框架实现视图层的渲染。
- Lexical 同 Slate 也使用了插件化。官方通过 `lexical-react` 进行渲染，但是并[不拘泥于特定框架](https://github.com/facebook/lexical/blob/main/docs/design.md)实现视图层。由于 Lexical 的数据结构是 Map 映射集合而不是普通对象，在渲染时需要先使用 [`reconcileNode()`]() 这个方法进行节点映射集合的遍历。


## 编辑器实例



#### ProseMirror

![PM instance](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c091176b4ef4064a5ec9a36a6a82a01~tplv-k3u1fbpfcp-zoom-1.image)

定义：[`src/edit/main.js`](https://github.com/ProseMirror/prosemirror/blob/0.10.1/src/edit/main.js)

ProseMirror 编辑器实例，使用 class 实现，`pm.doc` 代表文档的根 Node 节点，`pm.sel`代表文档的当前选区。

ProseMirror 的文档节点可以分为三大类型，`Node`、`Fragment` 和 `Mark`，分别代表基本节点、基本节点数组和节点标记。
- `Node` 可以拓展成为 `TextNode`，或者按照给定的 `schema` 拓展成为特定的 `NodeType` 进而用于代表段落、标题等。
- `Fragment` 类似一个容器，主要是将其 `content` 属性中的基本节点数组包起来。
- `Mark` 类似一个占位符，用来表现某一个 `TextNode` 所含有的特征。

#### Slate

![Slate instance](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e62bc858758c4f83a2de7ffedd593eec~tplv-k3u1fbpfcp-zoom-1.image)

定义：[`packages/slate/src/create-editor.ts`](https://github.com/ianstormtaylor/slate/blob/v0.61.3/packages/slate/src/create-editor.ts)

Slate 的实例对象，与 ProseMirror 用类实现不同，Slate 采用了纯对象表示编辑器实例。

> Slate 的早期也是基于 class 实现的，但是从 Immutable.js 切换到 Immer 的[重构](https://github.com/ianstormtaylor/slate/issues/2345#issue-374819376)后，转向了使用纯 JS 对象作为数据结构。

该实例节点就是文档的根节点，可以从 `editor.children` 获取到整个文档所有的子节点；`editor.selection` 代表文档的当前选区。


#### Lexical


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56d741b849fa4826af2e8f7fb8e1e190~tplv-k3u1fbpfcp-watermark.image?)

定义：[`packages/lexical/src/LexicalEditor.ts`](https://github.com/facebook/lexical/blob/v0.4.0/packages/lexical/src/LexicalEditor.ts)

Lexical 编辑器实例，使用 class 实现，`editor._editorState._nodeMap` 代表文档的节点合集，`editor._editorState._selection` 代表文档的当前选区。

**Lexical 的独特之处**

Lexical 的节点是通过 Map 存储的（如下图），这和 Slate、ProseMirror 的树状数据结构有本质差异，主要体现在单个节点修改的效率和内存占用上。

- 优点：Map 结构存储的内容能够很快增删改某个特定节点，而对于树状数据结构，为了保证数据是持久化的 [Single source of truth](https://en.wikipedia.org/wiki/Single_source_of_truth)，必须按照不可变数据的理念（Immutable）去生成一个新对象，造成内存占用增大的问题。
- 缺点：相应地，由于存储 Map 的结构不能够很好地表达实际渲染出来 DOM 结果的层次，所以在每次渲染的时候，需要做一次协调（Reconcilation）去生成层次结构，[可以把它想象成 React](https://github.com/facebook/lexical/blob/main/docs/design.md)，它通过双重缓存实现单向数据流渲染。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae64955afd1a4aa8beb5fb4e40f0d9c2~tplv-k3u1fbpfcp-watermark.image?)

## 选区 Selection

#### ProseMirror

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27ebb9befd7d4af59dbf5ac8782c1c1a~tplv-k3u1fbpfcp-zoom-1.image)

定义：[`src/edit/selection.js`](https://github.com/ProseMirror/prosemirror/blob/0.10.1/src/edit/selection.js)

ProseMirror 通过 `poll`的方式确定选区，也即轮询。每隔 100ms 就会对当前光标位置进行一次轮询，调用 `readFromDOM()` 从 DOM 读取真实选区并设置到编辑器实例的`sel`属性中。

通过 `window.getSeleciton()` 获取的真实选区会被转化成 `TextSelection` 并存储在 `sel.range` 中。此外还存储了上一次的真实选区在 `sel` 中，目的是用来比较判断 DOM 选区是否发生了变化。若没有发生变化，则不需要执行 `readFromDOM()`。

PS: 因为轮询更新选区的特性，在 demo 中快速输入中文时出现了光标的跑到行尾的问题。

<img alt="prosemirror_selection.gif" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be1512b95b334ec18a4411e73709309b~tplv-k3u1fbpfcp-watermark.image?" width="350" />

#### Slate

![slate_selection](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/daadeb4c8278435ab4b3ebfd2ba8e1b0~tplv-k3u1fbpfcp-zoom-1.image)

定义：[`packages/slate/src/interfaces/editor.ts`](https://github.com/ianstormtaylor/slate/blob/v0.61.3/packages/slate/src/interfaces/editor.ts)

Slate 的选区是原生浏览器的 [`Selection`](https://developer.mozilla.org/en-US/docs/Web/API/Selection) 之上的一层抽象，形如：

```ts
type Path = number[]
interface Point {
  path: Path
  offset: number
}
interface Range {
  anchor: Point
  focus: Point
}
interface Selection = Range | null
```

Slate 强大的地方在于它将 DOM 渲染出来的节点的可选区域抽象成 `Path`、`Point`、`Range` 等数据结构，一旦理解了它的设计逻辑，就能够很方便地定位到编辑器内某一个特定的范围，从而轻松实现插入、删除、移动等节点变换操作。


#### Lexical

Lexical 的选区包含 `anchor` 和 `focus` 两个点，并且在每个 `Point` 中存储了一份对当前 `_seletion` 的引用（循环引用）。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/439f9908800245a1bd452ce70497f814~tplv-k3u1fbpfcp-watermark.image?)

定义：[`packages/lexical/src/LexicalSelection.ts`](https://github.com/facebook/lexical/blob/v0.4.0/packages/lexical/src/LexicalSelection.ts)

## 规范化处理

规范化（Normalize）处理决定了一个编辑器的形状是否稳定。剪贴板中的 HTML 千奇百怪、不可预测，在富文本编辑器中粘贴时，未知的 HTML 处理起来十分棘手。兜底的方法是将 HTML 转成纯文本，但是这样就显得不够“富文本”了。

#### ProseMirror

采用了 Schema 定义文档的形状：`SchemaSpec` 类定义文档支持的 `marks` 和 `nodes`，`Schema` 类接收 `SchemaSpec` 为参数，并定义文章的形状。

`SchemaItem` 是所有的 `NodeType` 的父类，也就是说，所有的元素都继承了 `SchemaItem.register()` 方法用于注册各元素的规则。并且是根据事件进行触发，对所有继承了 `SchemaItem` 类的元素节点进行 `register` 注册相应命名空间 `namespace` 的某个类型的 `name` ，并指明对应要做的操作，这样就能够在不同的处理步骤（如解析 DOM 节点）中对各个节点进行特定的处理。

#### Slate

Slate 在早期（v0.47 前）使用了和 ProseMirror 一样采用了 `Schema` 的形式，用 JS 模板对象限定了不同类型的操作。但是 v0.50 后 Slate 将组件进行了插件化拆分，每个组件都作为一个插件有一套独立的处理逻辑，通过组件插件的 `normalizeNode` 可以对组件进行修剪等处理操作。

#### Lexical

Lexical 采用的规范化处理方式包括 `_htmlConversions` （负责剪贴板内容的粘贴）、`LexicalUpdates` （负责合并同类型文本节点）等。

后者的 `Update` 是 Lexical 中定时处理步骤，每当 `editor._observer` （即 MutationObserver）监听到 DOM 节点发生变化，就会批量更新对应的虚拟节点，实现数据的同步。在 `Update` 的过程中，就会对编辑器内容进行规范化操作。

## 原子操作

这三款编辑器都支持使用 [Yjs](https://github.com/yjs/yjs) 实现协同编辑，底层满足 [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) 的数据结构模型，ProseMirror 和 Slate 均是**基于操作**实现 CRDT 的，而 Lexical 则是**基于状态**实现 CRDT 的。

#### ProseMirror

ProseMirror 中操作变化都被当作 Operation 存储起来，在每个 `requestAnimationFrame` （宏任务）的循环中通过 `pm.flush` 被批量调用。

Operation 决定了更新 DOM 的最少步骤，存储在 `pm.operation` 中。

定义：[`src/edit/main.js`](https://github.com/ProseMirror/prosemirror/blob/0.10.1/src/edit/main.js)

```js
class Operation {
  constructor(pm) {
    this.doc = pm.doc
    this.sel = pm.sel.range
    this.scrollIntoView = false
    this.focus = false
    this.composingAtStart = !!pm.input.composing
  }
}
```

#### Slate

Slate 是基于 Operation 的操作的。每个原子操作都通过了 `editor.apply` 去执行，实现上和 ProseMirror 类似，不过是通过 `Promise.resolve()` （微任务）的循环中通过 `editor.onChange()` 被批量调用。

定义：[`packages/slate/src/transforms/general.ts`](https://github.com/ianstormtaylor/slate/blob/v0.61.3/packages/slate/src/transforms/general.ts)

Operation 的种类包括：`insert_text`、`remove_text`、`insert_node`、`merge_node`、 `remove_node`、`move_node`、`set_node`、`split_node`。

详见： [Slate.js 之 Operation 概述](https://juejin.cn/post/7034480408888770567)

#### Lexical

Lexical 中存储的数据结构是散列表映射，因此对于这个数据结构来说，只需要进行映射记录之间的更新即可让数据实现同步。

Lexical 中使用了 [`CollabElementNode`](https://github.com/facebook/lexical/blob/v0.4.0/packages/lexical-yjs/src/CollabElementNode.ts) 作为共享数据类型的存储，通过 `$createCollabNodeFromLexicalNode()` 函数将普通的节点转化为共享数据类型节点，该节点上会挂载一个实现了 [`Y.Map`](https://docs.yjs.dev/api/shared-types/y.map) 类的 `_map` 的属性。

## 总结

本文通过对比不同富文本编辑器框架的一些实现，分析了编辑器实例、选区、规范化、原子操作等。

- ProseMirror 登场比较早，[使用文档](https://prosemirror.net/docs/guide/)详尽，插件丰富，功能强大，但是 API 略显晦涩。

- Slate 最受欢迎（star 数领先），支持纯 JS 对象作为文档结构、个性化组件、丰富的 API、上手成本低，是很多编辑器的灵感来源，如语雀、Aomao。

- Lexical 新兴力量，背靠 Facebook，映射结构、可以基于状态实现协同。[此外](https://discuss.prosemirror.net/t/choosing-between-prosemirror-and-slate/1596)，它的 DOM 节点不受外部插件影响以及原生支持 React 18+ 的 Cocurrency 实现局部渲染性能优化。

以上三者均未实现 1.0 的突破，未能保证稳定，使用时还需要进行一些额外的开发。