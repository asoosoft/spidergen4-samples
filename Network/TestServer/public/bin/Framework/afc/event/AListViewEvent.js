/**
 * @author asoocool
 * 
 */

function AListViewEvent(acomp)
{
	AEvent.call(this, acomp);
	
	this.bScrollBind = false;
	this.isTouchLeave = true;
}
afc.extendsClass(AListViewEvent, AEvent);


//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AListViewEvent.prototype.scroll = function()
{
	this._scroll();
};

AListViewEvent.prototype.scrolltop = function()
{
	this._scroll();
};

AListViewEvent.prototype.scrollbottom = function()
{
	this._scroll();
};


//select 이벤트는 아이템 추가시 동적으로 생성되므로 함수를 구현하지 않는다.
//AListViewEvent.prototype.select = function() {};

//---------------------------------------------------------------------------------------------------



AListViewEvent.prototype._scroll = function()
{
	if(this.bScrollBind) return;
	this.bScrollBind = true;
	
	var alistview = this.acomp;
	alistview.scrollArea[0].addEventListener('scroll', function(e)
	{
		alistview.reportEvent('scroll', this);
	
		if(this.offsetHeight + this.scrollTop == this.scrollHeight)
		{
			if(alistview.scrollBottomManage())
				alistview.reportEvent('scrollbottom', this);
		}
		else if(this.scrollTop == 0)
		{
			if(alistview.scrollTopManage())
				alistview.reportEvent('scrolltop', this);
		}
	});
};

//itemList is jQuery Object
//복수개의 item 이 존재한다.
AListViewEvent.prototype._select = function(itemList)
{
	if(!itemList) return;
	
	var alistview = this.acomp;
	var thisObj = this;
	
    itemList.each(function(inx)
    {
		var startX = 0, startY = 0, timeout = null;
		
		AEvent.bindEvent(this, AEvent.ACTION_DOWN, function(e)
		{
			if(!alistview.option.isSelectable) return;
			
			thisObj.isTouchLeave = false;
			
			var oe = e.changedTouches[0];
	        startX = oe.clientX;
	        startY = oe.clientY;
	
			var item = this;
			timeout = setTimeout(function() 
			{
				timeout = null;
				if(!thisObj.isTouchLeave) alistview.setSelectItem(item);
				
			}, 300);
	
		});
		
		AEvent.bindEvent(this, AEvent.ACTION_MOVE, function(e)
		{
			if(!alistview.option.isSelectable) return;
			if(thisObj.isTouchLeave) return;
			
			var oe = e.changedTouches[0];
			if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE)
			{
				thisObj.isTouchLeave = true;
	
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
			if(thisObj.isTouchLeave) return;
			
			thisObj.isTouchLeave = true;
			
			if(timeout) 
			{
				clearTimeout(timeout);
				timeout = null;
			}
			
			alistview.setSelectItem(this);
			alistview.reportEventDelay('select', this, 100);
		});
		
		AEvent.bindEvent(this, AEvent.ACTION_CANCEL, function(e)
		{
			thisObj.isTouchLeave = true;
	
			if(timeout) 
			{
				clearTimeout(timeout);
				timeout = null;
			}
			
			if(alistview.selectItem===this) alistview.setSelectItem(null);
		});		
    	
    });
};

