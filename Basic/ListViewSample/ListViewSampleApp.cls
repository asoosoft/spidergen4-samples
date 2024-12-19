
/**
Constructor
Do not call Function in Constructor.
*/
class ListViewSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function ListViewSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/Views/MainView.lay');

};
