

SlideSubview = class SlideSubview extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



SlideSubview.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

SlideSubview.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	this.slideView.addItems(['Source/items/item1.lay', 'Source/items/item2.lay', 'Source/items/item3.lay'] , [1,2,3]);
	
};

SlideSubview.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};
