

ResponsiveSampleView = class ResponsiveSampleView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



ResponsiveSampleView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

ResponsiveSampleView.prototype.onBackBtnClick = function(comp, info, e)
{

	this.getContainer().navigator.goPrevPage();

};
