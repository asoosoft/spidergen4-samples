

subview1 = class subview1 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



subview1.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};


subview1.prototype.setData = function(data)
{

	this.lbl1.setText(data);
	this.msg1.setText(data + ' message.');

};
