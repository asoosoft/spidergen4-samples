/**
 * @author cheol
 */
function ARadioButton()
{
	AComponent.call(this);

	this.selectClass = 'radiobtn_check';
	
	this.isSelected = false;
	//this.isSafeClick = false; 
}
afc.extendsClass(ARadioButton, AComponent);

ARadioButton.CONTEXT = 
{
    tag:'<span data-base="ARadioButton" data-class="ARadioButton" class="ARadioButton-Style">RadioButton</span>',
    
    defStyle: 
    {
        width:'100px', height:'20px'
    },

    events: ['click']
};

ARadioButton.NAME = "ARadioButton";


ARadioButton.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	this.setSelectStyle( this.getAttr('data-select-class') );
	
	this.value = this.$ele.attr('data-radio-value');
	
	// 추후 시작시 선택여부를 속성으로 지정가능한 경우 소스 변경처리
	this.setSelect(false);
};

/*
ARadioButton.prototype.setSelectStyle = function(ncClass, cClass)
{
	if(ncClass) this.noSelectClass = ncClass;
	if(cClass) this.selectClass = cClass;
	if(this.isSelected) this.setSelect(true);
};

ARadioButton.prototype.setSelect = function(check)
{
	this.isSelected = check;
	
    if(this.selectClass && this.noSelectClass)
    {
        if(this.isSelected)
		{
			this.removeClass(this.noSelectClass)
			this.addClass(this.selectClass);
		}
        else
		{
			this.removeClass(this.selectClass)
			this.addClass(this.noSelectClass);
		}
    }
};
*/
ARadioButton.prototype.setSelectStyle = function(selectClass)
{
	// 기존 체크 스타일 제거
	if(this.isSelected) this.removeClass(this.selectClass);
	
	if(selectClass) this.selectClass = selectClass;
	
	this.setSelect(this.isSelected);
};

ARadioButton.prototype.setSelect = function(isSelect)
{
	//if(this.isSelected==isSelect) return;
	
	this.isSelected = isSelect;
	
    if(this.isSelected)
	{
		this.addClass(this.selectClass);
	}
    else
	{
		this.removeClass(this.selectClass)
	}
};


ARadioButton.prototype.getSelect = function()
{
	return this.isSelected;
};

ARadioButton.prototype.getText = function()
{
	return this.$ele.text();
};

ARadioButton.prototype.setText = function(text)
{
	this.$ele.text(text);
};


//add ukmani100
ARadioButton.prototype.setValue = function(value)
{
	this.value = value;
};

ARadioButton.prototype.getValue = function()
{
	return this.value;
};

ARadioButton.prototype.setCheckAlign = function(align)
{
	this.$ele.css({		
		'padding-left' : align == 'left' ? '20px' : '0px',
		'padding-right' :align == 'right' ? '20px' : '0px',
		'background-position' : align + ' center'
	});
};

ARadioButton.prototype.getCheckAlign = function()
{		
	var pos = this.element.style['background-position'];
	
	return pos.split(' ')[0];
};

ARadioButton.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length == 0) return;
	
	if(this.getSelect())
	{
		var value = this.getValue();
		dataArr[0][keyArr[0]] = value!=undefined ? value : 1;
	}
};

ARadioButton.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	this.setSelect(dataArr[0][keyArr[0]]);
};

ARadioButton.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
		
	var val = this.getAttr('data-select-class');

	//attr value 에 null 이나 undefined 가 들어가지 않도록
	ret['data-select-class'] = val ? val : '';
	
	return ret;
};

ARadioButton.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) AComponent.prototype._setDataStyleObj.call(this, styleObj);
		else this.setAttr(p, styleObj[p]);
	}
};
