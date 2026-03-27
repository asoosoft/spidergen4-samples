

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



MainView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

MainView.prototype.onMenuBtnClick = function(comp, info, e)
{

	this.getContainer().navigator.goPage(comp.getComponentId());

};
