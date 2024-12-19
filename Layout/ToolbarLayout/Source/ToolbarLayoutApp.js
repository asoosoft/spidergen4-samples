
afc.import('Framework/afc/component/ANavigator.js')

ToolbarLayoutApp = class ToolbarLayoutApp extends AApplication
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



ToolbarLayoutApp.prototype.onReady = function()
{
	AApplication.prototype.onReady.call(this);

	var navi = new ANavigator('main');

	navi.registerPage('Source/LoginView.lay', 'LoginView');
	navi.registerPage('Source/MainView.lay', 'MainView');

	navi.goPage('LoginView');

};

ToolbarLayoutApp.prototype.unitTest = function(unitUrl)
{
	//TODO:edit here

	this.onReady();

	AApplication.prototype.unitTest.call(this, unitUrl);
};

