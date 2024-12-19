
/**
Constructor
Do not call Function in Constructor.
*/
class TestWindow()
{
	super();

	//TODO:edit here

}
extends AView;


function TestWindow*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function TestWindow*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function TestWindow*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function TestWindow*onOkBtnClick(comp, info, e)
{
	
	this.getContainer().close();
	
};

function TestWindow*onCancelBtnClick(comp, info, e)
{
	this.getContainer().close();

};
