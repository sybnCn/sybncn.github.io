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

包括: MongoDao / MongoStreamDao, SolrDao, EsDao, HBasesDao / HabseStreamDao, DbutilDao(sql), DatasSqlDdlEngine / DatasSqlDdlStreamEngine 等.





### sybn sql 与 spark sql 的相同点

- 将业务逻辑 sql 化,提高易用性和可读性.
- 不用写太多代码,通过 sql 语句能以比较易读的方式实现复杂业务.
- 可以自定义 udf / udaf 扩展功能.
- sybn sql 支持运行在 spark 环境中. (V:0.1.11)

### sybn sql 与 spark sql 的不同点

- sybn sql 支持sql特性比较简单, 目前仅支持部分 sql 规范内容, 尚未完成对 sql 规范的完全支持.
- sybn sql 使用起来更加简单, 不需要提前注册, 不需要 StructType 即可对任意 List<Map> 或 List<JavaBean> 执行 sql 语句.
- sybn sql 的学习成本更低, 没有 RDD, Dataset 等专有概念需要提前学习, 输入输出是 java 的 List 或 Stream,并有 web gui 可以查询和可视化数据.

![]({{site.baseurl}}/images/api_core2.png)

## 相关页面
- [本工具对于sql规范的支持说明]({{site.baseurl}}/2019/06/06/sql-standard/)