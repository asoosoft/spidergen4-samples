

/**
Constructor
Do not call Function in Constructor.
*/
class GridSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function GridSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/Views/MainView.lay');


};
