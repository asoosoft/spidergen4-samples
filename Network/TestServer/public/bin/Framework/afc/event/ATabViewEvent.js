
/**
 * @author asoocool
 */

function ATabViewEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ATabViewEvent, AEvent);



//---------------------------------------------------------------------------------------------------
//	Component Event Functions
ATabViewEvent.prototype.swipe = function()
{
	this._swipe();
};


//---------------------------------------------------------------------------------------------------


