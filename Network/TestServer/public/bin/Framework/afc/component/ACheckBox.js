
function ACheckBox()
{
	AComponent.call(this);

	this.checkClass = 'checkbox_check';
	this.isChecked = false;
	this.isSafeClick = false; 
}
afc.extendsClass(ACheckBox, AComponent);

ACheckBox.CONTEXT = 
{
    tag:'<span data-base="ACheckBox" data-class="ACheckBox" class="ACheckBox-Style">CheckBox</span>',
    
    defStyle: 
    {
        width:'100px', height:'20px' 
    },

    events: ['click']
};

//add ukmani100
ACheckBox.NAME = "ACheckBox";

ACheckBox.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	this.setCheckStyle(this.getAttr('data-check-class'));
	
	this.value = this.$ele.attr('data-check-value');
	this.setCheck(false);
};

ACheckBox.prototype.setCheckStyle = function(checkClass)
{
	// 기존 체크 스타일 제거
	if(this.isChecked) this.removeClass(this.checkClass);
	
	if(checkClass) this.checkClass = checkClass;
	
	this.setCheck(this.isChecked);
};

ACheckBox.prototype.setCheck = function(check)
{
	this.isChecked = check;
	
	if(this.isChecked)
	{
		this.addClass(this.checkClass);
	}
	else
	{
		this.removeClass(this.checkClass);
	} 
};

ACheckBox.prototype.getCheck = function()
{
	return this.isChecked;
};

ACheckBox.prototype.setText = function(text)
{
	this.$ele.text(text);
};

ACheckBox.prototype.getText = function()
{
	return this.$ele.text();
};

ACheckBox.prototype.setValue = function(value)
{
	this.value = value;
};

ACheckBox.prototype.getValue = function()
{
	return this.value;
};

ACheckBox.prototype.setCheckAlign = function(align)
{
	this.$ele.css({		
		'padding-left' : align == 'left' ? '20px' : '0px',
		'padding-right' :align == 'right' ? '20px' : '0px',
		'background-position' : align + ' center'
	});
	
};

ACheckBox.prototype.getCheckAlign = function()
{		
	var pos = this.element.style['background-position'];
	
	return pos.split(' ')[0];
};

ACheckBox.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	dataArr[0][keyArr[0]] = this.getCheck();
};

ACheckBox.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	this.setCheck(dataArr[0][keyArr[0]]);
};

ACheckBox.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
		
	var val = this.getAttr('data-check-class');

	//attr value 에 null 이나 undefined 가 들어가지 않도록
	ret['data-check-class'] = val ? val : '';
	
	return ret;
};

ACheckBox.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) AComponent.prototype._setDataStyleObj.call(this, styleObj);
		else this.setAttr(p, styleObj[p]);
	}
};
