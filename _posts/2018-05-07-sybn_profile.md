---
layout: post
title:  "sybn profile 配置文件管理"
categories: sybn-core
tags:  sybn-core singleutil 0.1.10
author: sybn
---

* content
{:toc}

## 简介
maven 和 spring boot 都提供了各自的多环境切换方案，sybn util 工具包中也有自己的解决方案。 

此方案用于在多个环境中切换配置文件， 甚至在运行时指定 jar/war 包以外的任意系统目录中的的配置文件。



## ReadConfUtil 说明
- 各个数据库都有 xxxDaoConfImpl 这样一个实现类，提供的使用配置文件构造 xxxDao 的实现类。
- 实际上调用的则是 cn.sybn.singleutil.ReadConfUtil
- 直接使用 ReadConfUtil.getValue("参数名") 或者  ReadConfUtil.getValue("参数名@配置文件名") 记得得到配置文件属性，属性从配置文件读取后会缓存一小会，不会频繁读取文件。
- 如果有与参数名同名的系统属性，则优先使用系统属性，忽略配置文件中的值。 因此使用 java -jar -Dxxx=123 可以覆盖配置文件中的 xxx。
> 注意： ReadConfUtil 属于 cn.sybn.singleutil 包.
> 
> 因此他是一个独立工具类，在必要时直接将这个类复制到其他项目中可以单独使用，不需要依赖整个 sybn util 包。


## 用法举例
- 配置文件

```bash
## sybnuitl_test.properties
# 不带空格,实际值:"111111"
value1=111111
# 前后带空格,会被忽略,实际值:"222222"
value2 = 222222   
# 变量内含变量,会被替换,实际值:"333111111333"
value3=333${value1}333
```

- 读取属性

```java
// 从默认配置文件获取属性值
System.setProperty(SYBN_CONF, "sybnuitl_test.properties"); 
// or  java -jar -DSYBN_CONF=sybnuitl_test.properties
String value = ReadConfUtil.getValue("value1"); // 111111

// 从指定配置文件获取属性值
String value1 = ReadConfUtil.getValue("value1@sybnuitl_test.properties"); // 111111
String value2 = ReadConfUtil.getValue("value2@./sybnuitl_test.properties"); // 222222
String value3 = ReadConfUtil.getValue("value3@/ust/local/sybn/junit/sybnuitl_test.properties"); // 333111111333

// 从变量中指定的配置文件获取属性值 (支持操作系统环境变量)
System.setProperty("JUNIT_CONF", "sybnuitl_test");
// or  java -jar -DJUNIT_CONF=sybnuitl_test
String value4 = getValue("value3@{JUNIT_CONF}.properties");
```

