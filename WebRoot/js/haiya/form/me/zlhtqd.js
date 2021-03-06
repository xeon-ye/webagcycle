/*【租赁合同签订】**/
$(function(){
	changeTYShouYin();
	changeSblx();
	changeSftstk();
	validateZujinBiaozhunDates();//样式
	validateWyfDates();//样式
	/*校验合同号是否存在*/
	$("input[name='m:me_zlhtqd:hth']").change(function(){
		var hth = $(this).val();
		if(!hth) return;
		if(hth.length != 9){
			$.ligerDialog.warn("合同号为：三位门店号 + 三位楼层号 + 三位本楼层流水","提示");	
			return;
		}
		var conf = {aliasName:'validateHTHisExist',hth:hth};
		var result = RunAliasScript(conf);  
		if(result.result === 0) return; 
		
		hth = hth.substring(0,6);
		if(result.isSuccess == 1) $.ligerDialog.error(result.msg,"哎呦出错了！");
		else  $.ligerDialog.error("该合同号已经存在！","提示");
		
		$(this).val(hth);
	});
});
/*显示租户信息*/
function showZh(){
	var zhid = $("[name='m:me_zlhtqd:zhID']").val();
	if(zhid == null || zhid == ""){
		$.ligerDialog.warn("请先选择租户!","提示");
		return ;
	}
	var url=__ctx + "/platform/form/bpmDataTemplate/detailData_shxxwh.ht?__pk__="+zhid;
	DialogUtil.open({
		height:600,
		width: 800,
		title : "查看租户信息",
		url: url, 
		isResize: true
	});
}
/*显示品牌信息*/
function showPP(){
	var ppId = $("[name='m:me_zlhtqd:jyppID']").val();
	if(!ppId){
		$.ligerDialog.warn("请先选择品牌!","提示");
		return ;
	}
	var url=__ctx + "/platform/form/bpmDataTemplate/detailData_ppxxdj.ht?__pk__="+ppId;
	DialogUtil.open({
		height:600,
		width: 800,
		title : "查看品牌信息",
		url: url, 
		isResize: true
	});
}
/*校验子表填充数据是否重复**/ 
function checkDataBeforeInsert(data,tableName){
    if(tableName == 'me_zlhtqd_qtzkft' || tableName == 'me_zlhtqd_hykzkft'){
      var rows =   $(".listRow",$("[tableName='"+tableName+"']"));  //左右子表列
      for(var i =0,row;row=rows[i++];){
        var id = $("[name='s:"+tableName+":ppID']",$(row)).val();  //唯一值
          if(id ==data.PPBM) {                            //对话框，返回数据的那列
    	   $.ligerDialog.warn(data.PPNAME+"已经存在了！","提示信息");
            return false
         }
      }
    }
    
    if(tableName == 'me_zlhtqd_hyklx'){
        var rows = $(".listRow",$("[tableName='"+tableName+"']"));  //左右子表列
        for(var i =0,row;row=rows[i++];){
          var id = $("[name='s:"+tableName+":hyklxID']",$(row)).val();  //唯一值
            if(id == data.HYKTYPE) {                            //对话框，返回数据的那列
      	   $.ligerDialog.warn(data.HYKNAME+"已经存在了！","提示信息");
              return false
           }
        }
      }
    if(tableName == 'me_zlhtqd_pwxx'){
        var rows =   $(".listRow",$("[tableName='me_zlhtqd_pwxx']"));  //左右子表列
        
        //校验该铺位是否被租出去
        var zuLinStartDate  =$("[name='m:me_zlhtqd:zlyxqq']").val();
		if(!zuLinStartDate ){  $.ligerDialog.warn("尚未输入租赁开始日期！",'请核查');  return false }
		
        for(var i =0,row;row=rows[i++];){
          var id = $("[name='s:me_zlhtqd_pwxx:pwID']",$(row)).val();  //唯一值
            if(id ==data.WLDPID) {                              //对话框，返回数据的那列
      	   $.ligerDialog.warn(data.WLDPDM+"已经存在了！","提示信息");
              return false;
           }
        }
        $("[name='m:me_zlhtqd:splx']").val(data.DYLX);
      }
    
     return true;
  }

/* 校验铺位是否到期*/
function validatePuweiIsUsed(){
	 var zuLinStartDate = $.trim($("#zlyxqq").text());
	 var errMsg = "";
	 var warnMsg = "";
	 $("[name='s:me_zlhtqd_pwxx:pwID']").each(function(){	
		var pwID = $(this).val();
		var conf ={aliasName:'validatePuweiIsUsed',pwid:pwID,sDate:zuLinStartDate};
		var json = RunAliasScript(conf);
		if(json.isSuccess ==1){
			errMsg = json.msg;
			return false;	// 跳出循环
		}else if(json.result){
			var pwh = $.trim($(this).closest("tr").find("#pwh").text());
			warnMsg = warnMsg + "铺位【"+pwh+"】到期日期为："+json.result+"，请核查！<br/>";
		}
	});
	
	if(errMsg != ""){
		 $.ligerDialog.error(errMsg,"错误信息");
		 return false;
	}
	if(warnMsg != ""){
		 $.ligerDialog.warn(warnMsg,"提示信息");
		 return false;
	}
	return true;
}


/*结算标准信息   删除行事件*/
function me_zlhtqd_zjbzxxDelRowBeforeEvent(row){
	var xh = $("[name$=':xh']",row).val();
	$("[name='s:me_zlhtqd_ydzjfj:xh'][value=" + xh + "]").closest("tr").remove();/*清除旧的记录*/
}
function me_zlhtqd_wyftkDelRowBeforeEvent(row){
	var xh = $("[name$=':xh']",row).val();
	$("[name='s:me_zlhtqd_wyffj:xh'][value=" + xh + "]").closest("tr").remove();/*清除旧的记录*/
}
/**
 * 修改收费规则的时候删除所有分解
 * wyffj /ydzjfj*/ 
function delAllFenJie(target){
	$("[name='s:me_zlhtqd_"+target+":xh'][value!='']").closest("tr").remove();
}


/*租赁时间变化事件**/
function zlsjChangeEvent(){
	FormDate.doDateCalculate();
	validateZujinBiaozhunDates();
	$("[name='s:me_zlhtqd_klzgz:sjd']").trigger("change");
	validateWyfDates();
	validateMysfxm();
}

//计算所有铺位,与面积
function calAllPuwei(obj){
	var puweiTrs = $(".listRow:visible",$("[tablename='me_zlhtqd_pwxx']")); 
	var shangPuNums = "";
	puweiTrs.each(function (i) {
	  var pwId = $("[name$='pwh']",$(this)).val();
	  shangPuNums = shangPuNums + pwId;
	  if(i != puweiTrs.length-1)shangPuNums = shangPuNums+"-";
	});
	$("[name='m:me_zlhtqd:sp']").val(shangPuNums); 
}

function me_zlhtqd_zjbzxxAddRowAfterEvent(row){
	var preRow = $(row).prev();
	var preNx = $("[name$=':xh']",preRow).val();
	if(!preNx)preNx = 0;
	$("[name$=':xh']",row).val(1+Number(preNx));
	$("[name$=':sjd']",row).val(1+Number(preNx));
	validateZujinBiaozhunDates(row);
	};
	// 校验租金标准 时间
	function validateZujinBiaozhunDates(curRow){
		//租赁有效期起，止
		var zuLinStart =$("[name='m:me_zlhtqd:zlyxqq']");
		var zuLinStartDate  =zuLinStart.val();
		var zuLinEndDate  =$("[name='m:me_zlhtqd:zlyxqz']").val();
		if((!zuLinEndDate || !zuLinStartDate)&&curRow){    
			$.ligerDialog.warn("尚未输入租赁起止日期！",'请核查'); 
			$(curRow).remove();
			return
		}
		
		var rows = $(".listRow:visible",$("[tablename='me_zlhtqd_zjbzxx']"));
		for(var i=0,row;row=rows[i++];){
			if(i>1){
				// 处理比较颜色
				fillColorByCompare(row,$(rows[i-2]),"dj"); // 单价
				fillColorByCompare(row,$(rows[i-2]),"zj"); // 租金
				fillColorByCompare(row,$(rows[i-2]),"zzj"); // 总租金
			}
			if(zuLinStart.length ==0) continue; // 如果只读状态不再判断其他
			
			if(i>1){
				//开始日期等于上个结束日期加1
				var startDate = getNewDataStr($("[name$='jsrq']",$(rows[i-2])).val(),1,1);
				$("[name$='ksrq']",$(row)).val(startDate);
			}else{
				var differTotalStartDate = FormDate.compareDate($("[name$='ksrq']",$(row)).val(), zuLinStartDate);
				if(differTotalEndDate>=0)  {
					$.ligerDialog.warn("当前开始日期不能早于 租赁开始日期！",'请核查');
				}
				$("[name$='ksrq']",$(row)).val(zuLinStartDate);
			}
			var differTotalEndDate = FormDate.compareDate($("[name$='jsrq']",$(row)).val(), zuLinEndDate);
			if(differTotalEndDate<0)  {
				$.ligerDialog.warn("当前结束日期不能晚于 租赁有效期止！",'请核查');
				$("[name$='jsrq']",$(row)).val("")
				return ;
			}
		}
		$("[name$='dj']",curRow).trigger("change"); //从新计算总租金
		//ai 修改日期后，触发时间段chang事件
		$("[name='s:me_zlhtqd_klzgz:sjd']").trigger("change");
	}
	
	/**
	 *  与目标数据大小进行比较，只读取 name+_td ，非只读去input $:+name
	 * @param currentRow 当前行
	 * @param tragetRow 目标行
	 * @param name 名字
	 */
	function fillColorByCompare(currentRow,tragetRow,name){
		var curObj = $("[name$=':"+name+"']",currentRow);
		if(curObj.length ==0){ /*只读状态*/
			curObj = $("[name='"+name+"_td']",currentRow);
			var targetVal=FormUtil.commaback( $("[name='"+name+"_td']",tragetRow).text().trim() );
			var currentVal =FormUtil.commaback(curObj.text().trim());
		}else{
			var targetVal =FormUtil.commaback( $("[name$=':"+name+"']",tragetRow).val() ); //比较对象金额
			var currentVal =FormUtil.commaback(curObj.val());
			if(!targetVal || !currentVal) return; //对象为0不再计算 
		}
		if(currentVal>targetVal){
			curObj.css("color","red");
		}else if(currentVal<targetVal) {
			curObj.css("color","green");
		}else curObj.css("color","");
	}

	/*修改租金规则*/
	function changeZujinGz(obj){
		var curRow = $(obj).closest(".listRow");
		var danJia = $("[name$='dj']",curRow);
		var zuJin = $("[name$='zj']",curRow);
		var rule = $(obj).val();
		
		if(rule == "2" || rule=="4"){ //纯扣
			danJia.val(0);zuJin.val(0);
			danJia.attr("readonly","readonly");
			zuJin.attr("readonly","readonly");
		}else{
			danJia.removeAttr("readonly");
			zuJin.removeAttr("readonly"); 
		}
		danJia.trigger("change");
		createKoulvzu();
	}

	function createKoulvzu(){
		if($(".listRow:visible",$("[tablename$='klz']")).length ==0){
			FormUtil.addRow($('div[tablename$="klz"]'));  
			var appendRow = $(".listRow:visible",$("[tablename$='klz']"))[0];
			$("[name$='klzbh']",appendRow).val(1);
			$("[name$='jckl']",appendRow).val("0");
			$("[name$='ms']",appendRow).val("扣组率1");
		}
	}

	/**单价计算总租金
	 * trigger 'dj'/'zj' 触发者
	 * */
	function calZongZuJin(obj){
		var trigger = $(obj).attr("name").split(":")[2];
		var curRow = $(obj).closest(".listRow");
		var val = FormUtil.commaback($(obj).val()); 
		if(! val>0) return; 
		
		var mianJi = $("[name='m:me_zlhtqd:jzmj']").val();
		if(!mianJi){ $.ligerDialog.warn(" 合同建筑面积不能为空！",'请核查'); return ; }
		
		var zuJin,danJia;
		/* 如果是单价*/
		if('dj'== trigger){
			danJia = val;
			zuJin = mianJi * danJia;
			$("[name$=':zj']",curRow).val(FormMath.tofixed(zuJin,2));
		}else if('zj' == trigger){
			zuJin = val;
			danJia =zuJin/mianJi;
			$("[name$=':dj']",curRow).val(FormMath.tofixed(danJia,2));
		}else return;
		
		var baoDiType =$("[name$='bdxx']",curRow).val();
		var startDate = $("[name$='ksrq']",curRow).val();
		var endDate = $("[name$='jsrq']",curRow).val();
		if(baoDiType =="0"){ //按月
			var zongZujin = calMountZujin(startDate,endDate,zuJin);
		}else{
			var days = FormDate.dateVal(startDate, endDate, "day");
			var zongZujin = zuJin*days;
		}
		zongZujin = FormMath.tofixed(zongZujin,2);
		$("[name$='zzj']",curRow).val(zongZujin).trigger("change");
	 }
	
	/*总租金。月度计算法*/
	function calMountZujin(startTime,endTime,zuJin){
		startTime = startTime.replace(/\-/g, "/");
		endTime = endTime.replace(/\-/g, "/");
		var startDate = new Date(startTime); //开始时间
		var endDate = new Date(endTime); //结束时间
		
		var num=0;
		var year=endDate.getFullYear()-startDate.getFullYear();
			num+=year*12;
		var month=endDate.getMonth()-startDate.getMonth();
			num+=month;
			
		var amount = zuJin * num; //月租金
		var day=endDate.getDate()-startDate.getDate()+1;   //
		amount = amount + day*zuJin/30  // 少于一月 减相差金额，多于一月 加多的金额
		return amount;
	}


	/*生成扣率组规则*/
	function createKoulvRules(){
		return;
		//租金标准信息
		var zjbzxx = $(".listRow:visible",$("[tablename='me_zlhtqd_zjbzxx']"));
		var kouLvs = $(".listRow:visible",$("[tablename='me_zlhtqd_klz']"));
		var klzggRows =$(".listRow:visible",$("[tablename='me_zlhtqd_klzgz']")); //扣率组规则
		var klzggTableDiv = $("div[tablename='me_zlhtqd_klzgg']");
		if(zjbzxx.length==0 ||kouLvs.length==0){
			$.ligerDialog.warn("租金标准信息或者扣率组尚未完善！",'请核查');return;
		}
		klzggRows.remove();
		var rowIndex=0;
		for(var j=0,kouLv;kouLv=kouLvs[j++];){
			for(var i=0,row;row=zjbzxx[i++];){
				var sjd = $("name$='sjd'",row).val();
				var kouLvZu = $("name$='klzbh'",kouLv).val();
				
				FormUtil.addRow(klzggTableDiv);
				var curRol = $(".listRow:visible",$("[tablename='me_zlhtqd_klzgz']"))[rowIndex++];
				$("name$='sjd'",curRol).val(sjd);$("name$='sjd'",curRol).trigger("change");
				$("name$='lvz'",curRol).val(kouLvZu);$("name$='lvz'",curRol).trigger("change");
			}
		}
	}
	/*处理扣率时间段*/
	function handelKoulvTime(obj){
		var curRow = $(obj).closest(".listRow");
		var shijianNo = $("[name$='sjd']",curRow).val();
		if(!shijianNo) return ;
		/*取的时间段*/
		var shiJianDuanNo =$("[name='s:me_zlhtqd_zjbzxx:sjd'][value="+shijianNo+"]");
		if(shiJianDuanNo.length ==0) {
			$.ligerDialog.warn("该时间段不存在！ “"+shijianNo+"”",'请核查');
			$("[name$='sjd']",curRow).val("");
			return ;
		}
		var shiJianDuanRow = shiJianDuanNo.closest(".listRow");
		var StartDate = $("[name$='ksrq']",shiJianDuanRow).val();
		var endDate = $("[name$='jsrq']",shiJianDuanRow).val();
		if(!StartDate || !endDate) {
			$.ligerDialog.warn("改时间段信息不完善！ “"+shijianNo+"”",'请核查');
			$("[name$='sjd']",curRow).val("");
			return ;
		}
		
		$("[name$='ksrq']",curRow).val(StartDate);
		$("[name$='jsrq']",curRow).val(endDate);
		
		initXSJEQvalidateRule();
	}

	/*处理扣率组*/
	function handelKoulvGroup(obj){
		var curRow = $(obj).closest(".listRow");
		var koulvNo = $(obj).val();
		if(!koulvNo) return ;
		/*取扣率组*/
		var KouLv =$("[name='s:me_zlhtqd_klz:klzbh'][value="+koulvNo+"]");
		if(KouLv.length ==0) {
			$.ligerDialog.warn("该扣率组不存在！ “"+koulvNo+"”",'请核查');
			$(obj).val("");
			return ;
		}
		initXSJEQvalidateRule();
	}
	/*循环判断扣率组，初始化销售金额起,校验扣率组金额*/
	function initXSJEQvalidateRule(){ 
		var kouLvRules = $(".listRow:visible",$("[tablename='me_zlhtqd_klzgz']"));
		var combineMessage = [];
		for(var i=0,rule;rule=kouLvRules[i++];){
			var sjdInput=$("[name$=':sjd']",rule);
			if(sjdInput.length==0){ /*只读状态*/
				var sjd = $("[name='sjd_td']",rule).text().trim(); /*时间段*/
				var klz = $("[name='sjd_td']",rule).text().trim();/*扣率组*/
			}else{
				var sjd = sjdInput.val(); /*时间段*/
				var klz = $("[name$=':klz']",rule).val();/*扣率组*/
			}
			if(!sjd || !klz) return;
			 /*第一次设置开始金额为当前金额为第几行*/	
			var len=-1;
			for(var j=0,r;r=combineMessage[j++];){
				if(r.split("-")[0] == sjd+","+klz){
					len =Number(r.split("-")[1]);
				}
			}
			if(len==-1){
				$("[name$='zqxsjeq']",rule).val("0");$("[name$='zqxsjeq']",rule).trigger("change");
			}else{
				var JJJine = $("[name$='zqxsjez']",$(kouLvRules[len])).val(); /*上一截止金额*/
				$("[name$='zqxsjeq']",rule).val(JJJine);
				fillColorByCompare(rule,kouLvRules[len],"kl");
			}
			combineMessage.push(sjd+","+klz+"-"+(i-1));
		}
	} 
	/*校验周期销售金额止*/
	function 　checkZqxsjez(obj){
		var curRow = $(obj).closest(".listRow");
		 var JeQi = $("[name$='zqxsjeq']",curRow).val();
		 var jeZhi =$(obj).val();
		 if(JeQi&&jeZhi)
		 if( FormUtil.commaback(JeQi) > FormUtil.commaback(jeZhi)){
			 $.ligerDialog.warn("周期销售金额止:"+jeZhi+  "　不应该小于 周期销售金额起 ："+JeQi+"",'请核查！');
				$(obj).val("");
				return ;
		 }
		 initXSJEQvalidateRule();
	}
	/*【物业费条款添加事件】me_zlhtqd_wyftk*/
	function me_zlhtqd_wyftkAddRowAfterEvent(curRow){
		var preRow = $(curRow).prev();
		/*获取原结算标准最后一个序号*/
		if(preRow.length==0 ||preRow.attr("style") == 'display: none;'){
			preRow = $(".listRow:visible",$("[tablename='me_zlhtqd_ywyftk']")).last();
		}
		var preNx = $("[name$='nx']",preRow).val();
		if(!preNx) preNx=0;
		$("[name$='nx']",curRow).val(1+Number(preNx));
		$("[name$='xh']",curRow).val(1+Number(preNx));
		
		if(validateWyfDates(curRow) == false)$(curRow).remove();
	}

	/*校验物业费时间**/
	function validateWyfDates(row){
		//租赁有效期起
		var zuLinStart  =$("[name='m:me_zlhtqd:zlyxqq']");
		var zuLinStartDate  = zuLinStart.val();
		var zuLinEndDate  =$("[name='m:me_zlhtqd:zlyxqz']").val();
		if((!zuLinStartDate || !zuLinStartDate) && row){ 
			$.ligerDialog.warn("尚未输入租赁起止日期！",'请核查'); 
			return false;
		}
		//循环计算开始日期
		var rows = $(".listRow:visible",$("[tablename='me_zlhtqd_wyftk']"));
		for(var i=0,row;row=rows[i++];){
			if(i>1){ //填充字段颜色
				fillColorByCompare(row,$(rows[i-2]),"xs");
				fillColorByCompare(row,$(rows[i-2]),"dj");
				fillColorByCompare(row,$(rows[i-2]),"je");
				fillColorByCompare(row,$(rows[i-2]),"zje");
			}
			if(zuLinStart.length==0) continue;
			
			var shiJianDuan = $("[name$='sjd']",$(row)).val(i); //时间段
			if(i>1){
				//开始日期等于上个结束日期加1
				var startDate = getNewDataStr($("[name$=':jsrq']",$(rows[i-2])).val(),1,1);
				$("[name$=':ksrq']",$(row)).val(startDate);
			}else{
				$("[name$=':ksrq']",$(row)).val(zuLinStartDate);
			}
			//校验结束日期
			var jsrq =$("[name$=':jsrq']",row).val();
			if(!jsrq) continue;
			var differTotalEndDate = FormDate.compareDate(jsrq, zuLinEndDate);
			if(differTotalEndDate<0){
				$.ligerDialog.warn("结束日期不能晚于租赁有效期止！",'请核查！');
				$("[name$='jsrq']",curRow).val("")
			}
		}
	}

	/*总物业费**/
	function calZongWuYeFei(obj){
		var curRow = $(obj).closest(".listRow"); 
		//校验是否超过总日期
		var zuLinEndDate =$("[name='m:me_zlhtqd:zlyxqz']").val();
		var differTotalEndDate = FormDate.compareDate($("[name$=':jsrq']",curRow).val(), zuLinEndDate);
		if(differTotalEndDate<0)  {
			$.ligerDialog.warn("当前结束日期不能晚于租赁有效期止！",'请核查');
			$("[name$='jsrq']",curRow).val("")
			return ;
		}
		
		var danJia = FormUtil.commaback($("[name$='dj']",curRow).val()); // 单价
		if(! danJia>0) return; 
		
		var mianJi = $("[name='m:me_zlhtqd:jzmj']").val();
		if(!mianJi){
			$.ligerDialog.warn("建筑面积尚未计算生成!",'请核查');
			return ;
		}
		var baoDiType =$("[name$='glfxx']",curRow).val();
		
		var xs = $("[name$='xs']",curRow).val();
		var jine = FormMath.tofixed(mianJi * danJia * xs,2);

		$("[name$='je']",curRow).val(jine); $("[name$='je']",curRow).trigger("change");
		
		var startDate = $("[name$='ksrq']",curRow).val();
		var endDate = $("[name$='jsrq']",curRow).val();
		if(baoDiType =="0"){ //按月
			var zongJine = calMountZujin(startDate,endDate,jine);
		}else{
			var days = FormDate.dateVal(startDate, endDate, "day");
			var zongJine = jine*days;
		}
		zongJine =FormMath.tofixed(zongJine,2);
		$("[name$='zje']",curRow).val(zongJine);$("[name$='zje']",curRow).trigger("change");
	 }
	
/*切换收银方式*/
function changeTYShouYin(){
	var type = $("select[name='m:me_zlhtqd:tysy']");
	if(type.length==0) type = $("#changeTYShouYin").text().trim();
	else type = type.val();
	
	if(type==0 || type =='否') {
		$(".tongyishouyin").hide();
		$("input",$(".tongyishouyin")).val("");
	}
	else  $(".tongyishouyin").show();
}

/*改变【是否特殊条款】*/
function changeSftstk(){
	var sftstk = $("[name='m:me_zlhtqd:sftstk']");
	if(sftstk.length ==0){
		sftstk =$("#sftstk").text().trim();
	}else{
		sftstk = sftstk.val();
	} 
	
	if(sftstk == "1" || sftstk=='是'){
		$(".tstk_tr").show();
	} else{ 
		$(".tstk_tr").hide();
		$("textarea",$(".tstk_tr")).val("");
	}
}

/*改变【申报类型】*/
function changeSblx(){
	var sblx = $("[name='m:me_zlhtqd:sblx']");
	if(sblx.length ==0) sblx = $("#shenbaoLeixing").text().trim();
	else sblx = sblx.val();
		
	if(sblx == "2" || sblx == '是') $("#sbyy_tr").show();
	else {
		$("#sbyy_tr").hide();
		$("textarea",$("#sbyy_tr")).val("");
	}
}

/*加载时，改变【每月收费项目】的【收费方式】*/
function loadChangeSffs(){
	var sffs = $("[name$='sffs']:visible",$("[tablename='me_zlhtqd_mysfxm']"));
	sffs.each(function (i) {
		changeSffs(this);
	});
}

/*改变【每月收费项目】的【收费方式】*/
function changeSffs(obj){
	var $tr = $(obj).closest("tr");
	var sffs = $("[name$='sffs']",$tr).val(); /*收费方式*/
	$("[name$='dj']",$tr).off();
	 $("[name='shouFeiGuiZe']",$tr).show();
	switch(sffs){
		case "0":		/*固定金额类型 ： 只能录入收费金额*/
		case "4":		
			 $("[name$='dj']",$tr).attr("readonly","readonly").val("");
			 $("[name$='sfje']",$tr).removeAttr("readonly");
			 $("[name$='kl']",$tr).attr("readonly","readonly").val("");
		  break;
		case "1":		/*比率类型：只能录入比率*/
		case "2":
		case "5":
			 $("[name$=':sfgz']",$tr).val("");
			 $("[name$=':sfgzID']",$tr).val("");
			 $("[name='shouFeiGuiZe']",$tr).hide().parent().css("width","170px");
			$("[name$='dj']",$tr).attr("readonly","readonly").val("");
			$("[name$='sfje']",$tr).attr("readonly","readonly").val("");
			$("[name$='kl']",$tr).removeAttr("readonly");
		  break;
		case "3":		/*每平方米单价类型：只能录入单价*/
			 $("[name$='dj']",$tr).removeAttr("readonly");
			$("[name$='sfje']",$tr).attr("readonly","readonly").val("");
			$("[name$='kl']",$tr).attr("readonly","readonly").val("");
			//计算价格
			 $("[name$='dj']",$tr).on("blur",function(){
				 var dj =  FormUtil.commaback($(this).val()); 
				 var curRow = $(this).closest(".listRow"); 
				 var mianJi = $("[name='m:me_zlhtqd:jzmj']").val();
				 if(!mianJi) $.ligerDialog.warn("尚未生成面积");
				 $("[name$='sfje']",curRow).val(dj*mianJi);
			 });
		  break;
		default:
	}
}
/*校验每月收费项目*/
function validateMysfxm (){
	var zuLinStartDate  =$("[name='m:me_zlhtqd:zlyxqq']").val();
	var zuLinEndDate  =$("[name='m:me_zlhtqd:zlyxqz']").val();
	
	var sfxm = $(".listRow:visible",$("[tablename='me_zlhtqd_mysfxm']"));
	var sfxmArray =[];
	
	for(var i=0,row;row=sfxm[i++];){
		var ksrq = $("[name$='ksrq']",$(row)).val();
		var jsrq = $("[name$='jsrq']",$(row)).val();
		if(!ksrq) continue;
		var differTotalStartDate = FormDate.compareDate(ksrq, zuLinStartDate);
		if(differTotalStartDate>0){
			$.ligerDialog.warn("每月收费项目开始日期不能早于 租赁开始日期！",'请核查');
			$("[name$='ksrq']",$(row)).val("")
		}
		
		var differTotalEndDate = FormDate.compareDate(jsrq, zuLinEndDate);
		if(differTotalEndDate<0)  {
			$.ligerDialog.warn("每月收费项目结束日期不能晚于 租赁有效期止！",'请核查');
			$("[name$='jsrq']",$(row)).val("")
		}
		var curSfxmID =$("[name$='sfxmID']",$(row)).val();
		if(curSfxmID){
			for(var j=0,prevSfxm;prevSfxm=sfxmArray[j++];){
				var thisSfxmId = prevSfxm.split("$")[0];
				/*当前收费项目第二次出现*/
				if(thisSfxmId == curSfxmID){
					var differToPrevDate = FormDate.compareDate(ksrq,prevSfxm.split("$")[1]);
					if(differToPrevDate>=0){
						$.ligerDialog.warn("同一收费项目日期不得重复！",'请核查');
						$("[name$='ksrq']",$(row)).val("");
					}
				}
			  }
			
			sfxmArray.push(curSfxmID+"$"+jsrq);
			}
		}
}



/*分解所有结算标准信息  */
function decomposeAllJs(tableName,fenjieTable){
	var $jsbzxxTrs = $(".listRow:visible",$("[tablename='"+tableName+"']"));   
	$jsbzxxTrs.each(function (i) {
		decomposeSingle($(this),fenjieTable);
	});
	
	var $jsbzxxTrs = $("input[name$=':fjsj']:checked",$("[tablename='"+tableName+"']")).closest("tr");
	showFjsj($jsbzxxTrs,fenjieTable);
}
function decomposeAllWyf(){
	decomposeAllJs('me_zlhtqd_wyftk','me_zlhtqd_wyffj');
}
function decomposeSingleWyf(){
	decomposeSingleJs('me_zlhtqd_wyftk','me_zlhtqd_wyffj');
}
function decomposeAllYzj(){
	decomposeAllJs('me_zlhtqd_zjbzxx','me_zlhtqd_ydzjfj');
}
function decomposeSingleYzj(){
	decomposeSingleJs('me_zlhtqd_zjbzxx','me_zlhtqd_ydzjfj');
}

/*单个分解*/
function decomposeSingleJs(tableName,fenjieTable){
	$jsbzxxTrs = $("input[name$=':fjsj']:checked",$("div[tablename='"+tableName+"']")).closest("tr");
	if($jsbzxxTrs.length ==0){
		$.ligerDialog.warn("请选择要分解的数据！","提示信息");
		return;
	}
	
	//分解
	decomposeSingle($jsbzxxTrs,fenjieTable);
	showFjsj($jsbzxxTrs,fenjieTable);
} 

/*【通过分解目标行来分解信息，将结果输出至分解表】 
 * 被选中的行：selectRow,分解表的表明fenJieTable*/
function decomposeSingle(selectRow,fenJieTable){
	var xh = selectRow.find("[name$=':xh']").val();	
	if(!xh){
		$.ligerDialog.warn("请选择要分解的租金标准信息","提示");
		return ;
	}
	//分解表
	var fenJieTableDiv = $("div[tablename='"+fenJieTable+"']");
	/*将序号与当前选中行所有分解信息删除*/
	$("[name$=':xh'][value=" + xh + "]",fenJieTableDiv).closest("tr").remove(); /*清除旧的记录*/
	
	var sjd =$("[name$='xh']",selectRow).val(); //序号
	var ksrq =$("[name$='ksrq']",selectRow).val();
	var jsrq =$("[name$='jsrq']",selectRow).val();
	var jsrq =$("[name$='jsrq']",selectRow).val();
	
	//物业费
	if(fenJieTable == 'me_zlhtqd_wyffj'){
		var zj =FormUtil.commaback($("[name$='je']",selectRow).val());
		var sfgz =  $("[name='m:me_zlhtqd:wyfsfgzID']").val();
		var type = $("[name$='glfxx']",selectRow).val()
	//标准租金
	}else{
		var type = $("[name$='bdxx']",selectRow).val()
		var zj =FormUtil.commaback($("[name$='zj']",selectRow).val()); 
		var sfgz =$("[name='m:me_zlhtqd:zjsfgzID']").val();
	}
	
	
	var jsonData = decompose(sjd,ksrq,jsrq,zj,sfgz,"",type);
	/*填充数据*/
	for (var i = 0, c; c = jsonData[i++];) {
		FormUtil.addRow(fenJieTableDiv);
		var rowcount=$("input[name$=':ny']",fenJieTableDiv).length;
		$($("input[name$=':xh']",fenJieTableDiv).get(rowcount-1)).val(xh);		
		$($("input[name$=':ny']",fenJieTableDiv).get(rowcount-1)).val(c.ZQY);				
		$($("input[name$=':ksrq']",fenJieTableDiv).get(rowcount-1)).val(c.KSRQ);			
		$($("input[name$=':jsrq']",fenJieTableDiv).get(rowcount-1)).val(c.JSRQ);			
		$($("input[name$=':je']",fenJieTableDiv).get(rowcount-1)).val(c.YZJ);	
		$($("input[name$=':scrq']",fenJieTableDiv).get(rowcount-1)).val(c.CDRQ);
	}
	
}
/*分解数据*/
function decompose(sjd,ksrq,jsrq,zj,gzid,mbxs,type){
	if(!type) type=0;
	var paramJson = {jlbh:sjd,ksrq:ksrq,jsrq:jsrq,yzj:zj,zjjsbz:type};
	if(mbxs) paramJson.mbxs =mbxs;
	if(gzid) paramJson.gzid =gzid;
	var jsonParams = [];
	jsonParams.push(paramJson);
	var conf = {aliasName:'decompose',paramJson:JSON.stringify(jsonParams)};
	var json = RunAliasScript(conf); 
	var test = JSON2.stringify(json);
	debugger;
    if(json.isSuccess==0){
    	return JSON.parse(json.result);
	 }else{
		 $.ligerDialog.error("分解失败："+json.msg,"提示信息");
		 return [];
	 }
}



/*显示分解信息列表 */
function showFjsj(obj,fenJieTable){
	var fenJieTableDiv =$("div[tablename='"+fenJieTable+"']");
	var tableDiv = $(obj).closest("[tablename]");
	var selectRow =$("input[name=':fjsj']:checked",tableDiv).closest("tr");
	
	var xh = selectRow.find("[name$=':xh']").val();/*选择行*/
	
	$(".listRow:visible",fenJieTableDiv).hide();	/*先隐藏全部，在显示个体*/
	$("[name$=':xh'][value=" + xh + "]",fenJieTableDiv).closest("tr").show(); 
	
	$("td.tdNo", $(".listRow:visible",fenJieTableDiv)).each(function(i) {
		$(this).text(i + 1);
	});
	
	$("[name$=':zj']").trigger("blur");
}
/*格式化填充的日期*/
$().ready(function (){
	$("[formatDate]").live('change',function (){
		var me = $(this),val = me.val();
		if(!$.isEmpty(val)){
			var arry = val.split(".");
			var sTime = arry[0].replace(/\-/g, "/");
			var datefmt = me.attr("datefmt");
			var nowDate = new Date(sTime).Format(datefmt);
			me.val(nowDate);
		}
	});
	
	$("div[tablename='me_zlhtqd_ydzjfj']").find(".listRow").hide();	/*【月度租金分解】不能直接控制隐藏，否则权限控制不了,先隐藏全部，在显示个体*/
	$("div[tablename='me_zlhtqd_wyffj']").find(".listRow").hide();	/*【物业费分解】不能直接控制隐藏，否则权限控制不了,先隐藏全部，在显示个体*/
	
});


/**日期加上多少天     type: m=2/d=1/y=3   number:几天 */
function getNewDataStr(curDateStr,number,type){
	if(!curDateStr) return "";
	curDateStr = curDateStr.replace(/\-/g, "/");
	var curDate =  new Date(curDateStr);
	if(type==1) curDate.setDate(curDate.getDate()+number); 
	if(type==2) curDate.setMonth(curDate.getMonth()+number);
	if(type==3) curDate.setFullYear(curDate.getFullYear()+number); 

	var y=curDate.getFullYear();
	var m=curDate.getMonth()+1;
	var d=curDate.getDate();
	 
	if(m<=9)m="0"+m; if(d<=9)d="0"+d;
	var cdate=y+"-"+m+"-"+d;
	return cdate; //开始时间
} 