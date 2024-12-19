
/**
Constructor
Do not call Function in Constructor.
*/
class WindowSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function WindowSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

};

function WindowSampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
