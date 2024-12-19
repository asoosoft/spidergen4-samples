/**
 * @author asoocool
 */

function ATabBar()
{
	ABar.call(this);
	
	this.selectedTab = null;
	this.moreBtn = null;
	
	//임시 변수
	this.option = 
	{
		isCloseBtn: true,
		isIcon: true,
		isTabWrap: true
	};
	
	this.ttTimer = null;
}
afc.extendsClass(ATabBar, ABar);

ATabBar.CONTEXT = 
{
	tag: '<div data-base="ATabBar" data-class="ATabBar" class="ATabBar-Style"></div>',

    defStyle:
    {
        width:'100%', height:'40px'
    },

    events: []
};


ATabBar.prototype.init = function(context, evtListener)
{
	ABar.prototype.init.call(this, context, evtListener);
	
	//탭 버튼의 줄바꿈 옵션 과 더보기 버튼 공백
	if(this.option.isTabWrap)
	{
		this.setStyleObj(
		{
			'-webkit-flex-wrap': 'wrap',
			'-ms-flex-wrap': 'wrap',
			'padding-right': '20px'
		});
	}
};

ATabBar.prototype.preset = function()
{
	//우측 끝의 더보기 버튼
	var btn = new AButton();

	btn.preset = function()
	{
		this.setAttr('data-center-top', true);
		this.setAttr('data-color', 'rgb(255, 255, 255)|rgb(255, 255, 255)|');
		this.setAttr('data-bgcolor', 'rgb(58, 58, 58)|rgb(89, 89, 89)|');
	};

	btn.init();
	btn.setText('▼');
	btn.setStyleObj({ left:'', right:'5px', top:'5px', width:'15px', height:'15px', 'font-size': '10px' });
	btn.addEventListener('click', this, 'onDropBtnClicked');
	this.addComponent(btn);

	this.moreBtn = btn;
		
	if(!this.option.isTabWrap) this.moreBtn.hide();
};

//----------------------------------------------------------
//  delegate functions
//  function onCloseContainer();
//----------------------------------------------------------
ATabBar.prototype.setDelegator = function(delegator)
{
    this.delegator = delegator;
};


ATabBar.prototype.onDropBtnClicked = function(acomp, info)
{
	var tabs = this.getHiddenTabs(), tab;
	var menuItem = [];
	
	if(tabs.length==0) return;
	
	for(var i=0; i<tabs.length; i++)
	{
		tab = tabs[i];
		menuItem.push({ text: this.getTabTitle(tab), id:tab.tabId, icon:0 });
	}

	var pos = acomp.getBoundRect();

	//var menu = new AMenu(null, 0, MenuInfo.PRJ_MENU_ICON); //temp code
	//menu.setItemInfoArr(menuItem);
	//menu.setSelectListener(this, 'onMenuSelect');
	//menu.popupEx( { 'left': pos.left+'px', 'top': pos.top+acomp.getHeight()+'px' } );
};

ATabBar.prototype.onMenuSelect = function(menu, info)
{
	var tab = this.selectTabById(info.id, true);
	
	if(tab) this.reportEvent('select', tab, {});
};

ATabBar.prototype.onCloseBtnClick = function(acomp, info)
{
	var rTab = acomp.getParent();

	//onCloseContainer 함수에서 true 를 리턴하면 닫지 않기
	if(this.delegator && this.delegator.onCloseContainer(rTab)) return;
	
	this.removeTab(rTab);
};

ATabBar.prototype.moveTab = function(mvTab, posTab, isAfter)
{
	if(isAfter) mvTab.$ele.insertAfter(posTab.element);
	else mvTab.$ele.insertBefore(posTab.element);
};

ATabBar.prototype.indexOfTab = function(tab)
{
	return (this.$ele.children().index(tab.element) - 1);
};

ATabBar.prototype.getNextTab = function(tab)
{
	if(!tab) tab = this.selectedTab;
	
	var nextTab = tab.$ele.next()[0];
	if(nextTab) return nextTab.acomp;
	else return null;
};

ATabBar.prototype.getPrevTab = function(tab)
{
	if(!tab) tab = this.selectedTab;
	
	var prevTab = tab.$ele.prev()[0];
	if(prevTab) return prevTab.acomp;
	else return null;
};

ATabBar.prototype.getSelectedTab = function()
{
	return this.selectedTab;
};

ATabBar.prototype.getSelectedCntr = function()
{
	if(this.selectedTab) return this.selectedTab.cntr;
	else return null;
};

ATabBar.prototype.getActiveTabIdx = function()
{
	if(!this.selectedTab) return -1;

	var tabIdx = -1,
		selTabId = this.selectedTab.tabId;
	
	this.eachChild(function(acomp, inx)
	{
		if(acomp.tabId==selTabId) 
		{
			tabIdx = inx - 1;	//drop button 제거
			return false;	//loop stop
		}
	});
	
	return tabIdx;
};

ATabBar.prototype.selectTab = function(tab, moveFirst)
{
	if(tab)
	{
		//더보기 버튼이 태그 순서상 제일 앞이다.
		//if(moveFirst) tab.$ele.insertAfter(this.moreBtn.$ele);
		if(moveFirst) this.moveTab(tab, this.moreBtn, true);

		if(this.selectedTab!==tab) 
		{
			tab.$ele.css('background-color', '#1473e6');
			if(tab.cntr) 
			{
				tab.cntr.show();
				tab.cntr.onResize();
			}

			if(this.selectedTab) 
			{
				//if(this.selectedTab.cntr) 
				//this.selectedTab.cntr.hide();

				//컨테이너의 hide 를 호출하면 active, deactive 가 두번 발생한다.
				//활성화될 컨테이너의 show 만 호출해 줘도 되지만 성능을 위해 안보이는 컨테이너를 숨기기 위해
				//$ele.hide 만 호출해 준다.
				if(this.selectedTab.cntr)
				{
					this.selectedTab.cntr.$ele.hide();
					if(this.selectedTab.cntr.getView() && this.selectedTab.cntr.getView().onHide) this.selectedTab.cntr.getView().onHide();
				}
				this.selectedTab.$ele.css('background-color', '#424242');
			}

			this.selectedTab = tab;
		}
	}
		
	return tab;
};

ATabBar.prototype.selectTabById = function(tabId, moveFirst)
{
	if(this.ttTimer)
	{
		clearTimeout(this.ttTimer);
		this.ttTimer = null;
	}

	var tab = this.findTabById(tabId);
	
	//참 여부는 함수 내부에서 검사
	return this.selectTab(tab, moveFirst);
};


/*
ATabBar.prototype.setTabTitle = function(tabId, title)
{
	var tab = this.findTabById(tabId);
	if(tab)
	{
		tab.getChildren()[1].setText(title);
	}
};

ATabBar.prototype.getTabTitle = function(tabId)
{
	var tab = this.findTabById(tabId);
	
	if(tab) return tab.getChildren()[1].getText();
	else return null;
};
*/

ATabBar.prototype.setTabTitle = function(tab, title)
{
	tab.getChildren()[1].setText(title);
};

ATabBar.prototype.getTabTitle = function(tab)
{
	return tab.getChildren()[1].getText();
};

ATabBar.prototype.addTab = function(tabId, title, cntr, ttMsg)
{
	var tabBtnView = this._makeTab(),
		comps = tabBtnView.getChildren();
	
	tabBtnView.tabId = tabId;
	tabBtnView.ttMsg = ttMsg;
	
	if(cntr)
	{
		tabBtnView.cntr = cntr;
		cntr.tab = tabBtnView;
	}
	
	if(this.option.isIcon)
	{
		//comps[0].setImage('Theme/img/tree_item.png');

		//comps[0] is label
		comps[0].$ele.css(
		{
			'background-image': 'url("Theme/img/tree_item.png")',
			'background-position': (-16 * 2) + 'px 0px',
			'background-size': 'auto'
		});
	}
	
	//label
	comps[1].setText(title);
	comps[1].$ele.css('white-space', 'nowrap');
	
	//temp code
	if(this.option.isCloseBtn)
	{
		//x button
		comps[2].invisible();
		
		var tooltip = null, thisObj = this;

		tabBtnView.$ele.hover(
			function() 
			{
				comps[2].visible();
				
				if(tabBtnView.ttMsg)
				{
					thisObj.ttTimer = setTimeout(function()
					{
						thisObj.ttTimer = null;
						
						if(tabBtnView.isValid())
						{
							tooltip = new ATooltip();
							tooltip.show(tabBtnView.ttMsg, tabBtnView.getBoundRect());
						}

					}, 700);
				}
			},
			function() 
			{ 
				if(thisObj.ttTimer) 
				{
					clearTimeout(thisObj.ttTimer);
					thisObj.ttTimer = null;
				}
				
				else if(tooltip)
				{
					tooltip.hide();
					tooltip = null;
				}
			
				comps[2].invisible(); 
			}
		);

		comps[2].eventStop = true;
		comps[2].addEventListener('click', this, 'onCloseBtnClick');
	}

	this.aevent._select(tabBtnView);
	this.aevent._move(tabBtnView);
	
	this.addComponent(tabBtnView);
	
	return tabBtnView;
};

ATabBar.prototype.removeTab = function(rTab, doNotSelect)
{
	if(rTab.cntr) rTab.cntr.close();

	this.removeComponent(rTab);
	
	if(rTab === this.selectedTab) this.selectedTab = null;
	
	//일단 맨 마지막 탭을 활성화 시킨다. 차후 바로 이전 탭으로 활성화 해주기
	
	var tabCnt = this.getTabCount();
	
	if(!doNotSelect && tabCnt > 0)
	{
		var tab = this.getLastChild();
		this.selectTab(tab);
	}
	
	return tabCnt;
};

ATabBar.prototype.getFirstTab = function() 
{
	return this.getNextTab(this.moreBtn);
};

ATabBar.prototype.getLastTab = function() 
{ 
	return this.getLastChild(); 
};

ATabBar.prototype.selectFirstTab = function() 
{ 
	return this.selectTab(this.getFirstTab()); 
};

ATabBar.prototype.selectLastTab = function() 
{
	return this.selectTab(this.getLastTab());
};

//더보기 버튼 제외하기 위해 -1
ATabBar.prototype.getTabCount = function()
{
	return (this.getChildCount()-1);
};

ATabBar.prototype._makeTab = function()
{
	var view = AView.createView(null, 'Framework/afc/layout/tabbar-item.html', this);
	
	//tabbar-item.lay 파일의 리소스 상에서 아래 항목들을 셋팅해 줬으므로 
	//아래 코딩이 추가로 필요없다.
	/*
	view.setStyleObj(
	{
		'position': 'static',
		width: 'auto', height: 'auto',
		'padding': '0 20px 0 20px',
	});
	*/
	
	//temp code	
	if(!this.option.isIcon) view.getFirstChild().hide();
	if(!this.option.isCloseBtn) view.getLastChild().hide();
	
	return view;
};

ATabBar.prototype.findTabById = function(tabId)
{
	var retTab = null;
	
	if(tabId)
	{
		this.eachChild(function(acomp)
		{
			if(acomp.tabId==tabId) 
			{
				retTab = acomp;
				return false;	//loop stop
			}
		});
	}
		
	return retTab;
};


ATabBar.prototype.getAllTabs = function()
{
	var rets = [];

	this.eachChild(function(acomp, inx)
	{
		//더보기 버튼 제외
		if(inx==0) return;
	
		//모두 가져오는 경우
		rets.push(acomp);
	});
	
	return rets;
};


ATabBar.prototype.getHiddenTabs = function()
{
	var rets = [], pos;

	this.eachChild(function(acomp, inx)
	{
		//더보기 버튼 제외
		//if(tabs[i].className == 'AButton') continue;
		if(inx==0) return;
	
		pos = acomp.getPos();
		//두번째 줄에 있는 버튼이면 히든 버튼임.
		if(pos.top>0) rets.push(acomp);
		
		//모두 가져오는 경우
		//rets.push(acomp);
	
	});
	
	return rets;
};


