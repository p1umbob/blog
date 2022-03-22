---
title: "ProxyHandler 用法"
date: "2022-03-22"
---

## ProxyHandler

我们都知道 Proxy 能够捕获一些对对象的处理操作，并在这之上添加额外的逻辑。那么具体它是怎么使用的，本文将作简要介绍。

点开 typescript/liv/lib.es2015.proxy.d.ts 能够找到 ProxyHandler 中的对应接口：

```typescript
interface ProxyHandler<T extends object> {
    // 后面加小括号，函数调用时
    apply?(target: T, thisArg: any, argArray: any[]): any;
    // 使用 new 时，函数作为构造函数
    construct?(target: T, argArray: any[], newTarget: Function): object;
    // 使用 defineProperty 进行属性定义时
    // 对对象的访问器属性（没有 value，只能通过 defineProperty 定义的属性）或数值属性（value,enumerable,configurabble,writable）
    defineProperty?(target: T, p: string | symbol, attributes: PropertyDescriptor): boolean;
    // 使用 delete 删除对象属性
    deleteProperty?(target: T, p: string | symbol): boolean;
    // 访问对象的值时，xxx = 对象 或 对象.xxx
    get?(target: T, p: string | symbol, receiver: any): any;
    // 使用 Object.getOwnPropertyDescriptor 获取对象上某个属性的 descriptor 描述符（比如是否 configurable 等）
    getOwnPropertyDescriptor?(target: T, p: string | symbol): PropertyDescriptor | undefined;
    // 使用 Object.getPrototypeOf 获取原型时
    getPrototypeOf?(target: T): object | null;
    // 使用 in 判断是否含有某属性时
    has?(target: T, p: string | symbol): boolean;
    // 使用 Object.isExtensible 判断对象能否添加新属性时
    isExtensible?(target: T): boolean;
    // 获取对象的 keys 键值相关操作 如Object.getOwnPropertyNames()，Object.getOwnPropertySymbols()，Object.keys()
    ownKeys?(target: T): ArrayLike<string | symbol>;
    // 使用 Object.preventExtensions 禁止新增属性时
    preventExtensions?(target: T): boolean;
    // 对象 = xx，给对象设置新值时
    set?(target: T, p: string | symbol, value: any, receiver: any): boolean;
    // 使用 Object.setPrototypeOf() 给对象设置原型时
    setPrototypeOf?(target: T, v: object | null): boolean;
}
```

> 上述 Proxy 的 handler 即处理函数，也叫做“陷阱”（trap），因为它们捕获对底层目标对象的调用。
> 其实玩过富文本编辑器框架 slate.js，就知道其插件系统中如 insertText/insertNode/deleteBackward/apply 等，也是一个陷阱。
> 我们可以在陷阱中对插件系统的默认行为进行一层拦截。

```javascript
const a = function() {}

const p = new Proxy(a, {
  apply: (args) => {
    console.log("APPLY")
    return Reflect.apply(Object, args)
  }
})

p()
```

以上是一个简单的 Proxy 使用示例。

其中

- ProxyHandler 是 `apply`，在每次函数调用的时候都被触发；
- Reflect 是反射函数，能够保留原始的 `Object.apply` 用法（等同于保底的一个处理方案）。
