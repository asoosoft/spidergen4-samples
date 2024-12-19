
import 'Framework/afc/component/AApplication.js'
import 'Framework/afc/component/APage.js'
import 'Framework/afc/component/ANavigator.js'

/**
Constructor
Do not call Function in Constructor.
*/
class RGridApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function RGridApp:onReady()
{
	super.onReady();

	var navigator = new ANavigator();
	navigator.registerPage('Source/MainView.lay', 'MainView');
	navigator.goPage('MainView');

	//or

	//this.setMainContainer(new APage('main'));
	//this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};
