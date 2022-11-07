---
title: "Yjs 基本原理"
date: "2022-11-07"
---

> Yjs 的工作原理可以参考[这篇文章](https://github.com/yjs/yjs/blob/main/INTERNALS.md)

#背景
Yjs 的实现是基于 YATA 的[这篇论文](https://www.researchgate.net/publication/310212186_Near_Real-Time_Peer-to-Peer_Shared_Editing_on_Extensible_Data_Types)。

#原理

# Yjs 基础

本质上 Yjs 是一个 List CRDT（主要是 Linked List），它是任意项组成的（双向）链表。

- `Text` 是一个字符的 List，可以通过在这个 List 中的一些项中加上一些属性实现富文本支持。
- `Map` 是一个键值对的 List，它使用每个 `key` 的最后插入的 `value`，并为每个 `key` 的所有其他重复项都标记为已删除。

每个客户端（后称 peer，代表所有对等的协同编辑方）都在*首次插入*时被分配一个 53-bit 的整型数（JS 最大的安全整数）作为 ID。

## 链表项（List Item）
Yjs 链表中，每一项都由两个对象组成。

- Item (`src/structs/Item.js`)，用于将 Item 与相邻的 Item 关联起来。
- AbstractType (`src/types/AbstractType.js` 的实现，如 `YText`、`YMap`、`YArray`)，用于将实际内容存储在 Yjs 文档中。

每个插入到 Yjs 文档中的数据都有一个唯一的 ID，通过 `ID(clientID, clock)` 元组对组成。所有 peer 生成的第一个插入的字符或对象，clock 就从 0 递增加 1，以后每一次插入操作，clock 会也仅由插入操作递增（删除操作不会）。

如果将一系列字符（如 "abc" ）插入到文档，则时钟 clock 会针对每个字符递增（这里为 3 次）。但是 Yjs 只会将一个 Item 插入到链表中。这对核心 CRDT 算法没有影响，但显著优化了文本编辑期间创建 JS 对象的数量。仅当插入字符的操作时，插入/删除的所有字符共享相同的 clientID 且按顺序插入操作时该优化才生效。如果运行因任何原因中断（如插入操作中的字符被删除了），该 Item 将被拆分。

创建 Item 时，它会存储对前一个 Item 和后一个 Item 的 ID 的引用。这些信息分别存储在 Item 的 `origin` 和 `originRight` 字段中。当出现同时输入（有冲突可能）时，这两个字段会被使用到。虽然实际上很少见，但是 Yjs 需要保证所有 Item 在 peer 中始终解析为相同的顺序。实际逻辑相对简单，它存在于 [Item.js#integrate](https://github.com/yjs/yjs/blob/main/src/structs/Item.js#L413) 中。


```js
/**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) { // transaction 可以理解为一次批操作，会尽可能包含一些改动；offset 标记发生字符插入冲突的起点位置
    if (offset > 0) {
      this.id.clock += offset // 时钟新增 offset 个插入操作
      this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1)) // 左边是一个 Item，位置为当前时钟的上一个位置
      this.origin = this.left.lastId // 左边 Item 的 ID
      this.content = this.content.splice(offset) // 冲突内容分割出来
      this.length -= offset // 文本长度相应减少（因为被分割了）
    }

    if (this.parent) {
      if ((!this.left && (!this.right || this.right.left !== null)) || (this.left && this.left.right !== this.right)) { // right 的 left 和 left 的 right 存在（说明存在冲突的 Item）
        /**
         * @type {Item|null}
         */
        let left = this.left

        /**
         * @type {Item|null}
         */
        let o // 作为有冲突的第一个 Item
        // set o to the first conflicting item
        if (left !== null) {
          o = left.right // 使用 left 的 right 作为基准
        } else if (this.parentSub !== null) {
          o = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null // 获取到父节点给到的子节点映射（如果时 YMap）
          while (o !== null && o.left !== null) { // 一直找到最左侧的
            o = o.left
          }
        } else {
          o = /** @type {AbstractType<any>} */ (this.parent)._start
        }
        // TODO: use something like DeleteSet here (a tree implementation would be best)
        // @todo use global set definitions
        /**
         * @type {Set<Item>}
         */
        const conflictingItems = new Set()
        /**
         * @type {Set<Item>}
         */
        const itemsBeforeOrigin = new Set()
        // Let c in conflictingItems, b in itemsBeforeOrigin
        // ***{origin}bbbb{this}{c,b}{c,b}{o}***
        // Note that conflictingItems is a subset of itemsBeforeOrigin
        while (o !== null && o !== this.right) { // 往右遍历，直到 o 为 null 或者 o 不等于当前 Item 的 right（即冲突部分走完了）
          itemsBeforeOrigin.add(o)
          conflictingItems.add(o)
          if (compareIDs(this.origin, o.origin)) { // 左边指向的 Item 相同
            // case 1
            if (o.id.client < this.id.client) { // 比较 client，client 更小的放在左边，将 client 最小的设置为 left 作为开头
              left = o
              conflictingItems.clear()
            } else if (compareIDs(this.rightOrigin, o.rightOrigin)) { // 相同的 Item，虽然冲突，但是指向同一个 Item，所以冲突解决了
              // this and o are conflicting and point to the same integration points. The id decides which item comes first.
              // Since this is to the left of o, we can break here
              break
            } // else, o might be integrated before an item that this conflicts with. If so, we will find it in the next iterations // o 可能
          } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) { // use getItem instead of getItemCleanEnd because we don't want / need to split items.
            // case 2
            if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) { // 左边的位置没有冲突，更新 left 位置
              left = o
              conflictingItems.clear()
            }
          } else {
            break
          }
          o = o.right // 指向的 Item 向右移动
        }
        this.left = left
      }
      // reconnect left/right + update parent map/start if necessary // 更新 left+right 的合并后组合的位置
      if (this.left !== null) {
        const right = this.left.right
        this.right = right
        this.left.right = this
      } else {
        let r
        if (this.parentSub !== null) {
          r = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null
          while (r !== null && r.left !== null) {
            r = r.left
          }
        } else {
          r = /** @type {AbstractType<any>} */ (this.parent)._start
          ;/** @type {AbstractType<any>} */ (this.parent)._start = this
        }
        this.right = r
      }
      if (this.right !== null) {
        this.right.left = this
      } else if (this.parentSub !== null) {
        // set as current parent value if right === null and this is parentSub
        /** @type {AbstractType<any>} */ (this.parent)._map.set(this.parentSub, this)
        if (this.left !== null) {
          // this is the current attribute value of parent. delete right
          this.left.delete(transaction)
        }
      }
      // adjust length of parent
      if (this.parentSub === null && this.countable && !this.deleted) {
        /** @type {AbstractType<any>} */ (this.parent)._length += this.length
      }
      addStruct(transaction.doc.store, this) // 新增当前的节点结构
      this.content.integrate(transaction, this)
      // add parent to transaction.changed 新增 parent 到交易中
      addChangedTypeToTransaction(transaction, /** @type {AbstractType<any>} */ (this.parent), this.parentSub)
      if ((/** @type {AbstractType<any>} */ (this.parent)._item !== null && /** @type {AbstractType<any>} */ (this.parent)._item.deleted) || (this.parentSub !== null && this.right !== null)) {
        // delete if parent is deleted or if this is not the current attribute value of parent 处理删除节点、属性非 parent 子节点的情况
        this.delete(transaction)
      }
    } else {
      // parent is not defined. Integrate GC struct instead 没有定义 parent，需要对当前内容进行 GC 释放内存
      new GC(this.id, this.length).integrate(transaction, 0)
    }
  }
```

## Item 存储

Item 本身存储在两个数据结构（left/right）和一个缓存中。

这些 Item 按照文档顺序，存储在双向链表树中。每个 Item 都有 `left` 和 `right` 属性指向它的兄弟节点，`parent` 属性指向它在文档树中的父节点（根节点为 null），`content`（如果有的话）用来访问 Item 的子项。

所有的 Item 都在（`src/utils/StructStore.js`）中按照插入顺序引用。每个 Item 在链表中的位置是按照时间顺序在每个 client 来依次进行插入的。在文档树中查找一个给定 ID 的 Item 是通过二分查找法的。它还用于有效地收集同步期间对等点丢失的情况。

当发生本地插入时，Yjs 需要将文档中的插入位置（如位置 1000）映射到一个 ID 上。仅使用链表时，我们需要对整个链表进行 O(n) 的遍历。但是在编辑文档时，大多数插入的位置都是在最后一个插入位置或其附近。所以 Yjs 为了提高查找 Item 位置的性能，*会对文档中最近查找的 10 个位置进行缓存*。当需要进行查找或更新时，会对这些位置先进行查找以优化性能。缓存的更新使用一种实时变换的 heuristic（启发式，即最直观的算法，但未必是最优法）更新方式。这在内部被称为 Skip list / fast search marker。

## Deletion 删除

Yjs 中插入和删除的处理方式截然不同。插入操作是一系列基于操作（operation based）的 CRDT，而删除操作则是更简单的基于状态（state based）的 CRDT。

当一个 Item 被任何 peer 标记为删除时，在历史中任何时候再看到这个 Item 它的状态都会被标记为已删除。Yjs 内部使用了 `info` 这个字段用来标识 Item 的状态，如下所示。

```js
/**
 * 一个用来标识 Item 状态的 bitfield
 * bit1: keep                                       0001
 * bit2: countable                                  0010
 * bit3: deleted                                    0100  - 在这里标记为已删除的状态
 * bit4: mark - mark node as fast-search-marker     1000
 * @type {number} byte
 */
this.info = this.content.isCountable() ? binary.BIT2 : 0
```

Yjs 除了改变 Item 的 info 状态，并不记录有关删除的元数据：
- 不会记录何时删除该数据，不会记录删除者信息
- structStore 中不包含删除的记录
- clientID 时钟不递增

如果在 Yjs 中启用了垃圾回收，当一个对象被删除时，它的 content 将会被丢弃。如果被删除的对象包含 `children`（如有一个字段值是对象），它的内容会被一个 `GC` 对象所替换。`GC` 对象 (`src/structs/GC.js`) 是一种非常轻量级的数据结构，只存储了被删除内容的长度。

Yjs 实现了一些特殊的逻辑用来将已删除的 Item 的内容进行同步：

当删除（delete）或者标记（mark）时，被删除的 `ID` 列表会记录在一个本地的 transaction 中。当本地提交 transaction 时，这一系列的已删除 Item 集合将会被附加在事务的更新消息中。

快照（Snapshot，Yjs `history` 中的一个标记时间点）是*使用 `(client, clock)` 元组集合*以及*所有已删除 Item 集合*来构建的。已删除的集合是 `O(n)` 的，但因为通常删除发生在运行中，因此该数据集在实践中通常很小的（单个用户删除的操作通常不会特别大）。

## 事务 Transaction

Yjs 中的是有更新都发生在一个事务 (`src/utils/Transaction.js`) 中。

该事务收集一系列对 Yjs 文档的更新，以原子操作的方式应用到远程的 peer 中。一旦事务在本地被提交，它会生成一个压缩的更新消息，该消息被广播到同步的远程对等点 peer，以通知它们本地更改。更新的消息包括：
- 新插入的 Item 集合
- 在事务中删除的 Item 集合
- 网络协议（并非 Yjs 的一部分，是一些用于自定义网络协议的相关概念）
    - Update Object：Yjs 文档可被编码成一个更新对象，解析更新对象可以重建文档。文档上的每个更新都能够触发增量的文档更新，允许客户端相互同步。更新对象是一个 `Uint8Array` 能够有效地编码存储 Item 集合与已删除 Item 集合。
    - State Vector：状态向量定义每个用户地已知状态（`(client, clock)` 元组集合）。该对象也被编码为 Uint8Array。

客户端 A 可以通过发送其状态向量（同步步骤 1）向另一个远程客户端 peer B 询问缺少的文档更新。远程的对等点 peer B 可以使用各个客户端的时钟计算 A 所缺少的文档更新，并计算反映所有丢失更新的最小更新消息（同步步骤 2）。

同步过程的实现在 [y-protocols](https://github.com/yjs/y-protocols) 中。

## 快照 Snapshot

快照可用于恢复旧文档状态。它等于 状态向量 + 删除集（State Vector + Delete set）。客户端可以通过遍历序列 CRDT 并忽略所有具有 `id.clock > stateVector[id.client].clock` 的项目来恢复旧文档状态。客户端将不使用 `item.deleted`，而是使用删除集来确定项目是否被删除。

不建议使用快照恢复旧文档状态（虽然可以这样做）。相反，应该通过迭代最新状态并使用来自状态向量的附加信息来计算旧状态。
