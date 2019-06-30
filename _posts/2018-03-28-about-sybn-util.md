---
layout: post
title:  "关于 sybn util"
categories: about
tags:  about sybn-util
author: sybn
---

* content
{:toc}

## 简介
sybn util 是本人积累的java工具集，其主要包括：
- 数据库工具(联合查询：mysql/mongodb/sorl/HBase/excel/json等)
- 其他工具（各种底层静态工具类）

准备借鉴的开源项目：
- [hutool](https://gitee.com/loolly/hutool)
- Javatuples
- solr jdbc driver

项目依赖，基于最小依赖原则，本项目主要依赖以下内容：
- junit
- apache-common
- slf4j

## 数据库工具
- sybn-core 项目
  为 List/Stream 实现了 SqlDdlDao 接口
  为 聚合查询 实现了 SqlDdlDao 接口，支持聚合查询其他所有 SqlDdlDao 接口
- dbutiil-dao 项目
  为 mysql 实现了 SqlDdlDao 接口
- mongo-dao 项目
  为 mongo 实现了 SqlDdlDao 接口, 并支持子查询
- solr-dao 项目
  为 solr 实现了 SqlDdlDao 接口
- hadoop-dao 项目
  为 HBase实现了 SqlDdlDao 接口

## 基础工具
基础工具是 sybn-core 和 sybn-core-java8 项目，其包括如下主要功能：
- 常用的通用JavaBean sybn-core cn.sybn.bean 包
  - 缓存对象 cache 包
  - 计数器对象 counter 包
  - 实体对象 entry 包
  - 异常对象 exception 包
  - 主函数对象 main 包
  - 返回值对象 result 包
  - 范围对象 scope 包
  - 时间范围对象 times 包
- 独立工具集 sybn-core cn.sybn.singleutil 包

  此包下所有工具没有额外依赖，可以拎出来独立运行。
  默认只依赖如下开源库： slf4j, junit, apache-commons, jackson
  部分测试业务依赖了其他包，但是可以随时删除。
  
- 复杂工具集 sybn-core cn.sybn.util 包
  - 字符串工具 string 包
  - 单对象数据转换 
  - 对象集合数据转换
  - 对象集合 group 成 Map
  - 对象集合 group by 统计 及 fill 补零
  - 任务及日志工具 task包
  - 数据库业务通用包 id.db 包
  - 定义了 SybnQuery 和 CrudQueryCommonDao 接口
- 测试工具集 sybn-core cn.sybn.test 包

## 其他工具
- mail-util
  - 发送邮件
  - 缓存发送邮件
- http-util
  - httpclient 工具
- office-util
  - xls 导出工具
- servlet-util
  - servlet 工具
  
## 近期更新

- 0.3.5 版
1. 重构了 join 实现类, 增加了更多的用法, 降低了对原始数据的影响
2. 重构了 聚合查询实现 提高了性能

- 0.3.4 版
1. 开启 mongo 压缩传输, 提高了性能
2. 支持 mongo / mysql 的 select distinct a from table 语句
3. 支持 mongo 的  select a form (select b from table) 原生嵌套查询, 相比之前的 java 实现提高了性能
