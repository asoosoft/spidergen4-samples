
/**
Constructor
Do not call Function in Constructor.
*/
class AccordionSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function AccordionSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

function AccordionSampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
