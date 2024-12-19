
afc.import("Framework/afc/component/ANavigator.js");


RGridApp = class RGridApp extends AApplication
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



RGridApp.prototype.onReady = function()
{
	AApplication.prototype.onReady.call(this);

	var navigator = new ANavigator();
	navigator.registerPage('Source/MainView.lay', 'MainView');
	navigator.goPage('MainView');

	//or

	//this.setMainContainer(new APage('main'));
	//this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};
