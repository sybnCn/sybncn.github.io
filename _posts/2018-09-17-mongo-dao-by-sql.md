---
layout: post
title:  "MongoDao 对于 sql 的支持"
categories: sql-ddl-dao
tags:  mongo-dao dao sql mongo 0.2.13
author: sybn
---

* content
{:toc}

## 简介

MongoDao 对于于 sql 函数的支持与 Mysql 略有差异,在此专门作出说明。

注意: 所有关键字和函数名都不区分大小写,字段名区分大小写







## 支持标准sql功能

已经支持如下关键字： select, from, where, group by, having, order by, skip, limit.

在 group by 时,已经支持如下 UDAF 函数： avg, sum, count, count(distinct x), max, min

在 group by 时,已经支持如下 UDF 函数: year, month, dayofmonth, hour, minute, second, millisecond, dayofyear, dayofweek, week 等 

支持问号占位符： xxx = ?

支持 from 子查询, 比如:

``` sql
-- 求每天的用户数和总金额
select day, count(user) as user_count, sum(price_sum) as price_sum from (
	select date_format(pay_time, "%Y-%m-%d") as day, user, sum(price) as price_sum from table1 group by day, user;
) group by a
```

- [from子查询底层工具]({{site.baseurl}}/2019/04/07/sql_query-convert-mongo_aggregate/#例3-from子查询)

## 支持非标准sql功能 V:0.2.12

与其他dao一样,都支持如下 UDAF 函数: avgPositive, avgNz, countall, countAll(distinct x), list, set, listAll, setAll, first, last

与其他dao一样,都支持如下 UDF 函数: toInt, toLong, toDate, trim, subString, replace, replaceAll

与其他dao一样,都支持如下占位符： xxx in (?), xxx > #{xxx} 举例:

```java
// 传统sql占位符
dao.sqlFindListMap("select * from a in (?,?,?)", 1,2,3);

// 一个?占位一个集合
List<Integer> list = ListUtil.toList(1,2,3);
dao.sqlFindListMap("select * from a in (?)", list);

// myBatis 风格
Map<String, Object> map = new HashMap();
map.put("list", list)
dao.sqlFindListMap("select * from a in (#{xxx})", map);
```

MongoDao 在 group by 时还支持了简单的 Case When, 此函数莫mongo专有:

```java
// 以下两种写法等效
select a sum(case when t = 0 then 0 else 1 end) as tt from data group by a
select a sum(case t when 0 then 0 else 1 end) as tt from data group by a

// TODO 目前暂时不支持多和when，比如下面的大写部分：
select a sum(case t when 0 then 0 WHEN 1 THEN 1 else 2 end) as tt from data group by a
```

MongoDao 在 group by 时,还支持 UDTF 函数 unwind, 此函数为 mongo 专有:

```java
// 以下两种写法等效
select unwind(a) as a, sum(b) from data group by a
select a, sum(b) from data group by unwind(a) as a

```

## 不支持功能

不支持复杂的case when

不支持任何函数嵌套函数,比如: (sum(a)/sum(b)) 是 calc 内嵌 sum,不能直接使用.


## 注意事项 0.2.12

* 不恰当的查询语句会造成数据库查询超时,超时时间限制在dao的构造函数中, 比如:

```java
// 300秒超时
MongoDao dao = new MongoStreamDaoConfImpl("test", "confName@xxxx.properties", 300);
```

* 注意: 查询超时后,mongoDB是否停止执行已经超时的查询,由服务器设置确定,不恰当的设置可能造成服务器宕机.


## 相关页面
- [sql查询接口]({{site.baseurl}}/2018/04/24/sql-ddl-dao/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- sql查询实现:solr 文档待补
- [sql查询实现:elastic]({{site.baseurl}}/2019/10/24/es-dao/)
- [底层查询实现:sql转aggregate]({{site.baseurl}}/2019/04/07/sql_query-convert-mongo_aggregate/)
