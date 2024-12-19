

InnerView = class InnerView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



InnerView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

InnerView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

InnerView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};


InnerView.prototype.onAButton1Click = function(comp, info)
{

	//TODO:edit here
	alert('클릭1');

};

InnerView.prototype.onAButton2Click = function(comp, info)
{

	//TODO:edit here
	alert('클릭2');

};
