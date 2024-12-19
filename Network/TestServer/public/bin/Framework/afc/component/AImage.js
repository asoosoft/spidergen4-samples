/**
 * @author asoocool
 */


function AImage()
{
	AComponent.call(this);
	
}
afc.extendsClass(AImage, AComponent);

AImage.CONTEXT = 
{
    //tag: '<span data-base="AImage" data-class="AImage" data-flag="0001" class="AImage-Style"></span>',
	tag: '<img data-base="AImage" data-class="AImage" data-flag="0001" class="AImage-Style aimage-blank">',
    
    defStyle: 
    {
        width:'170px', height:'120px' 
    },

    events: ['load']
};

AImage.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
};


AImage.prototype.setImage = function(url)
{
	if(url)
	{		
		this.setAttr('src', url);
		this.removeClass('aimage-blank');
	}
	else
	{		
		this.removeAttr('src');
		this.addClass('aimage-blank');
	}
	
};

AImage.prototype.getImage = function()
{
	//return this.getStyle('background-image');
	return this.getAttr('src');
};

