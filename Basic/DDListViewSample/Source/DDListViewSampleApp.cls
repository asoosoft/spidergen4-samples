
/**
Constructor
Do not call Function in Constructor.
*/
class DDListViewSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function DDListViewSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

function DDListViewSampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
