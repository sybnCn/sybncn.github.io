---
layout: post
title:  "MongoDao 对于 sql 的支持"
categories: sybn-core
tags:  sybn-core 0.2.12
author: sybn
---

* content
{:toc}

## 简介

MongoDao 对于于 sql 函数的支持与 Mysql 略有差异,在此专门作出说明。

注意: 所有关键字和函数名都不区分大小写,字段名区分大小写







### 支持标准sql功能

已经支持如下关键字： select, from, where, group by, having, order by, skip, limit.

在 group by 时,已经支持如下 UDAF 函数： avg, sum, count, count(distinct x), max, min

在 group by 时,已经支持如下 UDF 函数: year, month, dayofmonth, hour, minute, second, millisecond, dayofyear, dayofweek, week 等 

支持问号占位符： xxx = ?

### 支持非标准sql功能 V:0.2.12

与其他dao一样,还支持如下 UDAF 函数: avgpositive, avgnz, countall, countall(distinct x), list, set, listall, setall

与其他dao一样,还支持如下 UDF 函数: toInt, toLong, toDate, trim, substring

与其他dao一样,还支持如下占位符： xxx in (?), xxx > #{xxx}

MongoDao 在 group by 时还支持了简单的 Case When:

```
select a sum(case when t > 0 then 1 else 2 end) as tt from data group by a
```

MongoDao 在 group by 时,还支持 UDTF 函数 unwind :

```
// 以下两种写法等效
select unwind(a) as a, sum(b) from data group by a
select a, sum(b) from data group by unwind(a) as a

```

### 不支持功能

不支持复杂的case when

不支持任何函数嵌套函数,比如: (sum(a)/sum(b)) 是 calc 内嵌 sum,不能直接使用.


### 注意事项 0.2.12

* 不恰当的查询语句会造成数据库查询超时,超时时间限制在dao的构造函数中, 比如:

```
// 300秒超时
MongoDao dao = new MongoStreamDaoConfImpl("test", "confName@xxxx.properties", 300);
```

* 注意: 查询超时后,mongoDB是否停止执行已经超时的查询,由服务器设置确定,不恰当的设置可能造成服务器宕机.

