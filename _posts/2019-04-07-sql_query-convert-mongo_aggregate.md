---
layout: post
title:  "sql 语句转 mongo aggregate 语句的各种例子"
categories: mongo-dao
tags:  mongo-dao 0.3.2 tools
author: sybn
---

* content
{:toc}

## 简介

部分同学不熟悉 mongodb 的查询语法，为了降低入门门槛，今天专门提供了转换类。

已经为大家准备好了 web 版接口: [<i class="fa fa-link" aria-hidden="true"></i>在线测试](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html)





## 使用方法
```java
// params 支持 ？ 和 #{name} 占位符
MongoAggregateBuilder.makPipeline(@NonNull String sql, Object... params)
```


## 例1(普通sql)

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

- [<i class="fa fa-link" aria-hidden="true"></i>在线测试](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html?sql_demo=mongo_aggregate_demo_1)

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

## 例2(带unwind的sql)

* 输入 SQL: 

```sql
-- 语法1 两种写法等效
select datas, count(*) as c from table group by unwind(datas) as data
```

- [<i class="fa fa-link" aria-hidden="true"></i>在线测试](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html?sql_demo=mongo_aggregate_demo_2a)

```sql
-- 语法2 group by 后面的字段名需要等于 as 后面的字段名
select unwind(datas) as data, count(*) as c from table group by data
```

- [<i class="fa fa-link" aria-hidden="true"></i>在线测试](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html?sql_demo=mongo_aggregate_demo_2b)

* 输出 Aggregate: 

```json
[
  {"$unwind":"$datas"}, 
  {"$group":{"_id":{"data":"$datas"},"c":{"$sum":1}}}, 
  {"$project":{"_id":0,"data":"$_id.data","c":1}}
]
```


## 例3(from子查询)

* 输入 SQL: 

``` sql
-- 求每天的用户数和总金额
select day, count(user) as user_count, sum(price_sum) as price_sum from (
  select date_format(pay_time, "%Y-%m-%d") as day, user, sum(price) as price_sum from table1 group by day, user;
) group by a
```

- [<i class="fa fa-link" aria-hidden="true"></i>在线测试](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html?sql_demo=mongo_aggregate_demo_3)

* 输出 Aggregate: 

```json
[
  {"$group":{"_id":{,"day":{"$dateToString":{"date":"$pay_time","format":"%Y-%m-%d"}},"user":"$user"},"price_sum":{"$sum":"$price"}}},
  {"$project":{"_id":0,"day":"$_id.day","user":"$_id.user","price_sum":1}},
  {"$group":{"_id": "day":"$day"},"user_count":{"$sum":{"$cond":{"if":{"$gt":["$user",null]},"then":1,"else":0}}},"price_sum":{"$sum":"$price_sum"}}},
  {"$project":{"_id":0,"day":"$_id.day","user_count":1,"price_sum":1}}
]
```

## 例4 (select子查询 $lookup) V0.3.5

* 输入 SQL: 

``` sql
-- 从 ticket 表统计收货地址城市，并显示 city 表中的城名称
select 
  city_id, count(*) as count_num,
  (select city_name from city where table_a.city_id = city.id) as name
from ticket group by city_id
```

- [<i class="fa fa-link" aria-hidden="true"></i>在线测试](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html?sql_demo=mongo_aggregate_demo_4)

* 输出 Aggregate: 

```json
[
  {"$group":{"_id":{"city_id":"$city_id"},"count_num":{"$sum":1}}},
  {"$project":{"_id":0,"city_id":"$_id.city_id","count_num":1}},
  {"$lookup":{"from":"city","localField":"id","foreignField":"city_id","as":"__lookup_city_id_city_id"}},
  {"$addFields":{"city_name":{"$max":"$__lookup_city_id_city_id.city_name"}}}
]
```

> 如果有 group by 时 lookup 默认会放在  group by 之后执行， 如果需要在其之前执行， 可以额外嵌套一层

``` sql
-- 从 ticket 表统计用户注册地址城市，并显示 city 表中的城名称
select 
  city_id, count(*) as count_num,
  (select city_name from city where b.city_id = city.id) as name
from (

  -- 获取订单及订单用户的城市id
  select 
    user_id, 
    (select city_id from user where ticket.user_id= user.id) as city_id # 从用户表找城市id
  from ticket
  where ticket_time >= str_to_date('2019-10-01', '%Y-%m-%d') 
    and ticket_time < str_to_date('2019-10-08', '%Y-%m-%d') # Mongo 查时间必须转Date格式
    
) b group by city_id
```


## 注意事项 

* mongo 只能支持 select 和 from 子查询, 无法支持 where 子查查询 和 join

* 此工具类暂时不支持加减乘除运算

* mongo对数据类型敏感，MySQL 中的 date > str_to_date('2019-04-07', '%Y-%m-%d') 可以写为 date > '2019-04-07' 但 mongo 不可以。

## web 版

* 以下是web版效果图  [<i class="fa fa-link" aria-hidden="true"></i>在线测试](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html)

![]({{site.baseurl}}/images/sql_query_convert_mongo_aggregate_3.png)

* 手机扫码试用

![]({{site.baseurl}}/images/rqcode_sql_query-convert-mongo_aggregate.png)

## 相关页面
- [mongodb 的 sql 查询接口]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
