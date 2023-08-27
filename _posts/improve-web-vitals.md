---
title: "技术优化小记（Web Vitals、兼容性等）"
date: "2023-08-27"
---

# 技术优化

主要分为UX、DX两个方面，优化用户体验和开发体验。

## 保持输入
保持对前端技术的灵敏嗅觉，了解新技术趋势（如swc、fresh、astro、qwik、million、lexical、turbopack、esbuild等新技术），并结合实际场景进行落地。

## 优化Web Vitals
- 提升FCP（_优<1.8s<差强人意<3s<差_）：
  - 动态加载组件
  - lazy-load/CDN img
  - h2/h3
  - 用webpack删代码treeShake+分包splitChunks
  - 并行请求
  - 文本内容尽早展示（font-display: swap）
  - 善用缓存（cache-control/expires/etag/last-modified）
  - brotli格式压缩（nginx 配置）
  - Inline CSS
  - Inline Img（base64）
  - CDN加载公共js
- 提升CLS（_impact×distance，优<0.1<差强人意<0.25<差_）：
  - 善用亲属关系hint（rel=dns-prefetch/prefetch/preload/preconnect）
  - WebP格式
- 提升FID（_优<100ms<差强人意<200ms<差_）：
  - 将大的同步操作拆分为小的异步操作
  - 使用SSR
  - 对耗时请求设置支持中断和超时
  - 复杂计算使用 Web Worker

## 优化兼容性
- 成体系的CSS兼容方案
  - animation动画：transform不能同时设置 scale/rotate 和 opacity，需要用两个动画曲线分别处理
  - 居中：设计导出的动画没有考虑小屏机的屏幕尺寸（小于375*812）导致absolute布局不居中，使用多一层div包裹，设置相对定位，宽高100%
  - 动画卡顿：ios上，避免使用step(1)的动画，有卡顿感，而应该改为linear，通过动画曲线设置渐变
  - 字体渲染出现白边：对动画文字格栅化渲染问题，可以通过添加will-change优化相应的文字动画；另外也可以通过加上clip-path: inset(1px); 裁剪解决
  - iphone非标准底部，需要添加 iphone对应的变量：env(safe-area-inset-bottom) 但在ios9以下不生效，需要确保添加了fallback的值兼容
  - 尽量避免使用grid、gap等可能有兼容性问题的属性
- Mixin
  - 字体渐变
  - 0.5px的边框