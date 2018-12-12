---
layout: post
title:  "DateScope 时间枚举工具"
categories: sybn-core
tags:  sybn-core dao sql jpin 0.2.16
author: sybn
---

* content
{:toc}

## 简介

部分业务需要枚举一个时间范围内的每一天, 所以准备了 DateScope 和 DateMonthScope.




### DateScope 示例代码

* 按天枚举

```java
// 闭区间, 支持多种时间格式, 忽略时分秒
DateScope scope = DateScope.create("20180101~2018-01-05");

// 打印每一天
int size = scope.size(); // size = 5
StringBuilder sb = new StringBuilder();
for (Date date : scope) {
	sb.append(DayUtil.dayToInt(date));
	sb.append(/);
}
sb.toString(); // sb = "20181101/20181102/20181103/20181104/20181105/"

// 打印每两天
scope.setStep(2);
size = scope.size(); // size = 3
StringBuilder sb = new StringBuilder();
for (Date date : scope) {
	sb.append(DayUtil.dayToInt(date));
	sb.append(/);
}
sb.toString(); // sb = "20181101/20181103/20181105/"
```


### DateMonthScope 示例代码

* 按月枚举

```java
// 闭区间, 支持多种时间格式, 只使用年月, 忽略天和时分秒
DateScope scope = DateScope.create("20180101~2018-02-05");

// 打印每月
int size = scope.size(); // size = 2
StringBuilder sb = new StringBuilder();
for (Date date : scope) {
	sb.append(DayUtil.dayToInt(date));
	sb.append(/);
}
sb.toString(); // sb = "20180101/20180201/"

// 每多个月打印一次的方法同上
```

### 类似的工具类

* IntegerScope

 整数枚举, 用法与DateScope相同
 
* NumberScope

 数字枚举, 用法与DateScope相同
