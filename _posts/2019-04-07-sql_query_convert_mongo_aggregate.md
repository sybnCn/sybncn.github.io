---
layout: post
title:  "sql 语句转 mongo aggregate 语句"
categories: mongo-dao
tags:  mongo-dao 0.3.2 tools
author: sybn
---

* content
{:toc}

## 简介

部分同学不熟悉 mongodb 的查询语法，为了降低入门门槛，今天专门提供了转换类。





### 使用方法
```java
// params 支持 ？ 和 #{name} 占位符
MongoAggregateBuilder.makPipeline(@NonNull String sql, Object... params)
```

### 例1(普通sql)

* 输入 SQL: 

```sql
select
	 (case type when 1 then value1 when 2 then value2 else 0 end) as t,
	 count(*) as c
 from table
 where date > str_to_date('2019-04-07', '%Y-%m-%d')
 group by t
 having c > 10
 order by c desc
 ```

* 输出 Aggregate: 

```json
[
    {$match:{"date": {"$gt": {"$date": "2019-04-06T16:00:00Z"}}}},
    {$group:{_id:{ "t":{$cond:{if:{"$eq": ["$type", 1]}, then:"$value1", else:{$cond:{if:{"$eq": ["$type", 2]}, then:"$value2", else:0}}}}}, "c":{$sum:1}}},
    {$project:{_id:0, "t":"$_id.t", "c":1}},
    {$match:{"c": {"$gt": 10}}},
    {$sort:{"c": -1}}
]
```

> 注意： mongo对数据类型敏感，MySQL 中的 date > str_to_date('2019-04-07', '%Y-%m-%d') 可以写为 date > '2019-04-07' 但 mongo 不可以。

### 例2(带unwind的sql)

* 输入 SQL: 

```sql
select datas, count(*) as c from table group by unwind(datas)
 ```

* 输出 Aggregate: 

```json
[
    {$unwind:"$datas"},
    {$group:{_id:{"unwind_datas":"$datas"}, "c":{$sum:1}}},
    {$project:{_id:0, "unwind_datas":"$_id.unwind_datas", "c":1}}
]
```


### 例3(from子查询)

* 输入 SQL: 

``` sql
-- 求每天的用户数和总金额
select day, count(user) as user_count, sum(price_sum) as price_sum from (
	select date_format(pay_time, "%Y-%m-%d") as day, user, sum(price) as price_sum from table1 group by day, user;
) group by a
```

* 输出 Aggregate: 

```json
[
	{$group:{_id:{, "day":{$dateToString:{date:"$pay_time",format: "%Y-%m-%d"}}, "user":"$user"}, "price_sum":{$sum:"$price"}}},
	{$project:{_id:0, "day":"$_id.day", "user":"$_id.user", "price_sum":1}},
	{$group:{_id:{ "day":"$day"}, "user_count":{$sum:{$cond:{if:{$gt:["$user", null]}, then:1, else:0}}}, "price_sum":{$sum:"$price_sum"}}},
	{$project:{_id:0, "day":"$_id.day", "user_count":1, "price_sum":1}}
]
```

### 注意事项 

* 此工具类暂时不支持多 select 嵌套，未来计划支持一部分

* SqlDdlDaoMultipleImpl 支持 select 嵌套，比如：

```sql
select * from mysql表 where id in (select id from mongo表)
```

## 相关页面
- [mongodb 的 sql 查询接口]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
