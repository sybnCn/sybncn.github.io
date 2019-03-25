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
sqlDdlDao multipleDao = new SqlDdlDaoMultipleImpl(allSourceDao);

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
sqlDdlDao multipleDao = new SqlDdlDaoMultipleImpl(allSourceDao);

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
sqlDdlDao multipleDao = new SqlDdlDaoMultipleImpl(allSourceDao);

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
select * from table where time_str > @time_date_str and time > @time
```

### 不支持功能

因为 join 的功能还没写完所以暂时使用 select + select + join 的方式实现 join 操作。
```sql
-- 第一次 join
# table1 的 sql 的返回值会被压入堆栈，坐标[0]
select type,count(*) as count from table1 group by type;
# table2 的 sql 的返回值会被压入堆栈，坐标[1]
select type,type_name from table2;
# join 会按先进后出的原则从堆栈的结尾获取表， 先取出[1]定义为 right， 再取出[0]定义为 left
# join 会将 right 的 type_name 写入 left，然后从堆栈删除 right [1]， 此时堆栈只剩下[0]
join right(type_name) on left.type = right.type;

-- 再次 join （按顺利连续join）
# table3 的 sql 的返回值会被压入堆栈，坐标[1]
select type_name_creatime,type_name from table3; # 第二次的 join 会将其前方此sql的返回值认定为 right 表, 而其前方第二张表也就是 第一次精品
# join 会按先进后出的原则从堆栈的结尾获取表， 先取出[1]定义为 right， 再取出[0]定义为 left
# join 会将 right 的 type_name_creatime 写入 left，然后从堆栈删除 right [1]， 此时堆栈只剩下[0]
join right(type_name_creatime) on left.type_name = right.type_name; # join 会将 right 表指定字段查询 left 表，然后返回 left 表

-- 嵌套 join 右表本身有 join 逻辑

# table1 的 sql 的返回值会被压入堆栈，坐标[1]
select type,type_id from table4;
# table2 的 sql 的返回值会被压入堆栈，坐标[2]
select type_id, type_id_createtime from table4;
# join 会按先进后出的原则从堆栈的结尾获取表， 先取出[2]定义为 right， 再取出[1]定义为 left
# join 会将 right 的 type_name 写入 left，然后从堆栈删除 right [2]， 此时堆栈只剩下[0]和[1]
join right(type_id_createtime) on left.type = right.type;
```

### 注意事项 

* 暂无

