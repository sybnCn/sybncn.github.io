---
layout: post
title:  "SybnQuery - 动态查询实体"
categories: sybn-core
tags:  sybn-core dao mongo solr sql 0.1.9
author: sybn
---

* content
{:toc}

## 简介
SybnQuery 属于 [sybn-core 项目]({{site.baseurl}}/2018/03/28/sybn-core/)

动态的查询对象,借鉴于 hibernate / spring jpa 中的动态查询对象.用于动态构建查询，并用于读写不同数据库。
* 相当于sql语句的where部分,可以存储and/or等逻辑条件和大于小于等于,between,like,in等对比的条件.
* 目前已经支持用其读写 mysql, mongodb, solr, hbase 数据库,并已支持整合到 spring data / hibernate jpa 的查询框架.

![]({{site.baseurl}}/images/sybn_query_2.png)



### 创建查询 v:0.1.9
可以使用如下方式创建 SybnQuery:
```java
// 直接创建 一个 query
SybnQuery<?> q1 = SybnQuery.newSybnQuary();
q1.eq("id", 1);
q1.ne("type", 0);
q1.gtelte("day", "2018-01-01", "2018-04-19");
q1.like("name", "aaa");

// 从请求参数中生成一个query
Map<String, String> request = new HashMap<>();
request.put("id@eq@i", "1"); // @i表示value是int
request.put("type@ne@i", "0");
request.put("day@gl", "2018-01-01~2018-04-19");
request.put("name@like", "aaa");
SybnQuery<?> q2 = SybnQueryMapBuilder.newQuery(request);

// 直接用sql语句生成一个query
SybnQuery<?> q2 = SybnQueryStringFactory.newQuery("id == 1 and type != 0 and day between '2018-01-01' and '2018-04-19' and name like '%aaa%'");
      
// 对比三个查询,应该完全一致
Assert.assertEquals(q1, q2);
Assert.assertEquals(q1, q3);

// `id` = 1 AND `type` <> 0 AND `day` BETWEEN '2018-01-01' AND '2018-04-19' AND `name` LIKE '%aaa%'
LogUtil.info(q1.toSqlWhere());
Assert.assertEquals(q1.toSqlWhere(), q2.toSqlWhere());
Assert.assertEquals(q1.toSqlWhere(), q3.toSqlWhere());

// `id` = ? AND `type` <> ? AND `day` BETWEEN ? AND ? AND `name` LIKE ?
LogUtil.info(q1.toPsWhere());
Assert.assertEquals(q1.toPsWhere(), q2.toPsWhere());
Assert.assertEquals(q1.toPsWhere(), q3.toPsWhere());

```
> 注：因为 Map 可能是无序的， SybnQueryMapBuilder 内置的查询优化器会自动将 in 和 like 等查询条件放在靠后位置
>
> 其他方式构造的 SybnQuery 则使用传入数据的顺序

> 注：0.1.8 的 SybnQueryStringFactory 无法正确处理  BETWEEN 后面的 AND 造成报错
> 
> 此 bug 在 0.1.9 中已经修复


> 注：不论使用那种方式， 构造单个值的 in 查询和构造首尾值相同的 between 查询， 都会被替换为 == 查询， not in 会被替换为 !=
>
> 例： id between 1 and 1 和  id in (1) 这两种写法，实际上得到的是 id == 1 的效果

### 执行查询 v:0.1.8
可以在不同数据平台执行相同的query:
```java
// 查询条件
String tableName = "sybn_junit_base"; // 被查询的表名
SybnQuery<SybnJunitBase> query = SybnQueryStringFactory.newQuery("id == 1 and type != 0 and name like '%aaa%'", SybnJunitBase.class);
String fields = null; // 需要返回的字段,null表示所有字段
String sort = "id asc"; // 返回时的排序条件,null表示不排序
int skip = 0; // 从第一行开始返回
int limit = 10; // 返回10行数据

// sql
String conf = "jdbc:mysql://账户:密码@192.168.4.31:3306,192.168.4.32:3306/test";
QueryCommonDao dao = new DbutilDaoImpl(conf);
// momgo - MongoDao 看到id相关条件会当做_id处理
String conf = "mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/test";
QueryCommonDao dao = new MongoDaoImpl(conf);
// solr
String conf = "solr://192.168.7.71:2181,192.168.7.72:2181/solr";
QueryCommonDao dao = new SolrDaoImpl(conf);
// hbase - HbaseDao 看到id相关条件会当做row处理
String conf = "hbase://192.168.7.71,192.168.7.72/hbase-unsecure";
QueryCommonDao dao = new HbaseDaoImpl(conf);
// 以上任意一个dao都可以跑通如下代码
long count = dao.queryCount(tableName, query); 
List<Map<String, Object>> mapList = dao.queryListMap(tableName, query, fields, sort, skip, limit);
List<SybnJunitBase> beanList = dao.queryList(tableName, SybnJunitBase.class, query, fields, sort, skip, limit);
long remove = dao.queryRemove(tableName, query);

// spring data jpa / hibernate jpa
Specification<SybnJunitBase> specification = SybnQueryJpaBuilder.create(query);
List<SybnJunitBase> list = customerRepository.findAll(specification);
```
> 注: QueryCommonDao 是 CrudQueryCommonDao 的一部分

## 相关页面
- [CrudQueryCommonDao 通用查询接口]({{site.baseurl}}/2018/03/28/crud-query-common-dao/)
- [group by util 通用聚合引擎]({{site.baseurl}}/2018/04/12/group-by-util/)
