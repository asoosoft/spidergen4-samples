
import 'Framework/afc/component/AWindow.js'

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

	this.tabview.addTab( 'view1', 'Source/subview/ItemView1.lay', 'view1');
	this.tabview.addTab( 'view2', 'Source/subview/ItemView2.lay', 'view2');
	this.tabview.addTab( 'view3', 'Source/subview/ItemView3.lay', 'view3');
	
	this.tabview.selectTabById('view1');
};

function MainView*onBackBtnClick(comp, info, e)
{
	//브라우저의 back 버튼을 누른 것과 같다.
	//실제로는 브라우저의 back 버튼으로 테스트 해보기

	theApp.webHistoryMgr.popHistory();

};

function MainView*onOpenBtnClick(comp, info, e)
{
	var wnd = new AWindow('TestWnd');
	wnd.setOption({isModal: false});
	wnd.open('Source/subview/TestWindow.lay', null, 100, 100, 370, 220);
};
