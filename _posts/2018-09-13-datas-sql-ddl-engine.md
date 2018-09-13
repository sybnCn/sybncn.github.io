---
layout: post
title:  "DatasSqlDdlEngine"
categories: sybn-core
tags:  sybn-core 0.2.12
author: sybn
---

* content
{:toc}

## 简介

DatasSqlDdlEngine 是针对 List 执行 sql 语句的工具。

用于处理那些非数据库数据，比如 xls 中的数据。





### 用法举例
```java
String sqlFind = "select * from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";
String sqlCount = "select count(*) from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";

// 入参list中可以是Map或JavaBean，返回值同样可以是Map或JavaBean
List<Map<String, Object>> sqlFindListMap = DatasSqlDdlEngine.sqlFindListMap(list, sqlFind);
List<SybnJunitBase> sqlFindList = DatasSqlDdlEngine.sqlFindList(list, sqlFind, SybnJunitBase.class);
```

### 支持功能
已经支持如下关键字： select, from, where, group by, having, order by, skip, limit.

已经支持如下函数： avg, sum, count, count(distinct x), max, min, list, set 等

支持如下占位符：  xxx = ?, xxx in (?), xxx > #{xxx}


### 注意事项 0.2.12

* DatasSqlDdlEngine 返回的数据是原始数据的深度拷贝，修改返回值不影响原始数据。

* 深度拷贝会消耗一些额外的性能，利用 DatasSelectUtil 中的 cloneAble 参数，可以允许跳过深度复制从而提高性能。

