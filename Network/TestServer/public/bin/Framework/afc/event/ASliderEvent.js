
/**
 * @author asoocool
 */

function ASliderEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ASliderEvent, AEvent);




//---------------------------------------------------------------------------------------------------
//	Component Event Functions


ASliderEvent.prototype.change = function()
{
	this._change();
};



//---------------------------------------------------------------------------------------------------


ASliderEvent.prototype._change = function()
{
	var aslider = this.acomp;
	
	aslider.$ele.bind('change', function(e) 
	{
		aslider.reportEvent('change', e);
	});
};
