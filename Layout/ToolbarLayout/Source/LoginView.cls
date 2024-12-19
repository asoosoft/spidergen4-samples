
/**
Constructor
Do not call Function in Constructor.
*/
class LoginView()
{
	super();

	//TODO:edit here

}
extends AView;


function LoginView*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function LoginView*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function LoginView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function LoginView*onNextBtnClick(comp, info, e)
{

	this.getContainer().navigator.goPage('MainView');

};