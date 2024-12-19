
/**
 * @author asoocool
 */

function ARadioButtonEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ARadioButtonEvent, AEvent);



//	overloading functions

ARadioButtonEvent.prototype.actionUpState = function()
{
	//this.acomp.setSelect(!this.acomp.getSelect());
	this.acomp.setSelect(true);
};

ARadioButtonEvent.prototype.defaultAction = function()
{
	this._click();
	this._keyup();
};

ARadioButtonEvent.prototype.keyup = null;

ARadioButtonEvent.prototype.onKeyUp = function(e)
{	
	if(this.acomp!==AComponent.getFocusComp()) return;
	
	if(!this.acomp.keyPropagation) e.stopPropagation();
		
	if(e.keyCode == 13 || e.keyCode == 32)
	{
		this.actionUpState();
		this.acomp.reportEvent('click', null, e);
	}
	
	this.acomp.reportEvent('keyup', null, e);
};


//---------------------------------------------------------------------------------------------------
//	Component Event Functions





//---------------------------------------------------------------------------------------------------