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





### 使用样例 (将 mongo 和 habse 表 join 在一起， 并写回 mongo)

* 从数据库中查询2个list,并将其join为一个.

```java
// 可以在静态类里存放每一个dao， SqlDdlStreamDao 接口为只读接口， SybnStreamDao接口为读写接口
SqlDdlStreamDao leftDao = new HbaseDaoStreamImpl("leftDao", "hbase://server_1:2121,server_2:2121/");
SybnStreamDao rightDao = new MongoDaoStreamImpl("rightDao", "mongo://username:password@127.0.0.1:27017");

// left 有三个字段: id,a,b
List<Map<String, Object>> left = leftDao.sqlFindListMap("select id, a, b from left where a > 0");
// right 有三个字段: id,left_id,c
List<Map<String, Object>> right = rightDao.sqlFindListMap("select id, left_id, c from right where c > 0");
// join 后 left 有五个字段: id,a,b,right_id,c
List<Map<String, Object>> res = DatasLeftJoinUtil.join(left, right, "join right(id as right_id, c) on left.id = right.left_id");

// 将处理后的数据持久化
rightDao.commonSaveAll("save_table_name", res)
```

* 从数据库中查询 stream 和 list,并将其join为一个 stream.

```java
// 可以在静态类里存放每一个dao SqlDdlStreamDao 接口为只读接口， SybnStreamDao接口为读写接口
SqlDdlStreamDao leftDao = new HbaseDaoStreamImpl("leftDao", "hbase://server_1:2121,server_2:2121/");
SybnStreamDao rightDao = new MongoDaoStreamImpl("rightDao", "mongo://username:password@127.0.0.1:27017");

// left 有三个字段: id,a,b
Stream<Map<String, Object>> left = leftDao.sqlFindStreamMap("select id, a, b from left where a > 0");
// right 有三个字段: id,left_id,c
List<Map<String, Object>> right = rightDao.sqlFindListMap("select id, left_id, c from right where c > 0");
// join 后 left 有五个字段: id,a,b,right_id,c
Stream<Map<String, Object>> res = DatasLeftJoinStreamUtil.join(left, right, "join right(id as right_id, c) on left.id = right.left_id");

// 将处理后的数据持久化
rightDao.commonSaveStream("save_table_name", res)
```


### 参数说明

> DatasLeftJoinUtil.join(left, right, "join right(id as right_id, c) on left.id = right.left_id")

* left
 被 join 的左表， 可以是 list 或者 stream， 可以是 Map 即将支持 java bean。
 
* right 
 用于 join 的右表，可以是 list 或者 Map， 暂不支持 stream。
 
* joinConfig = "join right(id as right_id, c) on left.id = right.left_id"

 join 条件， 由 4 部分组成：
``` sql 
   join right(id as right_id, c) on left.id = right.left_id
-- AAAA BBBBB CCCCCCCCCCCCCCCCC  DDDDDDDDDDDDDDDDDDDDDDDDDD

# AAAA
 join 方式目前还没有写 left join, right join 等 join 方式， 将来会支持。
 目前的 join 方式为 lookup， 将右表的每一条匹配数据都 join 一次， 结果互相覆盖。
 
# BBBB
 join 方式， 目前只支持 right， 其他方式未实现。
 right 方式表示 join 会保留左表的所有字段， 并将右表中括号里的CCCC字段 join 到左表中返回。
 
# CCCC
 join 字段， 支持 join 左右表的数据到左表， 支持 as， 支持 udf 函数。
 
# DDDD
 join on 策略， 指定左表哪些字段与右表哪些字段匹配， 多个条件 AND 分开。 支持 using 关键字。
 比如： on left.a = right.c AND left.b = right.b
 注意： 如果左右表字段类型不一致， 比如： 左表是 int 右表是 String ， 本工具类会尝试转换格式后再 join， 大多数情况可以得到正常的结果， 但是要消耗额外的性能。
 提示： 某些情况下可能需要 join 数据做一些简单加工， 可以尝试 on left.id = right.trim(b), 但此特性不保证向后兼容， 未来计划改为： on left.id = trim(right.b)
 未尽事宜： 咱不支持 join 中加常量比较， 外来会支持。 比如：  on left.a = right.c AND right.b > 0 
 
```


### 性能优化

某些场景下， DatasLeftJoinUtil 可以大幅优化性能，在这里提供优化方式。

* 缓存右表

某些右表会反复被相同的左表 join， 此时可以使用 GroupCacheList 包装右表，提高 join 的性能。

```java
List<Map<String, Object>> right = ... ;
// 开启右表 grup 缓存
List<Map<String, Object>> rightCache = new GroupCacheList<>(right)
```



### 未尽事宜

* 暂不支持 left join, right join 等标识, 近期计划支持.

* 暂不支持 stream join stream , 近期计划支持排序后的 stream :

* 暂不支持 join on 中添加比较条件, 近期计划支持.

* 暂不支持标准 sql 的 join 语法, 短期内暂不实现. 


### 注意事项 

* 暂无
- [sql查询接口]({{site.baseurl}}/2018/04/24/sql-ddl-dao/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- [CrudQueryCommonDao / CrudQueryCommonStreamDao 通用查询接口]({{site.baseurl}}/2018/03/28/crud-query-common-dao/)
- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)
- [在线测试]({{site.baseurl}}/2019/07/25/web-sql/)
