---
layout: post
title:  "excel 工具"
categories: sybn-core
tags:  sybn-core bean 0.3.26
author: sybn
---

* content
{:toc}

## 简介
sybn util 中提供了读写 excel 的工具类,并支持将 spring mvc 的数据 view 转换为excel
主要有以下功能:
- 读取 xls / xlsx 文件为二位数组, 并加将二位数据转为对象列表. 后续可以使用 DatasSqlDdlEngine 对此数据执行 sql 语句.
- 写入 List&lt;Map&gt; 的数据到 xls / xlsx 文件中.





### 用法举例
```java
// 读取 excel
List<Object[]> readExcel = PoiReadObjUtil.readExcelObject(new File("D:/xxx.xls"));
List<Map<String, Object>> arraysToMaps = PoiReadObjUtil.arraysToMaps(readExcel);
LogUtil.info("\r\n", ListLogUtil.conver(arraysToMaps, 32)); // 打印日志时最大列宽为32

// 写入 excel
ExcelBuilder builder = ExcelBuilderFactory.getExcelBuilder("文件名.xls", "excel标题", list);
builder.exportToLocalFile(new File("D:/"));
```

