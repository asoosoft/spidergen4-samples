
/**
Constructor
Do not call Function in Constructor.  
*/
class SearchWndApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function SearchWndApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

};

function SearchWndApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
