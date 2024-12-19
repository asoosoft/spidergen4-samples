
/**
Constructor
Do not call Function in Constructor.
*/
class Page0003()
{
	super();

	//TODO:edit here

}
extends AView;


function Page0003*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function Page0003*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function Page0003*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function Page0003*onPrevBtnClick(comp, info, e)
{

	//자신이 속해 있는 네비게이터를 얻어 이전으로 이동
	this.getContainer().navigator.goPrevPage();

};
