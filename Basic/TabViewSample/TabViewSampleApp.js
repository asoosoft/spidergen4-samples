

afc.import("Framework/afc/component/AToast.js");


TabViewSampleApp = class TabViewSampleApp extends AApplication
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



TabViewSampleApp.prototype.onReady = function()
{
	AApplication.prototype.onReady.call(this);

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/Views/MainView.lay');

};
