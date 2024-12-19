
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


function MainView*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

async function MainView*onInitDone()
{
	super.onInitDone();

	//url 대신 null 을 셋팅하면 빈 컨테이너가 뷰 내부에 생성된다. 컨테이너 아이디는 생략 가능
	var cntr = await this.naviView.loadContainer( null, 'naviView_cntr');

	//두번째 파라미터에 컨테이너를 셋팅하면 지정한 컨테이너의 내부에서 네비게이터가 작동된다.
	var navi = new ANavigator('sub_navi', cntr);

	navi.registerPage('Source/page/Page0001.lay', 'Page0001');
	navi.registerPage('Source/page/Page0002.lay', 'Page0002');
	navi.registerPage('Source/page/Page0003.lay', 'Page0003');

	navi.goPage('Page0001');
	

};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function MainView*onToolbarBtnClick(comp, info, e)
{
	//컴포넌트 아이디에 이동할 pageId 를 셋팅해 두었음.
	var compId = comp.getComponentId();
	
	var navi = ANavigator.find('sub_navi');
	
	navi.goPage(compId);

};
