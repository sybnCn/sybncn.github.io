---
layout: post
title:  "sybn sql 与 spark sql 的对比"
categories: sybn-core
tags:  sybn-core dao sql 0.1.11
author: sybn
---

* content
{:toc}

## 简介

sybn util 中关于 使用 sql 查询各个数据库的业务,暂时命名为 sybn sql.

目前主要是 SqlDdlDao 和 SqlDdlStreamDao ,及其在各个数据库的实现.

包括: MongoDao / MongoStreamDao, SolrDao, HBasesDao / HabseStreamDao, DbutilDao(sql), DatasSqlDdlEngine / DatasSqlDdlStreamEngine 等.





### sybn sql 与 spark sql 的相同点

- 将业务逻辑 sql 化,提高易用性和可读性.
- 不用写很多代码,通过 sql 语句能以比较易读的方式实现复杂业务.
- 可以自定义 udaf 扩展功能.
- sybn sql 已经支持运行在 spark 环境中. (V:0.1.11)

### sybn sql 与 spark sql 的不同点

- sybn sql 支持sql特性比较简单,目前仅支持 select, from, where, group by, having, order by, limit 关键字, 正在努力将 left join 相关工具类集成进来.
- sybn sql 的学习成本更低, 没有 RDD, Dataset 等专有概念需要提前学习, 输入输出是 java 的 List 或 Stream.
- sybn sql 使用起来更加简单, 不需要提前注册, 不需要 StructType 即可对任意 List<Map> 或 List<JavaBean> 执行 sql 语句.

