/**
 * @author asoocool
 */

function ADatePickerEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ADatePickerEvent, AEvent);



ADatePickerEvent.prototype.defaultAction = function()
{
	this._change();
};


//---------------------------------------------------------------------------------------------------
//	Component Event Functions





//---------------------------------------------------------------------------------------------------


ADatePickerEvent.prototype._change = function()
{
	//var thisObj = this;
	var datepkr = this.acomp;
	
	if(afc.isPC)
	{
		datepkr.$ele.bind('change', function(e) 
		{
			datepkr.setValue(this.value);
			datepkr.reportEvent('change', new Date(this.value));			
		});
	}
	
	//mobile
	else
	{
		//disable keyboard open
		//because tag is input of text
		datepkr.bindEvent(AEvent.ACTION_DOWN, function(e) 
		{
			e.preventDefault();
		});
		
		//open date picker
		datepkr.bindEvent(AEvent.ACTION_UP, function(e) 
		{
			if(!datepkr.isEnable || datepkr.$ele.attr('readonly')) return;
	
			datepkr.openPicker();
		});
		
		datepkr.$ele.bind('focus', function(e) 
		{
			if(!datepkr.isEnable || datepkr.$ele.attr('readonly')) return;
			
			datepkr.$ele.blur();
			datepkr.openPicker();
		});
	}
	
};

