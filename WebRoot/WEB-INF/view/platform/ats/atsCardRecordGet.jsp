
<%--
	time:2015-05-26 11:21:21
--%>
<%@page language="java" pageEncoding="UTF-8"%>
<%@include file="/commons/include/html_doctype.html"%>
<html>
<head>
<title>打卡记录明细</title>
<%@include file="/commons/include/get.jsp"%>
<script type="text/javascript">
	//放置脚本
</script>
</head>
<body>
	<div class="panel">
		<div class="panel-top">
			<div class="tbar-title">
				<span class="tbar-label">打卡记录详细信息</span>
			</div>
			<div class="panel-toolbar">
				<div class="toolBar">
					<div class="group">
						<a class="link back" href="list.ht"><span></span>返回</a>
					</div>
				</div>
			</div>
		</div>
		<table class="table-detail" cellpadding="0" cellspacing="0" border="0">
			<tr>
				<th width="20%">考勤卡号:</th>
				<td>${atsCardRecord.cardNumber}</td>
			</tr>
			<tr>
				<th width="20%">打卡日期:</th>
				<td>
				<fmt:formatDate value="${atsCardRecord.cardDate}" pattern="yyyy-MM-dd"/>
				</td>
			</tr>
			<tr>
				<th width="20%">打卡时间:</th>
				<td>${atsCardRecord.cardTime}</td>
			</tr>
			<tr>
				<th width="20%">打卡来源:</th>
				<td>${atsCardRecord.cardSource}</td>
			</tr>
			<tr>
				<th width="20%">打卡位置:</th>
				<td>${atsCardRecord.cardPlace}</td>
			</tr>
		</table>
		</div>
	</div>
</body>
</html>

