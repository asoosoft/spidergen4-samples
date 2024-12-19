
/**
Constructor
Do not call Function in Constructor.
*/
class ToolbarLayoutApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function ToolbarLayoutApp*onReady()
{
	super.onReady();

	var navi = new ANavigator('main');

	navi.registerPage('Source/LoginView.lay', 'LoginView');
	navi.registerPage('Source/MainView.lay', 'MainView');

	navi.goPage('LoginView');

};

function ToolbarLayoutApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
