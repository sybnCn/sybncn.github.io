---
layout: post
title:  "group by util 通用聚合引擎"
categories: sybn-core
tags:  sybn-core dao mongo solr 0.1.9
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



## 样例 v:0.1.9
```java
// group by 语句
String sql = "select date, 'test' as name, (1+1) as '等于二', sum(num), max(num), avg(num), count(num), count(distinct num) as c"
    + " from sybn_junit_base"
    + " where num > 1000"
    + " group by date"
    + " having c > 0"
    + " order by date desc"
    + " limit 0, 10";

// mongo
MongoDao mongoDao = new MongoDaoImpl("mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/test");
List<Map<String, Object>> groupByData = MongoGroupByUtil.groupBy(mongoDao, sql);
Stream<Map<String, Object>> groupByData = MongoGroupByStreamUtil.groupBy(mongoDao, sql);
// 返回值第一行： {"date":2018419,"name":"test","等于二":2,"sumNum":16501500,"minNum":1002,"maxNum":9999,"avgNum":5500.5,"countNum":3000,"c":3000}

// solr - groupKey 为多个值时会执行JavaGroupByUtil
SolrDao solrDao = new SolrDaoImpl("solr://192.168.7.71:2181,192.168.7.72:2181/solr");
List<Map<String, Object>> groupByData = SolrGroupByUtil.groupBy(solrDao, sql);
// TODO 未完成 Stream<Map<String, Object>> groupByData = SolrGroupByStreamUtil.groupBy(mongoDao, sql);
// 返回值第一行： {"date":"2018419","name":"test","等于二":2,"sumNum":16501500,"minNum":1002,"maxNum":9999,"avgNum":5500.5,"countNum":3000,"c":3000}

// java stream
List<Map<String, Object>> groupByData = JavaGroupByUtil.groupBy(listMap, sql);
Stream<Map<String, Object>> groupByData = JavaGroupByStreamUtil.groupBy(streamMap, sql);
// 返回值第一行： {"date":2018419,"name":"test","等于二":2,"sumNum":16501500,"minNum":1002,"maxNum":9999,"avgNum":5500.5,"countNum":3000,"c":3000}
```
> 注: 反回值中的 (1+1), sum, avg 等函数的返回值会自动降级，返回自字段类型可能是 double/float/long/int 中不越界不丢精度情况下的空间较小的值, 详情参考： TrimNumberUtil
> 注: 目前只有 MongoGroupByUtil 和 MongoGroupByStreamUtil 支持 having 语句
> 注: SolrGroupByUtil 使用 facet 返回的 group by 字段 date 的值是 String 型的，其他工具会返回正常的类型

## 远期规划
- JavaGroupByStreamUtil 需要支持 query.
- 将 tableName,query,groupFields,groupKey 统一封装进  SimpleSqlEntity 中. 目前 SimpleSqlEntity 还没有写完.

## 相关页面
- [SybnQuery 动态查询实体]({{site.baseurl}}/2018/03/28/sybn-query/)
- [CrudQueryCommonDao 通用查询接口]({{site.baseurl}}/2018/03/28/crud-query-common-dao/)
