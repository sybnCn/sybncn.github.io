---
layout: post
title:  "sql 语句转 mongo aggregate 语句的简单介绍"
categories: mongo-dao
tags:  mongo-dao 0.3.2 tools
author: sybn
---

* content
{:toc}

## 简介

部分同学不熟悉 mongodb 的查询语法，为了降低入门门槛，今天专门提供了转换类。

已经为大家准备好了 web 版接口: [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html)





## 使用方法
```java
// params 支持 ？ 和 #{name} 占位符
MongoAggregateBuilder.makPipeline(@NonNull String sql, Object... params)
```


## 举例

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

## 注意事项 

* mongo 只能支持 select 和 from 子查询, 无法支持 where 子查查询 和 join

* 此工具类暂时不支持加减乘除运算

* mongo对数据类型敏感，MySQL 中的 date > str_to_date('2019-04-07', '%Y-%m-%d') 可以写为 date > '2019-04-07' 但 mongo 不可以。

## web 版

* 以下是web版效果图  [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html)

![]({{site.baseurl}}/images/sql_query_convert_mongo_aggregate_3.png)

* 手机扫码试用

![]({{site.baseurl}}/images/rqcode_sql_query-convert-mongo_aggregate.png)

## 相关页面
- [mongodb 的 sql 查询接口]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
