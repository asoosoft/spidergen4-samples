
/**
Constructor
Do not call Function in Constructor.
*/
class Page0001()
{
	super();

	//TODO:edit here

}
extends AView;


function Page0001*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function Page0001*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function Page0001*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function Page0001*onPrevBtnClick(comp, info, e)
{

	//자신이 속해 있는 네비게이터를 얻어 이전으로 이동
	this.getContainer().navigator.goPrevPage();

};

function Page0001*onLogoutBtnClick(comp, info, e)
{
	//로그인 화면으로 이동하기 위해 메인 네비게이터를 얻어온다.(ToolbarLayoutApp.cls 에서 생성함)
	
	var navi = ANavigator.find('main');
	
	navi.goPrevPage();

};
