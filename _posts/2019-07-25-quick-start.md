---
layout: post
title:  "关于 sybn util"
categories: about
tags:  about sybn-util
author: sybn
---

* content
{:toc}

## 环境依赖

* 依赖 jre 1.8+

* 依赖 slf4j （默认不自动引入 slf4j 实现）

* 支持与 spring boot / spring data / spring mvc / hibernate / spark / spark sql 等生态系统共存

## maven 引用

* 暂不支持在maven公共库引用, 目前支持maven私服

```xml
	<properties>
		<sybn.version>0.3.4-SNAPSHOT</sybn.version>
	</properties>

	<distributionManagement>
		<repository>
			<id>releases</id>
			<name>vcfilm releases</name>
			<url> http://nexus.xxx.cn:8081/nexus/content/repositories/releases/</url>
		</repository>
		<snapshotRepository>
			<id>snapshots</id>
			<name>vcfilm snapshots</name>
			<url>http://nexus.xxx.cn:8081/nexus/content/repositories/snapshots/</url>
		</snapshotRepository>
	</distributionManagement>
	
	<dependencies>
	
		<!-- jdbc -->
		<dependency>
			<groupId>cn.linpengfei.sybnutil</groupId>
			<artifactId>dbutil-dao</artifactId>
			<version>${sybn.version}</version>
		</dependency>

		<!-- mongo db -->
		<dependency>
			<groupId>cn.linpengfei.sybnutil</groupId>
			<artifactId>mongo-dao</artifactId>
			<version>${sybn.version}</version>
		</dependency>
		
		<!-- solr -->
		<dependency>
			<groupId>cn.linpengfei.sybnutil</groupId>
			<artifactId>solr-dao</artifactId>
			<version>${sybn.version}</version>
		</dependency>
		
		<!-- hbase -->
		<dependency>
			<groupId>cn.linpengfei.sybnutil</groupId>
			<artifactId>hadoop-dao</artifactId>
			<version>${sybn.version}</version>
		</dependency>
		
	</dependencies>
```

## 单库查询样例
```java
// sql 语句
String sqlFind = "select * from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";
String sqlCount = "select count(*) from sybn_junit_base where id between '2018-03-20' and '2018-03-21'";

// 1. 构造不同数据库实例执行查询
// mysql / mongo / solr / HBase 数据量大时, 可以使用 StreamDao 以 Stream 流形式返回数据
SqlDdlDao dao = new DbutilDaoImpl("jdbc:mysql://账户:密码@192.168.4.31:3306,192.168.4.32:3306/test"); // sql
SqlDdlDao dao = new MongoDaoImpl("mongodb://账户:密码@192.168.4.31:27017,192.168.4.32:27017/test"); // mongo
SqlDdlDao dao = new SolrDaoImpl("solr://192.168.7.71:2181,192.168.7.72:2181/solr"); // solr
SqlDdlDao dao = new HBaseDaoImpl("hbase://192.168.7.71,192.168.7.72/hbase-unsecure"); // HBase
List<Map<String, Object>> sqlFindListMap = dao.sqlFindListMap(sqlFind);
List<SybnJunitBase> sqlFindList = dao.sqlFindList(sqlFind, SybnJunitBase.class);
long count = dao.sqlCount(sqlCount);

// 2. 直接查询jvm中的数据
List<Map<String, Object>> sqlFindListMap = DatasSqlDdlEngine.sqlFindListMap(list, sqlFind);
List<SybnJunitBase> sqlFindList = DatasSqlDdlEngine.sqlFindList(list, sqlFind, SybnJunitBase.class);
```

## 跨库查询样例

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

## 在线测试

- [在线测试](http://java.linpengfei.cn:8081/dw-api-sql/sql_frame.html?sql=select%20type_count%2Ccount(*)%20as%20type_count_count%20from%20(select%20type%2Ccount(*)%20as%20type_count%20from%20%5B%7Btype%3A1%2Cvalue%3A1%7D%2C%7Btype%3A2%2Cvalue%3A2%7D%2C%7Btype%3A1%2Cvalue%3A3%7D%5D%20group%20by%20type%3B)%20group%20by%20type_count)