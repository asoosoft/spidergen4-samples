
/**
Constructor
Do not call Function in Constructor.
*/
function BdkTestApp()
{
	AApplication.call(this);

	//TODO:edit here

}
afc.extendsClass(BdkTestApp, AApplication);


BdkTestApp.prototype.onReady = function()
{
	AApplication.prototype.onReady.call(this);

	//var navigator = new ANavigator();
	//navigator.registerPage('Source/MainView.lay', 'MainView');
	//navigator.goPage('MainView');

	//or

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

BdkTestApp.prototype.unitTest = function(unitUrl)
{
	//TODO:edit here

	this.onReady();

	AApplication.prototype.unitTest.call(this, unitUrl);
};

var theApp = null;

$(document).ready(function()
{
    theApp = new BdkTestApp();
	//theApp.projectOption = { autoInc: @auto-inc@, dynamicInc: @dynamic-inc@, autoScale: @auto-scale@, docWidth: @doc-width@, scaleVal: @scale-val@ };
    if(PROJECT_OPTION.unitUrl) theApp.unitTest(PROJECT_OPTION.unitUrl);
	else theApp.onReady();
});
