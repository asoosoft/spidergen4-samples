
afc.import('Framework/afc/component/APanel.js')

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
        
	
	

    }
}



MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

MainView.prototype.onInitDone = async function()
{
	AView.prototype.onInitDone.call(this);

	//url 대신 null 을 셋팅하면 빈 컨테이너가 뷰 내부에 생성된다. 컨테이너 아이디는 생략 가능
	var cntr = await this.naviView.loadContainer( null, 'naviView_cntr');

	//두번째 파라미터에 컨테이너를 셋팅하면 지정한 컨테이너의 내부에서 네비게이터가 작동된다.
	var navi = new ANavigator('sub_navi', cntr);

	navi.registerPage('Source/page/Page0001.lay', 'Page0001');
	navi.registerPage('Source/page/Page0002.lay', 'Page0002');
	navi.registerPage('Source/page/Page0003.lay', 'Page0003');

	navi.goPage('Page0001');
	

};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

MainView.prototype.onToolbarBtnClick = function(comp, info, e)
{
	//컴포넌트 아이디에 이동할 pageId 를 셋팅해 두었음.
	var compId = comp.getComponentId();
	
	var navi = ANavigator.find('sub_navi');
	
	navi.goPage(compId);

};
