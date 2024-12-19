
/**
Constructor
Do not call Function in Constructor.
*/
class SubView2()
{
	super();

	//TODO:edit here

}
extends AView;

//초기화가 완료되고 최초 한번만 호출되는 함수
function SubView2*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

//활성화 시점마다 매번 호출되는 함수
//최초로 호출되는 경우 isFirst 가 true
function SubView2*onActiveDone(isFirst)
{
	// 페이지데이터를 저장한다.
	var data = this.getContainer().getData();
	
	if(data)
	{
		AToast.show('data : ' + data.textData);
	}
};

function SubView2*onPrevBtnClick(comp, info, e)
{
	//컨테이너에 있는 네비게이터를 찾아서 
	var navi = this.getContainer().navigator;
	
	if(navi.canGoPrev()) navi.goPrevPage();
	else AToast.show("이전 페이지 히스토리 정보가 없습니다.");

};

function SubView2*onNextBtnClick(comp, info, e)
{
	//이름으로 네비게이터 를 찾는 방법
	var navi = ANavigator.find('testNavi');
	
	if(navi.canGoNext()) navi.goNextPage();
	else AToast.show("다음 페이지 히스토리 정보가 없습니다.");
};

function SubView2*onSubView3BtnClick(comp, info, e)
{
	this.getContainer().navigator.goPage('SubView3');

};
