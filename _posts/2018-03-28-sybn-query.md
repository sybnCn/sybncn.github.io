---
layout: post
title:  "SybnQuery - 动态查询实体"
categories: sybn-core
tags:  sybn-core dao entry
author: sybn
---

* content
{:toc}

SybnQuery 属于 [sybn-core 项目](../../../../2018/03/28/sybn-core/)

## SybnQuery - 动态查询实体
用于存储动态的查询条件,类似于hibernate或者spring jpaz中的Query对象.
相当于sql语句的where部分,可以存储and/or等逻辑条件和大约小语等于,between,like,in等查询条件.

目前已经支持用其查询 mysql, mongodb, solr, hbase 数据库,已支持转整合到spring data的查询框架.

### 创建查询
可以使用如下方式创建 SybnQuery:
```java
/**
 * 直接 new 一个 query
 */
SybnQuery<?> q1 = SybnQuery.newSybnQuary();
q1.eq("id", 1);
q1.ne("type", 0);
q1.like("name", "aaa");

/**
 * 从请求参数中生成一个query
 */
Map<String, String> request = new HashMap<>();
request.put("id@eq@i", "1"); // @i表示value是int
request.put("type@ne@i", "0");
request.put("name@like", "aaa");
SybnQuery<?> q2 = SybnQueryMapBuilder.newQuery(request);

/**
 *  对比两个查询,应该完全一致
 */
Assert.assertEquals(q1.toSqlWhere(), q2.toSqlWhere());
Assert.assertEquals(q1, q2);
```

### 执行查询
可以在不同数据平台执行相同的query:
```java
// 查询条件
ybnQuery<SybnJunitBase> query = SybnQuery.newSybnQuary(SybnJunitBase.class);
q1.eq("id", 1);
q1.ne("type", 0);
q1.like("name", "aaa");

String tableName = "sybn_junit_base"; // 被查询的表名
String fields = null; // 需要返回的字段,null表示所有字段
String sort = "id asc"; // 返回时的排序条件,null表示不排序
int skip = 0; // 从第一行开始返回
int limit = 10; // 返回10行数据

// sql
String conf = "jdbc:mysql://账户:密码@192.168.4.31:3306,192.168.4.32:3306/test";
CrudQueryCommonDao sqlDao = new DbutilDaoImpl(conf);
long count = sqlDao.queryCount(tableName, query);
List<Map<String, Object>> mapList = sqlDao.queryListMap(tableName, query, fields, sort, skip, limit);
List<SybnJunitBase> beanList = sqlDao.queryList(tableName, SybnJunitBase.class, query, fields, sort, skip, limit);

// momgo
String conf = "mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/test";
CrudQueryCommonDao mongoDao = new MongoDaoImpl(conf);
long count = mongoDao.queryCount(tableName, query); // mongo 看到id相关条件,会当做_id处理
List<Map<String, Object>> mapList = mongoDao.queryListMap(tableName, query, fields, sort, skip, limit);
List<SybnJunitBase> beanList = mongoDao.queryList(tableName, SybnJunitBase.class, query, fields, sort, skip, limit);

// solr
String conf = "solr://192.168.7.71:2181,192.168.7.72:2181/solr";
CrudQueryCommonDao solrDao = new SolrDaoImpl(conf);
long count = solrDao.queryCount(tableName, query);
List<Map<String, Object>> mapList = solrDao.queryListMap(tableName, query, fields, sort, skip, limit);
List<SybnJunitBase> beanList = solrDao.queryList(tableName, SybnJunitBase.class, query, fields, sort, skip, limit);

// hbase
String conf = "hbase://192.168.7.71,192.168.7.72/hbase-unsecure";
HbaseDao hbaseDao = new HbaseDaoImpl(conf);// HbaseDao 目前尚未完全实现CrudQueryCommonDao
long count = hbaseDao.queryCount(tableName", query); // HbaseDao 看到id相关条件会当做row处理
List<Map<String, Object>> mapList = hbaseDao.queryListMap(tableName, query, fields, sort, skip, limit);
List<SybnJunitBase> beanList = hbaseDao.queryList(tableName, SybnJunitBase.class, query, fields, sort, skip, limit);

// spring data
Specification<SybnJunitBase> specification = new SybnSpecification(query);
List<SybnJunitBase> list = customerRepository.findAll(specification); // TODO 尚未完全实现

```

