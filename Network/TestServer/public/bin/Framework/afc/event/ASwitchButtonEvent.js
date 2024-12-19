
/**
 * @author asoocool
 */

function ASwitchButtonEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ASwitchButtonEvent, AEvent);


ASwitchButtonEvent.prototype.actionUpState = function()
{
	this.acomp.setValue(!this.acomp.getValue());
};

ASwitchButtonEvent.prototype.defaultAction = function()
{
	this._click('change');
	this._keyup();
};

ASwitchButtonEvent.prototype.keyup = null;

ASwitchButtonEvent.prototype.onKeyUp = function(e)
{	
	if(this.acomp!==AComponent.getFocusComp()) return;
	
	if(!this.acomp.keyPropagation) e.stopPropagation();
		
	if(e.keyCode == 13 || e.keyCode == 32)
	{
		this.actionUpState();
		this.acomp.reportEvent('select', null, e);
	}
	
	this.acomp.reportEvent('keyup', null, e);
};


//---------------------------------------------------------------------------------------------------
//	Component Event Functions


