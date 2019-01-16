---
layout: post
title:  "sybn dao 使用子查询与union"
categories: sybn-core
tags:  sybn-core dao sql 0.2.20
author: sybn
---

* content
{:toc}

## 简介

标准的 sql 语句中查询嵌套查询和很常见的，但是 sybn dao 默认都只支持单表查询。

为了解决查询嵌套的问题， 准备了专门的 dao 实现： SqlDdlDaoMultipleImpl






### 使用样例

* from 子查询

```java
// 先生成 allSourceDao 并在其中注册所有的表
SqlDdlDao allSourceDao = new SqlDdlDaoAutoSourceImpl(allSource);
// 将 allSourceDao 转换为 SqlDdlDaoMultipleImpl 开启子查询支持。
sqlDdlDao multipleDao = mew SqlDdlDaoMultipleImpl(allSourceDao);

String sql = "
select type_name,sum(count) as count from (
	select type,count(*) as count from table1 group by type;
	select type,type_name from table2;
	join right(type_name) on left.type = right.type;
) group by type_name";
multipleDao.sqlFindListMap(sql);
```

* select 子查询 V:0.2.19

```java
// 先生成 allSourceDao 并在其中注册所有的表
SqlDdlDao allSourceDao = new SqlDdlDaoAutoSourceImpl(allSource);
// 将 allSourceDao 转换为 SqlDdlDaoMultipleImpl 开启子查询支持。
sqlDdlDao multipleDao = mew SqlDdlDaoMultipleImpl(allSourceDao);

String sql = "
	select * from table1 where id in (
		select id from table2
	);"
	
multipleDao.sqlFindListMap(sql);
```

* union V:0.2.18

```java
// 先生成 allSourceDao 并在其中注册所有的表
SqlDdlDao allSourceDao = new SqlDdlDaoAutoSourceImpl(allSource);
// 将 allSourceDao 转换为 SqlDdlDaoMultipleImpl 开启子查询支持。
sqlDdlDao multipleDao = mew SqlDdlDaoMultipleImpl(allSourceDao);

String sql = "
	select * from table1 
	union all
	select * from table2;"
	
multipleDao.sqlFindListMap(sql);
```

* 临时变量 V:0.2.20
```sql
set @time_date_str := '2019-01-16',
	@time := str_to_date(@time_date_str, '%Y-%m-%d');
select * from time_str > @time_date_str and time > @time
```

### 不支持功能

因为 join 的功能还没写完所以暂时使用 select + select + join 的方式实现 join 操作。


### 注意事项 

* 暂无

