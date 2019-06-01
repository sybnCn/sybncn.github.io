---
layout: post
title:  "FillListUtil 数据对齐工具"
categories: sybn-core
tags:  sybn-core list tools
author: sybn
---

* content
{:toc}

## 简介

处理数据时经常遇到不整齐的数据， 比如不同的行列数不一致， 本应递增的列表中间缺少部分行。

FillListUtil 专门负责补齐这种不规整的数据。





## 需求说明

* 待对齐的数据

t|type|a|b
-|-|-|-
2019-06-01|x|111|112
2019-06-01|y|121|122
2019-06-02|x|211|
2019-06-03|y|321|322

* 对齐后的数据

t|type|a|b
-|-|-|-
2019-06-01|x|111|112
2019-06-01|y|121|122
2019-06-02|x|211|0
2019-06-02|y|0|0
2019-06-03|x|0|0
2019-06-03|y|321|322

## 使用样例

* 数据对齐函数

```java
String testDataJson = "[{t:'2019-06-01',type:'x',a:111,b:112},{t:'2019-06-01',type:'y',a:121,b:122},{t:'2019-06-02',type:'x',a:111},{t:'2019-06-03',type:'y',a:321,b:322}]";
List<Map<String, Object>> maps = JsonTools.parseJsonToListMap(testDataJson);
logger.info("待对齐的数据：\r\n{}", ListLogUtil.conver(maps, 16));

List<Map<String, Object>> fill = ListFillUtil.fill(maps, "t('', 'yyyy-MM-dd', '2019-06-01~2019-06-03', '1DAY'),type", null, "a,b", 0);
logger.info("对齐后的数据：\r\n{}", ListLogUtil.conver(fill, 16));
```	

```
06-01 15:58:43.251 [main] INFO  cn.sybn.util.stat.fill.FillListUtil$JunitTest - 待对齐的数据：
t         |type|a  |b  
2019-06-01|x   |111|112
2019-06-01|y   |121|122
2019-06-02|x   |111|   
2019-06-03|y   |321|322

06-01 15:58:43.579 [main] INFO  cn.sybn.util.stat.fill.FillListUtil$JunitTest - 对齐后的数据：
t         |type|a  |b  
2019-06-01|x   |111|112
2019-06-01|y   |121|122
2019-06-02|x   |111|0  
2019-06-02|y   |0  |0  
2019-06-03|x   |0  |0  
2019-06-03|y   |321|322
```

# 字段归类说明

* 我们将 t,type 这种前后行相关，被递增或补充的字段值定义为 fillKey。 

对齐时，不同的 fillKey 之间取笛卡尔积，穷举所有的组合，缺失的值会被填充。

> 从数据来看, t 的值域为 2019-06-01,2019-06-02,2019-06-03 type 的值域为 x,y 因此对齐后的数据应该为 3*2=6 行

* 我们将 a,b 这种前后行无关，被填充零值的字段定位为 fillValueKey。  

对齐时，任意一行的任意一个此类值为空（value == null or ""）则填充 fillValueKeyDefaultsValue 作为其值。

> 从数据来看, 一共有 2个a 和 3个b 需要被填充0 


# 函数介绍

* 数据对齐函数

> 格式：ListFillUtil.fill(List<Map<String, Object>> sourceData, String fillArgs, Map<String, String> fillMap, String fillValueKey, Object fillValueKeyDefaultsValue);
>
> 例如：ListFillUtil.fill(maps, "t('', 'yyyy-MM-dd', '2019-06-01~2019-06-03', '1DAY'),type", null, "a,b", 0);
>
> sourceData 被补充的数据列表
>
> fillArgs 数据对齐参数,待补充的key的及其配置的集合(fill和valueKey的总合应该恰好等于list中的map的size)
>
> fillMap (可选)fillArgs的值域，填写此值可能提高性能.一般直接将request的paramMap传进来即可.
>
> fillValueKey (可选)待补充的value的key,如果有多个值逗号隔开
>
> fillValueKeyDefaultsValue (可选)value被补充的值, 支持Supplier函数。

* 数据对齐参数 fillArgs

fillArgs 中可以用逗号分开声明多个 fillKey 的值域，每个 fillKey 的值域由一个函数来描述，函数格式如下：

> 格式：fillKey(paramKey, fillType, fillScope, keyInterval)
>
> 例如：id(id,int),field,t(t,yyyy-MM-dd)
>
> fillKey = sourceData中数据的一个fillKey
>
> paramKey = (可选) 如果fillScope为空， 则从 fillMap中获取param对应的值作为fillScope
>
> fillType = sourceData中此key的补全方式  正在操作的字段类型（str=默认值,使用String格式 / null=以valueScope为准 / values=以已有数据为准忽略valueScope / int=以int格式valueScope为准 / yyyy-MM-dd=以date格式valueScope为准 / scope=以int / date格式valueScope为准）
>
> fillScope = sourceData中此key的补全范围（可选，默认为${param[paramKey]}）
>
> keyInterval = 数据步长，一般是： 1, 1DAY, 1MONTH, 1YEAR 等值