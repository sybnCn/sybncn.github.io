---
layout: post
title:  "DateScope 时间枚举工具"
categories: sybn-core
tags:  office-util excel 0.2.16
author: sybn
---

* content
{:toc}

## 简介

某些情况下无法读取jar包中的excel文件的解决方案.




### DateScope 示例代码

* 问题概述

```java
// 从 resources 的相对路径中获取xls文件信息
List<Map<String, Object>> data = PoiReadObjUtil.readExcelToMap(ReadFileUtil.read("file/test.xls", getClass()));

// 收到异常提示:  无法识别此excel文件的类型。可能是文件类型错误，或者maven编译问题。
```

* 问题原因

因为文件是放在源码目录中,打包到jar文件内的,因此可以排除文件本身的问题.

经查,发现是 maven-resources-plugin 插件造成的文件编码问题,需要修改pom.xml:

```java
<build>
	<plugins>
	......
	</plugins>
	<resources>
		<resource>
			<directory>${project.basedir}/src/main/resources</directory>
			<filtering>true</filtering>
			<excludes>
				<exclude>**/*.woff</exclude>
				<exclude>**/*.ttf</exclude>
				<exclude>**/*.eot</exclude>
				<exclude>**/*.svg</exclude>
				<exclude>**/*.zip</exclude>
				<exclude>**/*.xls</exclude>
				<exclude>**/*.xlsx</exclude>
				<exclude>**/*.crt</exclude>
				<exclude>**/*.p8</exclude>
			</excludes>
		</resource>
		<resource>
			<directory>${project.basedir}/src/main/resources</directory>
			<filtering>false</filtering>
			<includes>
				<include>**/*.woff</include>
				<include>**/*.ttf</include>
				<include>**/*.eot</include>
				<include>**/*.svg</include>
				<include>**/*.zip</include>
				<include>**/*.xls</include>
				<include>**/*.xlsx</include>
				<include>**/*.crt</include>
				<include>**/*.p8</include>
			</includes>
		</resource>
	</resources>
</build>
```
