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

如需修改数据,可以使用 SqlDdlDao 中的 commonSave 和 commonUpdate 等方法.






## maven 依赖

```xml
<dependency>
    <groupId>cn.linpengfei.sybnutil</groupId>
    <artifactId>sybn-jdbc-driver</artifactId>
    <version>0.3.4-SNAPSHOT</version>
</dependency>
```

##  jdbc demo

* jdbc 驱动直接查询 mongodb 3.6

```java
String url = "jdbc:mongo://127.0.0.1:27017/junit_test";
Map<String, String> n = MB.n("user", "junit_test_user", "password", "junit_test_pass");
Properties properties = new SybnProperties(n);
Connection connect = new SybnDaoDriver().connect(url, properties);

String selectSql = "select * from sybn_junit_crud_test_entry where type = ? limit 1";
PreparedStatement selectStatement = connect.prepareStatement(selectSql);
selectStatement.setInt(1, 0); // type = 0
ResultSet selectResultSet = selectStatement.executeQuery();
List<Map<String, Object>> select = HandlerUtil.MAP_LIST_HANDLER.handle(selectResultSet);
selectResultSet.close();
LogUtil.info("select", select.size(), select);
```

* 执行日志

```
08-20 20:30:12.925 [main] INFO  org.mongodb.driver.connection - Opened connection [connectionId{localValue:2, serverValue:50}] to 127.0.0.1:27017
08-20 20:30:13.866 [main] INFO  cn.sybn.util.base.LogUtil - select 1 [{"msg":"commonSaveOrReplace","date":"2019-08-20 18:14:01","_id":"9999","type":0,"num":9999}]
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

String selectSql = "select * from sybn_junit_crud_test_entry where type = ? limit 1";
PreparedStatement selectStatement = connect.prepareStatement(selectSql);
selectStatement.setInt(1, 0); // type = 0
ResultSet selectResultSet = selectStatement.executeQuery();
List<Map<String, Object>> select = HandlerUtil.MAP_LIST_HANDLER.handle(selectResultSet);
selectResultSet.close();
LogUtil.info("select", select.size(), select);
```

* 执行日志

```
08-20 20:35:46.616 [main] INFO  org.mongodb.driver.connection - Opened connection [connectionId{localValue:2, serverValue:52}] to 127.0.0.1:27017
08-20 20:35:47.717 [main] INFO  cn.sybn.util.base.LogUtil - select 1 [{"msg":"commonSaveOrReplace","date":"2019-08-20 18:14:01","_id":"9999","type":0,"num":9999}]
```

## 数据源支持

* 目前已支持以下数源据:

```
jdbc:mysql://127.0.0.1:3306/db
jdbc:mongo://127.0.0.1:27017/db
jdbc:solr://127.0.0.1:8983/solr
jdbc:hbase://127.0.0.1:2181
```

* 即将支持文件数据源,直接将文件当作数据库查询:

> 直接访问以下任意格式的磁盘文件(支持读取jar包内外的文件,只允许读取白名单中的目录)

```
jdbc:file://home/user/xxx.xls?startRows=2
jdbc:file://home/user/xxx.xlsx?startRows=2
jdbc:file://home/user/xxx.csv?chatset=GBK
jdbc:file://home/user/xxx.json?root=data
```

> 直接访问以下任意格式的http请求结果(只允许读取白名单中的url)

```
jdbc:http://home/user/xxx.xls?startRows=2
jdbc:http://home/user/xxx.xlsx?startRows=2
jdbc:ftp://home/user/xxx.csv?chatset=GBK
jdbc:https://home/user/xxx.json?root=data
```


## 相关页面
- [本工具对于sql规范的支持说明]({{site.baseurl}}/2019/06/06/sql-standard/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)

