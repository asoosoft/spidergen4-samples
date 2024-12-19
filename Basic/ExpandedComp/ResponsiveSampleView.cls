
/**
Constructor
Do not call Function in Constructor.
*/
class ResponsiveSampleView()
{
	super();

	//TODO:edit here

}
extends AView;


function ResponsiveSampleView*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function ResponsiveSampleView*onBackBtnClick(comp, info, e)
{

	this.getContainer().navigator.goPrevPage();

};
