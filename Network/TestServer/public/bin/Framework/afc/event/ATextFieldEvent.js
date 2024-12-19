
/**
 * @author asoocool
 */

function ATextFieldEvent(acomp)
{
	AEvent.call(this, acomp);
	
	this.chkInterval = null;
	this.oldText = '';
}
afc.extendsClass(ATextFieldEvent, AEvent);


ATextFieldEvent.prototype.defaultAction = function()
{
	var atextfield = this.acomp;
	
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
//	events: ['change', 'focus', 'blur']


ATextFieldEvent.prototype.change = function()
{
	this._change();
};


if(afc.isPC)
{ 
	//defaultAction 에서 호출했기 때문에
	ATextFieldEvent.prototype.keydown = null;
	ATextFieldEvent.prototype.keyup = null;
}





//---------------------------------------------------------------------------------------------------

ATextFieldEvent.prototype._focus = function()
{
	var thisObj = this;
	var atextfield = this.acomp;
	
	atextfield.$ele.focus(function(e) 
	{
		if(window._afc)
		{
			$(this).blur();
			return false;
		}
		
		AComponent.setFocusComp(atextfield);
		
		//텍스트 수정시 포커스가 중간에 있으면 키패드로 삭제 안되는 버그 대응(안드로이드)
		/*
		//4.3 안드로이드 버그 대응
		if(afc.andVer < 4.4)
		{
			setTimeout(function(){ atextfield.setText(atextfield.getText()); }, 1);	
		}
		*/
		
		if(!afc.isPC) KeyboardManager.inputScrollToCenter(this);
		//if(PROJECT_OPTION.build.bridgeName!='none') KeyboardManager.inputScrollToCenter(this);
		
		
		//타이머로 change 이벤트 처리
		if(atextfield.isTimerChange)
		{
			if(thisObj.chkInterval) clearInterval(thisObj.chkInterval);
			
			thisObj.chkInterval = setInterval(function()
			{
				//화면이 소멸되어 더이상 ATextField 가 유효한 컴포넌트가 아닌 경우
				if(!atextfield.element)
				{
					clearInterval(thisObj.chkInterval);
					thisObj.chkInterval = null;
					return;
				}
				
				thisObj.changeProc(e);

			}, ATextField.DELAY_TIME);
		}
		
		// Mask를 적용한 경우 readonly 아닌 경우에만 마스크적용 전의 값을 세팅하기 위함
		if(!atextfield.getAttr('readonly')) atextfield.element.value = atextfield.getText();
		
		atextfield.setIme();
		//atextfield.$ele.select();
		atextfield.reportEvent('focus', null, e);
	});
};

ATextFieldEvent.prototype._blur = function()
{
	var thisObj = this;
	var atextfield = this.acomp;
	
	atextfield.$ele.blur(function(e) 
	{
		if(thisObj.chkInterval) 
		{
			clearInterval(thisObj.chkInterval);
			thisObj.chkInterval = null;
		}
		
		// Mask를 적용한 경우 readonly 아닌 경우에만 입력된 값을 마스크 적용하여 값을 세팅하기 위함
		if(!atextfield.getAttr('readonly')) atextfield.setText(atextfield.element.value);
		
		atextfield.reportEvent('blur', null, e);
	});
};

ATextFieldEvent.prototype._change = function()
{
	var thisObj = this;
	
	this.acomp.$ele.on('keyup', function(e) 
	{
		thisObj.changeProc(e);
	});
	
	this.acomp.$ele.on('change', function(e) 
	{
		thisObj.changeProc(e);
	});
};

ATextFieldEvent.prototype.changeProc = function(e)
{
	var atextfield = this.acomp;
	//var strText = atextfield.getText();
	var strText = atextfield.element.value;
	
	if(this.oldText != strText)
	{
		this.oldText = strText;
		atextfield.reportEvent('change', strText, e);
	}
};

ATextFieldEvent.prototype._keydown = function()
{
	var acomp = this.acomp;
	
	acomp.$ele.on('keydown', function(e) 
	{	
		//이벤트가 더이상 상위로 전달되지 않아야할때 사용된다.
		//예를들어 '탭' 키를 누를때 발생되는 포커스 이동 기능을 사용하지 않을때 사용된다.
		//(탭 이동은 기본 탭키 이벤트는 막고 탭키컨트롤러에서 관리한다.)
		if(!acomp.keyPropagation) e.stopPropagation();

		acomp.reportEvent('keydown', null, e);
	});
};

ATextFieldEvent.prototype._keyup = function()
{
	var acomp = this.acomp;
	
	acomp.$ele.on('keyup', function(e) 
	{
		//이벤트가 더이상 상위로 전달되지 않아야할때 사용된다.
		//예를들어 '탭' 키를 누를때 발생되는 포커스 이동 기능을 사용하지 않을때 사용된다.
		//(탭 이동은 기본 탭키 이벤트는 막고 탭키컨트롤러에서 관리한다.)	
		if(!acomp.keyPropagation) e.stopPropagation();
		
		acomp.reportEvent('keyup', null, e);
	});
};
