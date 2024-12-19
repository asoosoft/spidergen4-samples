
/**
Constructor
Do not call Function in Constructor.
*/
class AutoBottomApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function AutoBottomApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

function AutoBottomApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
