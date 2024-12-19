
afc.import("Framework/afc/component/ANavigator.js");


BackKeySampleApp = class BackKeySampleApp extends AApplication
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



BackKeySampleApp.prototype.onReady = function()
{
	AApplication.prototype.onReady.call(this);
	
	//Library 폴더 우클릭 후 Add System LIB 메뉴 선택
	//위와 같이 Library 에 WebHistoryManager 를 추가하면
	//모바일의 BackKey 나 브라우저의 뒤로가기 버튼이 작동합니다.
	
	var navigator = new ANavigator();
	navigator.registerPage('Source/LoginView.lay', 'LoginView');
	navigator.registerPage('Source/MainView.lay', 'MainView');
	
	navigator.goPage('LoginView');
};

BackKeySampleApp.prototype.unitTest = function(unitUrl)
{
	//TODO:edit here

	this.onReady();

	AApplication.prototype.unitTest.call(this, unitUrl);
};
