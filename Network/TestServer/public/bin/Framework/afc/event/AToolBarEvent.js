/**
 * @author asoocool
 * 
 */

function AToolBarEvent(acomp)
{
	AViewEvent.call(this, acomp);
	
	// this.bScrollBind = false;
}
afc.extendsClass(AToolBarEvent, AViewEvent);


//---------------------------------------------------------------------------------------------------
//	Component Event Functions
/*

AToolBarEvent.prototype.scrolltop = function()
{
	this._scroll();
};

AToolBarEvent.prototype.scrollbottom = function()
{
	this._scroll();
};


//---------------------------------------------------------------------------------------------------



AToolBarEvent.prototype._scroll = function()
{
	if(this.bScrollBind) return;
	this.bScrollBind = true;
	
	var alistview = this.acomp;
	alistview.element.addEventListener('scroll', function(e)
	{
		if(this.offsetHeight + this.scrollTop == this.scrollHeight)
		{
			alistview.reportEvent('scrollbottom', e, 100);
		}
		else if(this.scrollTop == 0)
		{
			alistview.reportEvent('scrolltop', e, 100);
		}
	});
};

//itemList is jQuery Object
//복수개의 item 이 존재한다.
AToolBarEvent.prototype._select = function(itemList)
{
	if(!itemList) return;
	
	var alistview = this.acomp;
	
    itemList.each(function(inx)
    {
		var isTouchLeave = true, startX = 0, startY = 0, timeout = null;
		
		AEvent.bindEvent(this, AEvent.ACTION_DOWN, function(e)
		{
			if(!alistview.option.isSelectable) return;
			
			isTouchLeave = false;
			
			var oe = e.changedTouches[0];
	        startX = oe.clientX;
	        startY = oe.clientY;
	
			var item = this;
			timeout = setTimeout(function() 
			{
				timeout = null;
				if(!isTouchLeave) alistview.setSelectItem(item);
				
			}, 300);
	
		});
		
		AEvent.bindEvent(this, AEvent.ACTION_MOVE, function(e)
		{
			if(!alistview.option.isSelectable) return;
			if(isTouchLeave) return;
			
			var oe = e.changedTouches[0];
			if(Math.abs(oe.clientX - startX) > 10 || Math.abs(oe.clientY - startY) > 10)
			{
				isTouchLeave = true;
	
				if(timeout) 
				{
					clearTimeout(timeout);
					timeout = null;
				}
				
				if(alistview.selectItem===this) alistview.setSelectItem(null);
			}
		});
	
		AEvent.bindEvent(this, AEvent.ACTION_UP, function(e)
		{
			if(!alistview.option.isSelectable) return;
			if(isTouchLeave) return;
			
			isTouchLeave = true;
			
			if(timeout) 
			{
				clearTimeout(timeout);
				timeout = null;
			}
			
			alistview.setSelectItem(this);
			alistview.reportEvent('select', this, 1);
		});		
    	
    });
};



*/