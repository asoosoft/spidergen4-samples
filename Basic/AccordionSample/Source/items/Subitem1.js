
Subitem1 = class Subitem1 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



Subitem1.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

Subitem1.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

};

Subitem1.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

Subitem1.prototype.setData = function(data)
{
	for(var i=0; i<5; i++)
		this.grid.addRow(data);

};
