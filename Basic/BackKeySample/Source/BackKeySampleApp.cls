
import 'Framework/afc/component/ANavigator.js'


/**
Constructor
Do not call Function in Constructor.
*/
class BackKeySampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function BackKeySampleApp*onReady()
{
	super.onReady();
	
	//Library 폴더 우클릭 후 Add System LIB 메뉴 선택
	//위와 같이 Library 에 WebHistoryManager 를 추가하면
	//모바일의 BackKey 나 브라우저의 뒤로가기 버튼이 작동합니다.
	
	var navigator = new ANavigator();
	navigator.registerPage('Source/LoginView.lay', 'LoginView');
	navigator.registerPage('Source/MainView.lay', 'MainView');
	
	navigator.goPage('LoginView');
};

function BackKeySampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
