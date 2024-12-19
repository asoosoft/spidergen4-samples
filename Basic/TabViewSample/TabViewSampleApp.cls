
import 'Framework/afc/component/AToast.js'


/**
Constructor
Do not call Function in Constructor.
*/
class TabViewSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function TabViewSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/Views/MainView.lay');

};
