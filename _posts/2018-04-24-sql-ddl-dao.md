---
layout: post
title:  "sql ddl dao 通用查询引擎"
categories: sybn-core
tags:  sybn-core dao mongo solr HBase 0.1.10
author: sybn
---

* content
{:toc}

## 简介
SqlDdlDao 和 SqlDdlStreamDao 可以在各个数据库中执行 sql 操作.

本质上是 QueryCommonDao，DatasGroupByUtil，DatasLeftJoinUtil，DatasCalcUtil 等工具集的sql风格的门面。

目前有4类数据库Dao实现了此接口: MongoDao / MongoStreamDao, SolrDao, HBasesDao / HabseStreamDao, DbutilDao(sql)

计划支持以下特性：
- sqlFindList(sql) / sqlFindStream(sql) // 已实现
- sqlFindListMap(sql, class) / sqlFindStreamMap(sql, class) // 已实现
- sqlCount(sql) // 已实现
- sqlRemove(sql) // 未实现
- 将 GroupByUtil 装进 SqlDdlDao 的实现类中 // 未实现

![]({{site.baseurl}}/images/sql_ddl_dao.png)



## 样例 v:0.1.10
```java
// sql / SimpleSqlEntity / SimpleSqlQueryEntity 可以使用以下代码互相转换
SimpleSqlEntity sqlEntity = new SimpleSqlEntity(sql); // 用sql构造SimpleSqlEntity
sqlEntity.getWhere.add("day between '2018-03-20' and '2018-03-21'"); // 向SimpleSqlEntity添加条件
SimpleSqlQueryEntity sqlEntity = new SimpleSqlQueryEntity(sql); // 用sql构造SimpleSqlEntity
sqlEntity.getWhereQuery.like("name", "123"); // 向SimpleSqlQueryEntity添加条件
String sql = sqlEntity.toString(); // SimpleSqlEntity / SimpleSqlQueryEntity 可以转sql

/**
 * 所有接口都可以接受 sql / SimpleSqlEntity / SimpleSqlQueryEntity。
 * 静态查询传sql，动态查询传 SimpleSqlEntity / SimpleSqlQueryEntity。
 */
// sql
SqlDdlDao dao = new DbutilDaoImpl("jdbc:mysql://账户:密码@192.168.4.31:3306,192.168.4.32:3306/test");
List<Map<String, Object>> sqlFindListMap = dao.sqlFindListMap("select * from sybn_junit_base where day between '2018-03-20' and '2018-03-21'");
List<SybnJunitBase> sqlFindList = dao.sqlFindList("select * from sybn_junit_base where day between '2018-03-20' and '2018-03-21'", SybnJunitBase.class);

// mongo
SqlDdlDao dao = new MongoDaoImpl("mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/test");
List<Map<String, Object>> sqlFindListMap = dao.sqlFindListMap("select * from sybn_junit_base where day between '2018-03-20' and '2018-03-21'");
List<SybnJunitBase> sqlFindList = dao.sqlFindList("select * from sybn_junit_base where day between '2018-03-20' and '2018-03-21'", SybnJunitBase.class);

// solr
SqlDdlDao dao = new SolrDaoImpl("solr://192.168.7.71:2181,192.168.7.72:2181/solr");
List<Map<String, Object>> sqlFindListMap = dao.sqlFindListMap("select * from sybn_junit_base where id between '2018-03-20' and '2018-03-21'");
List<SybnJunitBase> sqlFindList = dao.sqlFindList("select * from sybn_junit_base where id between '2018-03-20' and '2018-03-21'", SybnJunitBase.class);

// HBase
SqlDdlDao dao = new HbaseDaoImpl("hbase://192.168.7.71,192.168.7.72/hbase-unsecure");
List<Map<String, Object>> sqlFindListMap = dao.sqlFindListMap("select * from sybn:sybn_junit_base where id between '2018-03-20' and '2018-03-21'");
List<SybnJunitBase> sqlFindList = dao.sqlFindList("select * from sybn:sybn_junit_base where id between '2018-03-20' and '2018-03-21'", SybnJunitBase.class);

// jvm V:0.1.10
List<Map<String, Object>> sqlFindListMap = DatasSqlDdlEngine.sqlFindListMap(list, "select * from list where id between '2018-03-20' and '2018-03-21'");
List<SybnJunitBase> sqlFindList = DatasSqlDdlEngine.sqlFindList(list, "select * from sybn:sybn_junit_base where id between '2018-03-20' and '2018-03-21'", SybnJunitBase.class);
```

## 支持程度

实现类|where|groupBy|having|orderBy|limit|UDAF
----:|---|---|---|---|---|---
DbutilDao|支持|支持|支持|支持|支持|sum, max, first, avg, count, count(distinct) ... 不支持: set, list
SolrDao|支持|支持单字段 java实现多字段|未实现|支持|支持|sum, max, first, avg, count, count(distinct) ... 不支持: set, list
MongoDao|支持|支持|支持|支持|支持|sum, max, first, avg, count, count(distinct), set, list
MongoStreamDao|支持|支持|支持|支持|支持|sum, max, first, avg, count, count(distinct), set, list
HBasesDao|支持|java实现|未实现|支持|支持|sum, max, first, avg, count, count(distinct), set, list ...
HabseStreamDao|支持|java实现|未实现|支持|支持|sum, max, first, avg, count, count(distinct), set, list ...
DatasSqlDdlEngine|支持|支持|支持|支持|支持|sum, max, first, avg, count, count(distinct), set, list ...
DatasSqlDdlStreamEngine|支持|支持|支持|支持|支持|sum, max, first, avg, count, count(distinct), set, list ...

> DatasSqlDdlEngine / DatasSqlDdlStreamEngine 接收 list/stream，在内存里对其执行 sql.
> 
> 实测 100,000 个 Map/bean 对象 where 查询的性能在 50ms 以内 (需要sql语句中的字段类型与数据中的字段类型一致,否则性能会有下降)

## 远期规划
- 将 Join 功能装进 SqlDdlDao 的实现类中 // 未实现

## 相关页面
- [SybnQuery 动态查询实体]({{site.baseurl}}/2018/03/28/sybn-query/)
- [CrudQueryCommonDao 通用查询接口]({{site.baseurl}}/2018/03/28/crud-query-common-dao/)
- [group by util 通用聚合引擎]({{site.baseurl}}/2018/04/12/group-by-util/)
