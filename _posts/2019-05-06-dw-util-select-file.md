---
layout: post
title:  "dw-util-select-file.jar 介绍"
categories: util
tags:  util 0.3.2 sql
author: sybn
---

* content
{:toc}

## 简介

为了方便查询离线文件, 准备了 dw-util-select-file.jar.

支持查询本地多个 csv, json, xls, xlsx 文件中的数据，支持联合查询





### 使用说明

```
语法: java -jar dw-util-select-xls.jar [--out=输出路径] 'sql' '数据文件路径1' ['数据文件路径2' ...]
	sql	此伪sql支持多表嵌套嵌套查询,少部分语法与mysql不一致
	文件路径	可以为多个 csv, json, xls, xlsx 文件, 第一个xls会映射为'data_1'表,第二个为'data_2'...所有xls的数据会映射为'data_all'表
```
	
* 举例A: 一次查询多个 excel 的集合

```bash
java -jar dw-util-select-xls.jar 'select type, max(num) as max_num, min(num) as min_num from data_all where type != 'A' group by type order by type' 'd:/num_1.xlsx' 'd:/num2.xlsx'
```

* 举例B: 嵌套查询多个 excel

```bash
java -jar dw-util-select-xls.jar 'select type, max(num) as max_num, min(num) as min_num from data_1 where type not in (select type from data_2 where id = 2) group by type order by type' 'd:/num_1.xlsx' 'd:/type.xls'
```

