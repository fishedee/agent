<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<style>
		</style>
	</head>
	<body>
		<div>
			地产金牌代理人提醒您，金牌代理人平台新增一位客户
		</div>
		<table border="1" cellspacing="0px" style="border-collapse:collapse">
			<tr>
				<th style="width:200px">条目</th>
				<th style="width:200px">值</th>
			</tr>
			<tr>
				<td>金牌代理人代码</td>
				<td><?php echo $data['userCode']?></td>
			</tr>
			<tr>
				<td>金牌代理人电话号码</td>
				<td><?php echo $data['userPhoneNumber']?></td>
			</tr>
			<tr>
				<td>项目名称</td>
				<td><?php echo $data['projectName']?></td>
			</tr>
			<tr>
				<td>客户姓名</td>
				<td><?php echo $data['name']?></td>
			</tr>
			<tr>
				<td>客户手机号码</td>
				<td><?php echo $data['phoneNumber']?></td>
			</tr>
			<tr>
				<td>客户意向面积</td>
				<td><?php echo $data['area']?></td>
			</tr>
			<tr>
				<td>客户预算</td>
				<td><?php echo $data['budget']?></td>
			</tr>
		</table>
	</body>
</html>