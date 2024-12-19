
/**
 * @author asoocool
 */

function AButtonEvent(acomp)
{
	AEvent.call(this, acomp);
	
	this.keyDownVal = false;
	
}
afc.extendsClass(AButtonEvent, AEvent);


//	overloading functions

AButtonEvent.prototype.actionDownState = function()
{
	AComponent.setFocusComp(this.acomp);

	this.acomp.changeBtnState(AButton.DOWN);
};

/*
AButtonEvent.prototype.actionMoveState = function()
{
	this.acomp.defaultBtnState();
};
*/

AButtonEvent.prototype.actionUpState = function()
{
	if(this.acomp.option.isCheckBtn)
	{
		this.acomp.setCheck(!this.acomp.getCheck());
	}
	else
	{
		if(afc.isPC) this.acomp.changeBtnState(AButton.OVER);
		else this.acomp.defaultBtnState();
	}
};

AButtonEvent.prototype.actionCancelState = function()
{
	this.acomp.defaultBtnState();
};

AButtonEvent.prototype.actionEnterState = function()
{
	if(this.acomp.option.isCheckBtn && this.acomp.getCheck()) return;
	
	this.acomp.changeBtnState(AButton.OVER);
};

AButtonEvent.prototype.actionLeaveState = function()
{
	if(this.acomp.option.isCheckBtn && this.acomp.getCheck()) return;
	
	this.acomp.defaultBtnState();
};

AButtonEvent.prototype.defaultAction = function()
{
	this._click();
	this._actionenter();
	this._actionleave();
	this._keydown();
	this._keyup();
};

//---------------------------------------------------------------------------------------------------
//	Component Event Functions


//defaultAction 에서 호출했기 때문에 
//이벤트가 등록되어 있어도 호출되지 않도록 인터페이스를 닫는다.
AButtonEvent.prototype.actionenter = null;
AButtonEvent.prototype.actionleave = null;
AButtonEvent.prototype.keydown = null;
AButtonEvent.prototype.keyup = null;

AButtonEvent.prototype.onKeyDown = function(e)
{	
	if(this.acomp!==AComponent.getFocusComp()) return;
	
	if(!this.acomp.keyPropagation) e.stopPropagation();
		
	if(e.keyCode == 13 || e.keyCode == 32)
	{	
		if(!this.keyDownVal)
		{
			this.keyDownVal = true;
			this.actionDownState();
		}
	}
	
	this.acomp.reportEvent('keydown', null, e);
};

AButtonEvent.prototype.onKeyUp = function(e)
{	
	if(this.acomp!==AComponent.getFocusComp()) return;
	
	if(!this.acomp.keyPropagation) e.stopPropagation();
		
	if(e.keyCode == 13 || e.keyCode == 32)
	{
		this.keyDownVal = false;
		this.actionUpState();
		this.acomp.defaultBtnState();
		this.acomp.reportEvent('click', null, e);
	}
	
	this.acomp.reportEvent('keyup', null, e);
};

AButtonEvent.prototype.longtab = function()
{
	this._longtab();
};

//---------------------------------------------------------------------------------------------------