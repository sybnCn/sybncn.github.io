---
layout: post
title:  "group by util 通用聚合引擎"
categories: sybn-core
tags:  sybn-core about index
author: sybn
---

* content
{:toc}

## 简介
GroupByStreamUtil 和 GroupByUtil 可以在各个数据库中执行 groupby 操作.

GroupByStreamUtil 会返回 Stream, GroupByUtil 会返回 list.

目前有3种实现: mongo, solr, java

他们都支持基础的聚合函数,比如: sum,min,max,count,count distinct等

其中 java 实现已经准备了大量自定义聚合函数(UDAF),并支持业务代码随时注册新的函数.



## 样例
```java
/** 
 *  select timeType, screenType, movieId,
 *      sum(maoyanShows) AS maoyanShows,
 *      sum(maoyanPeople) AS maoyanPeople,
 *      sum(maoyanSeats) AS maoyanSeats,
 *      sum(maoyanBoxoffice) AS maoyanBoxoffice,
 *      (maoyanPrice / maoyanShows) AS maoyanAvgPrice
 *  from maoyan
 *  where first_show between '2018-01-01' and '2018-03-31'
 **/
 
// 查询的表名
String tableName = "maoyan";
// 聚合前的查询条件
SybnQuery<?> query = SybnQueryStringFactory.newQuery("first_show between '2018-01-01' and '2018-03-31'");
// 被聚合的字段
String groupFields = "sum(maoyanShows) AS maoyanShows, "
    + "sum(maoyanPeople) AS maoyanPeople, "
    + "sum(maoyanSeats) AS maoyanSeats, "
    + "sum(maoyanBoxoffice) AS maoyanBoxoffice, " 
    + "(maoyanPrice / maoyanShows) AS maoyanAvgPrice";
SqlPartFieldList sqlPartFields = SqlPartFieldFactory.createList(groupFields);
// 聚合条件
List<String> groupKey = ListUtil.toList("timeType", "screenType", "movieId");

// mongo
String conf = "mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/test";
QueryCommonDao mongoDao = new MongoDaoImpl(conf);
Stream<Document> groupByData = MongoGroupByStreamUtil.groupByDoc(mongoDao, tableName, query, sqlPartFields, groupKey);
// solr - groupKey 为多个值时会执行JavaGroupByStreamUtil
String conf = "solr://192.168.7.71:2181,192.168.7.72:2181/solr";
QueryCommonDao solrDao = new SolrDaoImpl(conf);
Stream<Document> groupByData = SolrGroupByStreamUtil.groupByDoc(solrDao, tableName, query, sqlPartFields, groupKey);
// java list TODO 暂不支持 groupBy 时执行 query
Stream<Document> groupByData = JavaGroupByStreamUtil.groupByDoc(stream, sqlPartFields, groupKey);
```
注: QueryCommonDao 是 CrudQueryCommonDao 的一部分

## 远期规划
- JavaGroupByStreamUtil 需要支持 query.
- 将 tableName,query,groupFields,groupKey 统一封装进  SimpleSqlEntity 中. 目前 SimpleSqlEntity 还没有写完.

## 相关页面
- [SybnQuery 动态查询实体]({{site.baseurl}}/2018/03/28/sybn-query/)
- [CrudQueryCommonDao 通用查询接口]({{site.baseurl}}/2018/03/28/crud-query-common-dao/)
