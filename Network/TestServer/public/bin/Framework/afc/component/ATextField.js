
/**
 * @author asoocool
 */

function ATextField()
{
	AComponent.call(this);
	
	this.isTimerChange = false;
	this.keyPropagation = false;
}
afc.extendsClass(ATextField, AComponent);

ATextField.CONTEXT = 
{
    tag: '<input data-base="ATextField" data-class="ATextField" type="text" value="Text" class="ATextField-Style"/>',
        
    defStyle: 
    {
        width:'100px', height:'22px'  
    },

    events: ['change', 'focus', 'blur']
};

ATextField.DELAY_TIME = 200;
//if(afc.andVer<4.1) ATextField.DELAY_TIME = 500;

ATextField.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//if(this.$ele.attr('disabled')) this.enable(false);

	//asoocool 자동완성으로 인한 버그 수정
	this.$ele.attr('autocomplete', 'off');

	//this.setPatternByType();
	
	//if(!this.element.preventEvent) ATextFieldEvent.implement(this);
	
	this.setImeOnIE();
	this.enableTimerChange(this.getAttr('data-timer-change'));
};

ATextField.prototype.enableTimerChange = function(enable)
{
	this.isTimerChange = enable;
};

ATextField.prototype.setDataType = function(dataType)
{
	this.setAttr('type', dataType);
};

ATextField.prototype.getDataType = function()
{
	return this.getAttr('type');
};

ATextField.prototype.setPadOption = function(padOption)
{
	this.padOption = padOption;
};


ATextField.prototype.setPlaceholder = function(placeholder)
{
	this.setAttr('placeholder', placeholder);
};

ATextField.prototype.getPlaceholder = function()
{
	return this.getAttr('placeholder');
};


ATextField.prototype.setText = function(text)
{
	if(this.element.dm) text = this.element.dm.mask(text);
	
	this.element.value = text;
	this.aevent.oldText = text;
};

ATextField.prototype.setAttrValue = function(text)
{
	this.setText(text);
	
	this.setAttr('value', this.element.value);
};

ATextField.prototype.getAttrValue = function()
{
	return this.getText();
};

ATextField.prototype.getText = function()
{
	if(this.element.dm) return this.element.dm.unmask();
	
	return this.element.value;
};

ATextField.prototype.setTextAlign = function(align)
{
	this.setStyle('textAlign', align);
};

ATextField.prototype.setReadOnly = function(isReadOnly)
{
    if(isReadOnly) this.$ele.attr('readonly', isReadOnly);
    else this.$ele.removeAttr('readonly');
};

ATextField.prototype.getTextAlign = function()
{
	return this.getStyle('textAlign');
};

ATextField.prototype.setPadding = function(padding)
{
	this.setStyle('padding', parseInt(padding, 10)+'px');
};


ATextField.prototype.getPadding = function()
{
	return this.getStyle('padding');
};

ATextField.prototype.enable = function(isEnable)
{
	if(isEnable)
	{
		var thisObj = this;
		setTimeout(function() { AComponent.prototype.enable.call(thisObj, isEnable); }, afc.DISABLE_TIME-100);
	}
	else AComponent.prototype.enable.call(this, isEnable);
};

ATextField.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	//생성되어져 있는 객체에 셋팅하는 구조
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
	
	/*
	//객체를 생성해 추가하는 구조
	var obj = {};
	obj[keyArr[0]] = this.getText();
	dataArr.push(obj);
	*/
};

ATextField.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var value = dataArr[0][keyArr[0]];
	
	if(value == undefined) return;
	
	this.setText(value);
};

//IME IE에서 설정 css로
ATextField.prototype.setImeOnIE = function()
{
	var value = this.getAttr('ime-mode');
	if(value) this.setStyle('ime-mode', value);
};

//IME IE제외 설정
ATextField.prototype.setIme = function()
{
	if(!afc.isIE)
	{
		if(afc.isMapis)
		{
			var value = this.getAttr('ime-mode');
			if(value == 'active') SetMapsData('IME', 0);
			else if(value == 'inactive') SetMapsData('IME', 1);
		}
		//브라우저가 크롬일때 처리 -> 일단 안하기로함
	}
};