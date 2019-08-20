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

这个驱动目前只支持 select 查询, 计划支持 show table 等查询.

因为 SqlDdlDao 短期内暂不考虑支持使用 sql 修改数据, 所以 SybnDaoDriver 短期内也不支持.






##  jdbc demo

* jdbc 驱动直接查询 mongodb 3.6

```java
String url = "jdbc:mongo://127.0.0.1:27017/junit_test";
Map<String, String> n = MB.n("username", "junit_test_user", "password", "junit_test_pass");
Properties properties = new SybnProperties(n);
Connection connect = new SybnDaoDriver().connect(url, properties);

String sql = "select * from sybn_junit_crud_test_entry limit 1";
PreparedStatement preparedStatement = connect.prepareStatement(sql);
ResultSet resultSet = preparedStatement.executeQuery();
List<Map<String, Object>> handle = HandlerUtil.MAP_LIST_HANDLER.handle(resultSet);
LogUtil.info(handle.size(), handle);
```

* 执行日志

```
08-20 18:47:12.248 [main] INFO  org.mongodb.driver.cluster - Cluster created with settings {hosts=[127.0.0.1:27017], mode=SINGLE, requiredClusterType=UNKNOWN, serverSelectionTimeout='30000 ms', maxWaitQueueSize=5000}
08-20 18:47:12.442 [main] INFO  org.mongodb.driver.cluster - Cluster description not yet available. Waiting for 30000 ms before timing out
08-20 18:47:12.452 [cluster-ClusterId{value='5d5bcfb0a68e9e197f352fbd', description='null'}-127.0.0.1:27017] INFO  org.mongodb.driver.connection - Opened connection [connectionId{localValue:1, serverValue:33}] to 127.0.0.1:27017
08-20 18:47:12.467 [cluster-ClusterId{value='5d5bcfb0a68e9e197f352fbd', description='null'}-127.0.0.1:27017] INFO  org.mongodb.driver.cluster - Monitor thread successfully connected to server with description ServerDescription{address=127.0.0.1:27017, type=STANDALONE, state=CONNECTED, ok=true, version=ServerVersion{versionList=[3, 6, 13]}, minWireVersion=0, maxWireVersion=6, maxDocumentSize=16777216, logicalSessionTimeoutMinutes=30, roundTripTimeNanos=10774292}
08-20 18:47:12.810 [main] INFO  org.mongodb.driver.connection - Opened connection [connectionId{localValue:2, serverValue:34}] to 127.0.0.1:27017
08-20 18:47:13.321 [main] INFO  cn.sybn.util.base.log.ConverToLogEnginePool - register ConverToLogEngineInterface:
08-20 18:47:13.957 [main] INFO  cn.sybn.util.base.LogUtil - 1 [{"msg":"commonSaveOrReplace","date":"2019-08-20 18:14:01","_id":"9999","type":0,"num":9999}]
```

## dataSource demo

* 通过 dataSource 指定驱动包名查询 mongodb 3.6

```java
String url = "jdbc:mongo://127.0.0.1:27017/junit_test";
BasicDataSource dataSource = new BasicDataSource();
dataSource.setDriverClassName("cn.sybn.util.io.driver.SybnDaoDriver");
dataSource.setUrl(url);
dataSource.setUsername("junit_test_user");
dataSource.setPassword("junit_test_pass");
Connection connect = dataSource.getConnection();

String sql = "select * from sybn_junit_crud_test_entry limit 1";
PreparedStatement preparedStatement = connect.prepareStatement(sql);
ResultSet resultSet = preparedStatement.executeQuery();
List<Map<String, Object>> handle = HandlerUtil.MAP_LIST_HANDLER.handle(resultSet);
LogUtil.info(handle.size(), handle);
```

* 执行日志

```
08-20 18:36:20.043 [main] INFO  org.mongodb.driver.cluster - Cluster created with settings {hosts=[127.0.0.1:27017], mode=SINGLE, requiredClusterType=UNKNOWN, serverSelectionTimeout='30000 ms', maxWaitQueueSize=5000}
08-20 18:36:20.237 [main] INFO  org.mongodb.driver.cluster - Cluster description not yet available. Waiting for 30000 ms before timing out
08-20 18:36:20.268 [cluster-ClusterId{value='5d5bcd2466b9414025b4ec99', description='null'}-127.0.0.1:27017] INFO  org.mongodb.driver.connection - Opened connection [connectionId{localValue:1, serverValue:31}] to 127.0.0.1:27017
08-20 18:36:20.280 [cluster-ClusterId{value='5d5bcd2466b9414025b4ec99', description='null'}-127.0.0.1:27017] INFO  org.mongodb.driver.cluster - Monitor thread successfully connected to server with description ServerDescription{address=127.0.0.1:27017, type=STANDALONE, state=CONNECTED, ok=true, version=ServerVersion{versionList=[3, 6, 13]}, minWireVersion=0, maxWireVersion=6, maxDocumentSize=16777216, logicalSessionTimeoutMinutes=30, roundTripTimeNanos=7495325}
08-20 18:36:20.581 [main] INFO  org.mongodb.driver.connection - Opened connection [connectionId{localValue:2, serverValue:32}] to 127.0.0.1:27017
08-20 18:36:21.061 [main] INFO  cn.sybn.util.base.log.ConverToLogEnginePool - register ConverToLogEngineInterface:
08-20 18:36:21.546 [main] INFO  cn.sybn.util.base.LogUtil - 1 [{"msg":"commonSaveOrReplace","date":"2019-08-20 18:14:01","_id":"9999","type":0,"num":9999}]
```

## 相关页面
- [本工具对于sql规范的支持说明]({{site.baseurl}}/2019/06/06/sql-standard/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)

