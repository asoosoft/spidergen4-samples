
/**
 * @author asoocool
 */
 
//------------------------------------------------------------------------
//	뷰에는 내부에 다른 뷰를 로드하는 기능이 없도록 한다. 
//	뷰는 오로지 addcomponent 를 통해서만 다른 컴포넌트를 추가할 수 있다. 
//	폼을 구성하기 위한 기본 요소이다.
//------------------------------------------------------------------------

function AView()
{
	AComponent.call(this);
	
	this.isActiveActionDelay = true;
	
	//AView 의 소유자, 자신을 로드한 주체
	this.owner = null;
	this.document = null;
	this.url = null;
	
	//중복 아이디를 막기 위해 동적으로 할당된 prefix
	//afc.CLASS_MARK 를 포함하고 있다. ex, 4736352637362--
	this.compIdPrefix = '';
	
	//자체적인 스크롤 구현
	this.scrlManagerX = null;
	this.scrlManagerY = null;
	
	//this.isInitDone = false;	//init 이 완전히 완료되었는지, 알메이트 컴포넌트 관련해서 체크해야 함
	
	
	this.ldView = null;	//loaded view --> deprecated
	this.ldCntr = null;
	
}
afc.extendsClass(AView, AComponent);


//--------------------------------------------------------------------------------------------
//	static area

AView.CONTEXT = 
{
    tag: '<div data-base="AView" data-class="AView" class="AView-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    //events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom', 'drop', 'dragStart', 'dragEnd' ]
    events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom' ]
};

AView.NAME = "AView";

AView.isLoadCache = undefined;

AView.enableCache = function(enable)
{
	AView.isLoadCache = enable;
};


AView.setViewInItem = function(aview, item, owner)
{
	aview.$ele.css(
	{
		position: 'relative',
		left: '0px', top: '0px'
	});

	$(item).append(aview.$ele);

	aview.owner = owner;	//자신을 로드한 주체(_AComponent, _AContainer)
	aview.item = item;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
	item.view = aview;		//item 은 view 란 변수로 _AView 객체를 저장

	if(owner) aview.element.container = owner.getContainer();
	
	return aview;
};


//	뷰 객체만 로드하여 얻고 싶은 경우는 
//	item 에 null 값을 주고 url 만 입력하면 됨
//	--> AView.createView(null, 'view/test.lay');
//
AView.createView = function(item, url, owner, eventListener, skipUpdatePos, skipActiveDone)
{
	//AView.enableCache 함수를 호출한 경우 적용해 준다.
	if(AView.isLoadCache!=undefined) 
		$.ajaxSetup({cache: AView.isLoadCache});


	var aview = null;
	//var searchValue = AUtil.extractFileNameExceptExt(url, '/') + afc.CLASS_MARK;
	
	if(!item) item = $('<div></div>')[0];
	
	//반응형 사용여부
	if(PROJECT_OPTION.general.responsiveLay)
	{
		var RESPONSIVE_MODE;
		if(afc.isPC) RESPONSIVE_MODE = 'Pc'; 
		else if(afc.isMobile) RESPONSIVE_MODE = 'Mobile'
		if(RESPONSIVE_MODE)
		{
			var path = AUtil.extractLoc(url,'/');
			var fileName = AUtil.extractFileNameExceptExt(url,'/');
			var resUrl = path + RESPONSIVE_MODE + '/' +fileName+'.html';
			if(AUtil.isExistFile(resUrl)) url = resUrl;
		}
	}

	//로컬라이징 사용여부
	if(PROJECT_OPTION.general.localizing)
	{
		var path = AUtil.extractLoc(url,'/');
		var fileName = AUtil.extractFileNameExceptExt(url,'/');
		var localizeUrl = path + LocalizeManager.LANGUAGE + '/' +fileName+'.html';
		if(AUtil.isExistFile(localizeUrl)) url = localizeUrl;
	}
	
	afc.loadSync(item, url, function(ret)
	{
		if(!ret) return;

		var viewObj = $(this).children();
		var viewContext = viewObj[0];
		
		//AView의 absolute 옵션을 relative로 바꿔준다.
		//그래야 자식 컴포넌트들이 자신을 기준으로 배치된다.
		viewObj.css('position', 'relative');

		var _className = viewObj.attr(afc.ATTR_CLASS);
		if(!_className)
		{
			alert(afc.log('There is no className in attribute. url : ' + url));
			return;
		}
		
		//-------------------------------------------------------------------------
		// cls 파일 동적 로딩
		if(PROJECT_OPTION.build.dynamicInc && _className!='AView') 
		{
			//로컬라이징 사용여부
			if(PROJECT_OPTION.general.localizing) url = url.replace("/"+LocalizeManager.LANGUAGE+"/","/");
			//반응형
			if(PROJECT_OPTION.general.responsiveLay) url = url.replace("/"+RESPONSIVE_MODE+"/","/");
			afc.loadScript( url.substring(0, url.lastIndexOf(".")) + '.js');
		}
		//-------------------------------------------------------------------------		
		
		
		//-------------------------------------------------------------------------
		// 컴포넌트 파일 동적 로딩
		if(PROJECT_OPTION.build.dynamicComp && _className!='AView') 
		{
			var classMap = viewObj.attr('data-class-map');
			
			if(classMap)
			{
				var arr, p, i;
				
				//화면 파일은 캐시를 사용하지 않아도 컴포넌트 라이브러리는 
				//무조건 캐시를 사용하도록 셋팅, 차후 실효성을 테스트 해보고 수정하기
				if(AView.isLoadCache!=undefined) $.ajaxSetup({cache: true});
				
				classMap = JSON.parse(classMap);
				for(p in classMap)
				{
					arr = classMap[p];
					
					for(i=0; i<arr.length; i++)
					{
						afc.loadScript('Framework/' + p + '/component/' + arr[i] + '.js');
						afc.loadScript('Framework/' + p + '/event/' + arr[i] + 'Event.js');
					}
				}
				
				
				if(AView.isLoadCache!=undefined) 
					$.ajaxSetup({cache: AView.isLoadCache});
				
			}
		}
		//-------------------------------------------------------------------------		
		
		
		var _classFunc = window[_className];
		if(!_classFunc) 
		{
			alert(afc.log('We can not find the class of ' + _className ));
			return;
		}

		aview = new _classFunc();
		aview.url = url;
		aview.owner = owner;	//자신을 로드한 주체(AComponent, AContainer)
		aview.item = this;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
		this.view = aview;		//item 은 view 란 변수로 AView 객체를 저장

		if(owner) viewContext.container = owner.getContainer();
		if(!eventListener) eventListener = aview;
		
		viewContext.rootView = aview;
		viewContext.compIdPrefix = afc.makeCompIdPrefix();
		
		aview.init(viewContext, eventListener);
		
		//rmate component load check
		if(!aview.rMateManage(skipUpdatePos, skipActiveDone))
		{
			setTimeout(function()
			{
				if(aview.isValid())
				{
					aview._initDoneManage(skipUpdatePos, skipActiveDone);
				}

			}, 0);
		}
		
	});//, new RegExp(searchValue, 'g'), compIdPrefix);
	
	return aview;

};


//--------------------------------------------------------------------------------------------



AView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//context 에 rootView 가 셋팅되어져 있지 않으면 자신을 rootView 로 셋팅한다.	
	if(!this.element.rootView) this.element.rootView = this;

	var respClass = this.getAttr(afc.ATTR_RESP);
	if(respClass) this.addClass(respClass);
	
	//jQuery droppable 클래스 제거
	this.removeClass('ui-droppable');
	
	//if(!this.element.noRealizeChildren) this.realizeChildren(evtListener);
	
	this.realizeChildren(evtListener, this.reInitComp);
	
	if(afc.isIos)
	{
		if(this.$ele.css('overflow')!='hidden')
			this.$ele.css('-webkit-overflow-scrolling', 'touch');
	}
	else
	{
		var val = this.$ele.css('overflow');
		
		//뷰에 스크롤이 발생할 경우 가속기능을 부여하기 위해, z-index가 없거나 auto인 경우 0으로 대체
		//이 부분이 없으면 크롬 브라우저에서 뷰 스크롤 시 안보이던 부분이 안그려지는 버그가 생김
		if(val=='auto' || val=='scroll')
		{
			val = this.$ele.css('z-index');
			if(!val || val == 'auto') this.$ele.css('z-index', 0);
			
			// 여러 absolue 태그가 중첩되어 스크롤 기능이 작동될 때
			// 겹쳐지는 버그 수정(z-index 관련 오류)
			this.$ele.css('-webkit-backface-visibility', 'hidden');
		}
		
		
		//android 4.3 이하, BugFix
		//스크롤뷰 안의 컴포넌트 터치 안되는 버그 수정
		if(afc.andVer<4.4)
		{
			this.$ele.css('-webkit-transform', 'translateZ(0)');
			
			//thisObj = this;
			//setTimeout(function() { thisObj.$ele.css('-webkit-transform', ''); }, 100);
		}
	}
	
	//this.escapePreventTouch();
	
	if(!this.reInitComp)
	{
		this.actionToFocusComp();

		if(context && context.compIdPrefix) this.changeCompIdPrefix(context.compIdPrefix);

		if(this.owner && TabKeyController.compHasSubArr.indexOf(this.owner.className) > -1) this.createTabIndexArr();

		//for mirae - crud component 확인
		this.initCrudComponent();


		var loadUrl = this.getAttr('data-load-url');
		if(loadUrl && !window._afc) 
		{
			var thisObj = this;

			setTimeout(function()
			{
				thisObj.loadView(loadUrl);

			}, 0);
		}
	}
	
	
};

//탭인덱스 배열 만들어두는 함수
AView.prototype.createTabIndexArr = function(isRefreshArr) 
{
	this.focusableComponent = [];
	TabKeyController.findTabIndex(this, this.focusableComponent);
	if(isRefreshArr) return;
	if(this.focusableComponent.length > 0)
	{
		var thisObj = this;
		var focusNextTabLogic = function(isShift)
		{
			var index = thisObj.focusableComponent.indexOf(AComponent.getFocusComp()), nextComp, result;
			var firstTabStop = thisObj.focusableComponent[0];
			var lastTabStop = thisObj.focusableComponent[thisObj.focusableComponent.length-1];
			if(index > -1)
			{
				if(isShift)
				{
					if(AComponent.getFocusComp() === firstTabStop) return 'outFocusView';
					else nextComp = thisObj.focusableComponent[index-1];
				}
				else
				{
					if(AComponent.getFocusComp() === lastTabStop) return 'outFocusView';
					else nextComp = thisObj.focusableComponent[index+1];
				}
			}
			else 
			{
				if(thisObj.focusableComponent[0]) nextComp = thisObj.focusableComponent[0];
			}

			result = TabKeyController.findSubComp(nextComp, isShift);
			if(result) return result;
			else 
			{
				nextComp.setFocus();
				return focusNextTabLogic(isShift);
			}
		};

		this.element.addEventListener('keydown', function(e){
			if(e.keyCode == 9)
			{
				var nextComp = focusNextTabLogic(e.shiftKey);
				TabKeyController.findNextFocusInView(this.acomp, nextComp, e)
			}
		});
	}
};

AView.prototype.initCrudComponent = function() 
{
	if(typeof CrudManager != "function") return;
	
	this.crudObj = CrudManager.getCrudbyFileName(this.className);
	if(!this.crudObj) return;
	for(var i=0;i<this.getChildren().length;i++)
	{
		this.findChildCrudComp(this.getChildren()[i]);
	}

};

AView.prototype.findChildCrudComp = function(comp) 
{
	if(comp.baseName == 'AGridLayout' || comp.baseName == 'AFlexLayout')
	{
		var thisObj = this;
		comp.eachChild(function(acomp){
			thisObj.findChildCrudComp(acomp);
		});
	}
	else if(comp.baseName == 'AView' || comp.baseName == 'ARadioGroup')
	{
		var childView = comp.getChildren();
		for(var i in childView)
		{
			this.findChildCrudComp(childView[i]);
		}
	}
	else
	{
		var crud = comp.getAttr('data-crud');
		switch(crud)
		{
			case '1':
				if(this.crudObj.create == '0') comp.enable(false);
			break;
			case '2':
				if(this.crudObj.read == '0') comp.enable(false);
			break;
			case '3':
				if(this.crudObj.update == '0') comp.enable(false);
			break;
			case '4':
				if(this.crudObj.delete == '0') comp.enable(false);
			break;
		}
	}
};

AView.prototype.rMateManage = function(skipUpdatePos, skipActiveDone) 
{
	if(!window.rMate) return;

	var $rGrid = this.$ele.find('.RGrid-Style'),
		$rChart = this.$ele.find('.RChart-Style'),
		gridCnt = $rGrid.length, chartCnt = $rChart.length, thisObj = this;
	
	if(gridCnt+chartCnt > 0)
	{
		var delegator = 
		{
			onChartReady: function(rChart)
			{
				//console.log(rChart.className + ':' + chartCnt);

				chartCnt--;
				_initDoneCheck();
			},

			onGridReady: function(rGrid)
			{
				//console.log(rGrid.className + ':' + gridCnt);

				gridCnt--;
				_initDoneCheck();
			}
		};

		$rGrid.each(function() { this.acomp.setDelegator(delegator); });
		$rChart.each(function() { this.acomp.setDelegator(delegator); });

		function _initDoneCheck()
		{
			if( gridCnt+chartCnt == 0 && thisObj.isValid())
			{
				thisObj._initDoneManage(skipUpdatePos, skipActiveDone);
			}
		}
		
		return true;
	}
	
	else return false;
};


AView.prototype._initDoneManage = function(skipUpdatePos, skipActiveDone) 
{
	this.onInitDone();
	
	//if(this.onInitDone) this.onInitDone();
	
	if(!skipUpdatePos) this.updatePosition();

	if(!skipActiveDone) 
	{
		this.onActiveDone(true);

		var tabview = this.owner;
		if(tabview instanceof ATabView)
		{
			if(tabview.delegator && tabview.delegator.afterTabChanged) 
			{
				var oldView = tabview.oldTab ? tabview.oldTab.content.view : null;
				tabview.delegator.afterTabChanged(oldView, this, true, tabview);
			}
		}
	}
	
};


AView.prototype.getUrl = function() 
{
	return this.url;
};

AView.prototype.callSubActiveEvent = function(funcName, isFirst) 
{
	//최초 onActiveDone 은 initDoneManage 에서 호출해 주므로 스킵한다.
	if(funcName=='onActiveDone' && isFirst) return;

	if(this.ldView)
	{
		this.ldView[funcName].call(this.ldView, isFirst);
	}
	
	else if(this.ldCntr)
	{
		this.ldCntr[funcName].call(this.ldCntr, isFirst);
	}
	
	else
	{
		this.$ele.children().each(function()
		{
			if(!this.acomp) return;
			
			//서브 아이템으로 뷰를 가지고 있는 컴포넌트들(ATabView, ASplitView, AFlexView)은 
			//callSubActiveEvent 란 함수를 가지고 있다.	AListView는 필요시 동적으로 함수를 만든다.
			if(this.acomp.callSubActiveEvent) this.acomp.callSubActiveEvent(funcName, isFirst);
		});
	}
	
};

AView.prototype.enableActiveFocus = function(enable) 
{
	this.isActiveFocus = enable;
};


AView.prototype.onInitDone = function() 
{

};


//필요한 곳에서 재구현해서 사용한다.
//callSubActiveEvent 함수 호출하면 서브 컴포넌트에 전달해 준다.

//뷰가 활성화되기 바로 전에 호출된다.
AView.prototype.onWillActive = function(isFirst) 
{
	if(this.isActiveFocus) AComponent.setFocusComp(this);
	
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this.callSubActiveEvent('onWillActive', isFirst);
};

//뷰의 활성화가 시작되면 호출된다.
AView.prototype.onActive = function(isFirst) 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this.callSubActiveEvent('onActive', isFirst);
};

//뷰의 활성화가 완료되면 호출된다.
AView.prototype.onActiveDone = function(isFirst) 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this.callSubActiveEvent('onActiveDone', isFirst);
	
	//###########################################################################
	//차후에 이 부분도 backface-visibility 옵션으로 해결되는지 확인해 보기
	
	if(!AContainer.disableIosScroll && afc.isIos && !afc.isHybrid) afc.refreshApp();
	
	//뷰가 활성화 될 때 화면을 다시 한번 그려준다.
	//브라우저의 여러 경우에 따라 화면 렌더링의 버그가 있을 경우 옵션을 설정해 준다.
	//else if(this.option.isActiveRerender) afc.refreshApp();
};

AView.prototype.onWillDeactive = function() 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this.callSubActiveEvent('onWillDeactive');
};

AView.prototype.onDeactive = function() 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this.callSubActiveEvent('onDeactive');
};

AView.prototype.onDeactiveDone = function() 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this.callSubActiveEvent('onDeactiveDone');
};


//--------------------------------------------------------

/*
AView.prototype.reuse = function()
{
	AComponent.prototype.reuse.call(this);
	
	var container = this.getContainer();
	
	this.$ele.children().each(function()
	{
		if(this.acomp) 
		{
			this.container = container;
			//루트뷰는 변경되지 않는다.
			//this.rootView = rootView;
			this.acomp.reuse();
		}
	});
};
*/

AView.prototype.setScrollArrowX = function()
{
	var sa = new ScrollArrow();
	sa.setArrow('horizental');
	sa.apply(this.element);
};

AView.prototype.setScrollArrowY = function()
{
	var sa = new ScrollArrow();
	sa.setArrow('vertical');
	sa.apply(this.element);
};

AView.prototype.enableScrlManagerX = function()
{
	if(this.scrlManagerX) return;
	
	this.scrlManagerX = new ScrollManager();
	this.scrlManagerX.setOption(
	{
		startDelay: 10,
		endDelay: 20,
		scrollAmount: 10,
		speedRatio: 0.03
	});
	
	this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': ''});
	
	this.scrollXImplement();
	this.aevent._scroll();
};

AView.prototype.enableScrlX = function()
{
	this.scrlManagerX.enableScroll(true);
};

AView.prototype.disableScrlX = function()
{
	this.scrlManagerX.enableScroll(false);
};

AView.prototype.enableScrlManagerY = function()
{
	if(this.scrlManagerY) return;

	this.scrlManagerY = new ScrollManager();
	this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': ''});
	
	this.scrollYImplement();
	this.aevent._scroll();
};

AView.prototype.setScrollXComp = function(acomp)
{
	this.scrollXComp = acomp;
};

AView.prototype.scrollXImplement = function()
{
	var aview = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		e.preventDefault();
		
		aview.scrlManagerX.initScroll(e.changedTouches[0].clientX);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerX.updateScroll(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
			if(aview.scrollXComp) aview.scrollXComp.element.scrollLeft += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerX.scrollCheck(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
			if(aview.scrollXComp) aview.scrollXComp.element.scrollLeft += move;
			
			return true;
		});
	});
};

AView.prototype.scrollYImplement = function()
{
	var aview = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		e.preventDefault();
		
		aview.scrlManagerY.initScroll(e.changedTouches[0].clientY);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerY.updateScroll(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerY.scrollCheck(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
			return true;
		});
	});
};


AView.prototype.scrollTopManage = function()
{
	if(this.scrlManagerY) this.scrlManagerY.stopScrollTimer();
	
	return true;
};

AView.prototype.scrollBottomManage = function()
{
	if(this.scrlManagerY) this.scrlManagerY.stopScrollTimer();

	return true;
};

AView.prototype.scrollLeftManage = function()
{
	if(this.scrlManagerX) this.scrlManagerX.stopScrollTimer();
	
	return true;
};

AView.prototype.scrollRightManage = function()
{
	if(this.scrlManagerX) this.scrlManagerX.stopScrollTimer();
	
	return true;
};

AView.prototype.realizeChildren = function(evtListener, reInitComp)
{
	var thisObj = this, acomp,
		container = this.getContainer(), rootView = this.getRootView();
	
	if(reInitComp)
	{
		this.$ele.children().each(function()
		{
			if(this.acomp) this.acomp.init(this.acomp.element, evtListener);
			
			//뷰를 감싸고 있는 item 인 경우
			else
			{
				acomp = $(this).children()[0].acomp;
				acomp.init(acomp.element);
			}
		});
	}
	else
	{
		this.$ele.children().each(function()
		{
			acomp = AComponent.realizeContext(this, container, rootView, thisObj, evtListener);

			//뷰를 감싸고 있는 item 인 경우
			if(!acomp)
			{
				//동적으로 로드한 뷰에 대한 realize 를 시작한다.
				acomp = AComponent.realizeContext($(this).children()[0], container);

				acomp.owner = thisObj;
				acomp.item = this;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
				this.view = acomp;		//item 은 view 란 변수로 AView 객체를 저장
			}
		});
	}
	
};

AView.prototype.changeCompIdPrefix = function(newPrefix) 
{
	//compIdPrefix 값은 rootView 만 가지고 있다.
	if(newPrefix) this.compIdPrefix = newPrefix;
	
	var compId;
	
	this.eachChild(function(acomp, inx)
	{
		compId = acomp.getComponentId();
		
		//componentId 가 존재하면 새로운 compIdPrefix 가 적용되도록 다시 호출해 준다.
		if(compId) acomp.setComponentId(compId);
		
		//자신이 포함하고 있는 하위의 컴포넌트들도 바꿔주기 위해, AView, ALayout
		if(acomp.changeCompIdPrefix) acomp.changeCompIdPrefix();
	});
};

/*
AView.prototype.realizeChildren = function(evtListener)
{
	var thisObj = this, container = this.getContainer(), rootView = this.getRootView();
	
	_realize_helper(this.$ele.children(), evtListener, null);
	
	//--------------------------------------------------------------------
	
	function _realize_helper($children, listener, item)
	{
		var acomp, className, classFunc;
		
		$children.each(function()
		{
			className = this.getAttribute(afc.ATTR_CLASS);

			//item
			if(!className) 
			{
				//동적으로 로드한 뷰에 대한 realize 를 시작한다.
				_realize_helper($(this).children(), null, this);
				return;
			}

			classFunc = window[className];
			if(!classFunc) 
			{
				alert(afc.log('We can not find the class of ' + className ));
				return;
			}

			acomp = new classFunc();
			this.container = container;

			//item 이 참이면 동적 로드뷰 이므로 parent 가 없다. 즉, 자신이 rootView 이다.
			if(item)
			{
				//this.owner = thisObj;
				acomp.item = item;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
				item.view = acomp;		//item 은 view 란 변수로 AView 객체를 저장
				
				this.rootView = acomp;
				//listener = acomp;		//init 시점에 listener 가 null 이면 자동으로 rootView 가 리스너가 된다.
			}
			else 
			{
				//parent 변수만 셋팅해야 하므로 setParent 함수를 호출하지 않는다.
				//acomp.setParent(thisObj);
			
				acomp.parent = thisObj;
				this.rootView = rootView;
			}

			acomp.init(this, listener);
		});
	}
};
*/

AView.prototype.setParent = function(parent)
{
	AComponent.prototype.setParent.call(this, parent);
	
	var children = this.getChildren();
	
	for(var i=0; i<children.length; i++)
	{
		// 자식들의 부모까지 바뀐 것은 아니므로 parent 를 넘겨선 안됨.
		// 그대신 자신을 넘기면서 새로운 값으로 변경된 this 의 값들을 자식들에게 셋팅해 준다.
		children[i].setParent(this);
	}
};

AView.prototype.setHtml = function(html)
{
	$(this.element).html(html);
};

AView.prototype.findCompById = function(strId)
{
	//var ele = document.getElementById(this.getRootView().compIdPrefix+strId);
	var ele = this.$ele.find('#'+this.getRootView().compIdPrefix+strId)[0];
	
	if(ele) return ele.acomp;
	else return null;
};

//return : Array
AView.prototype.findCompByGroup = function(strGroup)
{
	var ret = [];
	$(this.element).find('*[data-group="'+strGroup+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

//return : Array
AView.prototype.findCompByClass = function(className)
{
	var ret = [];
	$(this.element).find('*['+afc.ATTR_CLASS+'="'+className+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.addComponent = function(acomp, isPrepend, posComp)
{
	if(!acomp.element) 
	{
		alert('First of all you must call function init();');
		return;
	}
	
	if(posComp)
	{
		if(isPrepend) acomp.$ele.insertBefore(posComp.element);
		else acomp.$ele.insertAfter(posComp.element);
	}
	else
	{
		if(isPrepend) this.$ele.prepend(acomp.element);
		else this.$ele.append(acomp.element);
	}
	
	var arrange = this.$ele.attr('data-arrange');
	if(arrange) acomp.$ele.css({'position':'relative', left:'0px', top:'0px', 'float':arrange});
	
	acomp.setParent(this);
	
	//tabIndex
	if(this.getContainer() && this.getContainer().tabKey) this.getContainer().tabKey.focusableComponent.push(acomp);
};

AView.prototype.removeComponent = function(acomp)
{
	acomp.removeFromView();
};

AView.prototype.getFirstChild = function()
{
	var ele = this.$ele.children()[0];
	if(ele) return ele.acomp;
	else return null;
};

AView.prototype.getLastChild = function()
{
	var ele = this.$ele.children().last()[0];
	if(ele) return ele.acomp;
	else return null;
};

AView.prototype.getChild = function(index)
{
	var ele = this.$ele.children()[index];
	if(ele) return ele.acomp;
	else return null;
};

AView.prototype.getChildCount = function()
{
	return this.$ele.children().length;
};

AView.prototype.eachChild = function(callback, isReverse)
{
	var $children;
	
	if(isReverse) $children = $(this.$ele.children().get().reverse());
	else $children = this.$ele.children();

	$children.each(function(inx)
	{
		if(!this.acomp) return;
		
		if(callback(this.acomp, inx)==false) return false;
	});
};

AView.prototype.getChildren = function()
{
	var ret = [];
	this.$ele.children().each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.removeChildren = function(onlyRelease)
{
	this.$ele.children().each(function()
	{
		if(this.acomp) 
			this.acomp.removeFromView(onlyRelease);
	});
};

AView.prototype.removeFromView = function(onlyRelease)
{
	this.removeChildren(onlyRelease);
	
	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

AView.prototype.setWidth = function(w)
{
	AComponent.prototype.setWidth.call(this, w);
	
	this.updatePosition();
};

AView.prototype.setHeight = function(h)
{
	AComponent.prototype.setHeight.call(this, h);
	
	this.updatePosition();
};

AView.prototype.updatePosition = function(pWidth, pHeight)
{
	//AView 클래스만 다음 비교를 한다.
	if(pWidth!=undefined) 
		AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	if(this.ldView)
	{
		this.ldView.updatePosition();
	}
	else
	{
		var width = this.$ele.width();
		var height = this.$ele.height();

		this.$ele.children().each(function()
		{
			if(this.acomp)
				this.acomp.updatePosition(width, height);
		});

		if(this.onUpdatePosition) this.onUpdatePosition(width, height);
	}
};

//툴바의 inline 기능을 추가
AView.prototype.inlineChildren = function()
{
	var children = this.getChildren();
	
	for(var i=0; i<children.length; i++)
		children[i].setInlineStyle();
};


/*
//스크롤이 있을경우 스크롤을 가운데로 셋팅
AView.prototype.scrollToCenter = function(tHeight)
{
	var tremHeight = 0;
	if(tHeight) tremHeight = tHeight;
	this.element.scrollTop = ((this.element.scrollHeight + tremHeight) - this.element.offsetHeight)/2;
};
*/

AView.prototype.scrollTo = function(pos)
{
	this.element.scrollTop = pos;
};

AView.prototype.scrollOffset = function(offset)
{
	this.element.scrollTop += offset;
};

AView.prototype.scrollToTop = function()
{
	this.element.scrollTop = this.element.scrollHeight*-1;
};

AView.prototype.scrollToBottom = function()
{
	this.element.scrollTop = this.element.scrollHeight;
};

AView.prototype.scrollToCenter = function()
{
	this.element.scrollTop = (this.element.scrollHeight - this.element.offsetHeight)/2;
};

AView.prototype.isMoreScrollTop = function()
{
	if(this.element.scrollTop > 0) return true;
	else return false;	
};

AView.prototype.isMoreScrollBottom = function()
{
	if(this.element.offsetHeight + this.element.scrollTop < this.element.scrollHeight) return true;
	else return false;	
};

AView.prototype.isMoreScrollLeft = function()
{
	if(this.element.scrollLeft > 0) return true;
	else return false;	
};

AView.prototype.isMoreScrollRight = function()
{
	if(this.element.offsetWidth + this.element.scrollLeft < this.element.scrollWidth) return true;
	else return false;
};

AView.prototype.isHscroll = function()
{
	return (this.element.offsetWidth < this.element.scrollWidth);
};

AView.prototype.isVscroll = function()
{
    return (this.element.offsetHeight < this.element.scrollHeight);
};

AView.prototype.isScroll = function()
{
	return (this.isHscroll() || this.isVscroll());
};

/*
enable 은 원래가 자신만 하면 되는데..

버그 때문에 하위까지 하게 된 것.... 그러므로...

하위까지 해야 하는 경우를 enable 함수의 파람으로 구별해서 처리하게 한다.

하위까지 해야 하는 경우는...

disable 시점에 기존의 정보를 저장해 두었다가 enable 시점에 확인하여 
기존의 값으로 복원...

하위까지 변경하는 경우 disable 없이 enable 만 호출하면 모두 풀리게 되는 것이 정상

*/
AView.prototype.enable = function(isEnable)
{
	AComponent.prototype.enable.call(this, isEnable);

	//input, textarea tag 도 같이 해줘야 이벤트 전달시 키보드 오픈을 막을 수 있다.

	_enalbe_helper(this.$ele.find('input'));
	_enalbe_helper(this.$ele.find('textarea'));
	_enalbe_helper(this.$ele.find('.RGrid-Style'));
	
	function _enalbe_helper($eles)
	{
		if(isEnable)
		{
			$eles.each(function()
			{
				if(!this.acomp || (this.acomp && this.acomp.isEnable))
					$(this).css('pointer-events', 'auto');
			});
		}
		else
		{
			//disable 전부 호출해 주면 된다.
			$eles.css('pointer-events', 'none');
		}
	}
};

AView.prototype.show = function()
{
	if(this.isShow()) return;
	
	this.onWillActive(false);
	
	AComponent.prototype.show.call(this);
	
	this.onActive(false);

	var thisObj = this;
	setTimeout(function() 
	{
		thisObj.onActiveDone(false);
	}, 0);
};

AView.prototype.hide = function()
{
	if(!this.isShow()) return;
	
	this.onWillDeactive();

	AComponent.prototype.hide.call(this);

	this.onDeactive();
	
	var thisObj = this;
	setTimeout(function() 
	{
		thisObj.onDeactiveDone();
	}, 0);
};

AView.prototype.shrinkChildren = function(ratio)
{
	var children = this.getChildren(), acomp, newTop, newHeight, newFontSize, unit;
	
	for(var i=0; i<children.length; i++)
	{
		acomp = children[i];
		
		//afc.log('[' + acomp.$ele.css('bottom') + ']');
		
		//newTop = acomp.getPos().top * ratio;
		//newHeight  = acomp.getHeight() * ratio;
		
		newTop = acomp.getPos().top;
		newHeight  = acomp.getHeight();
		newFontSize = acomp.$ele.css('font-size');
		
		unit = newFontSize.substring(newFontSize.length-2);
		newFontSize = Number(newFontSize.substring(0, newFontSize.length-2));
		
		//afc.log('[' + unit + ']');

		newTop = parseInt(newTop * ratio, 10);
		newHeight = parseInt(newHeight * ratio, 10);
		newFontSize = parseInt(newFontSize * ratio, 10);

		if(acomp.$ele.css('bottom')!='auto') 
		{
			acomp.$ele.css(
			{
				'height': newHeight+'px'
			});
			
			acomp.element.style.setProperty('font-size', newFontSize+unit, 'important');
		}
		else
		{
			acomp.$ele.css(
			{
				'top': newTop+'px',
				'height': newHeight+'px'
			});
			
			acomp.element.style.setProperty('font-size', newFontSize+unit, 'important');
		}
		
		//afc.log('[' + newFontSize+unit + ']');
		
		if(acomp.baseName=='AView') acomp.shrinkChildren(ratio);
	}

};


AView.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	var keyVal, children = this.getChildren(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		//매핑 타입이 child mapping 이면 자식 컴포넌트 자체에 셋팅된 필드키를 적용한다.
		if(child.mappingType==3) child.updateChildMappingComp(dataArr, queryData);
		else 
		{
			//if(!keyArr) continue;
			keyVal = keyArr[i];
			if(keyVal) child.setQueryData(dataArr, [keyVal], queryData);
		}
	}
	
};

AView.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	var keyVal, children = this.getChildren(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		keyVal = keyArr[i];
		if(keyVal) child.getQueryData(dataArr, [keyVal], queryData);
	}
	
};

AView.prototype.getDocument = function() 
{
	return this.document;
};

AView.prototype.bindDocument = function(doc) 
{
	this.document = doc;
	
	doc.setView(this);
};

AView.prototype.loadView = function(url)
{
    var $item = $('<div></div>');
    $item.css(
    {
        width: '100%', height: '100%', overflow: 'auto'
    });
	
    this.$ele.html($item);
	
	this.ldView = AView.createView($item[0], url, this);
	
	return this.ldView;
};

AView.prototype.loadContainer = function(viewUrl, cntrId, cntrClass)
{
	if(cntrClass==undefined) cntrClass = 'APanel';
	
	var acont = new window[cntrClass](cntrId);
	
	this.ldCntr = acont;
		
	acont.init();
		
	this.$ele.html(acont.$ele);
	
	//새로운 값으로 변경
	acont.item = this.element;
	this.element.acont = acont;
	acont.parent = this.getContainer();
	
	acont.$ele.css({ left:'0px', top:'0px', width:'100%', height:'100%' });
	
	
	if(viewUrl) acont.setView(viewUrl);

	acont.onCreate();
	
	return acont;
};




AView.prototype.getLoadView = function()
{
	return this.ldView;
};

AView.prototype.removeLoadView = function()
{
	if(this.ldView)
	{
		this.ldView.removeFromView();
		this.ldView = null;
	}
};

// 매핑가능한 개수를 리턴한다.
AView.prototype.getMappingCount = function()
{
	return this.getChildren().length;
};

// 컴포넌트 내부에 드랍 가능여부 리턴
AView.prototype.getDroppable = function()
{
	return true;
};

//탭뷰에 로드되어진 경우 선택시 넘겨준 데이터를 얻어온다.
AView.prototype.getTabData = function()
{
	if(this.item.tab) return this.item.tab.data;
	else return null;
};

AView.prototype.setTabData = function(data)
{
	if(this.item.tab) this.item.tab.data = data;
};

