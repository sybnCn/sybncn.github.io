---
layout: post
title:  "SQL语法树"
categories: about
tags:  mongo-dao sql 0.3.5
author: sybn
---

* content
{:toc}

## 简介

sybn dao 收到 sql 语句之后, 需要先将其转换为 SQL 语法树, 然后再将其中的各个节点分别处理.





## SQL语法树结构简图

![]({{site.baseurl}}/images/sql_tree.png)

## 主要节点说明

* 语法树节点分为 树节点 和 页节点

###### 树节点 

* JOIN 查询 SubJoinQueryEntity

* union 聚合查询 SySqlUnionEntity

* 多表查询 MultipleSqlEntity 支持 from 和 where 子查询, 

###### 页节点

* 单表查询 SimpleSqlEntity 等是类型, 仅查询单表, 实际分发给各个数据库的是这个类

## 实际执行

* SqlDdlDaoMultipleImpl 负责所有类型的查询, 并将子查询分发给不同的 dao

* 各个数据库的 dao (sql/mongo/solr/elastic/hbase) 都直接支持执行 SimpleSqlEntity

* mongo dao 支持直接执行带有 from 子查询的 MultipleSqlEntity, 但是不支持 where 子查询

## 相关页面
- [sql查询接口]({{site.baseurl}}/2018/04/24/sql-ddl-dao/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- [sql查询实现:elastic]({{site.baseurl}}/2019/10/24/es-dao/)
- [CrudQueryCommonDao / CrudQueryCommonStreamDao 通用查询接口]({{site.baseurl}}/2018/03/28/crud-query-common-dao/)
- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)
- [在线测试]({{site.baseurl}}/2019/07/25/web-sql/)
