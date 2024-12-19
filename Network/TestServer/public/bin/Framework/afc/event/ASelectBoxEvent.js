
/**
 * @author asoocool
 */

function ASelectBoxEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ASelectBoxEvent, AEvent);


ASelectBoxEvent.prototype.defaultAction = function()
{
	//상위로 이벤트를 전달할 필요가 없다.
    this.acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
    {
    	e.stopPropagation();
    });
};


//---------------------------------------------------------------------------------------------------
//	Component Event Functions


ASelectBoxEvent.prototype.change = function()
{
	this._change();
};

//---------------------------------------------------------------------------------------------------



ASelectBoxEvent.prototype._change = function()
{
	var aselectbox = this.acomp;
	
	aselectbox.$ele.bind('change', function(e) 
	{
		aselectbox.reportEvent('change', $(this).val());
	});
};


