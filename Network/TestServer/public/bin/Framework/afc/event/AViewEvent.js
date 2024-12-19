
/**
 * @author asoocool
 */

function AViewEvent(acomp)
{
	AEvent.call(this, acomp);
	
	this.bScrollBind = false;
}
afc.extendsClass(AViewEvent, AEvent);



//events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom', 'drop', 'dragstart', 'dragend' ]

//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AViewEvent.prototype.swipe = function()
{
	this._swipe();
};

AViewEvent.prototype.longtab = function()
{
	this._longtab();
};

AViewEvent.prototype.scroll = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollleft = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollright = function()
{
	this._scroll();
};

AViewEvent.prototype.scrolltop = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollbottom = function()
{
	this._scroll();
};

//---------------------------------------------------------------------------------------------------

AViewEvent.prototype._scroll = function()
{
	if(this.bScrollBind) return;
	this.bScrollBind = true;
	
	var aview = this.acomp, lastTop = this.scrollTop, lastLeft = this.scrollLeft;
	
	aview.element.addEventListener('scroll', function(e)
	{
		//horizontal
		if(lastLeft!=this.scrollLeft)
		{
			aview.reportEvent('scroll', 'h', e);
		
			if(this.offsetWidth + this.scrollLeft >= this.scrollWidth)
			{
				if(aview.scrollRightManage())
					aview.reportEvent('scrollright', null, e);
			}
			else if(this.scrollLeft == 0)
			{
				if(aview.scrollLeftManage())
					aview.reportEvent('scrollleft', null, e);
			}
			
			lastLeft = this.scrollLeft;
		}
		
		//vertical
		if(lastTop!=this.scrollTop)
		{
			aview.reportEvent('scroll', 'v', e);
		
			if(this.offsetHeight + this.scrollTop >= this.scrollHeight)
	        {
	        	if(aview.scrollBottomManage())
					aview.reportEvent('scrollbottom', null, e);
	        }
	        else if(this.scrollTop == 0)
	        {
	        	if(aview.scrollTopManage())
					aview.reportEvent('scrolltop', null, e);
	        }
			
			lastTop = this.scrollTop;
		}
	});
};

