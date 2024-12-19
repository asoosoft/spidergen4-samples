
/**
 * @author asoocool
 */

function ATextAreaEvent(acomp)
{
	AEvent.call(this, acomp);
	
	this.chkInterval = null;
	this.oldText = '';
	
}
afc.extendsClass(ATextAreaEvent, AEvent);


ATextAreaEvent.prototype.defaultAction = function()
{
	var textarea = this.acomp;
	
	//상위로 이벤트를 전달할 필요가 없다.
    this.acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
    {
    	e.stopPropagation();
    });
    
	//PC 인 경우의 기본 액션
	if(afc.isPC)
	{
		this._keydown();
		this._keyup();
	}
	
	this._focus();
	this._blur();
	
};


//---------------------------------------------------------------------------------------------------
//	Component Event Functions




ATextAreaEvent.prototype.change = function()
{
	this._change();	
};


if(afc.isPC)
{
	//defaultAction 에서 호출했기 때문에
	ATextAreaEvent.prototype.keydown = null;
	ATextAreaEvent.prototype.keyup = null;
}


//---------------------------------------------------------------------------------------------------

ATextAreaEvent.prototype._focus = function()
{
	var thisObj = this;
	var atextarea = this.acomp;
	
	atextarea.$ele.focus(function(e) 
	{
		if(window._afc || $(this).attr('readonly')) 
		{
			$(this).blur();
			return false;
		}
		
		AComponent.setFocusComp(atextarea);
		
		if(!afc.isPC) KeyboardManager.inputScrollToCenter(this);
		//if(PROJECT_OPTION.build.bridgeName!='none') KeyboardManager.inputScrollToCenter(this);
		
		//타이머로 change 이벤트 처리
		if(atextarea.isTimerChange)
		{
			if(thisObj.chkInterval) clearInterval(thisObj.chkInterval);
			
			thisObj.chkInterval = setInterval(function()
			{
				//화면이 소멸되어 더이상 ATextArea 가 유효한 컴포넌트가 아닌 경우
				if(!atextarea.element)
				{
					clearInterval(thisObj.chkInterval);
					thisObj.chkInterval = null;
					return;
				}
				
				thisObj.changeProc();

			}, ATextArea.DELAY_TIME);
		}			
		atextarea.setIme();
		atextarea.reportEvent('focus', e);
	});	
};

ATextAreaEvent.prototype._blur = function()
{
	var thisObj = this;
	var atextarea = this.acomp;
	
	atextarea.$ele.blur(function(e) 
	{
		if(thisObj.chkInterval) 
		{
			clearInterval(thisObj.chkInterval);
			thisObj.chkInterval = null;
		}
		
		atextarea.reportEvent('blur', e);
	});
	
};


ATextAreaEvent.prototype._change = function()
{
	var thisObj = this;
	
	this.acomp.$ele.bind('keyup', function(e) 
	{
		thisObj.changeProc();
	});

};

ATextAreaEvent.prototype.changeProc = function()
{
	var atextarea = this.acomp;
	//var strText = atextarea.getText();
	var strText = atextarea.element.value;
	
	if(this.oldText != strText)
	{
		this.oldText = strText;
		atextarea.reportEvent('change', strText);
	}
};

ATextAreaEvent.prototype._keydown = function()
{
	var acomp = this.acomp;
	
	acomp.$ele.bind('keydown', function(e) 
	{
		if(!acomp.keyPropagation) e.stopPropagation();
		
		acomp.reportEvent('keydown', null, e);
	});
};

ATextAreaEvent.prototype._keyup = function()
{
	var acomp = this.acomp;
	
	acomp.$ele.bind('keyup', function(e) 
	{
		if(!acomp.keyPropagation) e.stopPropagation();
		
		acomp.reportEvent('keyup', null, e);
	});
};	


