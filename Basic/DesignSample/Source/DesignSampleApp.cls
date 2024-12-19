
/**
Constructor
Do not call Function in Constructor.
*/
class DesignSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function DesignSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/DirectSample.lay');
	//this.mainContainer.open('Source/WorkView.lay');

	//TODO:edit here

};

function DesignSampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
