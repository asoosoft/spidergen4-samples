
/**
Constructor
Do not call Function in Constructor.
*/
class InnerView()
{
	super();

	//TODO:edit here

}
extends AView;


function InnerView*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function InnerView*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function InnerView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};


function InnerView*onAButton1Click(comp, info)
{

	//TODO:edit here
	AToast.show('클릭1');

};

function InnerView*onAButton2Click(comp, info)
{

	//TODO:edit here
	AToast.show('클릭2');

};
