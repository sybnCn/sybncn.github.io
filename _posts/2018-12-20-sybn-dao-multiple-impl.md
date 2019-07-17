---
layout: post
title:  "sybn dao 使用子查询与union"
categories: sql-ddl-dao
tags:  sybn-core dao sql 0.2.20
author: sybn
---

* content
{:toc}

## 简介

标准的 sql 语句中查询嵌套查询和很常见的，但是 sybn dao 默认都只支持单表查询。

为了解决查询嵌套的问题， 准备了专门的 dao 实现： SqlDdlDaoMultipleImpl




### 在线测试

可以用以下链接尝测试执行sql, 其中的  sql 及 json数据 可以随意替换. 也可以使用测试表: sql_demo_table,mongo_demo_table,cinema_info

- [在线测试](http://java.linpengfei.cn:8081/dw-api-sql/sql_frame.html?sql=select%20type_count%2Ccount(*)%20as%20type_count_count%20from%20(select%20type%2Ccount(*)%20as%20type_count%20from%20%5B%7Btype%3A1%2Cvalue%3A1%7D%2C%7Btype%3A2%2Cvalue%3A2%7D%2C%7Btype%3A1%2Cvalue%3A3%7D%5D%20group%20by%20type%3B)%20group%20by%20type_count)

### 使用样例

* 准备 SqlDdlDaoMultipleImpl

```java
// 初始化各种数据源, 为了容易理解这里使用直接传入jdbc的实现类
SqlDdlDao dao1 = new DbutilDaoImpl("jdbc:mysql://账户:密码@192.168.4.31:3306,192.168.4.32:3306/test"); // sql
SqlDdlDao dao2 = new MongoDaoImpl("mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/test"); // mongo
SqlDdlDao dao3 = new SolrDaoImpl("solr://192.168.7.71:2181,192.168.7.72:2181/solr"); // solr
SqlDdlDao dao4 = new HBaseDaoImpl("hbase://192.168.7.71,192.168.7.72/hbase-unsecure"); // HBase
// 推荐使用配置文件管理数据库连接信息, 比如: SqlDdlDao dao1 = new DbutilDaoConfImpl("mysql_test@xxx.properties")

// 构造 SqlDdlDaoMultipleImpl, 并将以上数据源注册进来.
SqlDdlDaoMultipleImpl multipleDao = new SqlDdlDaoMultipleImpl();
multipleDao.addAllTableSource(dao1);
multipleDao.addAllTableSource(dao2);
multipleDao.addAllTableSource(dao3);
multipleDao.addAllTableSource(dao4);
```

* from 子查询

```java
String sql = "
	select type_name,sum(count) as count from (
		select type,count(*) as count from table1 group by type;
		select type,type_name from table2;
		join right(type_name) on left.type = right.type;
	) group by type_name";
List<Map<String,Object>> mapList = multipleDao.sqlFindListMap(sql);
List<Bean> beanList = multipleDao.sqlFindList(sql, Bean.class);
```


* select 子查询 V:0.2.19

```java
String sql = "
	select * from table1 where id in (
		select id from table2
	);"
List<Map<String,Object>> mapList = multipleDao.sqlFindListMap(sql);
List<Bean> beanList = multipleDao.sqlFindList(sql, Bean.class);
```

* union V:0.2.18

```java
String sql = "
	select * from table1 
	union all
	select * from table2;"
List<Map<String,Object>> mapList = multipleDao.sqlFindListMap(sql);
List<Bean> beanList = multipleDao.sqlFindList(sql, Bean.class);
```

* 临时变量 V:0.3.4

```sql
-- 支持 mysql风格的临时变量
set @time_date_str := '2019-01-16',
    @time := str_to_date(@time_date_str, '%Y-%m-%d');
select * from table where time_str > @time_date_str and time > @time

-- 扩展支持 list 型变量
set @a@list = (1028, 1029, 1030, 1031, 1032);
select * from table where id in (@a@list);

-- 扩展支持 list 型变量,并内嵌函数和变量
set @a = 1032;
set @a@list = (1028, CONVERT("1029", SIGNED), CAST("1030" as SIGNED), toInt("1031"), @a);
select * from table where id in (@a@list);

-- 扩展支持 list 型变量,并从查询获取值
set @a@list = (SELECT id FROM table order by id limit 5);
select * from table where id in (@a@list);
```

### 不支持功能

因为 join 的功能还没写完所以暂时使用 select + select + join 的方式实现 join 操作。
```sql
-- ## 第一次 join

-- table1 的 sql 的返回值会被压入堆栈，坐标[0]
select type,count(*) as count from table1 group by type;
-- table2 的 sql 的返回值会被压入堆栈，坐标[1]
select type,type_name from table2;
-- join 会按先进后出的原则从堆栈的结尾获取表， 先取出[1]定义为 right， 再取出[0]定义为 left
-- join 会将 right 的 type_name 写入 left，然后从堆栈删除 right [1]， 此时堆栈只剩下[0]
join right(type_name) on left.type = right.type;

-- ## 再次 join （按顺利连续join）

-- table3 的 sql 的返回值会被压入堆栈，坐标[1]
select type_name_creatime,type_name from table3; -- # 第二次的 join 会将其前方此sql的返回值认定为 right 表, 而其前方第二张表也就是 第一次精品
-- join 会按先进后出的原则从堆栈的结尾获取表， 先取出[1]定义为 right， 再取出[0]定义为 left
-- join 会将 right 的 type_name_creatime 写入 left，然后从堆栈删除 right [1]， 此时堆栈只剩下[0]
join right(type_name_creatime) on left.type_name = right.type_name; -- # join 会将 right 表指定字段查询 left 表，然后返回 left 表

-- ## 嵌套 join 右表本身有 join 逻辑

-- table1 的 sql 的返回值会被压入堆栈，坐标[1]
select type,type_id from table4;
-- table2 的 sql 的返回值会被压入堆栈，坐标[2]
select type_id, type_id_createtime from table4;
-- join 会按先进后出的原则从堆栈的结尾获取表， 先取出[2]定义为 right， 再取出[1]定义为 left
-- join 会将 right 的 type_name 写入 left，然后从堆栈删除 right [2]， 此时堆栈只剩下[0]和[1]
join right(type_id_createtime) on left.type = right.type;
```

### 注意事项 

* 暂无

## 相关页面
- [本工具对于sql规范的支持说明]({{site.baseurl}}/2019/06/06/sql-standard/)
- [sql查询接口]({{site.baseurl}}/2018/04/24/sql-ddl-dao/)
- [sql查询实现:跨数据库联合查询]({{site.baseurl}}/2018/12/20/sybn-dao-multiple-impl/)
- [sql查询实现:list / stream]({{site.baseurl}}/2018/09/13/datas-sql-ddl-engine/)
- [sql查询实现:stream多路异步查询]({{site.baseurl}}/2018/10/15/sql_ddl_dao_stream_async_impl/)
- [sql查询实现:mongodb]({{site.baseurl}}/2018/09/17/mongo-dao-by-sql/)
- [sql查询实现:Hbase]({{site.baseurl}}/2019/05/16/hbase-dao/)
- sql查询实现:solr 文档待补
