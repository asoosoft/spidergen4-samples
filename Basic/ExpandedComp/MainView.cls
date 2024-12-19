
/**
Constructor
Do not call Function in Constructor.
*/
class MainView()
{
	super();

	//TODO:edit here

}
extends AView;


function MainView*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function MainView*onMenuBtnClick(comp, info, e)
{

	this.getContainer().navigator.goPage(comp.getComponentId());

};
