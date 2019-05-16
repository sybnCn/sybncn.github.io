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
- Java对象工具(比如:使用sql语句查询list，各种类型的对象互相转换)
- 数据库工具(sql/mongodb/sorl/HBase/redis)
- 其他工具（比如excel/csv导出）

准备借鉴的开源项目
- [hutool](https://gitee.com/loolly/hutool)
- Javatuples
- solr jdbc driver



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

## 数据库工具
- dbutiil-dao 项目
  - 实现了 CrudQueryCommonDao 接口
- mongo-dao 项目
  - 实现了 CrudQueryCommonDao 接口
- solr-dao 项目
  - 实现了 CrudQueryCommonDao 接口
- hadoop-dao 项目
  - 即将实现 CrudQueryCommonDao 接口
- redis-dao 项目
  - 未实现  CrudQueryCommonDao 接口

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
- 0.2.6 在 mongodb 中支持 count(a) 和 count(distinct a) 只统计非 null 结果,使之与 mysql 的执行效果一致.
- 0.2.5 支持在 sql 中使用 mybatis 占位符.
- 0.2.4 更新读写 excel 文件的工具类,方便使用 sql 语句读写 excel 中的数据.
