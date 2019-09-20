---
layout: post
title:  "数据查询"
categories: about
tags:  mongo-dao sql 0.3.5
author: sybn
---

* content
{:toc}

## 简介

mongo dao 提供简便的 mongo 数据库操作 ORM， 支持数据 CRUD 以及 sql 查询.

通过 mongo dao， 没有任何 mongo 基础的开发人员可以将 mongo 直接当作 sql 库来使用, 降低开发成本。

本文主要介绍 mongo 的 sql 查询能力。

```xml
<dependency>
	<groupId>cn.linpengfei.sybnutil</groupId>
	<artifactId>mongo-dao</artifactId>
	<version>0.3.5-SNAPSHOT</version>
</dependency>

<dependency>
    <groupId>cn.linpengfei.sybnutil</groupId>
    <artifactId>sybn-jdbc-driver</artifactId>
    <version>0.3.5-SNAPSHOT</version>
</dependency>
```




#### sql 转 aggregate

mongo 原生不支持 sql 语句查询， mongo 的查询语言为 json 风格的 Aggregate。

我们的 MongoAggregateBuilder 可以把 sql 语句转换为 mongo 的  Aggregate 表达式。

转换后的 Aggregate 表达式可以在任何原生的 mongo 环境中执行， 无需依赖本工具类。

已经为大家准备好了 web 版接口: [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/aggregate.html)

#### 使用 MongoDao 查询 sql 语句

使用 mongo dao 可以直接执行 sql 语句获取数据， 支持返回  List / Stream， 支持指定返回值的类型。

```java
// sql 语句
String sqlFind = "select * from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";
String sqlCount = "select count(*) from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";

// 使用最简单的方法构造 dao 线程安全
SqlDdlDao dao = new MongoDaoImpl("mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/test");

// 执行 sql 查询 List<Map<String, Object>> 格式数据
List<Map<String, Object>> sqlFindListMap = dao.sqlFindListMap(sqlFind);
// 执行 sql 查询 List<bean> 格式数据
List<SybnJunitBase> sqlFindList = dao.sqlFindList(sqlFind, SybnJunitBase.class);
// 执行 sql 查询 Stream<Map<String, Object>> 格式数据
Stream<Map<String, Object>> sqlFindStreamMap = dao.sqlFindStreamMap(sqlFind);
// 执行 sql 查询 Stream<bean> 格式数据
Stream<SybnJunitBase> sqlFindStream = dao.sqlFindStream(sqlFind, SybnJunitBase.class);
// 执行 count
long count = dao.sqlCount(sqlCount);
```

- [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/sql_frame.html?sql=select%20*%20from%20mongo_demo_table%20limit%201%3B)

* 额外支持跨存储引擎联合查询， 比如：sql union mongo

- [===》在线测试《===](http://java.linpengfei.cn:8081/dw-api-sql/sql_frame.html?sql=select%20*%20from%20sql_demo_table%20limit%201%20%0D%0Aunion%20%0D%0Aselect%20*%20from%20mongo_demo_table%20limit%201%3B)

#### 使用 jdbc 查询 mongo

正在测试直接将 mongo 转化为 jdbc 数据源使用， 让使用者与本工具类代码解耦。

```java
// 创建 jdbc 连接
String url = "jdbc:mongo://127.0.0.1:27017/junit_test";
Map<String, String> n = MB.n("user", "junit_test_user", "password", "junit_test_pass");
Properties properties = new SybnProperties(n);
Connection connect = new SybnDaoDriver().connect(url, properties);

// 被执行的 sql
String selectSql = "select * from sybn_junit_crud_test_entry where type = ? limit 1";

// 使用 jdbc 执行此 sql
PreparedStatement selectStatement = connect.prepareStatement(selectSql);
selectStatement.setInt(1, 0); // type = 0
ResultSet selectResultSet = selectStatement.executeQuery();
List<Map<String, Object>> select = HandlerUtil.MAP_LIST_HANDLER.handle(selectResultSet);
selectResultSet.close();

// 打印结果
LogUtil.info("select", select.size(), select);
```


## 相关页面
- [sql查询接口]({{site.baseurl}}/2018/04/24/sql-ddl-dao/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- [CrudQueryCommonDao / CrudQueryCommonStreamDao 通用查询接口]({{site.baseurl}}/2018/03/28/crud-query-common-dao/)
- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)
- [在线测试]({{site.baseurl}}/2019/07/25/web-sql/)
