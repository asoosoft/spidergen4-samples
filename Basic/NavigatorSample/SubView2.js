

SubView2 = class SubView2 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}


//초기화가 완료되고 최초 한번만 호출되는 함수
SubView2.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

//활성화 시점마다 매번 호출되는 함수
//최초로 호출되는 경우 isFirst 가 true
SubView2.prototype.onActiveDone = function(isFirst)
{
	// 페이지데이터를 저장한다.
	var data = this.getContainer().getData();
	
	if(data)
	{
		AToast.show('data : ' + data.textData);
	}
};

SubView2.prototype.onPrevBtnClick = function(comp, info, e)
{
	//컨테이너에 있는 네비게이터를 찾아서 
	var navi = this.getContainer().navigator;
	
	if(navi.canGoPrev()) navi.goPrevPage();
	else AToast.show("이전 페이지 히스토리 정보가 없습니다.");

};

SubView2.prototype.onNextBtnClick = function(comp, info, e)
{
	//이름으로 네비게이터 를 찾는 방법
	var navi = ANavigator.find('testNavi');
	
	if(navi.canGoNext()) navi.goNextPage();
	else AToast.show("다음 페이지 히스토리 정보가 없습니다.");
};

SubView2.prototype.onSubView3BtnClick = function(comp, info, e)
{
	this.getContainer().navigator.goPage('SubView3');

};
