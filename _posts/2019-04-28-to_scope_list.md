---
layout: post
title:  "to_scope_list 数据视图"
categories: sybn-core
tags:  sybn-core 0.3.2
author: sybn
---

* content
{:toc}

## 简介

使用sql语句查询到的数据是二维数据,本身可以映射为一个excel或者table, 但是无法直接准换为 echarts 图表。

为了解决数据可视化问题, 我们准备了 data view 工具。将 sql 的结果数据直接转换为 echarts 可用的数据, 或者其他需要的数据格式。

to_scope_list 是折线图与柱图的 data view 实现。





### 使用说明
```java
String resultView = "to_scope_list(t, '20190101~20190131', to_date(), 't', 'c', '1DAY', 0)"
ResultToMapConverPool.get(resultView).conver(res);
```

* 参数说明

参数|举例|说明
---:|----|----
timeField|x|x轴对应的字段
timeScope|date范围：180101~180201<br/>long范围：1~10<br/>str指定范围：北京,上海,广州<br/>str自适应：null<br/>str指定策略：order by sum(value) desc limit 10 (limit N 与  desc 非必填)|x轴为盈的范围
timeConver|日期用：date 或 to_date()<br/>数字用long 或, to_long()<br/>字符串用：string|不区分大小写, x轴转换类 (经常遇到x轴的值为String, 但需要int型的x轴, 此参数可以对此做数据转换
aggFields|plan|折线的field, 用于控制一行 row 中有几条折线
groupKeys|x,x1,x2|折线的key
interval|86400, 1, 1DAY, 1MONTH|非必须,x轴的间隔, 
defaults|null 或者 0|非必须,折线图无值时,数据当什么处理.


### to_scope_list 使用样例

* to_scope_list 视图

```java
String resultView = "to_scope_list(t, '20190101~20190131', to_date(), 't', 'c', '1DAY', 0)"

List<Map<String, Object>> data = dao.sqlFindListMap("select t, count(*) as c from table where t between 20180101 and 20180131 group by t order by t")
ResultBase res = new ResultTRows<>(data);

ResultConver resultConver = ResultToMapConverPool.get(resultView);
ResultBase res2 = resultConver.conver(res);
```

* 返回值

```json
{
  "result" : true,
  "msg" : "success",
  "total" : 1,
  "attachment" : {
    "_group_by" : [ ],
    "_group_fields" : [ "c" ],
    "_group_x_field" : "t",
    "_group_y_field" : "'c'",
    "_group_scope_interval" : "1DAY",
    "_group_scope_list" : [ "2019-01-01", "2019-01-02", "2019-01-03", "2019-01-04", "2019-01-05", "2019-01-06", "2019-01-07", "2019-01-08", "2019-01-09", "2019-01-10", "2019-01-11", "2019-01-12", "2019-01-13", "2019-01-14", "2019-01-15", "2019-01-16", "2019-01-17", "2019-01-18", "2019-01-19", "2019-01-20", "2019-01-21", "2019-01-22", "2019-01-23", "2019-01-24", "2019-01-25", "2019-01-26", "2019-01-27", "2019-01-28" ]
  },
  "rows" : [ {
    "_" : null,
    "value_scope_start" : "2019-01-01",
    "value_scope_end" : "2019-01-28",
    "plan" : [ 98832, 89188, 88477, 94331, 98127, 97541, 88971, 91883, 90769, 89554, 101539, 101411, 100595, 91890, 91782, 92129, 91568, 102538, 103876, 103814, 95736, 95367, 95750, 96365, 99826, 102768, 102364, 95084 ],
    "ticket" : [ 7454, 2097, 1735, 5957, 7649, 6009, 2353, 2063, 2079, 2012, 3611, 5106, 4042, 2010, 1882, 2137, 2105, 3713, 5120, 4895, 2455, 2133, 2428, 2114, 4300, 4458, 4071, 2494 ],
    "sum_plan" : 2692075.0,
    "sum_ticket" : 98482.0
  } ]
}
```

* 前端渲染

> 前段使用 charts.js 直接将上面的json结果集渲染为折线图.
>
> 如果有美化要求,可以让前段人员修改.

* 集成工具

> 上述内容已经集成进 api-core 接口项目中,  
> 
> api-core 是业务层通用组件, 本文档主要讲述 dao 层通用组件,因此不专门阐述.
>
> 以下是 api-core 效果图, 集成了 跨库dao,sql代码提示, 数据可视化三个特性.

![]({{site.baseurl}}/images/api_core.png)



### 注意事项 

* 暂无

