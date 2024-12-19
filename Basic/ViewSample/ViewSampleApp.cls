
/**
Constructor
Do not call Function in Constructor.
*/
class ViewSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function ViewSampleApp*onReady()
{
	super.onReady();
	
	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};
