---
layout: post
title:  "SqlDdlDaoStreamAsyncImpl 介绍"
categories: sql-ddl-dao
tags:  sybn-core 0.2.21 sql
author: sybn
---

* content
{:toc}

## 简介

SqlDdlDaoStreamAsyncImpl 是 SqlDdlDao 的流式异步查询实现。

支持对一个流同时执行一批 sql 语句， 从而大幅降低数据库负载。





### 代码样例

* 在 SqlDdlDaoStreamAsyncImpl 中异步执行多条 sql 语句。

```java
// 用一个流构造 dao, stream 中可以是 map 也可使是 java bean
SqlDdlDaoStreamAsyncImpl sqlDdlDaoStreamAsync = new SqlDdlDaoStreamAsyncImpl(stream);

// 向流中注册多条 sql 语句， 这些 sql 语句的执行对象相同， 逻辑互不相关
Callback<List<Map<String, Object>>> resultCallback1 = sqlDdlDaoStreamAsync.sqlFindListMap(sql1, list);
Callback<List<Map<String, Object>>> resultCallback2 = sqlDdlDaoStreamAsync.sqlFindListMap(sql2, list);
Callback<List<Map<String, Object>>> resultCallback3 = sqlDdlDaoStreamAsync.sqlFindListMap(sql3, list);

// 利用 count 消费流
sqlDdlDaoStreamAsync.count();

// 从 Callback 中获取返回值
List<Map<String, Object>> listMap1 = resultCallback1.get();
List<Map<String, Object>> listMap2 = resultCallback2.get();
List<Map<String, Object>> listMap3 = resultCallback3.get();
```

> 注意:  SqlDdlDaoStreamAsyncImpl 目前的版本不支持子查询和联合查询， 后期考虑优先支持支持子查询。


### 使用说明

* 并行流

SqlDdlDaoStreamAsyncImpl 支持传入 parallel 流, 此时 SqlDdlDaoStreamAsyncImpl 将会因为多线程执行而提高速度。

但是， parallel 流会增加 SqlDdlDaoStreamAsyncImpl 的内存占用， 并导致 first， last，list 等顺序敏感的 UDAF 函数返回值的变化。

