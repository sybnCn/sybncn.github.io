---
layout: post
title:  "excel 工具"
categories: tools
tags:  office-util excel xls xlsx 0.2.6
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

* 读写 excel

```java
// 读取 excel, 支持 xls, xlsx 格式
List<Object[]> readExcel = PoiReadObjUtil.readExcelObject(new File("D:/xxx.xls"));
List<Map<String, Object>> maps = PoiReadObjUtil.arraysToMaps(readExcel);
LogUtil.info("\r\n", ListLogUtil.conver(maps, 32)); // 打印日志时最大列宽为32

// 写入 excel
ExcelBuilder builder = ExcelBuilderFactory.getExcelBuilder("文件名.xls", "excel标题", list);
builder.exportToLocalFile(new File("D:/"));
```

* 读取 csv

```java
// 从 String 读取 csv 
String csv = "a,b\r\n\"1\",2\r\n11,22\r\n111,222\r\n";
List<String[]> converterByStr = converterByStr(csv);
List<Map<String, Object>> maps = PoiReadObjUtil.arraysToMaps(converterByStr);
LogUtil.info("\r\n", ListLogUtil.conver(maps, 32)); // 打印日志时最大列宽为32

// 从文件读取 csv (支持 InputStream 或者 文件名 读取)
List<String[]> converterByStr = converter("D:/xxx.csv", Charsets.UTF_8);
List<Map<String, Object>> maps = PoiReadObjUtil.arraysToMaps(converterByStr);
LogUtil.info("\r\n", ListLogUtil.conver(maps, 32)); // 打印日志时最大列宽为32

// 读取 InputStream 到 Stream
String csv = "a,b\r\n\"1\",2\r\n11,22\r\n111,222\r\n";
InputStream is = new ByteArrayInputStream(csv.getBytes());
Stream<String[]> stream = converterStream(is, Charsets.UTF_8);
Stream<Map<String, Object>> stream2 = PoiReadObjUtil.arraysToMaps(stream);
stream.colse(); // 关闭 InputStream
List<Map<String, Object>> converterByStr2 = stream2.collect(Collectors.toList());
LogUtil.info("\r\n", ListLogUtil.conver(converterByStr2, 32)); // 打印日志时最大列宽为32
```
