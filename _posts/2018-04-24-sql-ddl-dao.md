---
layout: post
title:  "sql ddl dao 通用查询引擎"
categories: sybn-core
tags:  sybn-core dao sql mongo solr HBase groupBy 0.2.13
author: sybn
---

* content
{:toc}

## 简介
SqlDdlDao 和 SqlDdlStreamDao 可以在各个数据库中执行 sql 操作.

本质上是 QueryCommonDao，DatasGroupByUtil，DatasLeftJoinUtil，DatasCalcUtil 等工具集的sql风格的门面。

目前有4类数据库Dao实现了此接口: MongoDao / MongoStreamDao, SolrDao, HBasesDao / HabseStreamDao, DbutilDao(sql)

![]({{site.baseurl}}/images/sql_ddl_dao_2.png)



## 样例 v:0.2.6
```java
String sqlFind = "select * from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";
String sqlCount = "select count(*) from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";

// sql / mongo / solr / HBase 数据量大时, 可以使用 StreamDao 以 Stream 流形式返回数据
SqlDdlDao dao = new DbutilDaoImpl("jdbc:mysql://账户:密码@192.168.4.31:3306,192.168.4.32:3306/test"); // sql
SqlDdlDao dao = new MongoDaoImpl("mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/test"); // mongo
SqlDdlDao dao = new SolrDaoImpl("solr://192.168.7.71:2181,192.168.7.72:2181/solr"); // solr
SqlDdlDao dao = new HBaseDaoImpl("hbase://192.168.7.71,192.168.7.72/hbase-unsecure"); // HBase
List<Map<String, Object>> sqlFindListMap = dao.sqlFindListMap(sqlFind);
List<SybnJunitBase> sqlFindList = dao.sqlFindList(sqlFind, SybnJunitBase.class);
long count = dao.sqlCount(sqlCount);

// jvm
List<Map<String, Object>> sqlFindListMap = DatasSqlDdlEngine.sqlFindListMap(list, sqlFind);
List<SybnJunitBase> sqlFindList = DatasSqlDdlEngine.sqlFindList(list, sqlFind, SybnJunitBase.class);
```

> 注意: sql实际上会翻译为各个数据库自己的语言去执行,因此类似于: "where day = now()" 这样带有的 sql 专属函数 "now()" 的语句是不被支持的. 

> 注意：Hbase 的所有条件都是按字符串顺序比较的所以会出现 9 > 10， 在设计数据表时，最好填充0，将9存为000009。

## 支持程度 V:0.2.13

功能|DbutilDao (MySQL)|SolrDao|MongoDao|HBasesDao|DatasSqlDdlEngine (collection / stream)
----:|---|---|---|---|---|---
SELECT|支持|支持|支持|支持|支持
FROM|支持|支持|支持|支持|忽略
WHERE|支持|支持 (区分字段类型)|支持 (区分字段类型)|支持|JAVA实现
GROUP BY|支持|半原生半JAVA|支持|JAVA实现|JAVA实现
HAVING|支持|JAVA实现|支持|JAVA实现|JAVA实现
ORDER BY|支持|支持|支持|支持|JAVA实现
OFFSET|支持|支持|支持|JAVA实现|JAVA实现
LIMIT|支持|支持|支持|JAVA实现|JAVA实现
sum, avg, max ...|支持|支持|支持|JAVA实现|JAVA实现
set, list ...|暂不支持|暂不支持|支持|JAVA实现|JAVA实现
count(distinct x)|支持|支持|支持|JAVA实现|JAVA实现
year, month, hour ...|支持|不支持|支持|暂不支持|暂不支持
(x + y) as calc|支持|JAVA实现|JAVA实现|JAVA实现|JAVA实现
(CASE WHEN ...) as a|支持|JAVA实现|JAVA实现|JAVA实现|JAVA实现
sum(CASE WHEN ...) as a|支持|JAVA实现|JAVA实现|JAVA实现|JAVA实现
? 占位符|支持|支持|支持|支持|支持
mybatis 占位符|支持|支持|支持|支持|支持

> 关于私有 UDAF:
> * 自定义函数 set 是指将数据转 set 输出(删除重复项)
> * 自定义函数 list 是指将数据转 list 输出
> * 自定义函数 scopelist 是指将数据按时间转 list 输出,一般用于生成折线图,无数据的时间点使用默认值代替
> * 更多自定义函数另行说明

> 关于在内存中对 JAVA 集合类执行 sql 语句:
> 
> DatasSqlDdlEngine / DatasSqlDdlStreamEngine 接收 list/stream，在内存里对其执行 sql.
> 
> 实测 100,000 个 Map/bean 对象 where 查询的性能在 50ms 以内 (前提是sql语句中的字段类型与数据类型一致,否则也可以正确执行,但性能会下降)

> 注意: 
>
> mongodb / solr 对类型敏感,查询 a = 0 和 a = "0" 的效果不一样.
>
> 其他数据库 a = 0 和 a = "0" 的返回值一致,但两种写法有性能差异.

## 规划
计划支持以下特性：
- sqlFindList(sql) / sqlFindStream(sql) // 已实现
- sqlFindListMap(sql, class) / sqlFindStreamMap(sql, class) // 已实现
- sqlCount(sql) // 已实现
- sqlRemove(sql) // 未实现
- 将 GroupByUtil 装进 SqlDdlDao 的实现类中 // 已实现
- 将 Join 功能装进 SqlDdlDao 的实现类中 // 未实现

## 相关页面
- [SybnQuery 动态查询实体]({{site.baseurl}}/2018/03/28/sybn-query/)
- [CrudQueryCommonDao 通用查询接口]({{site.baseurl}}/2018/03/28/crud-query-common-dao/)
- [group by util 通用聚合引擎]({{site.baseurl}}/2018/04/12/group-by-util/)
