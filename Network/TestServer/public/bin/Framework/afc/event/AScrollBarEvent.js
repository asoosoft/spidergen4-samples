
/**
 * @author asoocool
 */

function AScrollBarEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(AScrollBarEvent, AEvent);




//---------------------------------------------------------------------------------------------------
//	Component Event Functions


AScrollBarEvent.prototype.scroll = function()
{
	this._scroll();
};



//---------------------------------------------------------------------------------------------------

AScrollBarEvent.prototype._scroll = function()
{
	var acomp = this.acomp;
	
	if(acomp.isScrollVert)
	{
		acomp.$ele.scroll(function(e)
		{
			acomp.reportEvent('scroll', this.scrollTop, e);
		});
	}
	else 
	{
		acomp.$ele.scroll(function(e)
		{
			acomp.reportEvent('scroll', this.scrollLeft, e);
		});
	}
};