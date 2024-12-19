

SubView3 = class SubView3 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



//처음 한번만 실행되는 함수
SubView3.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

//초기화가 완료되면 호출되는 함수
SubView3.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
	
	
};


//뷰의 활성화가 완료되면 매번 호출된다.
SubView3.prototype.onActiveDone = function(isFirst) 
{
	AView.prototype.onActiveDone.call(this, isFirst);

	var mainView = this.getContainer().getView();	//MainView 객체는 컨테이너의 기본뷰이므로 이와 같이 얻어올 수 있다.
	
	mainView.setTitle(this.TitleLabel.getText());
};

SubView3.prototype.onPrevBtnClick = function(comp, info, e)
{
	//owner 는 자신을 로드한 컴포넌트이다. 여기서는 ATabView 이다.
	var tabview = this.owner;
	
	//위와 같이 변수 뒤에 데이터 형을 지정하면
	//형을 알 수 없는 객체도 자동완성 기능을 이용할 수 있다.
	tabview.goPrevSelect();
};
