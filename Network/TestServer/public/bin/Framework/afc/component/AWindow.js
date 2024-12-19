/**
 *	@author asoocool
 * 
 */

function AWindow(containerId)	
{
	AContainer.call(this, containerId);
	
	this.modalBg = null;	//모달용 배경 div
	
	this.isOpenActionDelay = true;
	
	
	//show 함수 호출시 delay 를 주었는지
	this.isDelayShow = false; 
	//사라지면서 터치한 정보가 하위 컨테이너에게 전달되는 것을 시간 지연을 통해서 막음.
	this.isDisableTime = true;

	//init 함수에서 초기화 함
	this.option = {};

	/*
	this.option =
	{
		isModal: false,
		isCenter: false,			//자동 중앙정렬 할지
		isFocusLostClose: false,	//모달인 경우 포커스를 잃을 때 창을 닫을지
		isFocusLostHide: false,		//모달인 경우 포커스를 잃을 때 창을 숨길지
		modalBgOption: afc.isMobile ? 'dark' : 'none',		//none, light, dark 모달인 경우 배경을 어둡기 정도
		overflow: 'hidden',			//hidden, auto, visible, scroll
		dragHandle: null,
		isResizable: false,
		isDraggable: false,
		//isAbsolute: false
		inParent: false				//부모 컨테이너 안에 창을 띄울 경우, 모달리스(isModal:false)이고 부모를 클릭해도 항상 부모보다 위에 보이게 하려면 이 값을 true 로 셋팅해야 한다.
	};
	*/
	
	/*
	if(afc.andVer<4.4) 
	{
		//4.3 이하에서만 작동
		this.option.isPreventTouch = true;
	}
	*/

	//this.resultListener = null;

}
afc.extendsClass(AWindow, AContainer);

//--------------------------------------------------------------------------------
//	static area
//--------------------------------------------------------------------------------

AWindow.BASE_ZINDEX = 1000;

//팝업된 AWindow 객체들을 모아 둔다.
AWindow.wndList = [];

//top window has the max z-index 
AWindow.topWindow = null;

//AWindow.wndList 에 윈도우를 추가한다.
//윈도우 오픈 시 내부적으로 자동 호출해 준다.
AWindow.addWindow = function(awnd)
{
	var length = AWindow.wndList.length;

	//이미 존재하는지 체크
	for(var i=0; i<length; i++)
	{
		if(AWindow.wndList[i]===awnd) return false;
	}
	
	AWindow.wndList.push(awnd);
	return true;
};

//AWindow.wndList 에서 윈도우를 제거한다.
//윈도우 close 시 내부적으로 자동 호출해 준다.
AWindow.removeWindow = function(awnd)
{
	var length = AWindow.wndList.length;

	for(var i=0; i<length; i++)
	{
		if(AWindow.wndList[i]===awnd)
		{
			AWindow.wndList.splice(i,1);
			break;
		}
	}
};

AWindow.findWindow = function(cntrId)
{
	var length = AWindow.wndList.length, retWnd = null;

	for(var i=0; i<length; i++)
	{
		retWnd = AWindow.wndList[i];
		
		if(retWnd.getContainerId()==cntrId) return retWnd;
	}
	
	return null;
};


//보여지고 있는 윈도우 중에서 최상단 윈도우에게 backKey 이벤트를 전달한다.
//디바이스에서 backKey 가 눌려지면 자동으로 호출된다. 
AWindow.reportBackKeyEvent = function()
{
	var topWnd = AWindow.getTopWindow();

	if(topWnd) return topWnd.onBackKey();

	return false;
};

//오픈된 윈도우들에게 resize 이벤트를 전달한다.
//네이티브 WebView 의 사이즈가 변경되면 자동으로 호출된다.
AWindow.reportResizeEvent = function()
{
	var length = AWindow.wndList.length;

	for(var i=0; i<length; i++)
		AWindow.wndList[i].onResize();
};

AWindow.reportMoveCenter = function()
{
	var length = AWindow.wndList.length;
	var wnd;
	for(var i=0; i<length; i++)
	{
		wnd = AWindow.wndList[i]
		if(wnd.option.isCenter) wnd.moveToCenter();
	}
};

AWindow.getTopWindow = function()
{
	return AWindow.topWindow;
};

AWindow.updateTopWindow = function()
{
	var toTopWnd = null, length = AWindow.wndList.length, max = 0, tmp;

	//hide 된 윈도우까지 값을 비교해도 됨.
	for(var i=0; i<length; i++)
	{
		//asoocool test
		//if(AWindow.wndList[i].option.isAbsolute) continue;
	
		tmp = Number(AWindow.wndList[i].$ele.css('z-index'));
		
		//console.log( '(' + max + ', ' + tmp +')' );

		if(max<tmp)
		{
			toTopWnd = AWindow.wndList[i];
			max = tmp;
		}
	}
	
	//마지막 윈도우가 닫히면서 호출될 경우 toTopWnd 는 null 이 될 수 있다.
	//그래도 AWindow.topWindow 와 다르므로 makeTopWindow(null) 과 같이 호출된다.
	//이런 경우 AWindow.topWindow 의 deactive 계열 함수만 호출된다.
	
	AWindow.makeTopWindow(toTopWnd);
};

//toTopWnd 을 최상위로 올리는 로직 구현
//modalBg 및 윈도우의 z-index 변경 로직과 container 의 active, deactive 이벤트를 발생시켜준다.
AWindow.makeTopWindow = function(toTopWnd, isFirst)
{
	var deactWnd = AWindow.topWindow, zIndex = AWindow.BASE_ZINDEX;
	
	if(deactWnd===toTopWnd) return;
	
	if(toTopWnd) toTopWnd.onWillActive(isFirst);
	
	//최초 윈도우가 띄워지는 경우 AWindow.topWindow 가 null 이 될 수 있다.
	if(deactWnd) 
	{
		zIndex = Number(deactWnd.$ele.css('z-index')) + 2;
	
		//topWindow 에서 close 가 호출되면 z-index 를 0 으로 셋팅한 후 updateTopWindow 가 호출된다.
		//즉, deactWnd의 zIndex 가 0이면 곧 닫힐 윈도우이다.
		//그런 경우는 z-index 를 deactWnd의 의 값을 기준으로 셋팅해선 안되고 현재 자신의 값을 유지하면 된다.
		
		if(zIndex==2 && toTopWnd) zIndex = toTopWnd.$ele.css('z-index');
		
		deactWnd.onWillDeactive();
	}
	
	if(toTopWnd) toTopWnd.$ele.css('z-index', zIndex);
	
	
	AWindow.topWindow = toTopWnd;
	
	//모달 다이얼로그인 경우 modalBg 의 z-index 도 변경시켜준다.	
	if(toTopWnd && toTopWnd.option.isModal) 
	{
		if(toTopWnd.modalBg) toTopWnd.modalBg.css('z-index', zIndex-1);
		else toTopWnd.modalManage(zIndex-1);
	}
	
	if(toTopWnd) toTopWnd.onActive(isFirst);
	if(deactWnd) deactWnd.onDeactive();
	
	//topWindow 가 close 되는 경우는 setTimeout 을 주면 안됨. 
	//윈도우가 먼저 클로즈 된 후 onDeactiveDone 이 호출되어 $ele 가 null 인데도 callSubActiveEvent 함수를 호출한다.
	
	if(zIndex>2) setTimeout(_active_done_helper, 0);
	else _active_done_helper();
	
	function _active_done_helper()
	{
		if(toTopWnd && toTopWnd.isValid() ) toTopWnd.onActiveDone(isFirst);
		if(deactWnd && deactWnd.isValid() ) deactWnd.onDeactiveDone();
	}	
	
};

//---------------------------------------------------------------------------------------------

AWindow.prototype.init = function(context)
{
	AContainer.prototype.init.call(this, context);
	
	
	this.setWindowOption(
	{
		isModal: false,
		isCenter: false,			//자동 중앙정렬 할지
		isFocusLostClose: false,	//모달인 경우 포커스를 잃을 때 창을 닫을지
		isFocusLostHide: false,		//모달인 경우 포커스를 잃을 때 창을 숨길지
		modalBgOption: afc.isMobile ? 'dark' : 'none',		//none, light, dark 모달인 경우 배경을 어둡기 정도
		overflow: 'hidden',			//hidden, auto, visible, scroll
		dragHandle: null,
		isResizable: false,
		isDraggable: false,
		//isAbsolute: false
		inParent: false				//부모 컨테이너 안에 창을 띄울 경우, 모달리스(isModal:false)이고 부모를 클릭해도 항상 부모보다 위에 보이게 하려면 이 값을 true 로 셋팅해야 한다.
		
	}, true);
	
	
	//afc.log('AWindow init');
	
	//타이틀을 만든다던가....등등의 태그 생성 작업
};

AWindow.prototype.onCreate = function()
{
	AContainer.prototype.onCreate.call(this);

	if(this.option.isCenter) this.moveToCenter();
	
    this.windowTouchBugFix(true);
    
    if(this.option.isPreventTouch) this.preventTouch();

	if(this.option.isDraggable) 
	{
		var dragOpt = 
		{
			scroll: false,
			//containment: 'window'
		};
		
		if(this.option.dragHandle) dragOpt.handle = this.option.dragHandle;

		this.$ele.draggable(dragOpt);
	}
		
	this.enableResize(this.option.isResizable);
	
	this.windowTouchManage();
	
	//임시코드 
	//차후에 AView 또는 AContainer 에 주기  
	/*
	var view, txts = [];
	if(view = this.getView()) txts = view.findCompByClass('ATextField');
	if(txts.length>0) txts[0].setFocus();
	*/
};

AWindow.prototype.setDragOption = function(key, value)
{
	if(this.option.isDraggable) 
	{
		this.$ele.draggable('option', key, value);
	}
};

AWindow.prototype.onResize = function()
{
	if(this.option.isCenter) this.moveToCenter();

	AContainer.prototype.onResize.call(this);
};

AWindow.prototype.enableResize = function(enable)
{
	if(enable)
	{
		//윈도우를 오픈한 이후에 리사이즈 옵션을 켤 수도 있으므로 변수값을 셋팅한다.
		this.option.isResizable = true;
	
		var thisObj = this;
		this.$ele.resizable(
		{
			handles: 'all',
			resize: function(event, ui)
			{
				//ui.size.height = Math.round( ui.size.height / 30 ) * 30;
				thisObj.onResize();
			}
		});
		
		//resizable 을 호출하면 position 값이 바뀌므로 다시 셋팅해 준다.
		this.$ele.css('position', 'absolute');
	}
	
	else  
	{
		//리사이즈가 활성화 되어져 있는 경우만 실행되도록 한다.
		if(this.option.isResizable) 
		{
			this.option.isResizable = false;
			this.$ele.resizable('destroy');
		}
	}

};

AWindow.prototype.setResultListener = function(resultListener)
{
	this.resultListener = resultListener;
};

AWindow.prototype.setResultCallback = function(callback)
{
	this.callback = callback;
};

AWindow.prototype.moveToCenter = function()
{
    //var cenX = theApp.rootContainer.getWidth()/2 - this.getWidth()/2;
    //var cenY = theApp.rootContainer.getHeight()/2 - this.getHeight()/2;
	
	var cenX, cenY;
	
	if(this.option.inParent)
	{
    	cenX = this.parent.$ele.width()/2 - this.getWidth()/2;
    	cenY = this.parent.$ele.height()/2 - this.getHeight()/2;
	}
	else
	{
    	cenX = $(window).width()/2 - this.getWidth()/2;
    	cenY = $(window).height()/2 - this.getHeight()/2;
	}
    
    this.move(cenX, cenY);
};

AWindow.prototype.setWindowOption = function(option, notOverwrite)
{
	for(var p in option)
    {
		if(!option.hasOwnProperty(p)) continue;
		
		if(notOverwrite && this.option[p]!=undefined) continue;
    	
		this.option[p] = option[p];
    }
};

AWindow.prototype.setModalBgOption = function(option)
{
	this.option.modalBgOption = option;

	if(this.option.modalBgOption=='light') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.3)');
	else if(this.option.modalBgOption=='dark') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.5)');
	else this.modalBg.css('background-color', '');
};


//window buf fix
AWindow.prototype.windowTouchBugFix = function(isOpen)
{
	if(isOpen)
	{
		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos && window.AppManager) AppManager.touchDelay();
		
		this.isDisableTime = true;
		
		//이전 윈도우가 사라지면서 자신을 띄웠을 때, 이전 윈도우가 터치한 정보가 자신에게 전달되는 것을 막음.
		//아이폰에서는 this.actionDelay('input'); 이 작동하지 않는다.
		
		if(this.isOpenActionDelay) this.actionDelay();
		
		//자신을 띄운 하위 컨테이너에게 터치 정보가 전달되는 것을 막음. 
		if(this.option.isModal)
		{
			if(++this.parent.disableCount==1)
			{
				//var $ele = this.parent.get$ele();
				//$ele.find('input').css('pointer-events', 'none');
				//$ele.css('pointer-events', 'none');
				
				this.parent.enable(false);
			}
		}
	}
	
	//close
	else
	{
		var thisObj = this;

		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos && window.AppManager) AppManager.touchDelay();
		
		if(this.option.isModal)
		{
			//사라지면서 터치한 정보가 하위 컨테이너에게 전달되는 것을 시간 지연을 통해서 막음.
 			if(this.isDisableTime) setTimeout(_closeHelper, afc.DISABLE_TIME);
			//Disable delay가 없는 경우
 			else _closeHelper();
 			
		}
		else
		{
			//모달리스인 경우는 띄울 때 배경을 disable 시키지 않으므로 
			//닫을 때 터치 정보가 배경으로 전달된다. 그렇기 때문에 닫힐 경우 무조건 disable 시킨 후
			//활성화 시켜준다.
			if(++this.parent.disableCount==1) this.parent.enable(false);
			setTimeout(_closeHelper, afc.DISABLE_TIME);
		}
		
		
		function _closeHelper()
		{
			if(!thisObj.parent.isOpen()) return;

			if(--thisObj.parent.disableCount==0)
			{
				//var $ele = thisObj.parent.get$ele();
				//$ele.find('input').css('pointer-events', 'auto');
				//$ele.css('pointer-events', 'auto');

				thisObj.parent.enable(true);
			}
		}
		
	}
};

AWindow.prototype.windowTouchManage = function()
{
	var thisObj = this;
	
    AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, function(e)
    {
		e.stopPropagation();
		
		AWindow.makeTopWindow(thisObj);
    });
};

//android 4.3 이하, BugFix
//배경으로 터치 전달되어 스크롤되는 버그
AWindow.prototype.preventTouch = function()
{
/*
	if(afc.andVer>4.3) return;
	
    AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, function(e)
    {
		e.preventDefault();
		e.stopPropagation();
    });
	*/
};

//윈도우가 모달 모드인 경우의 처리
AWindow.prototype.modalManage = function(zIndex)
{
	this.modalBg = $('<div></div>');
	this.modalBg.css(
	{
		'width':'100%', 'height':'100%',
		'position':'absolute',
		'top':'0px', 'left':'0px',
		'z-index':zIndex, 
	});
	
	if(this.option.modalBgOption=='light') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.3)');
	else if(this.option.modalBgOption=='dark') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.5)');
	
	if(this.option.inParent) this.parent.$ele.append(this.modalBg);
	else theApp.rootContainer.$ele.append(this.modalBg);
	
	var thisObj = this;
	AEvent.bindEvent(this.modalBg[0], AEvent.ACTION_DOWN, function(e)
	{
		e.preventDefault();
		e.stopPropagation();
	    	
		if(thisObj.option.isFocusLostClose) 
		{
			thisObj.isDisableTime = false;
			thisObj.close();
		}
		else if(thisObj.option.isFocusLostHide) 
		{
			thisObj.isDisableTime = false;
			thisObj.hide();
		}
	});
	
};

//다이얼로그와 같은 속성으로 윈도우를 오픈한다.
AWindow.prototype.openAsDialog = function(viewUrl, parent, width, height)
{
	//var bgOpt = '';
	
	//if(afc.isPC) bgOpt = 'none';
	//else bgOpt = 'light';
	
	this.setWindowOption(
	{
		isModal: true,
		isCenter: true,
		//modalBgOption: bgOpt
	});
	
	this.open(viewUrl, parent, 0, 0, width, height);
};

//팝업메뉴와 같은 속성으로 윈도우를 오픈한다.
AWindow.prototype.openAsMenu = function(viewUrl, parent, width, height)
{
	this.setWindowOption(
	{
		isModal: true,
		isCenter: true,
		isFocusLostClose: true,
	});
	
	this.open(viewUrl, parent, 0, 0, width, height);
};

AWindow.prototype.openCenter = function(viewUrl, parent, width, height)
{
	this.setWindowOption(
    {
		isCenter: true
    });
	
	this.open(viewUrl, parent, 0, 0, width, height);
};


AWindow.prototype.openFull = function(viewUrl, parent)
{
	this.open(viewUrl, parent, 0, 0, '100%', '100%');
};



//	윈도우 창을 연다.
//
AWindow.prototype.open = function(viewUrl, parent, left, top, width, height)
{
	if(!AContainer.prototype.open.call(this, viewUrl, parent, left, top, width, height, !this.option.inParent)) return false;
	
	this.$ele.css( { 'overflow':this.option.overflow });
	
    //전역 wndList 에 추가
	AWindow.addWindow(this);
	
	AWindow.makeTopWindow(this, true);
	
	return true;

};

/*
AWindow.prototype.setView = function(view, isFull)
{
	AContainer.prototype.setView.call(this, view, isFull);
	
	//윈도우에 한해서 뷰터치시 포커스를 준다.
	this.view.actionToFocusComp();
};
*/

//윈도우 창을 닫는다.
//----------------------------------------------------------
//	result function
//	function onWindowResult(result, awindow);
//----------------------------------------------------------

AWindow.prototype.close = function(result, data)
{
	//현재는 최상위 z-index 이지만 
	//곧 닫힐 윈도우이기 때문에 정렬에서 맨 하위가 되도록 0을 셋팅한다.
	this.$ele.css('z-index', 0);
	
	AWindow.updateTopWindow();
	
	//--------------------------------

	AContainer.prototype.close.call(this, result, data);
	
	this.windowTouchBugFix(false);
	
	if(this.option.isModal) 
	{
		this.modalBg.remove();
		this.modalBg = null;
	}
	
	//전역 wndList 에서 제거
	AWindow.removeWindow(this);
	
	if(this.resultListener) 
	{
		var thisObj = this;
		setTimeout(function()
		{
			thisObj.resultListener.onWindowResult(result, data, thisObj);
		}, 10);
	}
	
	if(this.callback)
	{
		var thisObj = this;
		setTimeout(function()
		{
			thisObj.callback(result, data);
		}, 10);
	}
};

AWindow.prototype.show = function(delay)
{	
	this.windowTouchBugFix(true);
	
	AWindow.makeTopWindow(this);	
	
	if(this.option.isModal) this.modalBg.show();
	
    if(delay==undefined) this.$ele.show();
	else
    {
      	var thisObj = this;
       	thisObj.isDelayShow = true;

       	setTimeout(function() 
       	{
       		if(thisObj.isDelayShow) 
       			thisObj.$ele.show();
       	}, delay);
    }

};

AWindow.prototype.hide = function()
{
	this.isDelayShow = false;
	
	this.windowTouchBugFix(false);
	
	this.$ele.css('z-index', 0);
	AWindow.updateTopWindow();
	
    this.$ele.hide();
	if(this.option.isModal) this.modalBg.hide();
};

AWindow.prototype.restore = function()
{

};

AWindow.prototype.minimize = function()
{

};

AWindow.prototype.maximize = function()
{

};


AWindow.prototype.move = function(x, y)
{
	if(!isNaN(x)) x += 'px';
	if(!isNaN(y)) y += 'px';
	
	this.$ele.css( { 'left':x, 'top':y });
};

AWindow.prototype.moveX = function(x)
{
	if(!isNaN(x)) x += 'px';
	this.$ele.css('left', x);
};

AWindow.prototype.moveY = function(y)
{
	if(!isNaN(y)) y += 'px';
	this.$ele.css('top', y);
};

AWindow.prototype.offset = function(x, y)
{
	var pos = this.getPos();
	this.$ele.css( { 'left':(pos.left+x)+'px', 'top':(pos.top+y)+'px' });
};

AWindow.prototype.onBackKey = function()
{
	this.close();
	return true;
};



