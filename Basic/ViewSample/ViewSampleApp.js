

ViewSampleApp = class ViewSampleApp extends AApplication
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



ViewSampleApp.prototype.onReady = function()
{
	AApplication.prototype.onReady.call(this);
	
	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

