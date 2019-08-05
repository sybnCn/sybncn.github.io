---
layout: post
title:  "sql ddl dao 通用查询引擎"
categories: sql-ddl-dao
tags:  sybn-core dao spring mysql mongo solr HBase 0.3.4
author: sybn
---

* content
{:toc}

## 简介
SqlDdlDao 和 SqlDdlStreamDao 是在各个数据库中执行 sql 操作的接口.

目前已有多种数据库Dao实现了此接口: MongoDao / MongoStreamDao, SolrDao, HBasesDao / HabseStreamDao, DbutilDao(sql)

另外还有用于查询 list 和 Stream 的实现类：SqlDdlDaoListImpl / SqlDdlDaoStreamAsyncImpl

![]({{site.baseurl}}/images/sql_ddl_dao_impl.png)

另外还有针对不同数据库联合查询的实现类: SqlDdlDaoMultipleImpl



## 单库查询样例 v:0.2.6
```java
// sql 语句
String sqlFind = "select * from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";
String sqlCount = "select count(*) from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";

// 1. 以url形式构造不同数据库实例执行查询
// mysql / mongo / solr / HBase 数据量大时, 可以使用 StreamDao 以 Stream 流形式返回数据
SqlDdlDao dao = new DbutilDaoImpl("jdbc:mysql://账户:密码@192.168.4.31:3306,192.168.4.32:3306/demo"); // sql
SqlDdlDao dao = new MongoDaoImpl("mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/demo"); // mongo
SqlDdlDao dao = new SolrDaoImpl("solr://192.168.7.71:2181,192.168.7.72:2181/solr"); // solr
SqlDdlDao dao = new HBaseDaoImpl("hbase://192.168.7.71,192.168.7.72/hbase-unsecure"); // HBase
List<Map<String, Object>> sqlFindListMap = dao.sqlFindListMap(sqlFind);
List<SybnJunitBase> sqlFindList = dao.sqlFindList(sqlFind, SybnJunitBase.class);
long count = dao.sqlCount(sqlCount);

// 2. 直接查询jvm中的数据
List<Map<String, Object>> sqlFindListMap = DatasSqlDdlEngine.sqlFindListMap(list, sqlFind);
List<SybnJunitBase> sqlFindList = DatasSqlDdlEngine.sqlFindList(list, sqlFind, SybnJunitBase.class);
```

> 注意: sql实际上会翻译为各个数据库自己的语言去执行,因此类似于: "where day = now()" 这样带有的 sql 专属函数 "now()" 的语句是不被支持的. 

> 注意：Hbase 的所有条件都是按字符串顺序比较的所以会出现 9 > 10， 在设计数据表时，最好填充0，将9存为000009。

## 常见sql语法支持程度 V:0.2.13

功能|DbutilDao (MySQL)|SolrDao|MongoDao|HBasesDao|DatasSqlDdlEngine (collection / stream)
----:|---|---|---|---|---|---
SELECT|支持|支持|支持|支持|支持
FROM|支持|支持|支持|支持|忽略
WHERE|支持|支持 (区分字段类型)|支持 (区分字段类型)|支持|JAVA实现
GROUP BY|支持|半原生半JAVA|支持|JAVA实现|JAVA实现
HAVING|支持|JAVA实现|支持|JAVA实现|JAVA实现
ORDER BY|支持|支持|支持|支持|JAVA实现
OFFSET|支持|支持|支持|JAVA实现|JAVA实现
LIMIT|支持|支持|支持|JAVA实现|JAVA实现
sum, avg, max ...|支持|支持|支持|JAVA实现|JAVA实现
set, list ...|暂不支持|暂不支持|支持|JAVA实现|JAVA实现
count(distinct x)|支持|支持|支持|JAVA实现|JAVA实现
year, month, hour ...|支持|不支持|支持|暂不支持|暂不支持
(x + y) as calc|支持|JAVA实现|JAVA实现|JAVA实现|JAVA实现
(CASE WHEN ...) as a|支持|JAVA实现|JAVA实现|JAVA实现|JAVA实现
sum(CASE WHEN ...) as a|支持|JAVA实现|JAVA实现|JAVA实现|JAVA实现
? 占位符|支持|支持|支持|支持|支持
mybatis 占位符|支持|支持|支持|支持|支持


## 对于 join 的支持 V:0.3.4

join|右表来自任意数据源的list|右表来自任意数据源的Stream
----:|---|---
左表来自任意数据源的list|支持|支持
左表来自任意数据源的Stream|支持|不支持

- [跨库联合查询用法]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)

## 关于标准 UDF: V:0.3.4
所有 dao 目前已经全局支持在 where 的比较运算符右侧嵌套使用如下 mysql 自带的 UDF 函数：

NOW, CURDATE, TRIM, CAST, UPPER, LOWER, LENGTH, CHAR_LENGTH, INITCAP, TIMESTAMPDIFF, CONVERT, DATE_ADD/ ADDDATE, DATE_SUB / SUNDATE, STR_TO_DATE, DATE_FORMAT, DAYOFWEEK, WEEKDAY, EXTRACT, NVL / IFNULL, GREATEST, LEAST, MD5 等


比如：
``` sql
-- 支持 比较运算符右侧嵌套函数
where play_time_yyyymmdd 
	  between convert(DATE_FORMAT(date_sub(convert(now(), DATE), INTERVAL 30 day), '%Y%m%d'), SIGNED)
	      and convert(DATE_FORMAT(date_sub(convert(now(), DATE), INTERVAL 1 day), '%Y%m%d'), SIGNED)
---等效于
where play_time_yyyymmdd between 20190101 and 20190130
```

* 但是不支持在字段名上牵头UDF，比如：

``` sql
-- 不支持 play_time_yyyymmdd 外面嵌套任何函数
where DATE_FORMAT(play_time_yyyymmdd, '%Y-%m-%d') = '2018-01-16' 
```

* 可以使用如下命令获取最新的支持列表:

```java
Set<String> udfNames = SybnUdfUtil.getUdfNames();
// 截止 2019-07-24 支持的 udf 完整列表为: (不区分大小写) ["toint","compare","upper","topercent","replace","weekday","subdate","convert","curdate","from_days","tofloat","substring","date_sub","toset","cast","trim","todate","now","str_to_date","tolowercase","tolist","ifnull","md5_16","adddate","todouble","concat_ws","nvl","lower","timestampdiff","concat","replaceall","splitsubstring","date_add","tolong","dayofweek","date_format","calc","touppercase","tostring","to_days","md5"]
```


## 关于私有 UDAF:
> * 自定义函数 set 是指将数据转 set 输出(删除重复项)
> * 自定义函数 list 是指将数据转 list 输出
> * 自定义函数 scopelist 是指将数据按时间转 list 输出,一般用于生成折线图,无数据的时间点使用默认值代替
> * 更多自定义函数另行说明

## 关于在内存中对 JAVA 集合类执行 sql 语句:
> 
> DatasSqlDdlEngine / DatasSqlDdlStreamEngine 接收 list/stream，在内存里对其执行 sql.
> 
> 实测 100,000 个 Map/bean 对象 where 查询的性能在 50ms 以内 (前提是sql语句中的字段类型与数据类型一致,否则也可以正确执行,但性能会下降)

> 注意: 
>
> mongodb / solr 对类型敏感,查询 a = 0 和 a = "0" 的效果不一样.
>
> 其他数据库 a = 0 和 a = "0" 的返回值一致,但两种写法有性能差异.


## 常用的构造函数

* 直接使用url构造

```java
SqlDdlDao dao = new DbutilDaoImpl("jdbc:mysql://username:password@192.168.4.31:3306,192.168.4.32:3306/demo"); // sql
SqlDdlDao dao = new MongoDaoImpl("mongodb://username:password@192.168.4.31:27017,192.168.4.32:27017/demo"); // mongo
SqlDdlDao dao = new SolrDaoImpl("solr://192.168.7.71:2181,192.168.7.72:2181/solr"); // solr
SqlDdlDao dao = new HBaseDaoImpl("hbase://192.168.7.71,192.168.7.72/hbase-unsecure"); // HBase
```

* 直接使用url构造, 但是账号密码可以单独写

```java
SqlDdlDao dao = new DbutilDaoImpl("jdbc:mysql://192.168.4.31:3306/demo", "username", "password"); // sql
SqlDdlDao dao = new MongoDaoImpl("mongodb://192.168.4.31:27017/demo", "username", "password", "authDatabase"); // mongo
```

* 直接读取配置文件

```java
SqlDdlDao dao = new DbutilDaoConfImpl("sql.demo@db.properties"); // sql
SqlDdlDao dao = new MongoDaoConfImpl("mongo.demo@db.properties"); // mongo
SqlDdlDao dao = new SolrDaoConfImpl("solr.demo@db.properties"); // solr
SqlDdlDao dao = new HBaseDaoConfImpl("hbase.demo@db.properties"); // HBasemongo
```

以下是db.properties

```
// 所有dao都支持直接使用url构造
sql.demo=jdbc:mysql://username:password@192.168.4.31:3306,192.168.4.32:3306/demo

// 所有mysql/mongo支持使用url构造, 但是账号密码可以单独写
mongo.demo=mongodb://192.168.4.31:27017,192.168.4.32:27017/demo
mongo.demo.username=username
mongo.demo.password=password
mongo.demo.authSource=admin

// 所有等号右边,都支持使用变量
host=127.0.0.1

// solr 支持 solr, http, https 
solr.demo=https://${host}:8983/solr

hbase.demo=hbase://${host}:2181/
```

* 直接传入配置对象 Properties v:0.3.4


```java
// 从 properties 中读取 sql.test 构造dao
Properties properties = new SybnCoreProperties().load("db.properties");
DbutilDao dao2 = new DbutilStreamDaoPropertiesImpl(sybnDbProperties, "test");

SqlDdlDao dao = new DbutilDaoPropertiesImpl(properties, "sql.demo"); // sql
SqlDdlDao dao = new MongoDaoPropertiesImpl(properties, "mongo.demo"); // mongo
SqlDdlDao dao = new SolrDaoPropertiesImpl(properties, "solr.demo"); // solr
SqlDdlDao dao = new HBaseDaoPropertiesImpl(properties, "hbase.demo"); // HBasemongo
```

* 直接使用 spring 的数据源

``` java
@Resource(name="sql_demo") 
DataSource dataSource;

@Resource(name="mongo_demo") 
MongoTemplate mongoTemplate

// ... ...

SqlDdlDao dao = new DbutilDaoImpl("spring_sql", dataSource);
SqlDdlDao dao = new MongoDaoImpl("spring_mongo", mongoTemplate.getDb);
```

## 接口函数

![]({{site.baseurl}}/images/sql_ddl_dao_fun.png)

## 子接口和主要实现类 v:0.3.4

![]({{site.baseurl}}/images/sql_ddl_dao_sub.png)

## 规划
计划支持以下特性：
- sqlRemove(sql) // 未实现

## 相关页面
- [本工具对于sql规范的支持说明]({{site.baseurl}}/2019/06/06/sql-standard/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- sql查询实现:solr 文档待补
- [底层工具:SybnQuery 动态查询实体]({{site.baseurl}}/2018/03/28/sybn-query/)
- [底层工具:CrudQueryCommonDao 通用查询接口]({{site.baseurl}}/2018/03/28/crud-query-common-dao/)
- [底层工具:group by util 通用聚合引擎]({{site.baseurl}}/2018/04/12/group-by-util/)
- [quick-start]({{site.baseurl}}/2019/07/25/quick-start/)
- [在线测试]({{site.baseurl}}/2019/07/25/web-sql/)

