---
layout: post
title:  "jdbc-driver"
categories: jdbc
tags: jdbc about sql 0.3.4
author: sybn
---

* content
{:toc}

## 介绍

SybnDaoDriver 可以作为 mongo, solr. hbase 的 jdbc 简易驱动使用.

SybnDaoDriver 是 SqlDdlDao 的封装类, 支持 SqlDdlDao 的所有 sql 特性.

SybnDaoDriver 目前只支持 select, show tables 等查询.

因为 SqlDdlDao 短期内暂不考虑支持使用 sql 修改数据, 所以 SybnDaoDriver 短期内也不支持.






##  jdbc demo

* jdbc 驱动直接查询 mongodb 3.6

```java
String url = "jdbc:mongo://127.0.0.1:27017/junit_test";
BasicDataSource dataSource = new BasicDataSource();
dataSource.setDriverClassName("cn.sybn.util.io.driver.SybnDaoDriver");
dataSource.setUrl(url);
dataSource.setUsername("junit_test_user");
dataSource.setPassword("junit_test_pass");
Connection connect = dataSource.getConnection();

String selectSql = "select * from sybn_junit_crud_test_entry where type = ? limit 1";
PreparedStatement selectStatement = connect.prepareStatement(selectSql);
selectStatement.setInt(1, 0); // type = 0
ResultSet selectResultSet = selectStatement.executeQuery();
List<Map<String, Object>> select = HandlerUtil.MAP_LIST_HANDLER.handle(selectResultSet);
LogUtil.info("select", select.size(), select);

String showTablesSql = "show tables";
PreparedStatement showTablesStatement = connect.prepareStatement(showTablesSql);
ResultSet showTablesResultSet = showTablesStatement.executeQuery();
List<Map<String, Object>> showTables = HandlerUtil.MAP_LIST_HANDLER.handle(showTablesResultSet);
LogUtil.info("showTables", showTables.size(), showTables);
```

* 执行日志

```
08-20 20:30:12.925 [main] INFO  org.mongodb.driver.connection - Opened connection [connectionId{localValue:2, serverValue:50}] to 127.0.0.1:27017
08-20 20:30:13.397 [main] INFO  cn.sybn.util.base.log.ConverToLogEnginePool - register ConverToLogEngineInterface:
08-20 20:30:13.866 [main] INFO  cn.sybn.util.base.LogUtil - select 1 [{"msg":"commonSaveOrReplace","date":"2019-08-20 18:14:01","_id":"9999","type":0,"num":9999}]
08-20 20:30:13.874 [main] INFO  cn.sybn.util.base.LogUtil - showTables 4 [{"Tables_in_junit_test":"junit_test_save"},{"Tables_in_junit_test":"sybn_junit_data"},{"Tables_in_junit_test":"sybnJunitTestStringIdEntity"},{"Tables_in_junit_test":"sybn_junit_crud_test_entry"}]
```

## dataSource demo

* 通过 dataSource 指定驱动包名查询 mongodb 3.6

```java
String url = "jdbc:mongo://127.0.0.1:27017/junit_test";
Map<String, String> n = MB.n("username", "junit_test_user", "password", "junit_test_pass");
Properties properties = new SybnProperties(n);
Connection connect = new SybnDaoDriver().connect(url, properties);

String selectSql = "select * from sybn_junit_crud_test_entry where type = ? limit 1";
PreparedStatement selectStatement = connect.prepareStatement(selectSql);
selectStatement.setInt(1, 0); // type = 0
ResultSet selectResultSet = selectStatement.executeQuery();
List<Map<String, Object>> select = HandlerUtil.MAP_LIST_HANDLER.handle(selectResultSet);
LogUtil.info("select", select.size(), select);

String showTablesSql = "show tables";
PreparedStatement showTablesStatement = connect.prepareStatement(showTablesSql);
ResultSet showTablesResultSet = showTablesStatement.executeQuery();
List<Map<String, Object>> showTables = HandlerUtil.MAP_LIST_HANDLER.handle(showTablesResultSet);
LogUtil.info("showTables", showTables.size(), showTables);
```

* 执行日志

```
08-20 20:35:46.616 [main] INFO  org.mongodb.driver.connection - Opened connection [connectionId{localValue:2, serverValue:52}] to 127.0.0.1:27017
08-20 20:35:47.202 [main] INFO  cn.sybn.util.base.log.ConverToLogEnginePool - register ConverToLogEngineInterface:
08-20 20:35:47.717 [main] INFO  cn.sybn.util.base.LogUtil - select 1 [{"msg":"commonSaveOrReplace","date":"2019-08-20 18:14:01","_id":"9999","type":0,"num":9999}]
08-20 20:35:47.727 [main] INFO  cn.sybn.util.base.LogUtil - showTables 4 [{"Tables_in_junit_test":"junit_test_save"},{"Tables_in_junit_test":"sybn_junit_data"},{"Tables_in_junit_test":"sybnJunitTestStringIdEntity"},{"Tables_in_junit_test":"sybn_junit_crud_test_entry"}]
```

## 相关页面
- [本工具对于sql规范的支持说明]({{site.baseurl}}/2019/06/06/sql-standard/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)

