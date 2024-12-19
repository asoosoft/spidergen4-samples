
/**
 * @author asoocool
 */

//-----------------------------------------------------------------------------------------
//  AButton class
//	버튼의 normal 상태는 없고 기본 색상과 스타일이 normal 상태이다.
//	기본 색상과 스타일을 기준으로 downState, overState, disableState 를 기본적으로 제공해 준다.
//	추가적으로 over, down, disable 상태를 변경하고 싶은 경우는 setBtnStyle 함수를 통해 
//	style 파일의 키를 넣어준다. 
//	스타일 파일에서 over,down,disable 스타일 키는 normal style 키보다 순서상으로 밑에 있어야 한다.
//-----------------------------------------------------------------------------------------

function AButton()
{
	AComponent.call(this);

   	this.btnStyles = ['','',''];
};
afc.extendsClass(AButton, AComponent);


AButton.CONTEXT = 
{
    //tag:'<button data-base="AButton" data-class="AButton" data-flag="0001" data-state="0" class="AButton-Style AButton-normal">Button</button>',
	tag:'<button data-base="AButton" data-class="AButton" data-flag="0001" class="AButton-Style">Button</button>',

    defStyle: 
    {
    	width:'80px', height:'22px' 
    },
   
    events: ['click', 'longtab']
};

AButton.OVER = 0;
AButton.DOWN = 1;
AButton.DISABLE = 2;

AButton.STATE = ['over', 'down', 'disable'];

AButton.NAME = "AButton";


AButton.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	if(afc.isIos && !this.getStyle("padding-left")) this.$ele.css('padding','0px 0px 1px 0px');
	
	this.$img = this.$ele.children();
	
	this.setOption(
	{
		imgAfterText: this.$ele.attr('data-aftertext'),	//이미지가 텍스트 뒤로 갈지 여부
		imgNewLine: this.$ele.attr('data-newline'),		//버튼과 이미지 줄바꿈 여부
		isToolBtn: this.getAttr('data-tool-button'),
		isCheckBtn: this.getAttr('data-check-button'),		//체크용 버튼인지
		autoDownState: !this.getAttr('data-down-state')	//자동으로 버튼 다운 상태를 변경해 줄지
	});
	
	this.saveBaseState();
	
	for(var i=0; i<AButton.STATE.length; i++)
		this.btnStyles[i] = this.getAttr('data-style-' + AButton.STATE[i]);
	
	this.isSafeClick = !this.getAttr('data-speed-button');
	
	this.isChecked = false;										//체크되어 있는 상태인지
};

//AButton.prototype.setCheckButton = function(isSet) { this.isCheckBtn = isSet; };
//AButton.prototype.setToolButton = function(isSet) { this.isToolBtn = isSet; };

AButton.prototype.setCheck = function(check) 
{
	if(!this.option.isCheckBtn) return;
	
	this.isChecked = check;
	
	if(this.isChecked) this.changeBtnState(AButton.DOWN);
	else this.defaultBtnState();
};

AButton.prototype.getCheck = function() 
{ 
	return this.isChecked;  
};

AButton.prototype.setText = function(text)
{
	if(this.$ele)
	{
		this.$ele.text(text);
		
		if(this.$img)
		{
			if(this.option.imgAfterText) this.$ele.append(this.$img);
			else this.$ele.prepend(this.$img);
		}
		
		var ele = this.element;
		if(ele.shrinkInfo) AUtil.autoShrink(ele, ele.shrinkInfo);
		//if(this.shrinkInfo) this.autoShrink(this.shrinkInfo);
	}
};

AButton.prototype.getText = function()
{
	return this.$ele.text();
};

AButton.prototype.setHtml = function(html)
{
	if(this.$ele)
	{
		this.$ele.html(html);
	}
};

AButton.prototype.getHtml = function()
{
	return this.$ele.html();
};

AButton.prototype.setImage = function(url)
{
	if(url) 
	{
		if(this.$img) this.$img.remove();
		
		if(this.option.imgAfterText) 
		{
			if(this.option.imgNewLine) this.$img = $('<br><img src="' + url + '">');
			else this.$img = $('<img src="' + url + '">');
			
			this.$ele.append(this.$img);
		}
		else 
		{
			if(this.option.imgNewLine) this.$img = $('<img src="' + url + '"><br>');
			else this.$img = $('<img src="' + url + '">');
		
			this.$ele.prepend(this.$img);
		}
	}
	else 
	{
		this.$img = undefined;
		//this.option.imgAfterText = undefined;
		//this.option.imgNewLine = undefined;
		
		this.$ele.removeAttr('data-aftertext');
		this.$ele.removeAttr('data-newline');
		this.$ele.html(this.$ele.text());
	}
};

AButton.prototype.getImage = function()
{
	if(this.$img) 
	{
		if(this.option.imgNewLine && this.option.imgAfterText) return $(this.$img[1]).attr('src');
		else return $(this.$img[0]).attr('src');
	}
	else return '';
};


AButton.prototype.setDefStyle = function(style)
{
	this.defStyle = style;
};

AButton.prototype.setBtnStyle = function(state, style)
{
	this.btnStyles[state] = style;
};

AButton.prototype.defaultBtnState = function()
{
	if(!this.isEnable) return;

	this.clearStateClass();
	this.applyBaseState();
};

AButton.prototype.clearStateClass = function()
{
	if(!this.isEnable) return;
	
	for(var i=0; i<AButton.STATE.length; i++)
	{
		if(this.btnStyles[i])
			this.removeClass(this.btnStyles[i]);
	}
	
	if(this.defStyle) this.removeClass(this.defStyle);
};

AButton.prototype.changeBtnState = function(newState)
{
	if(!this.isEnable) return;
	
	this.clearStateClass();
	
	if(this.btnStyles[newState]) 
	{
		this.element.style['background-color'] = this.baseState['background-color'];
		this.addClass(this.btnStyles[newState]);
	}
	
	else 
	{
		this.applyBaseState();
		this[AButton.STATE[newState]+'State']();
	}
};

AButton.prototype.enable = function(isEnable)
{
   	if(isEnable) 
	{
		AComponent.prototype.enable.call(this, isEnable);
	
		this.defaultBtnState();
	}
   	else 
	{
		// 최초에 disabled 속성값을 enable false로 변경할 때 생기는 오류때문에 셋타임아웃으로 처리
		var thisObj = this;
		setTimeout(function()
		{
			thisObj.changeBtnState(AButton.DISABLE);

			AComponent.prototype.enable.call(thisObj, isEnable);
		});
	}
};

AButton.prototype.downState = function()
{
	if(this.option.isToolBtn) 
	{
		var rt = this.getBoundRect();
		this.$ele.css('background-position', -1*rt.width + 'px 0px');
	}
	
	//밝기를 줄임
	else if(this.option.autoDownState) this._changeBgLightness(0.15, 'important');
};

AButton.prototype.overState = function()
{
	if(this.option.isToolBtn) 
	{
		var rt = this.getBoundRect();
		this.$ele.css('background-position', -2*rt.width + 'px 0px');
	}
	
	//밝기를 늘임
	//else this._changeBgLightness(0.05, 'important');
	
};

AButton.prototype.disableState = function()
{
	if(this.option.isToolBtn) 
	{
		var rt = this.getBoundRect();
		this.$ele.css('background-position', -3*rt.width + 'px 0px');
	}

	else this.downState();
};

AButton.prototype.applyBaseState = function()
{
	//this.$ele.css(this.baseState);
	
	if(this.option.isToolBtn) 
	{
		this.$ele.css('background-position', '0px 0px');
	}
	else
	{
		if(this.defStyle) this.addClass(this.defStyle);
		
		this.element.style['background-color'] = this.baseState['background-color'];
		//this.element.style['border'] = this.baseState['border'];
	}
	
};

AButton.prototype.saveBaseState = function()
{
	this.defStyle = this.getAttr('data-style');
	
	this.baseState = 
	{
		'background-color': this.element.style['background-color'],
		//'border': this.element.style['border']
	};
};

AButton.prototype.getLastBgColor = function($ele)
{
	var color = $ele.css('background-color');
	
	if(color=='transparent') 
		return this.getLastBgColor($ele.parent());
	
	color = color.match(/\d+/g);
	
	//afc.log(color);
		
	if(color.length==4 && color[3]=='0')
		return this.getLastBgColor($ele.parent());
	
	return color;
};

//내부적으로 밝은 것은 어둡게 어두운 것은 발게 처리함(lightness 0.5 기준)
//그러므로 value 는 줄이거나 늘이려는 실제값(0.0 < value < 0.5)  내부적으로만 사용
AButton.prototype._changeBgLightness = function(value, important)
{
	var rgbArr = this.getLastBgColor(this.$ele), alpha = '';
		
	if(rgbArr.length==4) alpha = ',' + rgbArr[3];
	
	hslArr = AUtil.RgbToHsl(rgbArr[0], rgbArr[1], rgbArr[2]);
	
	//밝기 조절
	if(hslArr[2]<0.5) hslArr[2] += value;
	else hslArr[2] -= value;
	
	//css 형식에 맞게 값 변환
	hslArr[0] *= 360, hslArr[1] *= 100, hslArr[2] *= 100;
	
	var hslVal = 'hsl(' + hslArr[0] + ',' + hslArr[1] + '%,' + hslArr[2] + '%' + alpha + ')';
	//console.log(hslVal);
	
	this.element.style.setProperty('background-color', hslVal, important);
};

/*
AButton.prototype.changeOppositeColor = function(colorKey, important)
{
	var color = this.$ele.css(colorKey),
		rgbArr = color.match(/\d+/g);

	var oppArr = AUtil.OppositeColor(rgbArr[0], rgbArr[1], rgbArr[2]);
	this.element.style.setProperty(colorKey, 'rgb('+ oppArr.join() + ')', important);

};
*/

AButton.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length == 0) return;
	
	if(this.data) dataArr[0][keyArr[0]] = this.data;
};

AButton.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	this.data = dataArr[0][keyArr[0]];
};

AButton.prototype.setIconMargin = function(value)
{
	var $img = this.$ele.children('img');
	
	if($img.length>0) $img[0].style['margin'] = value;
};


AButton.prototype.getIconMargin = function()
{
	var $img = this.$ele.children('img');
	
	if($img.length>0) return $img[0].style['margin'];
	else return '';
};

//button 의 각 data-style-xxx 값만 얻어서 리턴
AButton.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
		
	var keyArr = ['data-style-over', 'data-style-down', 'data-style-disable'], val;
	
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
AButton.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) AComponent.prototype._setDataStyleObj.call(this, styleObj);
		else this.setAttr(p, styleObj[p]);
	}
};
