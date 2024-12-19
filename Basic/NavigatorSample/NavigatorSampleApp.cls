
/**
Constructor
Do not call Function in Constructor.
*/
class NavigatorSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function NavigatorSampleApp*onReady()
{
	super.onReady();
	
	//다음과 같이 두가지 방법으로 사용할 수 있다.
	//isMainNavi 값을 true, false 로 변경하여 다음 두가지 경우를 테스트 해 볼 수 있다.
	var isMainNavi = false;

	// 응용프로그램 전체를 네비게이터 방식으로 동작하게 하는 경우
	if(isMainNavi)
	{
		//두번째 파라미터에 컨테이너를 셋팅하면 지정한 컨테이너의 내부에서 네비게이터가 작동된다.
		//null 을 셋팅하거나 생략하면 메인컨테이너에서 네이게이터가 작동된다.
		var navigator = new ANavigator('testNavi', null);
		
		navigator.registerPage('Source/Views/SubView1.lay', 'SubView1');
		navigator.registerPage('Source/Views/SubView2.lay', 'SubView2');
		navigator.registerPage('Source/Views/SubView3.lay', 'SubView3');
		
		navigator.goPage('SubView1');
	}

	//or
	
	//기본 메인 컨테이너 셋팅 후, 
	//화면의 특정 영역에서 네비게이터를 사용하는 경우, Source/MainView.cls 소스 참조
	else
	{
		this.setMainContainer(new APage('main'));

		this.getMainContainer().open('Source/MainView.lay');
	}
};
