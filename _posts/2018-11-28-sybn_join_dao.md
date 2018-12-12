---
layout: post
title:  "sybn join dao 开发计划"
categories: sybn-core
tags:  sybn-core dao sql join 0.2.16
author: sybn
---

* content
{:toc}

## 简介

当前版本的 SqlDdlDao 的所有实现类都只支持单表查询, 需要使用 join 功能时,需要额外调用 DatasLeftJoinUtil 才能实现.

这将造成查询代码和join代码的分离, 无法实现 sql 重的 join 语句.

因此, 需要写一个新的 SqlDdlDao 实现类, 将 DatasLeftJoinUtil 中的 join 功能加入进去.







### 目标代码

* 旧版本的实现方式, 需要分成三行sql代码来处理.

```java
// 可以在静态类里存放每一个dao
SqlDdlDao leftDao = new HbaseDaoImpl("leftDao", "hbase://server_1:2121,server_2:2121/");
SqlDdlDao rightDao = new MongoDaoImpl("rightDao", "mongo://username:password@127.0.0.1:27017");

// left 有三个字段: id,a,b
List<Map<String, Object>> left = leftDao.sqlFindListMap("select id, a, b from left where a > 0");
// right 有三个字段: id,left_id,c
List<Map<String, Object>> right = rightDao.sqlFindListMap("select id, left_id, c from right where c > 0");
// join 后 left 有五个字段: id,a,b,right_id,c
DatasLeftJoinUtil.join(left, right, "join right(id as right_id, c) on left.id = right.left_id");
```

* 需要开发新版本的实现方式, 只要一行sql代码.

```java
// 现在只需要一个大的dao, 并将各个小的dao注册进来
Map<String, SqlDdlDao> allSource = new HashMap<>();
allSource.put("left", leftDao); // 注册 left 表使用 leftDao 来操作
allSource.put("right", rightDao); // 注册 right 表使用 rightDao 来操作
SqlDdlDao allSourceDao = new SqlDdlDaoAutoSourceImpl(allSource)

// 以下代码等效于之前的三行代码
String sql = "select left.id, left.a, left.b, rigth.id as right_id, right.c from left as left"
	 + " join (select id, left_id, c from right) as right on left.id = right.left_id";
List<Map<String, Object>> left = allSourceDao.sqlFindListMap(sql);
```

* 新版本的业务逻辑

```java
// 1. 入参
String sql = "select left.id, left.a, left.b, rigth.id as right_id, right.c from left as left"
	 + " join (select id, left_id, c from right where c > 0) as right on left.id = right.left_id"
	 + " where left.a > 0"
	 
// 2. 拆分
String leftSql = "select id, a, b from left where a > 0";
String rightSql = "select id, left_id, c from right where c > 0";
String joinSql = "join right(id as right_id, c) on left.id = right.left_id";
String postSql = ""; // 某些情况下会对 join 后的结果执行二次过滤

// 3. 调用不同的dao执行sql, 可能有二次嵌套

```

* 已实现的业务逻辑

```java
SqlDdlDaoMultipleImpl dao = new SqlDdlDaoMultipleImpl();
List<Map<String, Object>> targetDatas = JsonTools.parseJsonToListMap("[{a:1,b:2},{a:11,b:22},{a:111,b:222}]");
List<Map<String, Object>> sourceDatas = JsonTools.parseJsonToListMap("[{c:1,d:3},{c:11,d:33},{c:111,d:333}]");
dao.addTableSource("table1", targetDatas);
dao.addTableSource("table2", sourceDatas);

String sysql = "select * from table1;select * from table2;join right(d) on a = c";
List<Map<String, Object>> maps = dao.sqlFindListMap(sysql);
// maps = [{"a":1,"b":2,"d":3},{"a":11,"b":22,"d":33},{"a":111,"b":222,"d":333}]
```

### 不支持功能

因为本工具包不要求注册数据结构,因此无法自动推断字段属于哪张表,所有的字段必须只用前缀标记所属表名.


### 注意事项 

* 暂无

