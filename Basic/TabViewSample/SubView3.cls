
/**
Constructor
Do not call Function in Constructor.
*/
class SubView3()
{
	super();

	//TODO:edit here

}
extends AView;


//처음 한번만 실행되는 함수
function SubView3:init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

//초기화가 완료되면 호출되는 함수
function SubView3*onInitDone()
{
	super.onInitDone();
	
	
};


//뷰의 활성화가 완료되면 매번 호출된다.
function SubView3*onActiveDone(isFirst) 
{
	super.onActiveDone(isFirst);

	var mainView:MainView = this.getContainer().getView();	//MainView 객체는 컨테이너의 기본뷰이므로 이와 같이 얻어올 수 있다.
	
	mainView.setTitle(this.TitleLabel.getText());
};

function SubView3*onPrevBtnClick(comp, info, e)
{
	//owner 는 자신을 로드한 컴포넌트이다. 여기서는 ATabView 이다.
	var tabview:ATabView = this.owner;
	
	//위와 같이 변수 뒤에 데이터 형을 지정하면
	//형을 알 수 없는 객체도 자동완성 기능을 이용할 수 있다.
	tabview.goPrevSelect();
};
