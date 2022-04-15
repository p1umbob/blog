# 从 Slate 的内置特性到洋葱模型

## Slate 的属性 props 和特性 attributes

在 Slate 的文档中，有一句[提醒](https://docs.slatejs.org/concepts/09-rendering#leaves)，“请确保将 `props.attributes` 混入到自定义的组件中，并且在自定义组件中渲染 `props.children`“。

![Screenshot from 2022-04-14 21-37-23.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb64474cc4f44692bbf5db85a86abcf2~tplv-k3u1fbpfcp-watermark.image?)

`props` 泛指父组件传入子组件的参数，而其中的 `attributes` 是指 Slate 在渲染过程中所需的内置特性，`children` 则是指代 Slate 接管并负责渲染的文本组件。

那这个 `attributes` 为什么如此重要？本文将带着这个问题一探究竟。

## Slate 的自定义内置特性

在 Slate 的开发过程中，经常会看到一些 `data-` 开头的**自定义内置特性**（attribute），比如 `data-slate-node` 等。将这些内置特性列举如下：

### Editable

- `data-slate-editor` 用于标识编辑器组件。

### Element

- `data-slate-node`: 必须，取值有 `'element'|'value'|'text'`，分别代表元素、文档全量值（适用于 `Editable` 上）、文本节点（适用于 `isInline` 的元素）。

- `data-slate-void`: 若为空元素则取值为 `true`，否则不存在。

- `data-slate-inline`: 若为内联元素则取值为 `true`，否则不存在。

此外，对于 `Element` 的 `attributes` 中还有以下内置特性内容：

- `contentEditable`: 若不可编辑则取值为 `false`，否则不存在。

- `dir`: 若编辑方向为从右到左则取值 `'rtl'`，否则不存在。

- `ref`: 必选，当前元素的 ref 引用。Slate 会在每次 `Element` 渲染时将该元素和其对应 DOM 节点的映射关系添加到 `ELEMENT_TO_NODE` 的 WeakMap 中。若缺少 ref 则会因为 `ELEMENT_TO_NODE` 中映射关系的缺失而导致渲染失败和 `toSlateNode` 中报错。

### Leaf

- `data-slate-leaf`: 必须，取值为 `true`，表明对应 DOM 元素为 Leaf 节点。

### String

- `data-slate-string`: 若为文本节点则取值为 `true`，否则不存在。

- `data-slate-zero-width`: 若为零宽度文本节点则取值 `'n'|'z'`，分别指代换行、不换行，否则不存在。

- `data-slate-length`: 用于标注零宽度文本节点的实际宽度，单位为字符数。默认为 0，如果不为零则为被设置了 `isVoid` 的元素的文本字符的宽度。

### 其他

- `data-slate-spacer`: 设置了 `isVoid` 的 `Element` 外面会包裹一层元素，这个包裹元素会含有该自定义特性，以便区分普通元素，并用于掌管该空元素相关的行为（复制、光标聚焦、光标失焦等）。

## Slate 的洋葱模型

Slate 中的组件层级可以用下图表示：

![Slate-onion-model.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b69848e1c7b4b1eb9e28cb17742320e~tplv-k3u1fbpfcp-watermark.image?)

Slate 本质上是一个**洋葱模型**，从外到内分别为：

- `Slate` 一个编辑器组件外包裹层，用于接管 `Editable` 的 `onChange` 事件。
- `Editable` 本质上是一个 Textarea 元素的超集，这一点也体现在它的[参数类型](https://github.com/ianstormtaylor/slate/blob/5160efeea492fa52c462e0a9f14189b5dc18c48e/packages/slate-react/src/components/editable.tsx#L110)上。是一个可变的单例编辑器实例。
- `Children` 孩子组件，用于接管 `Editable` 的 `children` 属性，并负责往下渲染 `Element`。
- `Element` 元素，从根节点 `editor` 往下的一级节点，代表元素实例，每个元素都有一个 `type` 属性用于标识其类型。使用 `renderElement` 方法渲染，可添加自定义属性和样式。在这层更新*元素节点层级*的映射关系。
- `Text` 文本组件，用于接管 `Element` 的 `children` 属性，并负责往下渲染 `Leaf`。在这层更新*叶子节点层级*的映射关系。
- `Leaf` 叶子，从根节点 `editor` 往下的二级节点，每个叶子都有一个 `text` 属性给 `String` 进行文字渲染。使用 `renderLeaf` 方法渲染,可添加自定义属性和样式。
- `String` 最底层的文本元素，文本输入时和浏览器的 `DOM` 真正交互所在位置，并没有和虚拟 DOM 层做“视图-数据”绑定，因为这个位置 `contentEditable` 的 `DOM` 原生地支持文本输入。比如输入一个字符，则会在这里触发一次 `onChange` 事件并冒泡到 `Slate` 上接管处理。

因为 Slate 洋葱模型的缘故，所有元素的特性都是直接挂载在对应的 DOM 节点上，每一个对应层级就会有该层级对应的 `attributes` 内置特性用于标注该层节点的信息（如内联元素，会对应拥有 `data-slate-inline="true"`），比如 `Element` 的内置特性就是 `data-slate-node=“element"`，`Leaf` 的内置特性就是 `data-slate-leaf`。

## 开发一个自定义组件

Slate 中涉及到自定义组件或者自定义文本节点属性，这时候会使用到 `slate-react` 的 renderLeaf 和 renderElement。

下面简单开发一个自定义组件来加深对洋葱模型的理解：

```jsx
function App() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
   {
      type: "paragraph",
      children: [
        {
          text: "This is editable ",
        },
      ],
    },
    {
      type: "block-quote",
      children: [
        {
          text: "This is block quote ",
        },
      ],
    },
  ]);

  const renderElement = ({ children, element, attributes }) => {
    return <DefaultElement {...{ children, element, attributes }} />;
  };

  const DefaultElement = ({ children, element, attributes }) => {
    if (element.type === "block-quote") {
      return (
        <blockquote style={{ fontFamily: "fantasy" }}>{children}</blockquote>
      );
    }
    return (<div {...attributes}>{children}</div>);
  };

  return (
    <div className="App">
      <Slate editor={editor} value={value} onChange={(val) => setValue(val)}>
        <Editable renderElement={renderElement} />
      </Slate>
    </div>
  );
}

export default App;
```

以上为添加一个自定义的 `block-quote` 组件的普通做法，但是按照我们刚刚的思路，也能够将洋葱模型背后的面纱揭开，直接把 `block-quote` 组件的完整渲染结果作为 `DefaultElement` 的返回值。

我们将上述的 `DefaultElement` 重写为：

```jsx
  const DefaultElement = ({ children, element, attributes }) => {
    if (element.type === "block-quote") {
      return (
        <blockquote
          data-slate-node="text"
          ref={attributes.ref}
          style={{ fontFamily: "fantasy" }}
        >
          <span data-slate-leaf="true" contenteditable="true">
            <span data-slate-string="true">{children[0].props.text.text}</span>
          </span>
        </blockquote>
      );
    }
    return <div {...attributes}>{children}</div>;
  };
```

重写后的 `block-quote` 组件实际上和渲染出来的 DOM 结构层级几乎一致，将组件的渲染结果直接返回。其层级结构符合 Slate 的洋葱模型。

> 注意：实践中并不建议这样做，因为这样会丢失了叶子节点作为自定义组件的一部分所包含的信息，而叶子节点的渲染结果是不可预知的，因此这样做的话，可能会导致渲染结果不一致。

> 此外，在 Slate 的实现中，分别在 `Element` 和 `Text` 两个层级都更新了弱映射 `ELEMENT_TO_NODE`，而上述 demo 实际上是没有更新的该弱映射的，所以会出现以下报错：`Uncaught Error: Cannot get the leaf node at path [1] because it refers to a non-leaf node: [object Object]`

## toSlateNode 报错

使用 Slate 的 `slate-react` 层渲染引擎时会经常遇到这样的报错，这个是 `slate-react` 层本身的设计局限导致的。

```js
Uncaught Error: Cannot resolve a Slate node from DOM node: [object HTMLDivElement]
    at Object.toSlateNode (react-editor.ts:391:1)
    at editable.tsx:761:1
```

这是因为通过事件获取到的 DOM 节点在 `ELEMENT_TO_NODE` 弱映射中**没有对应的键值对**，所以会导致无法从 DOM 元素中映射到对应的 node 节点。

在实践中，我们为特定节点添加了自定义的 `data-ignore-slate` 属性，这样就能够在调用 `toSlateNode()` 的时候对含有该属性的节点进行**过滤**，避免报错。

```js
if(domNode?.hasAttribute?.("data-ignore-slate")) return
```

## 总结

从 Slate 的 `attributes` 出发，我们认识到了这些内置特性的功能都有哪些，是如何将 Slate 携带的信息存放到渲染出来的 DOM 节点里的。

并且从顶到下认识了 `slate-react` 是如何一层一层将数据包裹起来，像一个洋葱模型一样。Slate 节点的数据通过分层映射管理，一层一层地转化为对应页面上的 DOM 节点。
