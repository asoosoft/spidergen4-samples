/**
 * @author asoocool
 */

function ATabView()
{
	AComponent.call(this);
	
	this.delegator = null;
	
    this.tabArea = null;
    this.tabContents = null;
    this.tabBtnTpl = null;
    
	this.isRefresh = false;
    
    this.isAnimation = false;
    this.slideDir = 'left';	//changeAnimation 이 slide 일 경우 사용된다.
    
    //this.tabHeight = '22px';	//asoocool_20180426
    //this.paddingX = '40px';
    //this.paddingY = '20px';
    this.selectedTab = null;
    //바로 이전에 선택되었던 탭
    this.oldTab = null;
	this.lastSelectedTabId = null;
    
    this.isTabChanging = false;	//탭이 변경되고 있는 중인지
    
    this.option =
    {
        contentReload: false,    //탭이 변경될 경우 컨텐츠를 다시 로드할 지
        changeAnimation: 'slide',    //fade, slide
		sameTabCheck: true
    };
    
    /*
    this.option =
    {
        upTxtColor: '#585858',
        upBgColor: '#d8e1eb',
        downTxtColor: '#2c2c2c',
        downBgColor: '#f0f0f0',
        borderColor: '#a0a0a0',
        tabBgColor: '#eef1fb',
    };
    */
    
    //this.txtColors = ['',''];
	//this.bgColors = ['',''];
   	//this.bgImages = ['',''];
   	this.btnStyles = ['',''];
    
}
afc.extendsClass(ATabView, AComponent);

ATabView.CONTEXT = 
{
    tag: '<div data-base="ATabView" data-class="ATabView" class="ATabView-Style" data-state="0" >'+
	        '<div class="tab_area">'+
	            '<span class="ATabView_select">tab1</span>'+
	            '<span class="ATabView_deselect">tab2</span>'+
	            '<span class="ATabView_deselect">tab3</span>'+
			'</div>'+
    		'<div class="tab_contents"></div>'+
	      '</div>',

    defStyle: 
    {
        width:'380px', height:'240px'
    },

    events: ['swipe']
};



ATabView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
		
	this.tabArea = this.$ele.find('.tab_area');
	this.tabContents = this.$ele.find('.tab_contents');
	this.tabBtnTpl = this.tabArea.children().eq(1).clone(); 

	//this.tabHeight = this.tabArea.css('height');	//asoocool_20180426

	var styles = [this.getAttr('data-style-tabselect'), this.getAttr('data-style-tabnormal')];
	this.setBtnStyle(styles);
	//if(attrArr) this.setBtnStyle(attrArr.split('|'));
	
	if(this.getAttr('data-tab-history')) this.enableHistory(true);
	

	//개발 모드가 아니면
	if(!window._afc) 
	{
		this.tabArea.children().remove();
		
		var tabInfos = this.getMultiAttrInfo('data-tabinfo-'), p, infoArr, tmp, index=0, arr = {};
		
		for(key in tabInfos)
		{
			tmp = tabInfos[key].split(',')[3];
			if(tmp) arr[tmp] = tabInfos[key];
			else arr[index++] = tabInfos[key];
		}

		for(i in arr)
		{
			infoArr = arr[i].split(',');
			this.addTab(infoArr[1], infoArr[2], infoArr[0]);
		}
		
		var thisObj = this;
		
		setTimeout(function()
		{
			var selTabId = thisObj.$ele.attr('data-tab-select');
			if(selTabId) thisObj.selectTabById(selTabId);
		}, 0);
	}

//	if(this.tabArea.css('visibility')=='hidden') this.hideTabArea();

};

//----------------------------------------------------------
//	* delegate functions *
//	function beforeTabChanging(oldView, newView, isFirst, tabview);
//	function tabChanging(oldView, newView, isFirst, tabview);
//	function afterTabChanged(oldView, newView, isFirst, tabview);
//----------------------------------------------------------

ATabView.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;
};


ATabView.prototype.setSlideDir = function(dir)
{
	this.slideDir = dir;
};

ATabView.prototype.enableAnimation = function(enable)
{
	this.isAnimation = enable;
};

ATabView.prototype.setTabOption = function(option)
{
    for(var p in option)
    { 
        if(option[p]!=undefined)
            this.option[p] = option[p];
    }
};

//asoocool_20180426
ATabView.prototype.showTabArea = function()
{
	var tabHeight = this.tabArea.height();
	
    this.tabArea.show();
	this.tabContents.css('height', 'calc(100% - '+ tabHeight +'px)');
};

ATabView.prototype.hideTabArea = function()
{
	this.tabArea.hide();
	this.tabContents.css('height', '100%');
};

/*
ATabView.prototype.getTabAreaHeight = function()
{
	if(!this.tabArea.is(":visible")) return 0;
    else return this.tabArea.height();
};
*/

ATabView.prototype.addTabEx = function(tabInfo)
{
	return this.addTab(tabInfo.name, tabInfo.url, tabInfo.tabId, tabInfo.data, tabInfo.oneshot, tabInfo.isLoad);
};

//탭컨트롤 내부에 탭버튼을 추가한다. url 은 탭버튼 클릭시 보여줄 컨텐츠이다. 
ATabView.prototype.addTab = function(name, url, tabId, data, oneshot, isLoad)
{
    //탭버튼 템플릿을 복사하여 추가한다.
   	var tabObj = this.tabBtnTpl.clone();
   	tabObj.text(name);
   	
    this.tabArea.append(tabObj);

    var content = $('<div></div>');
    content.css(
    {
        display: 'none',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    });
	
	if(typeof(url)=='string') tabObj.attr('data-page', url);
	
	//url is aview
	else AView.setViewInItem(url, content[0], this);
    
    //box-sizing 적용됨. padding-top 만큼이 tabarea 뒤에 숨는다. 
    //this.tabContents.css('padding-top', this.getTabAreaHeight()+'px');
    this.tabContents.append(content);
    
    var tabEle = tabObj[0];
    //탭과 매칭되는 컨텐츠 영역을 저장해 둔다.
    tabEle.content = content[0];
    tabEle.name = name;
    tabEle.tabId = tabId;
    tabEle.data = data;
    //tabEle.view = null;
	tabEle.oneshot = oneshot;
	
	//자신과 연결되어 있는 탭 객체를 저장해 둔다.
	content[0].tab = tabEle;
    
    //content 내부의 중복 클래스 접근을 위해 고유 아이디를 부여한다.
    if(tabEle.tabId) content.attr('id', this.element.id+'-'+tabEle.tabId);
    
    var thisObj = this;
    AEvent.bindEvent(tabEle, AEvent.ACTION_DOWN, function(e)
    {
		//thisObj.lastSelectedTabId = tabEle.tabId;
        //thisObj.tabChangeManage(this);
		
		thisObj.selectTab(this);
    }); 
    
	if(isLoad) this.loadTabContent(tabEle, true);
    
    return tabEle;
};

ATabView.prototype.removeTab = function(tab)
{
	if(tab.content && tab.content.view)
		tab.content.view.removeFromView();
	
    $(tab.content).remove();
    $(tab).remove();
    
    //box-sizing 적용됨. padding-top 만큼이 tabarea 뒤에 숨는다. 
    //this.tabContents.css('padding-top',this.getTabAreaHeight()+'px');
};

/*
ATabView.prototype.setTabPadding = function(paddingX, paddingY)
{
    this.paddingX = paddingX;
    this.paddingY = paddingY;
};
*/

ATabView.prototype.setTabName = function(tab, name)
{
	tab.name = name;
	$(tab).text(name);
};

ATabView.prototype.setTabUrl = function(tab, url)
{
	$(tab).attr('data-page', url);
	
	this.loadTabContent(tab);
};

ATabView.prototype.selectTab = function(tab, data, isNoHistory)
{
	this.lastSelectedTabId = tab.tabId;
	
	if(data!=undefined) tab.data = data;
	
	var ret = this.tabChangeManage(tab);
	
	//탭이 선택된 히스토리 정보를 저장한다.
	if(this.historyInfo && !isNoHistory && ret)
	{
		this.historyInfo.pushInfo(tab);
	}
};

ATabView.prototype.clearSelectTab = function()
{
	this.selectedTab = null;
    this.oldTab = null;
	this.lastSelectedTabId = null;
};

ATabView.prototype.removeAllTab = function()
{
	this.clearSelectTab();
	var allTabs = this.getAllTabs();
	for(var i = 0; i<allTabs.length; i++)
	{
		this.removeTab(allTabs[i]);
	}
};

//탭을 순서 번호로 찾아 활성화 한다.
ATabView.prototype.selectTabByIndex = function(index, data)
{
    var selTab = this.getTabByInx(index);
    
    if(selTab) this.selectTab(selTab, data);
    return selTab;
};

//탭을 고유 아이디로 찾아 활성화한다. 활성화된 탭을 리턴한다. 찾지 못하면 null
ATabView.prototype.selectTabById = function(tabId, data)
{
    var selTab = this.getTabById(tabId);
    if(selTab) this.selectTab(selTab, data);
    return selTab;
};

//탭 아이디로 탭 객체 얻어오기
ATabView.prototype.getLastSelectedTabId = function()
{
    if(this.lastSelectedTabId) return this.lastSelectedTabId;
	else return this.getTabByInx(0).tabId;
};

//탭 아이디로 탭 객체 얻어오기
ATabView.prototype.getTabById = function(tabId)
{
    var retTab = null;
    
    this.tabArea.children().each(function()
    {
        if(this.tabId==tabId) 
        {
            retTab = this;
            return false;   //each callback 리턴
        }
    });
    
    return retTab;
};

//탭 인덱스로 탭 객체 얻어오기
ATabView.prototype.getTabByInx = function(index)
{
    var retTab = null;
    if(index<0) retTab = this.tabArea.children().last()[0];
    else retTab = this.tabArea.children().eq(index)[0];
    
    return retTab;
};

ATabView.prototype.getAllTabs = function()
{
    return this.tabArea.children();
};

ATabView.prototype.getSelectedTab = function()
{
    return this.selectedTab;
};

ATabView.prototype.callSubActiveEvent = function(funcName, isFirst)
{
	var selView = this.getSelectedView();
	if(selView) selView[funcName](isFirst);
};


ATabView.prototype.getSelectedView = function()
{
	if(this.selectedTab) return this.selectedTab.content.view;
    else return null;
};

ATabView.prototype.tabChangeManage = function(tabEle)
{
	if(this.isTabChanging) return false;
	
	if(this.selectedTab === tabEle)
	{
		if(this.option.sameTabCheck) return false;
		else 
		{
			this.activeTab(this.selectedTab, this.selectedTab, false);
			//this.activeTab(null, this.selectedTab, false);
			return true;
		}
	}

	this.oldTab = this.selectedTab;

	//이전 버튼 비활성
	if(this.oldTab) 
	{
		/*
		$(this.oldTab).css(
		{
			'color': this.txtColors[1],
			'background-color': this.bgColors[1],
			'background-image': this.bgImages[1]	
		});
		*/
		
		if(this.btnStyles[0]) $(this.oldTab).removeClass(this.btnStyles[0]);
		$(this.oldTab).removeClass('ATabView_select');
		
		if(this.btnStyles[1]) $(this.oldTab).addClass(this.btnStyles[1]);
		$(this.oldTab).addClass('ATabView_deselect');
	}

	this.selectedTab = tabEle;
	
	/*
	//현재 버튼 활성화
	$(this.selectedTab).css(
	{
		'color': this.txtColors[0],
		'background-color': this.bgColors[0],
		'background-image': this.bgImages[0]	
	});
	*/
	
	if(this.btnStyles[1]) $(this.selectedTab).removeClass(this.btnStyles[1]);
	$(this.selectedTab).removeClass('ATabView_deselect');
	if(this.btnStyles[0]) $(this.selectedTab).addClass(this.btnStyles[0]);
	$(this.selectedTab).addClass('ATabView_select');

	//아직 뷰가 로드되지 않은 상태이거나 매번 릴로드 하는 옵션이면
	if(!tabEle.content.view || this.option.contentReload) 
	{
		if(this.loadTabContent(tabEle))
			this.activeTab(this.oldTab, this.selectedTab, true);
	}
	else this.activeTab(this.oldTab, this.selectedTab, false);
	
	return true;
};

//view 로 tabElement 를 얻으려면 view.item.tab
ATabView.prototype.loadTabContent = function(tabEle, skipActiveDone) 
{
	var tabUrl = $(tabEle).attr('data-page');
	
	//item, url, owner, eventListener, skipUpdatePos, skipActiveDone
	var aview = AView.createView(tabEle.content, tabUrl, this, null, null, skipActiveDone);
	
	return aview;
};

//탭활성화 관련 처리, reload : 컨텐츠를 새롭게 다시 로드했는지
ATabView.prototype.activeTab = function(oldTab, newTab, reload) 
{
	this.isTabChanging = true;
	
	var thisObj = this, oldView = null, newView = null;

	if(oldTab) oldView = oldTab.content.view;
	newView = newTab.content.view;

	//IOS UIWebOverflowContentView BugFix	
	if(afc.isIos && window.AppManager) AppManager.enableApp(false);
	
	//---------------------------------------------------------------------------
	//	나중에 액티브될 경우 이벤트가 전달되지 않도록 사라질 때 disable 상태로 만든다.
	
	if(oldView && oldView.isActiveActionDelay) oldView.enable(false);
	
	this.beforeTabChanging(oldView, newView, reload);

	//최초 액티브될 경우 이벤트가 전달되지 않도록 disable 시켜둔다.
	if(reload && newView.isActiveActionDelay) newView.enable(false);
	//-----------------------------------------------------------------------------
	
	if(this.isAnimation)
	{
		switch(this.option.changeAnimation) 
		{
			case 'slide':
			{
				if(oldTab) 
					$(oldTab.content).addClass('slide-out-'+this.slideDir);
				
				var newContent = $(newTab.content);
	           	newContent.show();
				newContent.addClass('slide-in-'+thisObj.slideDir);
	           	 
	           	newContent.one('webkitAnimationEnd', function()
	           	{
	        		if(oldTab) 
	        		{
	        			$(oldTab.content).removeClass('slide-out-'+thisObj.slideDir);
	        			$(oldTab.content).hide();
	        		}
	        		
	            	newContent.removeClass('slide-in-'+thisObj.slideDir);
	            	
	            	_effectCallback();
	           	});
			}
			break;

			case 'fade':
			{
				if(oldTab) $(oldTab.content).hide();

				$(newTab.content).fadeIn('fast', _effectCallback);
			}
			break;

			default:
			{
				if(oldTab) $(oldTab.content).hide();
					
				$(newTab.content).show('fast', _effectCallback);
			}
			break;
		}
		
		//자체적으로 호출하므로 effectCallback 을 호출하지 않는다.
		_showCallback(false);
	}

	//에니메이션 효과가 없는 경우
	else
	{
		if(oldTab) $(oldTab.content).hide();
		
		var newContent = $(newTab.content);
		newContent.show();
		
		_showCallback(true);
	}
	
	function _showCallback(isEffectCallback)
	{
		thisObj.tabChanging(oldView, newView, reload);
			
		if(isEffectCallback) setTimeout(_effectCallback, 0);
	}

	function _effectCallback() 
	{
		thisObj.afterTabChanged(oldView, newView, reload);
		
		//이전 탭에서 터치한 정보가 전달되지 안도록 
		//disable 상태에서 잠시 딜레이를 준 후 enable 시켜준다.
		
		if(newView.isActiveActionDelay)
			setTimeout(function() { newView.enable(true); }, afc.DISABLE_TIME);
		
		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos && window.AppManager) setTimeout(function() { AppManager.enableApp(true); }, AppManager.TOUCH_DELAY_TIME);

		
		if(oldTab && oldTab.oneshot) 
		{
			oldTab.content.view.removeFromView();
			oldTab.content.view = null;
		}
		
		
		thisObj.isTabChanging = false;
	}
};

ATabView.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	if(this.selectedTab)
	{
		var aview = this.selectedTab.content.view;
		
		if(aview) aview.updatePosition();
	}
};

/*
ATabView.prototype.setTextColor = function(colors)
{
	this.txtColors = colors;
};

ATabView.prototype.setBGColor = function(colors)
{
	this.bgColors = colors;
};

ATabView.prototype.setBGImage = function(images)
{
	this.bgImages = images;
};
*/
ATabView.prototype.setBtnStyle = function(styles)
{
	if(this.btnStyles)
	{
		this.removeClass(this.btnStyles[0]);
		this.removeClass(this.btnStyles[1]);
		//this.removeClass(this.btnStyles[2]);
	}
	
	this.btnStyles = styles;
};

ATabView.prototype.changeBtnState = function(oldState, newState)
{
	//this.setStyle('color', this.txtColors[newState]);
	//this.setStyle('background-color', this.bgColors[newState]);
	//this.setStyle('background-image', this.bgImages[newState]);
	
	/*
	if(this.txtColors[newState]) this.element.style.setProperty('color', this.txtColors[newState], 'important');
	if(this.bgColors[newState]) this.element.style.setProperty('background-color', this.bgColors[newState], 'important');
	
	if(this.bgImages[newState]) this.element.style.setProperty('background-image', this.bgImages[newState], 'important');
	else this.element.style.setProperty('background-image', '', 'important');
	*/
	
	//최초 초기화 하는 경우
	if(oldState<0)
	{
		if(this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
		this.addClass('AButton-'+afc.BTN_STATE[newState]);
	}
	else
	{
		if(this.isStyleOver)
		{
			if(newState>AButton.NORMAL && this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
			if(oldState>AButton.NORMAL && this.btnStyles[oldState]) this.removeClass(this.btnStyles[oldState]);
		}
		else
		{
			if(this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
			if(this.btnStyles[oldState]) this.removeClass(this.btnStyles[oldState]);
		}
		
		this.removeClass('AButton-'+afc.BTN_STATE[oldState]);
		this.addClass('AButton-'+afc.BTN_STATE[newState]);
	}
};


//--------------------------------------------------------------------------------------------------

ATabView.prototype.beforeTabChanging = function(oldView, newView, isFirst)
{
	if(this.delegator && this.delegator.beforeTabChanging) this.delegator.beforeTabChanging(oldView, newView, isFirst, this);
	
	if(newView) newView.onWillActive(isFirst);
	if(oldView) oldView.onWillDeactive();
};

ATabView.prototype.tabChanging = function(oldView, newView, isFirst) 
{
	if(this.delegator && this.delegator.tabChanging) this.delegator.tabChanging(oldView, newView, isFirst, this);
	
	if(newView) newView.onActive(isFirst);
	if(oldView) oldView.onDeactive();
};

ATabView.prototype.afterTabChanged = function(oldView, newView, isFirst)
{
	if(this.delegator && this.delegator.afterTabChanged) 
	{
		//if(newView.isInitDone) this.delegator.afterTabChanged(oldView, newView, isFirst, this);
		if(!isFirst) this.delegator.afterTabChanged(oldView, newView, isFirst, this);
	}
	
    if(newView) 
	{
		if(!isFirst) 
		{
			newView.updatePosition();	//최초인 경우는 onInitDone 전에 updatePosition 이 호출되어진다.
			newView.onActiveDone(isFirst);
		}
		
		//init 이 완전히 완료되었는지, 알메이트 컴포넌트 관련해서 체크해야 함
		//if(newView.isInitDone) newView.onActiveDone(isFirst);
	}
	
    if(oldView) oldView.onDeactiveDone();
};


ATabView.prototype.removeFromView = function(onlyRelease)
{
	this.removeAllTab();
	
	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

ATabView.prototype.enableHistory = function(enable)
{
	if(enable) this.historyInfo = new AHistoryInfo();
	else this.historyInfo = null;
};

ATabView.prototype.clearHistory = function(enable)
{
	if(this.historyInfo) this.historyInfo.clearHistory();
};

ATabView.prototype.goPrevSelect = function(data)
{
	if(this.historyInfo)
	{
		var tab = this.historyInfo.prevInfo();
		if(tab) this.selectTab(tab, data, true);
	}
};

ATabView.prototype.goNextSelect = function(data)
{
	if(this.historyInfo)
	{
		var tab = this.historyInfo.nextInfo();
		if(tab) this.selectTab(tab, data, true);
	}
};

ATabView.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
		
	var keyArr = ['data-style-tabnormal', 'data-style-tabselect'], val;
	
	for(var i=0; i<keyArr.length; i++)
	{
		val = this.getAttr(keyArr[i]);

		//attr value 에 null 이나 undefined 가 들어가지 않도록
		ret[keyArr[i]] = val ? val : '';
	}
	
	return ret;
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
ATabView.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) AComponent.prototype._setDataStyleObj.call(this, styleObj);
		
		else if(p=='data-style-tabnormal') this._set_class_helper(this.$ele, this.$ele.find('.ATabView_deselect'), styleObj, p);
		else if(p=='data-style-tabselect') this._set_class_helper(this.$ele, this.$ele.find('.ATabView_select'), styleObj, p);
	}
};

