/**
 * @author lee
 */

function ASwitchButton()
{
	AComponent.call(this);

	this.backOnStyle = 'switch-on';
	this.backOffStyle = 'switch-off';
	
	this.barEl = null;     //바 버튼 돔객체
	
	this.textArr = null;
	this.isOn = false;
}

afc.extendsClass(ASwitchButton, AComponent);

ASwitchButton.CONTEXT = 
{
    tag: '<div data-base="ASwitchButton" data-class="ASwitchButton" class="ASwitchButton-Style"><span class=""></span></div>',
    
    defStyle: 
    {
        width:'35px', height:'20px'
    },

    events: ['change']
};

ASwitchButton.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	this.barEl = this.$ele.children().eq(0);

	this.setSwitchStyle(
		this.getAttr('data-style-on'),
		this.getAttr('data-style-off')
	);
	
	this.setValue(false);
	this.actionToFocusComp();
};

ASwitchButton.prototype.setSwitchStyle = function(backOnStyle, backOffStyle)
{
	this.setSwitchOnStyle(backOnStyle);
	this.setSwitchOffStyle(backOffStyle);
};

ASwitchButton.prototype.setSwitchOnStyle = function(backOnStyle)
{
	if(backOnStyle) 
	{
		this.backOnStyle = backOnStyle;
		if(window._afc) this.setValue(true);
	}
};

ASwitchButton.prototype.setSwitchOffStyle = function(backOffStyle)
{
	if(backOffStyle)
	{
		this.backOffStyle = backOffStyle;
		if(window._afc) this.setValue(false);
	}
};

ASwitchButton.prototype.getValue = function()
{
	return this.isOn;
};

ASwitchButton.prototype.setValue = function(isOn)
{
	this.isOn = isOn;
	
    if(this.isOn)
    {
		this.removeClass('switch-off');
		this.addClass('switch-on');
		
        this.removeClass(this.backOffStyle);
        this.addClass(this.backOnStyle);
    }
    else
    {
		this.removeClass('switch-on');
		this.addClass('switch-off');
		
        this.removeClass(this.backOnStyle);
        this.addClass(this.backOffStyle);
    } 
};

ASwitchButton.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getValue();
};

ASwitchButton.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var value = dataArr[0][keyArr[0]];
	
	if(value == undefined) return;
	
	this.setValue(value);
};

ASwitchButton.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
		
	var keyArr = ['data-style-on', 'data-style-off'], val;
	
	for(var i=0; i<keyArr.length; i++)
	{
		val = this.getAttr(keyArr[i]);

		//attr value 에 null 이나 undefined 가 들어가지 않도록
		ret[keyArr[i]] = val ? val : '';
	}
	
	return ret;
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
ASwitchButton.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) AComponent.prototype._setDataStyleObj.call(this, styleObj);
		else this.setAttr(p, styleObj[p]);
	}
};
