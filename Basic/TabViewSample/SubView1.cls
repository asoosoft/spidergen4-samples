
/**
Constructor
Do not call Function in Constructor.
*/
class SubView1()
{
	super();

	//TODO:edit here

}
extends AView;


function SubView1:init(context, evtListener)
{
	super.init(context, evtListener);
	

};

//초기화가 완료되면 호출되는 함수
function SubView1*onInitDone()
{
	super.onInitDone();
	
	
};

//뷰의 활성화가 완료되면 매번 호출된다.
function SubView1:onActiveDone(isFirst) 
{
	super.onActiveDone(isFirst);
	
	//아래와 같이 변수 뒤에 데이터 형을 지정하면
	//형을 알 수 없는 객체도 자동완성 기능을 이용할 수 있다.
	var mainView:MainView = this.getContainer().getView();	//MainView 객체는 컨테이너의 기본뷰이므로 이와 같이 얻어올 수 있다.
	mainView.setTitle(this.TitleLabel.getText());
	
	
	AToast.show('Select Tab2 버튼을 클릭해 보세요.');
};

function SubView1*onSelectBtnClick(comp, info, e)
{
	//owner 는 자신을 로드한 컴포넌트이다. 여기서는 ATabView 이다.
	this.owner.selectTabById('tab2');

};
