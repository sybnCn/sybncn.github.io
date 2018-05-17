---
layout: post
title:  "sybn counter 计数器"
categories: sybn-core
tags:  sybn-core bean 0.1.10
author: sybn
---

* content
{:toc}

## 简介
sybn counter 是一个多线程计数器,此接口的两个实现 SybnCounterImpl 和 SybnCounterMapImpl 都是线程安全的.
sybn counter 主要有以下功能:
- 以 Map<String, Long> 的形式维护一组支持inc操作的long型数据
- 记录任务的开始时间和任务进度,预估任务的剩余时间





### 用法举例
```java
SybnCounter count = new SybnCounterImpl();
count.setCount("aaa", 1);
count.incCount("aaa", 1);
long aaa = count.getCount("aaa"); // 2

count.setTotal(100);
count.incCurrent(10);
String log = count.toCountString(); // {progress:10/100( 10.00%), currentTime:1ms, remainTime:9ms, aaa:2}
```

