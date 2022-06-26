---
title: "原型链"
date: "2022-06-26"
---

# 原型链

首先, 看下 Bublé 的继承是怎么实现的.

> cf: [Bublé](https://buble.surge.sh/)

```js
function Gender() {
  console.log("Gender-0", arguments.callee, this);
}

// ES6
class Male extends Gender {
  constructor(age) {
    super();
    this.age = age;
  }
  getAge() {
    return this.age;
  }
}

// ES5
var Female = (function (Gender) {
  function Female(age) {
    // [盗用]: 子类盗用父类的构造函数 (Constructor stealing) _获取实例属性_
    Gender.call(this);
    this.age = age;
  }
  if (Gender) {
    // 这个 `__proto__` 无对应中文译名, 我愿称之为 "子宫 (=指共) 指针". 能让实例获取共有属性.
    Female.__proto__ = Gender;
  }
  // [原型]: 子类的 `prototype` 配置为父类的原型对象之副本 (采用 new 对象或 create 对象的方式) _获取原型属性_
  // [寄生]: (1)用 `Object.create(Gender.prototype)` 代替 `new Gender()` (2)补充上新原型对象的 `constructor` 以弥补构造器的缺失. 从而避免两次调用父类的构造函数
  // [组合]: 同时使用 [盗用] 及 [原型]
  Female.prototype = Object.create(Gender && Gender.prototype);
  Female.prototype.constructor = Female;
  Female.prototype.getAge = function () {
    return this.age;
  };
  return Female;
})(Gender);

const gender = new Gender(1);
const male = new Male(12);
const female = new Female(22);

console.log("[out]", gender, male, female, male.getAge(), female.getAge());
console.log(
  "[typeof]",
  typeof gender,
  typeof male.__proto__,
  typeof male.prototype,
  typeof Male.prototype,
  typeof Male
);
```

输出以下结果：

```js
Gender-0 [Function: Gender] Gender {}
Gender-0 [Function: Gender] Male {}
Gender-0 [Function: Gender] Female {}
[out] Gender {} Male { age: 12 } Female { age: 22 } 12 22
[typeof] object object undefined object function
```

> 上述 [盗用], [原型], [寄生], [组合] 都能够看作是某种实现继承的哲学.

`class extends` 使用的是寄生组合继承.

继承本质上是一种 OOP 概念, 我们想要达到的目的无非就是逻辑复用. 由于 JavaScript 的弱类型语言特性, 所以继承的实现方式也比较灵活. 可以"不知廉耻"地盗用父类构造函数创造自己的类, 也可以造一个和父类原型对象一样的对象, 并拓展该对象以创造自己的类.

`__proto__` 还没有中文对照, 但是我觉得称它为 "子宫指针" 是一个很好的记忆点. 因为它: (1) 是一个存在于实例上的属性, 指向创建构造它的函数的原型对象 (感觉就像是指向孕育自己的子宫) (2) 因为它也是获取原型链上共有属性 (非实例属性) 的一个桥梁, 即指向共有属性所在原型链的指针, "指共" 谐音 "子宫".

> 以上谈到的 _类_, _原型对象_, _子宫指针_ 都是 `object`
