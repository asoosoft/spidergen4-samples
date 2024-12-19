
afc.import('Framework/afc/component/AToast.js')

GridSampleApp = class GridSampleApp extends AApplication
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



GridSampleApp.prototype.onReady = function()
{
	AApplication.prototype.onReady.call(this);

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/Views/MainView.lay');


};

