---
layout: post
title:  "SqlDdlDao 对于 sql 标准的支持"
categories: about
tags:  about sybn-util sql
author: sybn
---

* content
{:toc}

## 简介
常有人问起, 我的 SqlDdlDao 工具类对于 sql 规范的支持版本和支持程度.

因此, 在这里对 sql 规范的支持版本和程度做一下简单的归纳.




## sql规范

下面是SQL发展的简要历史：

* 1986年，ANSI X3.135-1986，ISO/IEC 9075:1986，SQL-86

* 1989年，ANSI X3.135-1989，ISO/IEC 9075:1989，SQL-89

* 1992年，ANSI X3.135-1992，ISO/IEC 9075:1992，SQL-92（SQL2）

* 1999年，ISO/IEC 9075:1999，SQL:1999（SQL3）

* 2003年，ISO/IEC 9075:2003，SQL:2003

* 2008年，ISO/IEC 9075:2008，SQL:2008

* 2011年，ISO/IEC 9075:2011，SQL:2011

其中比较重要的标准是 SQL-92, 因此这里会专门讨论 SqlDdlDao 对于这个标准中的内容的支持程度.

参考链接: https://blog.csdn.net/BeiiGang/article/details/43194453


## SQL92查询特性支持列表

> SqlDdlDao 目前只是一个查询工具, 因此基于SQL语句的增删改基本上都没有实现, 但提供写入和更新数据的 java 方法.

* 查询语句

查询语句|支持程度
-:|:-
SELECT|支持
FROM table / FROM (select ...)|支持
WHERE / WHERE a in (select ...)|支持
GROUP BY|支持
HAVING|支持
ORDER BY|支持
SKIP / LIMIT|支持
JOIN|非标准支持
ON|支持
USING|支持
USE|不支持
SHOW DATDBASES|非标准支持
SHOW TABLES|非标准支持
SET @a:=1; where a>@a|支持
UNION / UNOIN ALL|支持
DISTINCT|支持
CASE WHEN ELSE END|支持

* 数据类型

数据类型|支持程度
-:|:-
CHAR(n) / CHARACTER(n)|支持
VARCHAR(n) / VARCHAR2(n)|支持
CHARACTER VARYING(n) |支持
INTEGER / INT / SMALLINT|支持
DECIMAL(p,s) / DEC(p,s) / NUMERIC(p,s) / FLOAT(p) / REAL|支持
DOUBLE PRECISION|支持
DATE / datetime / timestamp |支持
TIME|未评估
INTERVAL year-month|未评估
INTERVAL day|未评估
BOOLEAN|支持
BLOB|未评估

* 条件
 
 条件|支持程度
-:|:-
< > <= >= <> =|支持
AND OR NOT|支持
IS [NOT] NULL|支持
[NOT] LIKE|支持
[NOT] IN ( [,...] )|支持
[NOT] BETWEEN x AND y|支持
[conditional] ANY ( [,...] )|不支持
[conditional] ALL ( [,...] )|不支持
 
* 函数

 函数|支持程度
-:|:-
AVG / MAX / MIN / SUM / COUNT|支持
GREATEST / LEAST(x,y,...)|支持
ROUND / TRUNC(x,places/date,format)|不支持
POSITION(s1 IN s2)|不支持
EXTRACT(datetime FROM datetime_value)|支持
CHAR_LENGTH(s1) / LENGTH(s1)|支持
SUBSTRING(string FROM start [FOR length]) / SUBSTR(string,start,length)|部分支持
INSTR(str,substr,start,mnth)|不支持
INITCAP|支持
UPPER / LOWER(string)|支持
TRIM(BOTH/LEADING/TRAILING char FROM string)|支持
[L/R]TRIM(str,chrset)|支持
TRANSLATE / CONVERT(char USING value) / TRANSLATE(str,from,to)|部分支持
[L/R]PAD(str,to_len,str2)|支持
DECODE(expr,search1,result1,...[,default])|不支持
NVL(expr,replace)|支持
Date Format - ROUND/TRUNC/TO_CHAR/TO_DATE(value,fmt)|部分支持

参考链接: https://blog.csdn.net/zhongmengya/article/details/5049025

  
## 近期更新
- 0.3.2 最新稳定版
- 0.3.3 不稳定版, 增强了 join 的能力
- 0.3.4 不稳定版, 增强了 distinct 的能力, 支持纯 mongo 的子查询


## 在线测试

可以用以下链接尝测试执行sql, 其中的  sql 及 json数据 可以随意替换. 也可以使用测试表: sql_demo_table,mongo_demo_table,cinema_info

- [<i class="fa fa-link" aria-hidden="true"></i>在线测试]({{site.baseurl}}/2019/07/25/web-sql/)


## 相关页面
- [sql查询接口]({{site.baseurl}}/2018/04/24/sql-ddl-dao/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- sql查询实现:solr 文档待补
- [sql查询实现:elastic]({{site.baseurl}}/2019/10/24/es-dao/)
- [在线测试]({{site.baseurl}}/2019/07/25/web-sql/)
- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)
- [jdbc-driver]({{site.baseurl}}/2019/08/18/jdbc-driver/)

