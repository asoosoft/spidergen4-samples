
/**
Constructor
Do not call Function in Constructor.
*/
class SlideViewSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function SlideViewSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

function SlideViewSampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
