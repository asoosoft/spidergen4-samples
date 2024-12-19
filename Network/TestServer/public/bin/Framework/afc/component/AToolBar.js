/**
 * @author kyun
 */

function AToolBar()
{
	AView.call(this);
	
}
afc.extendsClass(AToolBar, AView);


AToolBar.CONTEXT = 
{
    tag: '<div data-base="AToolBar" data-class="AToolBar" data-flag="1011" data-gap="20px" class="AToolBar-Style"></div>',

    defStyle:
    {
        width:'100%', height:'40px'
    },

    events: ['scroll', 'scrollleft', 'scrollright', 'drop']
};


AToolBar.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	if(afc.isIos) this.setStyle('-webkit-overflow-scrolling', 'touch');
	
	var children = this.getChildren();
	for(var i=0; i<children.length; i++)
		children[i].setInlineStyle();
};

AToolBar.prototype.isHscroll = function()
{
	return (this.element.offsetWidth < this.element.scrollWidth);
};

AToolBar.prototype.scrollTo = function(leftPos)
{
	this.element.scrollLeft = leftPos;
};

AToolBar.prototype.scrollOffset = function(offset)
{
	this.element.scrollLeft += offset;
};

