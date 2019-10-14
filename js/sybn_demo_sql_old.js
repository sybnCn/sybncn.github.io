
function hereDoc(func) {
	return func.toString().split(/\n/).slice(1, -1).join('\n');
}

function getSybnDemoSql(){
	return {
		"sql_demo_1":"",
		"sql_demo_2":"",
		"sql_demo_3":"",
		"mongo_demo_1":"",
		"mongo_demo_2":"",
		"mongo_demo_3":"",
		"multiple_demo_1":"select * from sql_demo_table limit 1\r\nunion\r\nselect * from mongo_demo_table limit 1;",
		"multiple_demo_2":"select a, sum(b) as s from [{a:1,b:1},{a:2,b:2},{a:3,b:3},{a:1,b:4}] group by a having s > 0 order by a;",
		"multiple_demo_3":"select * from sql_demo_table limit 1\r\nunion all\r\nselect * from mongo_demo_table limit 1;",
		"multiple_demo_4":"set @t := str_to_date('2019-03-01', '%Y-%m-%d');\r\nselect * from sql_demo_table where create_time < @t and type in (\r\n  select * from mongo_demo_table where create_time > @t\r\n);",
		"multiple_demo_5":hereDoc(function(){/*!
set @t := str_to_date("2019-03-01", '%Y-%m-%d');
select * from sql_demo_table where create_time < @t and type in (
  select * from mongo_demo_table where create_time > @t
);
		*/}),
		"mongo_aggregate_demo_1":"select\r\n	 (case type when 1 then value1 when 2 then value2 else 0 end) as t,\r\n	 count(*) as c\r\n from table\r\n where date > str_to_date('2019-04-07', '%Y-%m-%d')\r\n group by t\r\n having c > 10\r\n order by c desc",
		"mongo_aggregate_demo_2a":"select datas, count(*) as c from table group by unwind(datas)",
		"mongo_aggregate_demo_2b":"select unwind(datas) as datas, count(*) as c from table group by datas",
		"mongo_aggregate_demo_3":"-- 求每天的用户数和总金额\r\nselect day, count(user) as user_count, sum(price_sum) as price_sum from (\r\n	select date_format(pay_time, '%Y-%m-%d') as day, user, sum(price) as price_sum from table1 group by day, user;\r\n) group by a",
		"mongo_aggregate_demo_4":"-- 从 ticket 表统计城市，并显示 city 表中的城名称\r\nselect \r\n  city_id, count(*) as count_num,\r\n  (select city_name from city where table_a.city_id = city.id) as name\r\nfrom ticket group by city_id"
	};
}