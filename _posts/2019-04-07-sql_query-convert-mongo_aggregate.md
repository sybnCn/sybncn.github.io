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

已经为大家准备好了 web 版接口: [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html)





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

- [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html?sql_demo=mongo_aggregate_demo_1)

* 输出 Aggregate: 

```json
[
  {"$match":{"date":{"$gt":{"$date":"2019-04-06T16:00:00Z"}}}},
  {"$group":{"_id":{"t":{"$cond":{"if":{"$eq":["$type",1]},"then":"$value1","else":{"$cond":{"if":{"$eq":["$type",2]},"then":"$value2","else":0}}}}},"c":{"$sum":1}}},
  {"$project":{"_id":0,"t":"$_id.t","c":1}},
  {"$match":{"c":{"$gt": 10}}},
  {"$sort":{"c":-1}}
]
```


> 注意： mongo对数据类型敏感，MySQL 中的 date > str_to_date('2019-04-07', '%Y-%m-%d') 可以写为 date > '2019-04-07' 但 mongo 不可以。

### 例2(带unwind的sql)

* 输入 SQL: 

```sql
-- 语法1 两种写法等效
select datas, count(*) as c from table group by unwind(datas) as data
```

- [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html?sql_demo=mongo_aggregate_demo_2a)

```sql
-- 语法2 group by 后面的字段名需要等于 as 后面的字段名
select unwind(datas) as data, count(*) as c from table group by data
```

- [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html?sql_demo=mongo_aggregate_demo_2b)

* 输出 Aggregate: 

```json
[
  {"$unwind":"$datas"}, 
  {"$group":{"_id":{"data":"$datas"},"c":{"$sum":1}}}, 
  {"$project":{"_id":0,"data":"$_id.data","c":1}}
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

- [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html?sql_demo=mongo_aggregate_demo_3)

* 输出 Aggregate: 

```json
[
  {"$group":{"_id":{,"day":{"$dateToString":{"date":"$pay_time","format":"%Y-%m-%d"}},"user":"$user"},"price_sum":{"$sum":"$price"}}},
  {"$project":{"_id":0,"day":"$_id.day","user":"$_id.user","price_sum":1}},
  {"$group":{"_id": "day":"$day"},"user_count":{"$sum":{"$cond":{"if":{"$gt":["$user",null]},"then":1,"else":0}}},"price_sum":{"$sum":"$price_sum"}}},
  {"$project":{"_id":0,"day":"$_id.day","user_count":1,"price_sum":1}}
]
```

### 注意事项 

* 此工具类暂时不支持非 from 的 select 嵌套

*  此工具类暂时不支持加减乘除运算

### web 版

* 以下是web版效果图  [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html)

![]({{site.baseurl}}/images/sql_query_convert_mongo_aggregate_2.png)

## 相关页面
- [mongodb 的 sql 查询接口]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
