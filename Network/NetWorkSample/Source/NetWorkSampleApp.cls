
/**
Constructor
Do not call Function in Constructor.
*/
class NetWorkSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function NetWorkSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

function NetWorkSampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
