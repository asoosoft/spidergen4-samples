	

function ADataMask(ele, acomp)
{
	this.ele = ele;
	this.acomp = acomp;
	
	this.maskFuncs = [];
	this.maskParams = [];
	
	this.isClear = true;
}

// 기본 데이터
ADataMask.dataInfoArr = [];

// update 할 때마다 전체 마스크함수 목록을 저장해두는 변수
ADataMask.maskListArr = [];

// 루트뷰가 내부 컴포넌트를 realize 하고 삭제된 마스크함수 목록으로 알림창 띄우기 위한 변수
ADataMask.removedArr = [];

// 이전 업데이트 데이터와 현재 데이터로 추가된 함수를 판단하여 리턴한다.
ADataMask.update = function()
{
	var allMaskArr = [], updateArr = [], removeArr = [], tmp, i;
	
	// 함수와 배열이 아닌 전체 마스크 함수 목록을 뽑는다. type.funcName
	for(var type in ADataMask)
	{
		if(typeof ADataMask[type] == 'function' ||
		  Array.isArray(ADataMask[type])) continue;
		
		for(var funcName in ADataMask[type])
		{
			tmp = type+'.'+funcName;
			allMaskArr.push(tmp);
		}
	}
	/*
	// 전체 마스크 함수 목록에 없는 항목 제거
	for(i=0; i<ADataMask.maskListArr.length; i++)
	{
		if(allMaskArr.indexOf(ADataMask.maskListArr[i]) < 0)
		{
			removeArr.push(ADataMask.maskListArr[i]);
		}
	}*/
	
	// 이전에 확인했을 때의 마스크 함수 외에 추가된 함수 추가
	for(i=allMaskArr.length-1; i>0; i--)
	{
		if(ADataMask.maskListArr.indexOf(allMaskArr[i]) < 0)
		{
			updateArr.push(allMaskArr[i]);
		}
	}
	
	ADataMask.maskListArr = allMaskArr;
	
	return updateArr;
};

ADataMask.prototype.mask = function(value, ele)
{
	if(ele) this.ele = ele;
	this.setOriginal(value);
	
	if(window._afc)
	{
		this.ele.setAttribute('data-maskorigin', value);
		try{
			for(var i=0; i<this.maskFuncs.length; i++)
				value = this.maskFuncs[i].call(this, value, this.maskParams[i], this.ele );
		}catch(e){
			//console.log(e);
		}
	}
	else
	{
		for(var i=0; i<this.maskFuncs.length; i++)
			value = this.maskFuncs[i].call(this, value, this.maskParams[i], this.ele );
	}
	
	if(this.isClear) this.data = this.keyArr = this.queryData = null;
	
	return value;
};

ADataMask.prototype.unmask = function(ele)
{
	if(ele) this.ele = ele;
	return this.getOriginal(ele);
};

ADataMask.prototype.insertMaskFunc = function(func, param, inx)
{
	if(func) 
	{
		if(inx==undefined)
		{
			this.maskFuncs.push(func);
			this.maskParams.push(param);
		}
		else
		{
			this.maskFuncs.splice(inx, 0, func);
			this.maskParams.splice(inx, 0, param);
		}
	}
};

ADataMask.prototype.updateMaskFunc = function(func, param, inx)
{
	if(inx!=undefined && inx < this.maskFuncs.length)
	{
		if(func) this.maskFuncs[inx] = func;
		if(param) this.maskParams[inx] = param;
	}
};

ADataMask.prototype.moveMaskFunc = function(fromIdx, toIdx)
{
	if(fromIdx == undefined || toIdx == undefined) return;
	if(fromIdx < 0 || fromIdx > this.maskFuncs.length-1) return;
	if(toIdx < 0 || toIdx > this.maskFuncs.length-1) return;
	
	var func = this.maskFuncs.splice(fromIdx, 1)[0];
	var param = this.maskParams.splice(fromIdx, 1)[0];
	
	this.maskFuncs.splice(toIdx, 0, func);
	this.maskParams.splice(toIdx, 0, param);
};


ADataMask.prototype.removeMaskFunc = function(inx)
{
	if(inx != undefined)
	{
		this.maskFuncs.splice(inx, 1);
		this.maskParams.splice(inx, 1);
	}
};

// 개발에서 마스크를 제거하거나 추가할 때 호출하여 마스킹처리하는 함수
ADataMask.prototype.resetElement = function()
{
	if(!this.ele) return;
	var value = this.mask(this.original);
	
	if(typeof value != 'string') value = '';
	
	if(this.ele.dataset.base == 'ATextField')
	{
		this.acomp.setAttrValue(this.original);
		/*this.ele.value = value;
		this.ele.setAttribute('value', this.ele.value);*/
	}
	else this.ele.innerHTML = value;
};

ADataMask.prototype.setOriginal = function(original)
{
	this.ele.dmOriginal = original;
};

ADataMask.prototype.getOriginal = function()
{
	return this.ele.dmOriginal;
};

ADataMask.setQueryData = function(data, keyArr, queryData)
{
	ADataMask.dataInfoArr = [data, keyArr, queryData];
};

ADataMask.getQueryData = function(data, keyArr, queryData)
{
	return ADataMask.dataInfoArr;
};

ADataMask.clearQueryData = function()
{
	ADataMask.dataInfoArr = [];
};
/*
ADataMask.prototype.setQueryData = function(data, keyArr, queryData)
{
	this.data = data;
	this.keyArr = keyArr;
	this.queryData = queryData;
};

ADataMask.prototype.getQueryData = function()
{
	return {data: this.data, keyArr: this.keyArr, queryData: this.queryData};
};
*/
ADataMask.Number = 
{
	money:
	{
		title: '정수부의 3자리마다 콤마를 넣는다.',
		func: function money(value, param, ele)
		{
			if(value == undefined) value = '';
			else
			{
				var reg = /(^[+-]?\d+)(\d{3})/;
				value += "";
				//while (reg.test(value.toString()))
				while( reg.test(value) )
					value = value.replace(reg, '$1' + ',' + '$2');
			}

			return value;
		}
	},
	
	removeComma:
	{
		title: '콤마를 제거한다.',
		func: function removeComma(value, param, ele)
		{
			if(!value) return '';
			else return value.toString().replace(/,/g, '');
		}
	},
	
	decimalAdjust:
	{
		title: '숫자의 소수점 이하를 조절한다. 숫자값 리턴',
		param: ['유형(floor, round, ceil)', '지수값'],
		func: function decimalAdjust(value, param, ele)
		{
			var type = param[0]?param[0]:'floor',
				exp = param[1];
			
			// If the exp is undefined or zero...
			if (typeof exp === 'undefined' || +exp === 0) {
				return Math[type](value);
			}
			value = +value;
			exp = +exp;
			// If the value is not a number or the exp is not an integer...
			if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
				return NaN;
			}
			// Shift
			value = value.toString().split('e');
			value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
			// Shift back
			value = value.toString().split('e');
			return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
		}
	},
	
	toFixed:
	{
		title: '지정된 숫자를 고정 소수점 표기법을 사용한 문자열로 만들어 리턴한다.',
		param: ['소수점 뒤 자릿수'],
		func: function toFixed(value, param, ele)
		{
			return (+value).toFixed(param[0]);
		}
	},
	
	abs:
	{
		title: '절대값을 만들어 문자로 리턴한다.',
		func: function abs(value, param, ele)
		{
			value = value.toString();
			if(value.charAt(0) == '-') return value.substring(1);
			else return value;
		}
	},
	
	percent:
	{
		title: '뒷부분에 %를 붙인다.',
		func: function percent(value, param, ele)
		{
			return value + '%';
		}
	},
	
	abs_percent:
	{
		title: '절대값을 만들고 뒷부분에 %를 붙여 리턴한다.',
		func: function abs_percent(value, param, ele)
		{
			return ADataMask.Number.percent.func(ADataMask.Number.abs.func(value));
		}
	},
	// 더미 데이터의 길이만큼 '●'를 생성
	makeDummyString:
	{
		title: '더미 데이터의 길이만큼 ●문자를 넣는다.',
		func: function makeDummyString(value, param, ele)
		{
			var dumStr = '';
			for(var i=0; i<value.length; i++) dumStr += '●';
			return dumStr;
		}
	},
	// 사업자번호
	business:
	{
		title: '입력된 값을 사업자번호 포맷으로 변경한다. ###-##-#####',
		func: function business(value, param, ele)
		{
			value = value.replace(/[^0-9]/g, '');
			value = value.substring(0, 10);
			
			if(value.length>5) value = value.substring(0,3) + '-' + value.substring(3,5) + '-' + value.substring(5,10);
			else if(value.length>3) value = value.substring(0,3) + '-' + value.substring(3,5);
			return value;	//value.replace(/([0-9]{3})([0-9]{2})([0-9]{5})/,"$1-$2-$3");
		}
	},
	// 법인등록번호
	corporate:
	{
		title: '입력된 값을 법인등록번호 포맷으로 변경한다. ######-#######',
		func: function corporate(value, param, ele)
		{
			value = value.replace(/[^0-9]/g, '');
			value = value.substring(0, 13);
			
			if(value.length>6) value = value.substring(0,6) + '-' + value.substring(6,13);
			return value;	//value.replace(/([0-9]{6})([0-9]{7})/,"$1-$2");
		}
	},
};

ADataMask.Date = 
{
	date:
	{
		title: 'YYYY@MM@DD 형태로 변경한다. parseInt 처리한 값으로 표현한다.',
		param: ['구분자(기본값 /)'],
		func: function date(value, param, ele)
		{
			var divider = '/';
			if(param[0]) divider = param[0];
			if(!parseInt(value, 10)) return '';
			value+='';
			return value.substring(0,4)+divider+value.substring(4,6)+divider+value.substring(6,8); 
		}
	},
	time:
	{
		title: 'HH@MM@SS 형태로 변경한다. parseInt 처리한 값으로 표현한다.',
		param: ['구분자(기본값 /)'],
		func: function time(value, param, ele)
		{
			var divider = '/';
			if(param[0]) divider = param[0];
			if(!parseInt(value, 10)) return '';
			value+='';
			return value.substring(0,2)+divider+value.substring(2,4)+divider+value.substring(4,6); 
		}
	},
};

ADataMask.DataGrid = 
{
	dataType:
	{
		title: 'ADataGrid 셀의 type을 지정한다.',
		param: ['타입(button, checkbox, radio)'],
		func: function(value, param, ele)
		{
			value.type = param[0];
			return value;
		}
	}
};
/*
ADataMask.Text = 
{
	prefix:
	{
		title: '데이터의 뒷부분에 문자를 넣는다.',
		param: ['들어갈 문자'],
		func: function(value, param, ele)
		{
			var txt = '';
			if(param[0]) txt = param[0];
			return value += txt;
		}
	},
	suffix:
	{
		title: '데이터의 앞부분에 문자를 넣는다.',
		param: ['들어갈 문자'],
		func: function(value, param, ele)
		{
			var txt = '';
			if(param[0]) txt = param[0];
			return value = txt + value;
		}
	},
};*/

