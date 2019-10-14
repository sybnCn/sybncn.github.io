
function hereDoc(func) {
	return func.toString().split(/\n/).slice(1, -1).join('\n');
}

function getSybnDemoSql(){
	return {
		"sql_demo_1":hereDoc(function(){/*!
		*/}),
		"sql_demo_2":hereDoc(function(){/*!
		*/}),
		"sql_demo_3":hereDoc(function(){/*!
		*/}),
		"mongo_demo_1":hereDoc(function(){/*!
		*/}),
		"mongo_demo_2":hereDoc(function(){/*!
		*/}),
		"mongo_demo_3":hereDoc(function(){/*!
		*/}),
		"multiple_demo_1":hereDoc(function(){/*!
select now() as now, date_format(now(),'%Y-%m-%d') as today;
		*/}),
		"multiple_demo_2":hereDoc(function(){/*!
select a, sum(b) as s
from [{a:1,b:1},{a:2,b:2},{a:3,b:3},{a:1,b:4}]
group by a
having s > 0
order by a;
		*/}),
		"multiple_demo_3":hereDoc(function(){/*!
-- 查询 sql, 2 == '2' 所以可以获取4行
select 'select sql' as action, name, type, create_time from sql_demo_table where type in (1, '2')
union all
-- 查询 mongo, 2 != '2' 所以只能得到2行
select 'select mongo' as action, name, type, create_time from mongo_demo_table where type in (1, '2')
union all
-- group by 子查询
select 'group by' as action, name, min(type) as type, max(create_time) as create_time from (
  select * from sql_demo_table
  union all
  select * from mongo_demo_table 
) group by name
		*/}),
		"multiple_demo_4":hereDoc(function(){/*!
-- 先将字符串转时间并赋值给变量, 然后再查询
set @t := str_to_date("2019-03-01", '%Y-%m-%d');
select * from sql_demo_table where create_time < @t and type in (
  select * from mongo_demo_table where create_time > @t
);
		*/}),
		"multiple_demo_5":hereDoc(function(){/*!
		*/}),
		"mongo_aggregate_demo_1":hereDoc(function(){/*!
select
  (case type when 1 then value1 when 2 then value2 else 0 end) as t,
  count(*) as c
 from table
 where date > str_to_date('2019-04-07', '%Y-%m-%d')
 group by t
 having c > 10
 order by c desc
		*/}),
		"mongo_aggregate_demo_2a":hereDoc(function(){/*!
-- 语法1 两种写法等效
select datas, count(*) as c from table group by unwind(datas) as data
		*/}),
		"mongo_aggregate_demo_2b":hereDoc(function(){/*!
-- 语法2 group by 后面的字段名需要等于 as 后面的字段名
select unwind(datas) as data, count(*) as c from table group by data
		*/}),
		"mongo_aggregate_demo_3":hereDoc(function(){/*!
-- 求每天的用户数和总金额
select day, count(user) as user_count, sum(price_sum) as price_sum from (
  select date_format(pay_time, "%Y-%m-%d") as day, user, sum(price) as price_sum from table1 group by day, user;
) group by a
		*/}),
		"mongo_aggregate_demo_4":hereDoc(function(){/*!
-- 从 ticket 表统计收货地址城市，并显示 city 表中的城名称
select 
  city_id, count(*) as count_num,
  (select city_name from city where table_a.city_id = city.id) as name
from ticket group by city_id
		*/}),
	};
}