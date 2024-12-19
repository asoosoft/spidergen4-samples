

SubView1 = class SubView1 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



SubView1.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	

};

//초기화가 완료되면 호출되는 함수
SubView1.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
	
	
};

//뷰의 활성화가 완료되면 매번 호출된다.
SubView1.prototype.onActiveDone = function(isFirst) 
{
	AView.prototype.onActiveDone.call(this, isFirst);
	
	//아래와 같이 변수 뒤에 데이터 형을 지정하면
	//형을 알 수 없는 객체도 자동완성 기능을 이용할 수 있다.
	var mainView = this.getContainer().getView();	//MainView 객체는 컨테이너의 기본뷰이므로 이와 같이 얻어올 수 있다.
	mainView.setTitle(this.TitleLabel.getText());
	
	
	AToast.show('Select Tab2 버튼을 클릭해 보세요.');
};

SubView1.prototype.onSelectBtnClick = function(comp, info, e)
{
	//owner 는 자신을 로드한 컴포넌트이다. 여기서는 ATabView 이다.
	this.owner.selectTabById('tab2');

};
