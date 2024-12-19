

SubView3 = class SubView3 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



//초기화가 완료되고 최초 한번만 호출되는 함수
SubView3.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};


SubView3.prototype.onPrevBtnClick = function(comp, info, e)
{
	var navi = this.getContainer().navigator;
	
	if(navi.canGoPrev()) navi.goPrevPage();
	else AToast.show("이전 페이지 히스토리 정보가 없습니다.");

};

SubView3.prototype.onNextBtnClick = function(comp, info, e)
{
	//이름으로 네비게이터 를 찾는 방법
	var navi = ANavigator.find('testNavi');
	
	if(navi.canGoNext()) navi.goNextPage();
	else AToast.show("다음 페이지 히스토리 정보가 없습니다.");

};

SubView3.prototype.onSubView1BtnClick = function(comp, info, e)
{

	this.getContainer().navigator.goPage('SubView1');

};
