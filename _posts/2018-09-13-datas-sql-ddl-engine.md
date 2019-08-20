---
layout: post
title:  "DatasSqlDdlEngine"
categories: sql-ddl-dao
tags:  sybn-core sql dao 0.2.13
author: sybn
---

* content
{:toc}

## 简介

DatasSqlDdlEngine 是针对 List 执行 sql 语句的工具。

用于处理那些非数据库数据，比如 xls 中的数据。

该系列有3个实现类:
*  DatasSqlDdlEngine 处理 list
*  DatasSqlDdlStreamEngine 处理 stream
*  DatasSqlDdlStreamAsyncEngine 异步处理 stream, 原样返回新的流, 通过 callback 输出结果





### 优缺点
* DatasSqlDdlEngine 处理 list, 当处理GB级别的源数据时, JVM 会因为内存不足而 OOM. 因此只适用于处理小数据量的业务(比如小于500M的sql表).
* DatasSqlDdlStreamEngine 处理 stream 无论源数据有多大, 都不会因为源数据而 OOM, 内存占用最低. 但是如果范围的结果集数据过大, 仍然会OOM.
* DatasSqlDdlStreamAsyncEngine 可以对一个流执行互不相关的一批sql语句, 可以大幅节约外部IO, 但是会同时在内存中保存所有sql的返回值, 有一定的OOM风险.

### 用法举例
```java
String sqlFind = "select * from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";
String sqlCount = "select count(*) from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";

// DatasSqlDdlEngine 处理 list 支持是Map或JavaBean，返回值同样可以是Map或JavaBean
List<Map<String, Object>> result1 = DatasSqlDdlEngine.sqlFindListMap(list, sqlFind);
List<SybnJunitBase> result2 = DatasSqlDdlEngine.sqlFindList(list, sqlFind, SybnJunitBase.class);

// DatasSqlDdlStreamEngine 处理 stream 注意:执行后 stream 会被消费无法继续使用
List<Map<String, Object>> result3 = DatasSqlDdlStreamEngine.sqlFindListMap(stream1, sqlFind);
List<SybnJunitBase> result4 = DatasSqlDdlStreamEngine.sqlFindList(stream2, sqlFind, SybnJunitBase.class);

// DatasSqlDdlStreamAsyncEngine 原样返回新的 stream. 因此可以对一个流并行执行多条 sql 语句.
ListCallback callback1 = new ListCallback();
ListCallback callback2 = new ListCallback();
stream4 = DatasSqlDdlStreamAsyncEngine.sqlFindListMap(stream3, sqlFind, callback);
stream5 = DatasSqlDdlStreamAsyncEngine.sqlFindListMap(stream4, sqlCount, callback);
stream5.count();
// 必须等流被 消费后才能使用get获取返回值
List<Map<String, Object>> result5 = callback1.get();
List<Map<String, Object>> result9 = callback2.get();
```

### 支持功能
已经支持如下关键字： select, from, where, group by, having, order by, skip, limit.

已经支持如下函数： avg, sum, count, count(distinct x), max, min, list, set 等

支持如下占位符： xxx = ?, xxx in (?), xxx > #{xxx}


### 注意事项

* DatasSqlDdlEngine 返回的数据是原始数据的深度拷贝，修改返回值不影响原始数据。

* 深度拷贝会消耗一些额外的性能，改用 DatasSelectUtil 并设置 cloneAble 参数，可以允许跳过深度复制从而提高性能。

* DatasSqlDdlStreamAsyncEngine 只支持查询 Stream<map> 出于性能考虑不支持java bean. 可以用 BeanMapUtil.toMap() 将 java bean 流转为 Map 流.


## 相关页面
- [sql查询接口]({{site.baseurl}}/2018/04/24/sql-ddl-dao/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- sql查询实现:solr 文档待补
- [jdbc-driver]({{site.baseurl}}/2019/09/18/jdbc-driver/)
