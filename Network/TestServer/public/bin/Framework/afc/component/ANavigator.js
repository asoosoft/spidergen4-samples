
/**
 * @author asoocool
 */

function ANavigator(name, cntr)
{
    this.pageHistory = new Array();
	
    this.curHisIndex = -1;

	this.flipType = 'normal';	//normal, slide, fade
    this.slideDir = 'left';		//left, right, up, down
    
    this.pageInfoMap = {};
	this.activePage = null;
	
	if(name) ANavigator.objects[name] = this;
	else ANavigator.objects['0'] = this;
	
	ANavigator.activeNavi = this;
	
	if(!cntr) this.cntr = theApp.rootContainer;
	else this.cntr = cntr;
	
	//프레임 컨테이너에 자신을 셋팅
	this.cntr.childNavigator = this;
}

//-----------------------------------------------------------------------------
//	static area
ANavigator.objects = {};
ANavigator.activeNavi = null;

ANavigator.find = function(name)
{
	if(name) return ANavigator.objects[name];
	else return ANavigator.objects['0'];
};

ANavigator.getActiveNavigator = function() { return ANavigator.activeNavi; };

ANavigator.getActiveNaviPage = function()
{
	if(ANavigator.activeNavi) return ANavigator.activeNavi.getActivePage();
	else return null;
};


ANavigator.reportBackKeyEvent = function()
{
/*
	var topWnd = AWindow.getTopWindow();

	if(topWnd) return topWnd.onBackKey();
*/
	var page = ANavigator.getActiveNaviPage();

	if(page) return page.onBackKey();
	
	else return false;
};

ANavigator.reportResizeEvent = function()
{
	for(var p in ANavigator.objects)
	{
		ANavigator.objects[p].onResize();
		
		//첫번째 원소만 체크(루트 네비게이터) 하기 위해 
		break;
		
	}
};

//---------------------------------------------------------------------------------


//normal, slide, fade
ANavigator.prototype.setFlipType = function(flipType)
{
	this.flipType = flipType;	
};

//left, right, up, down
ANavigator.prototype.setSlideDir = function(slideDir)
{
    this.slideDir = slideDir;
};

//url 은 필수.
ANavigator.prototype.registerPage = function(url, pageId, pageClass, cond)
{
	var infoArray = this.pageInfoMap[pageId];
	var newInfo = { url: url, pageId: pageId+'_0', cond: cond, pageClass: pageClass, pageObj: null };	//cond is condition variable, 조건에 맞는 페이지를 리턴하기위해
		
	if(!infoArray) 
	{
		infoArray = new Array();
		this.pageInfoMap[pageId] = infoArray;
	}
	//같이 페이지 아이디로 페이지 정보가 존재하면 아이디 숫자를 하나 높여 추가한다.
	else 
	{
		newInfo.pageId = pageId+'_'+infoArray.length;
	}

	infoArray.push(newInfo);
	
	if(!pageClass) newInfo.pageClass = afc.ClassName.PAGE;
};


ANavigator.prototype.registerPageEx = function(pageInfo)
{
	this.registerPage(pageInfo.layUrl, pageInfo.pageId, pageInfo.pageClass, pageInfo.cond);
};


//cond 옵션을 비교하여 tabId 를 리턴한다.
ANavigator.prototype.getPageInfo = function(pageId)
{
	var infoArray = this.pageInfoMap[pageId];
	if(!infoArray) return null;
	
	var obj = null;
	for(var i=0; i<infoArray.length; i++)
	{
		obj = infoArray[i];
		if(obj.cond)
		{
			if( (!obj.cond.width || screen.width==obj.cond.width) && 
				(!obj.cond.height || screen.height==obj.cond.height) ) return obj;
		}
	}
	
	return obj;
};

ANavigator.prototype.getPage = function(pageId)
{
	var pageInfo = this.getPageInfo(pageId);
	
	if(pageInfo) return pageInfo.pageObj;
	else return null;
};

ANavigator.prototype.pushHistory = function(page)
{
	this.curHisIndex++;
    this.pageHistory.length = this.curHisIndex;
    this.pageHistory.push(page);
};

ANavigator.prototype.flipPage = function(willActivePage, isFirst)
{
	var thisObj = this, willDeactivePage = this.activePage;
	
	this.isTabFlipping = true;
	
	willActivePage.onWillActive(isFirst);
	if(willDeactivePage) willDeactivePage.onWillDeactive();
	
	if(this.flipType=='normal')
	{
		willActivePage.show();
		willActivePage.onActive(isFirst);

		if(willDeactivePage) 
		{
			willDeactivePage.hide();
			willDeactivePage.onDeactive();
		}
		
		setTimeout(function() 
		{
			_effectDone();
		}, 0);
	}
	
	else if(this.flipType=='slide')
	{
		willActivePage.show();
		willActivePage.$ele.addClass('slide-in-'+this.slideDir);
		willActivePage.onActive(isFirst);
		
		if(willDeactivePage)
		{
			willDeactivePage.$ele.addClass('slide-out-'+this.slideDir);
			willDeactivePage.onDeactive();
		}
		
		willActivePage.$ele.one('webkitAnimationEnd', function()
		{
			if(willDeactivePage) 
			{
				willDeactivePage.$ele.removeClass('slide-out-'+thisObj.slideDir);
				willDeactivePage.$ele.hide();
			}

			willActivePage.$ele.removeClass('slide-in-'+thisObj.slideDir);

			_effectDone();
		});
	}
	
	this.activePage = willActivePage;
	

	function _effectDone() 
	{
		willActivePage.onActiveDone(isFirst);
		
		if(willDeactivePage) 
		{
			willDeactivePage.onDeactiveDone();
			
			if(willDeactivePage.oneshot) thisObj.clearPage(willDeactivePage.getContainerId());
		}
		
		thisObj.isTabFlipping = false;
	}
};

ANavigator.prototype.goPage = function(pageId, data, isNoHistory)
{
	var pageInfo = this.getPageInfo(pageId);
	
	//없는 페이지이면 리턴 
	if(!pageInfo) return null;
	
	var isFirst = false;
	if(!pageInfo.pageObj)
	{
		pageInfo.pageObj = new window[pageInfo.pageClass](pageId);
		pageInfo.pageObj.navigator = this;
		//pageInfo.pageObj.url = pageInfo.url;
		pageInfo.pageObj.open(pageInfo.url, this.cntr);
		
		isFirst = true;
	}
	
	//현재 액티브된 페이지를 다시 호출한 경우
	if(pageInfo.pageObj!==this.activePage)
	{
		pageInfo.pageObj.pageData = data;	//deprecated
		pageInfo.pageObj.setData(data);

		this.flipPage(pageInfo.pageObj, isFirst);

		if(!isNoHistory) this.pushHistory(pageInfo.pageObj);
	}
	
	return pageInfo.pageObj;
};

ANavigator.prototype.goPrevPage = function(data)
{
	if(this.canGoPrev())
	{
		this.curHisIndex--;
		var page = this.pageHistory[this.curHisIndex];
		
		page.pageData = data;	//deprecated
		page.setData(data);
		
		this.flipPage(page, false);
		
		return true;
	}
	
	return false;
};

ANavigator.prototype.goNextPage = function(data)
{
	if(this.canGoNext())
	{
		this.curHisIndex++;
		var page = this.pageHistory[this.curHisIndex];
		
		page.pageData = data;	//deprecated
		page.setData(data);
		
		this.flipPage(page, false);
		
		return true;
	}
	
	return false;
};

ANavigator.prototype.getActivePage = function()
{
    return this.activePage;
};

ANavigator.prototype.canGoPrev = function()
{
	return (this.curHisIndex>0);
};

ANavigator.prototype.canGoNext = function()
{
	return (this.curHisIndex<this.pageHistory.length-1);
};

ANavigator.prototype.clearHistory = function()
{
	this.pageHistory.length = 0;
	this.curHisIndex = -1;
};

ANavigator.prototype.clearPage = function(pageId)
{
	var pageInfo = this.getPageInfo(pageId);
	
	if(pageInfo && pageInfo.pageObj)
	{
		pageInfo.pageObj.close();
		pageInfo.pageObj = null;
	}
};

ANavigator.prototype.onResize = function()
{
	var pageInfo, pageId;
	
	for(pageId in this.pageInfoMap)
	{
		pageInfo = this.getPageInfo(pageId);
			
		if(pageInfo.pageObj) pageInfo.pageObj.onResize();
	}
};




