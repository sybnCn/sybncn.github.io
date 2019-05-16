---
layout: post
title:  "HBaseDaoImpl 介绍"
categories: hadoop-dao
tags:  hadoop-dao 0.3.2 sql
author: sybn
---

* content
{:toc}

## 简介

HBaseDaoImpl 是 SqlDdlDao 接口的实现类,  实现了基于sql的各种数据查询能力.
支持注入到 SqlDdlDaoMultipleImpl 做跨存储引擎的数据查询.





### 使用说明
* HBaseDaoImpl 读写时, 将 hbase 的 RowKey 映射为  id 处理.
* HBaseDaoImpl 不区分字段类型 a>1等效于 a>"1"
* HBaseDaoImpl 如果查询 javaBean 会自动转换字段类型, 如果查询 Map 所有字段值都会返回 String 类型.
* HBaseDaoImpl 支持将  hbase 的 timestamp 特性映射为 _timestamp 字段,支持在sql中对其查询.


### 数据时光机(_timestamp)

* 在 HBaseDaoImpl 中查询某个数据的快照

```sql
-- 查询 id = 100 的数据 2019-05-01 的快照
SELECT * FROM hbase_hp_cinema_info where id = 100 and _timestamp = toDate('2019-05-01');
```

> 注意:  where 条件筛选的是数据当前状态, _timestamp 条件尽可以控制返回值的快照时间.
> 
> 如果需要在 where 条件中查询 _timestamp 时刻快照的状态, 需要用 SqlDdlDaoMultipleImpl 做双层查询

* 在 SqlDdlDaoMultipleImpl 中筛选快照时刻的数据状态

```sql
-- 查询 2019-05-01 的快照中, status = 1 的数据
select * from ( 
  	SELECT * FROM hbase_hp_cinema_info where _timestamp = toDate('2019-05-01');
) where status = 1;
```

* 在SqlDdlDaoMultipleImpl中查询某个字段不同时刻的差异

```sql
-- 查询 2019-04-01 与 2019-05-01 两个快照 status 不一致的数据
select * from ( 
	select v1, v2, compare(v1, v2) as compared from (
  	SELECT id, status as v1 FROM hbase_hp_cinema_info where _timestamp = toDate('2019-05-01');
  	SELECT id, status as v2 FROM hbase_hp_cinema_info where _timestamp = toDate('2019-04-01');
  	join right(*) on id = id;
  )
) where compared != 0;
```

