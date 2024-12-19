/**
 * @author asoocool
 */

//	APage 는 부모컨테이너 밑의 풀화면으로 추가될 수 있다.
//	싱글페이지만 사용할 경우 open() 함수를 호출하면 된다.
//	네비게이션 기능을 이용할 경우 ANavigator 객체와 같이 사용해야 한다.
function APage(containerId)
{
	AContainer.call(this, containerId);

	this.navigator = null;
	this.pageData = null;	//deprecated
	//활성화시 로드되고 비활성화시 바로 삭제한다. true 이면 매번 새로 로드된다.
	this.oneshot = false;
}
afc.extendsClass(APage, AContainer);


APage.prototype.init = function(context)
{
	AContainer.prototype.init.call(this, context);

	//afc.log('APage init');
};

APage.prototype.open = function(viewUrl, parent)
{
	var ret = AContainer.prototype.open.call(this, viewUrl, parent, 0, 0, '100%', '100%');
	
	if(ret)
	{
		//parent 가 static 으로 지정되어 있으면 자신도 static 로 변경해 준다.
		//container split 시 static 으로 지정할 경우 셋팅되어짐.
		if(this.parent!==theApp.rootContainer && this.parent.$ele.css('position')=='static')
		{
			this.$ele.css('position', 'static');
		}
	}
	
	return ret;
};

//deprecated, instead use getData
APage.prototype.getPageData = function()
{
	return this.pageData;
};

APage.prototype.onBackKey = function()
{
    if(this.navigator.canGoPrev())
    {
        this.navigator.goPrevPage(false);
        return true;
    }
    
	return false;
};
