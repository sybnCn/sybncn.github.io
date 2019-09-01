---
layout: post
title:  "DatasJoinUtil"
categories: tools
tags:  sybn-core join 0.3.5
author: sybn
---

* content
{:toc}

## 简介

DatasJoinUtil 支持 list / stream 互相 join 操作. 其语法和效果类似与 sql 的 join .





### 使用样例

* 从数据库中查询2个list,并将其join为一个.

```java
// 可以在静态类里存放每一个dao
SqlDdlDao leftDao = new HbaseDaoImpl("leftDao", "hbase://server_1:2121,server_2:2121/");
SqlDdlDao rightDao = new MongoDaoImpl("rightDao", "mongo://username:password@127.0.0.1:27017");

// left 有三个字段: id,a,b
List<Map<String, Object>> left = leftDao.sqlFindListMap("select id, a, b from left where a > 0");
// right 有三个字段: id,left_id,c
List<Map<String, Object>> right = rightDao.sqlFindListMap("select id, left_id, c from right where c > 0");
// join 后 left 有五个字段: id,a,b,right_id,c
List<Map<String, Object>> res = DatasLeftJoinUtil.join(left, right, "join right(id as right_id, c) on left.id = right.left_id");
```


* 从数据库中查询 stream 和 list,并将其join为一个 stream.

```java
// 可以在静态类里存放每一个dao
SqlDdlStreamDao leftDao = new HbaseDaoStreamImpl("leftDao", "hbase://server_1:2121,server_2:2121/");
SqlDdlDao rightDao = new MongoDaoImpl("rightDao", "mongo://username:password@127.0.0.1:27017");

// left 有三个字段: id,a,b
Stream<Map<String, Object>> left = leftDao.sqlFindStreamMap("select id, a, b from left where a > 0");
// right 有三个字段: id,left_id,c
List<Map<String, Object>> right = rightDao.sqlFindListMap("select id, left_id, c from right where c > 0");
// join 后 left 有五个字段: id,a,b,right_id,c
Stream<Map<String, Object>> res = DatasLeftJoinStreamUtil.join(left, right, "join right(id as right_id, c) on left.id = right.left_id");
```

### 未尽事宜

* 暂不支持 left join, right join 等标识, 近期计划支持.

* 暂不支持 stream join stream , 近期计划支持排序后的 stream :

* 暂不支持 join on 中添加比较条件, 近期计划支持.

* 暂不支持标准 sql 的 join 语法, 短期内暂不实现. 


### 注意事项 

* 暂无

- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)
- [在线测试]({{site.baseurl}}/2019/07/25/web-sql/)
