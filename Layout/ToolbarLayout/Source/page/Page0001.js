

Page0001 = class Page0001 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



Page0001.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

Page0001.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

Page0001.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

Page0001.prototype.onPrevBtnClick = function(comp, info, e)
{

	//자신이 속해 있는 네비게이터를 얻어 이전으로 이동
	this.getContainer().navigator.goPrevPage();

};

Page0001.prototype.onLogoutBtnClick = function(comp, info, e)
{
	//로그인 화면으로 이동하기 위해 메인 네비게이터를 얻어온다.(ToolbarLayoutApp.cls 에서 생성함)
	
	var navi = ANavigator.find('main');
	
	navi.goPrevPage();

};
