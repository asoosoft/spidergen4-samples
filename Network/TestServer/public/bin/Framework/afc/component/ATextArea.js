/**
 * @author asoocool
 */

function ATextArea()
{
	AComponent.call(this);
	
	this.isTimerChange = false;
}
afc.extendsClass(ATextArea, AComponent);

ATextArea.CONTEXT = 
{
    tag: '<textarea data-base="ATextArea" data-class="ATextArea" class="ATextArea-Style"></textarea>',

    defStyle: 
    {
		//asoocool 20180419
        width:'320px', height:'150px'
    },

    events: ['focus', 'change', 'blur']
};

ATextArea.READONLY_KEYS = [afc.KEY_LEFT, afc.KEY_UP, afc.KEY_RIGHT, afc.KEY_DOWN, afc.KEY_PGUP, afc.KEY_PGDOWN, afc.KEY_END, afc.KEY_HOME];


ATextArea.DELAY_TIME = 200;

ATextArea.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	//this.$ele.attr('data-role', 'none');
	
	//if(this.$ele.attr('disabled')) this.enable(false);
	
	this.setImeOnIE();
};

ATextArea.prototype.enable = function(isEnable)
{
	if(isEnable)
	{
		var thisObj = this;
		setTimeout(function() { AComponent.prototype.enable.call(thisObj, isEnable); }, afc.DISABLE_TIME-100);
	}
	else AComponent.prototype.enable.call(this, isEnable);
};

ATextArea.prototype.enableTimerChange = function(enable)
{
	this.isTimerChange = enable;
};


ATextArea.prototype.setPlaceholder = function(placeholder)
{
	this.setAttr('placeholder', placeholder);
};

ATextArea.prototype.getPlaceholder = function()
{
	return this.getAttr('placeholder');
};

ATextArea.prototype.setText = function(text)
{
	this.element.value = text;
};

ATextArea.prototype.appendText = function(text)
{
	this.element.value += text;
};

ATextArea.prototype.getText = function()
{
	return this.element.value;
};

ATextArea.prototype.setTextAlign = function(align)
{
	this.setStyle('textAlign', align);
};

ATextArea.prototype.getTextAlign = function()
{
	return this.getStyle('textAlign');
};

ATextArea.prototype.setPadding = function(padding)
{
	this.setStyle('padding', parseInt(padding, 10)+'px');
};

ATextArea.prototype.getPadding = function()
{
	return this.getStyle('padding');
};

ATextArea.prototype._readOnlyEvtFunc = function(e) 
{
	if(e.ctrlKey && e.which==afc.KEY_C) return;
	else
	{
		var inx = ATextArea.READONLY_KEYS.indexOf(e.which);
		if(inx>-1) return;
	}
	
	e.preventDefault(); 
};

ATextArea.prototype.setReadOnly = function(isReadOnly)
{
	if(isReadOnly) this.$ele.attr('readonly', 'readonly');
    else this.$ele.removeAttr('readonly');
};

ATextArea.prototype.selectableReadOnly = function(isReadOnly)
{
	if(isReadOnly) this.element.addEventListener('keydown', this._readOnlyEvtFunc, false);
	else this.element.removeEventListener('keydown', this._readOnlyEvtFunc, false);
};

ATextArea.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var value = dataArr[0][keyArr[0]];
	
	if(value == undefined) return;
	
	this.setText(value);
};

ATextArea.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
};

ATextArea.prototype.isScroll = function()
{
	return (this.element.offsetHeight < this.element.scrollHeight);
};

//IME IE에서 설정 css로
ATextArea.prototype.setImeOnIE = function()
{
	var value = this.getAttr('ime-mode');
	if(value) this.setStyle('ime-mode', value);
};

//IME IE제외 설정
ATextArea.prototype.setIme = function()
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



//<textarea> 태그 내에 text 추가
ATextArea.prototype.setInnerText = function(text)
{
	this.$ele.text(text);
};

ATextArea.prototype.getInnerText = function()
{
	return this.$ele.text();
};


