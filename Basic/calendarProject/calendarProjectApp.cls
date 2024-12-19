

/**
Constructor
Do not call Function in Constructor.
*/
class calendarProjectApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function calendarProjectApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

function calendarProjectApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
