---
layout: post
title:  "CrudQueryCommonDao接口"
categories: sybn-core
tags:  sybn-core interface dao
author: sybn
---

* content
{:toc}

## 简介
CrudQueryCommonDao工具属于 [sybn-core 项目]({{site.baseurl}}/2018/03/28/sybn-core/)

由 QueryCommonDao 和  CrudCommonDao 组成。

此接口已经提供 sql，mongo，solr，hbase 的全部或部分实现。



## QueryCommonDao - 基于 SybnQuery 的动态查询接口
- 常规写法:

```java
/**
 * 使用 SybnQuery 执行查询的接口
 * 
 * <pre>
 *  SybnQuery 可以来自其工厂类
 *  SybnQuery 也可以由 spring data 或者 hibernate 的 query 对象转换而来。 TODO 待测试
 * </pre>
 * 
 * @author linpengfei
 * @version 2017年11月23日
 */
public interface QueryCommonDao {

  /**
   * 使用query查询指定表,并返回指定格式.
   * 
   * @param tableName 被查询的表名(必填)
   * @param query 查询条件
   * @param fields 支持sql/mongo风格的字段定义，比如： a as a,b  等效于 {'a as a':1,b:1} 注意防注入
   * @param sort 排序条件 兼容sql个mongo格式,兼容String与Map格式 "aaa ASC" / "{aaa:1}" / {aaa:1}
   * @param skip
   * @param limit
   * @return
   * @throws MyDbException
   */
  @NonNull
  public <T> List<Map<String, Object>> queryListMap(@NonNull String tableName, @Nullable SybnQuery<?> query, @Nullable Object fields, @Nullable Object sort, int skip, int limit) throws MyDbException, InterruptedException;

  /**
   * 使用query查询指定表,并返回指定格式.
   * 
   * @param tableName 默认根据clazz的className推断表名
   * @param clazz 返回值格式 例如: MyUserInfo.class
   * @param query 查询条件
   * @param fields 支持sql/mongo风格的字段定义，比如： a as a,b  等效于 {'a as a':1,b:1}
   * @param sort 排序条件 兼容sql个mongo格式,兼容String与Map格式 "aaa ASC" / "{aaa:1}" / {aaa:1}
   * @param skip
   * @param limit
   * @return
   * @throws MyDbException
   */
  @NonNull
  public <T> List<T> queryList(@Nullable String tableName, @NonNull Class<T> clazz, @Nullable SybnQuery<?> query, @Nullable Object fields, @Nullable Object sort, int skip, int limit) throws MyDbException, InterruptedException;

  /**
   * 使用query查询指定表,并返回指定格式.
   * 
   * @param tableName 被查询的表名(必填)
   * @param type 返回值格式 map  可以直接在泛型方法中创建: TypeReference type = new TypeReference() {};
   * @param query 查询条件
   * @param fields 支持sql/mongo风格的字段定义，比如： a as a,b  等效于 {'a as a':1,b:1}
   * @param sort 排序条件 兼容sql个mongo格式,兼容String与Map格式 "aaa ASC" / "{aaa:1}" / {aaa:1}
   * @param skip
   * @param limit
   * @return
   * @throws MyDbException
   */
  @NonNull
  public <T> List<T> queryList(@NonNull String tableName, @NonNull TypeReference<T> type, @Nullable SybnQuery<?> query, @Nullable Object fields, @Nullable Object sort, int skip, int limit)
      throws MyDbException, InterruptedException;

  /**
   * 统计满足指定条件的数据量
   * @param tableName
   * @param query
   * @return
   * @throws MyDbException
   */
  public long queryCount(@NonNull String tableName, @Nullable SybnQuery<?> query) throws MyDbException, InterruptedException;

  /**
   * 
   * @param tableName 默认根据clazz的className推断表名
   * @param clazz
   * @param query
   * @return
   * @throws MyDbException
   */
  public long queryCount(@NonNull String tableName, @NonNull Class<?> clazz, @Nullable SybnQuery<?> query) throws MyDbException, InterruptedException;
}
```

- 说明

  SybnQuery 对象可以使用来自前端的 RequestMap 构造
  
  
## CrudCommonDao - 通用的增删改查接口
- 接口定义:

```java

/**
 * 通用crudDao接口
 * 
 * @author linpengfei
 * @version 2017年5月16日
 */
public interface CrudCommonDao {

  /**
   * 保存数据,支持传入java bean或者 map
   * 
   * @param tableName 默认根据data的className推断表名
   * @param data
   * @return
   * @throws InterruptedException
   */
  boolean commonSave(String tableName, Object data) throws InterruptedException;

  /**
   * 保存数据,支持传入java bean或者 map
   * 
   * <pre>
   *  如果旧数据已存在则尽量报错
   *  注意: 不同数据库判断数据是否重复的方式会有所不同.
   *  sql 是参考 主键和唯一键
   *  solr 是参考 id
   *  mongo 是参考 _id (monggo dao 中有 replaceFirst 方法可以自定义唯一键)
   * </pre>
   * 
   * @param tableName 默认根据data的className推断表名
   * @param data
   * @return
   * @throws InterruptedException
   */
  boolean commonSaveAll(String tableName, List<?> data) throws InterruptedException;

  /**
   * 保存数据,支持传入java bean或者 map
   * 
   * <pre>
   *  如果旧数据已存在则尽量覆盖.
   *  注意: 不同数据库判断数据是否重复的方式会有所不同.
   *  sql 是参考 主键和唯一键
   *  solr 是参考 id
   *  mongo 是参考 _id (monggo dao 中有 replaceFirst 方法可以自定义唯一键)
   * </pre>
   * 
   * @param tableName 默认根据data的className推断表名
   * @param data
   * @return
   * @throws InterruptedException
   */
  <T> boolean commonSaveOrReplace(String tableName, List<T> data) throws InterruptedException;
  /**
   * 保存数据,支持传入java bean或者 map
   * 
   * <pre>
   *  如果旧数据已存在则覆盖.
   *  注意: 不同数据库判断数据是否重复的方式会有所不同.
   *  sql 是参考 主键和唯一键
   *  solr 是参考 id
   *  mongo 是参考 _id (monggo dao 中有 replaceFirst 方法可以自定义唯一键)
   * </pre>
   * 
   * @param tableName 默认根据data的className推断表名
   * @param data
   * @return
   * @throws InterruptedException
   */
  <T> boolean commonSaveOrReplace(String tableName, T data) throws InterruptedException;

  /**
   * 查询id等于指定值的记录
   * 
   * @param tableName 默认根据clazz的className推断表名
   * @param clazz 对于 map 等内含泛型, 不方便使用class的情况,请传入 TypeReference.
   * @param id
   * @return
   * @throws InterruptedException
   */
  @Nullable
  <T> T commonFindById(String tableName, @NonNull Class<T> clazz, Object id) throws InterruptedException;

  /**
   * 查询id等于指定值的记录
   * 
   * @param tableName 默认根据type内的className推断表名
   * @param type 可以直接在泛型方法中创建: TypeReference<T> type = new TypeReference<T>() {};
   * @param id
   * @return
   * @throws InterruptedException
   */
  @Nullable
  <T> T commonFindById(@NonNull String tableName, @NonNull TypeReference<T> type, Object id) throws InterruptedException;

  /**
   * 查询指定数据数据,sql暂时只支持等于
   * 
   * @param tableName 默认根据clazz的className推断表名
   * @param clazz 对于 map 等内含泛型, 不方便使用class的情况,请传入 TypeReference.
   * @param query 仅限等于,例如: {a:1,b:2} => a=1 and b=2 , 如需复杂条件,需使用 QueryCommonDao
   * @param sort
   * 
   *        <pre>
   *  兼容sql和mongo风格的写法
   *  null = "" = 不排序;
   *  "a asc,b asc" = ["a","b"] = {"a":1,"b":1} = "{a:1,b:1}" = 字段a和升序
   *        </pre>
   * 
   * @param skip
   * @param limit
   * @return
   * @throws InterruptedException
   */
  @NonNull
  <T, Q> List<T> commonFindByKv(String tableName, @NonNull Class<T> clazz, Map<String, Q> query, Object sort, int skip, int limit) throws InterruptedException;

  /**
   * 查询指定数据数据,sql暂时只支持等于
   * 
   * @param tableName 默认根据type内的className推断表名
   * @param type 可以直接在泛型方法中创建: TypeReference<T> type = new TypeReference<T>() {};
   * @param query 仅限等于,例如: {a:1,b:2} => a=1 and b=2 , 如需复杂条件,需使用 QueryCommonDao
   * @param sort
   * 
   *        <pre>
   *  兼容sql和mongo风格的写法
   *  null = "" = 不排序;
   *  "a asc,b asc" = ["a","b"] = {"a":1,"b":1} = "{a:1,b:1}" = 字段a和升序
   *        </pre>
   * 
   * @param skip
   * @param limit
   * @return
   * @throws InterruptedException
   */
  @NonNull
  <T, Q> List<T> commonFindByKv(@NonNull String tableName, @NonNull TypeReference<T> type, Map<String, Q> query, Object sort, int skip, int limit)
      throws InterruptedException;

  /**
   * 查询指定数据数据,暂时只支持等于
   * 
   * @param tableName 默认根据clazz的className推断表名
   * @param clazz 对于 map 等内含泛型, 不方便使用class的情况,请传入 TypeReference.
   * @param query 仅限等于,例如: {a:1,b:2} => a=1 and b=2 , 如需复杂条件,需使用 QueryCommonDao
   * @param fields
   * 
   *        <pre>
   *  兼容sql和mongo风格的写法
   *  null = "" = "*" = 所有字段;
   *  "a,b" = ["a","b"] = {"a":1,"b":1} = "{a:1,b:1}" = 字段a和b
   *  mongo下不支带as,count(*),表关联等sql特有写法
   *        </pre>
   * 
   * @param sort
   * 
   *        <pre>
   *  兼容sql和mongo风格的写法
   *  null = "" = 不排序;
   *  "a asc,b asc" = ["a","b"] = {"a":1,"b":1} = "{a:1,b:1}" = 字段a和升序
   *        </pre>
   * 
   * @param skip
   * @param limit
   * @return
   * @throws InterruptedException
   */
  @NonNull
  <T, Q> List<T> commonFindByKv(String tableName, @NonNull Class<T> clazz, Map<String, Q> query, Object fields, Object sort, int skip, int limit)
      throws InterruptedException;

  /**
   * 查询指定数据数据,暂时只支持等于
   * 
   * @param tableName 默认根据type内的className推断表名
   * @param type 可以直接在泛型方法中创建: TypeReference<T> type = new TypeReference<T>() {};
   * @param query 仅限等于,例如: {a:1,b:2} => a=1 and b=2 , 如需复杂条件,需使用 QueryCommonDao
   * @param fields
   * 
   *        <pre>
   *  兼容sql和mongo风格的写法
   *  null = "" = "*" = 所有字段;
   *  "a,b" = ["a","b"] = {"a":1,"b":1} = "{a:1,b:1}" = 字段a和b
   *  mongo下不支带as,count(*),表关联等sql特有写法
   *        </pre>
   * 
   * @param sort
   * 
   *        <pre>
   *  兼容sql和mongo风格的写法
   *  null = "" = 不排序;
   *  "a asc,b asc" = ["a","b"] = {"a":1,"b":1} = "{a:1,b:1}" = 字段a和升序
   *        </pre>
   * 
   * @param skip
   * @param limit
   * @return
   * @throws InterruptedException
   */
  @NonNull
  <T, Q> List<T> commonFindByKv(@NonNull String tableName, @NonNull TypeReference<T> type, Map<String, Q> query, Object fields, Object sort, int skip,
      int limit) throws InterruptedException;

  /**
   * 查询指定数据数据的第一条,暂时只支持等于
   * 
   * @param tableName 默认根据clazz的className推断表名
   * @param clazz 对于 map 等内含泛型, 不方便使用class的情况,请传入 TypeReference.
   * @param query 仅限等于,例如: {a:1,b:2} => a=1 and b=2 , 如需复杂条件,需使用 QueryCommonDao
   * @param sort
   * 
   *        <pre>
   *  兼容sql和mongo风格的写法
   *  null = "" = 不排序;
   *  "a asc,b asc" = ["a","b"] = {"a":1,"b":1} = "{a:1,b:1}" = 字段a和升序
   *        </pre>
   * 
   * @return
   * @throws InterruptedException
   */
  @Nullable
  <T, Q> T commonFindFirstByKv(String tableName, @NonNull Class<T> clazz, Map<String, Q> query, Object sort) throws InterruptedException;

  /**
   * 查询指定数据数据的第一条,暂时只支持等于
   * 
   * @param tableName 默认根据type内的className推断表名
   * @param type 可以直接在泛型方法中创建: TypeReference<T> type = new TypeReference<T>() {};
   * @param query 仅限等于,例如: {a:1,b:2} => a=1 and b=2 , 如需复杂条件,需使用 QueryCommonDao
   * @param sort
   * 
   *        <pre>
   *  兼容sql和mongo风格的写法
   *  null = "" = 不排序;
   *  "a asc,b asc" = ["a","b"] = {"a":1,"b":1} = "{a:1,b:1}" = 字段a和升序
   *        </pre>
   * 
   * @return
   * @throws InterruptedException
   */
  @Nullable
  <T, Q> T commonFindFirstByKv(@NonNull String tableName, @NonNull TypeReference<T> type, Map<String, Q> query, Object sort) throws InterruptedException;

  /**
   * 使用指定条件count
   * 
   * <pre>
   *  query 为空时count全表
   * </pre>
   * 
   * @param tableName 必填
   * @param query 可为空，仅限等于条件,例如: {a:1,b:2} => a=1 and b=2 , 如需复杂条件,需使用 QueryCommonDao
   * @return
   * @throws InterruptedException
   */
  <Q> long commonCountByKv(@NonNull String tableName, @Nullable Map<String, Q> query) throws InterruptedException;

  /**
   * 更新指定数据
   * 
   * @param tableName 默认根据data内的className推断表名
   * @param data 将data中的所有非null值update到库中
   * @param ignoreKey 忽略data中的某些值
   * @return 返回查询到的数据条数
   * @throws InterruptedException
   */
  int commonUpdateById(String tableName, IdInterface<?> data, String... ignoreKey) throws InterruptedException;

  /**
   * 更新所有行
   * 
   * <pre>
   * 对于mongo,无需手工加$set
   * solr 未实现此接口
   * </pre>
   * 
   * @param tableName 必填
   * @param updateValues
   * @return 返回查询到的数据条数
   * @throws InterruptedException
   */
  <V> int commonUpdateValuesByAll(@NonNull String tableName, Map<String, V> updateValues) throws InterruptedException;

  /**
   * 更新指定数据
   * 
   * <pre>
   * 对于mongo,无需手工加$set
   * </pre>
   * 
   * @param tableName 必填
   * @param id
   * @param update
   * @return 返回查询到的数据条数
   * @throws InterruptedException
   */
  <V> int commonUpdateValuesById(@NonNull String tableName, Object id, Map<String, V> updateValues) throws InterruptedException;

  /**
   * 更新指定条件的数据
   * 
   * <pre>
   * 对于mongo,无需手工加$set
   * solr 未实现此接口
   * </pre>
   * 
   * @param tableName 必填
   * @param query 处于安全考虑,不允许为空,如果一定要为空,请调用commonUpdateValuesByAll
   * @param updateValues
   * @return 返回查询到的数据条数
   * @throws InterruptedException
   */
  <Q, V> int commonUpdateValuesByKv(@NonNull String tableName, Map<String, Q> query, Map<String, V> updateValues) throws InterruptedException;

  /**
   * 更新指定数据
   * 
   * <pre>
   * 对于mongo,无需手工加$set
   * </pre>
   * 
   * @param tableName 必填
   * @param id
   * @param updateValues
   * @return 返回查询到的数据条数
   * @throws InterruptedException
   */
  <V> long commonRemoveById(@NonNull String tableName, Object... ids) throws InterruptedException;

  /**
   * 更新指定条件的数据
   * 
   * <pre>
   * 对于mongo,无需手工加$set
   * </pre>
   * 
   * @param tableName 必填
   * @param query 处于安全考虑,不允许为空,如果一定要为空,请调用commonUpdateValuesByAll
   * @param updateValues
   * @return 返回查询到的数据条数
   * @throws InterruptedException
   */
  <Q, V> long commonRemoveByKv(@NonNull String tableName, Map<String, Q> query) throws InterruptedException;
}
```


## 相关页面
- [SybnQuery 动态查询实体]({{site.baseurl}}/2018/03/28/sybn-query/)
- [sql查询接口]({{site.baseurl}}/2018/04/24/sql-ddl-dao/)
- [group by util 通用聚合引擎]({{site.baseurl}}/2018/04/12/group-by-util/)