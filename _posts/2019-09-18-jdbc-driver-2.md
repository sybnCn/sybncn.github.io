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

因为 SqlDdlDao 短期内暂不考虑支持数据修改, 所以 SybnDaoDriver 短期内也不支持.






##  jdbc demo

* jdbc 驱动直接查询 mongodb 3.6

```java
String url = "jdbc:mongo://127.0.0.1:27017/junit_test";
Properties properties = new SybnProperties(MB.n("username", "junit_test_user", "password", "junit_test_pass"));
Connection connect = new SybnDaoDriver().connect(url, properties);

PreparedStatement preparedStatement = connect.prepareStatement("select * from sybn_junit_crud_test_entry limit 1");
ResultSet resultSet = preparedStatement.executeQuery();
List<Map<String, Object>> handle = HandlerUtil.MAP_LIST_HANDLER.handle(resultSet);
LogUtil.info(handle.size(), handle);
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
PreparedStatement preparedStatement = connect.prepareStatement("select * from sybn_junit_crud_test_entry limit 1");
ResultSet resultSet = preparedStatement.executeQuery();
List<Map<String, Object>> handle = HandlerUtil.MAP_LIST_HANDLER.handle(resultSet);
LogUtil.info(handle.size(), handle);
```


## 相关页面
- [本工具对于sql规范的支持说明]({{site.baseurl}}/2019/06/06/sql-standard/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)

