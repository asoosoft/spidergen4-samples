
/**
Constructor
Do not call Function in Constructor.
*/
class DataGridSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function DataGridSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

function DataGridSampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
