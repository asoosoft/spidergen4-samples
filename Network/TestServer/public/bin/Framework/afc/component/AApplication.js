/**
 * @author asoocool
 */

function AApplication()
{
	//this.navigator = null;
	
	this.rootContainer = null;		//body 태그를 기반으로 하는 최상위 컨테이너, 화면을 표현하지는 않는다.
	this.mainContainer = null;		//루트 컨테이너 밑으로, 화면을 표현하는 시작 컨테이너 
	
	//this.indicator = null;
	this.orientation = 'portrait';
	
	//this.appContainer = null;
	this.curPath = null;
	
	this.resPool = null;
	this.mdiManager = null;
	
	this.keyDownListeners = null;
	this.keyUpListeners = null;
}



AApplication.prototype.unitTest = function(unitUrl)
{
//console.log('unitTest : ' + unitUrl);

	//if(this.mainContainer) this.mainContainer.close();

	//this.rootContainer.$ele.children().remove();
	
	//this.setMainContainer(new APage('unit'));
	//this.mainContainer.open(unitUrl);
	
	
	//this.rootContainer.$ele.children().hide();
	
	var cntr = new APage('unit');
	cntr.open(unitUrl);
};


AApplication.prototype.onReady = function()
{
	this.setCurrentPath();

	//라이브러리 추가시 동적으로 생성
	//
	if(window['ResPool']) this.resPool = new ResPool();
	if(window['MDIManager']) this.mdiManager = new MDIManager();
	
	this.rootContainer = new AContainer();
	this.rootContainer.init($('body')[0]);
	
	//edge 소수점 전화번호 인식 버그 수정
	this.rootContainer.$ele.attr('x-ms-format-detection','none');
	
	if(afc.isPC)
	{
		//pc 버전용 글로벌 스크롤 스타일 추가
		this.rootContainer.$ele.addClass('_global_scroll_style_');
	}

	//키보드 이벤트 초기화
	this.initKeyEvent();

    var thisObj = this;
    window.addEventListener('orientationchange', function()
    {
    	//var page = thisObj.navigator.getActivePage();
    	//if(!page) return;
    	
      	switch (window.orientation) 
      	{
        	case 0: //portrait
        	case 180:
        		thisObj.orientation = 'portrait';
        		//page.onOrientationChange('portrait');
          	break;
          	
        	case 90: 
        	case -90: //landscape
        		thisObj.orientation = 'landscape';
        		//page.onOrientationChange('landscape');
          	break;
          	
        	default:
	            //viewport.setAttribute('content', 'width=' + vpwidth + ', initial-scale=0.25, maximum-scale=1.0;')
          	break;
      	}
        
    }, false);

	this.isOrientationChanged = false;
	this.prevOrientation = this.orientation;
	
    window.addEventListener('resize', function()
    {
		var isResize = true;
		if(afc.isMobile)
		{
			var focusComp = AComponent.getFocusComp();
			var wh = $(window).height();
			
			// 회전이 되지 않은 경우
			if(thisObj.prevOrientation == thisObj.orientation)
			{
				//console.log('EXTRMK - 1.회전이 되지 않은 경우');
				// 회전X인 경우 모바일에서 작동하는 경우 화면사이즈를 변경할 수 없으므로
				// 키보드가 on/off 되는 경우밖에 없다.(추측) resize를 하지 않게 하여 처리한다.
				
				// 키보드의 on/off 여부를 판단한다.
				var isKeypadVisible;
				if(thisObj.windowHeight > wh+300) isKeypadVisible = true;
				else isKeypadVisible = false;

				var isOrientationChanged = thisObj.isOrientationChanged;
				// 이전에 화면이 회전된 경우
				if(isOrientationChanged)
				{
					//console.log('EXTRMK - 1.1.이전에 화면이 회전된 경우');
					
					// resize X 이전에 화면이 회전되었고 키패드가 있는 경우
					if(isKeypadVisible)
					{
						//console.log('EXTRMK - 1.1.1키패드가 있는 경우');
						isResize = false;
					}
					// resize O 이전에 화면이 회전되었고 키패드가 없는 경우
					else
					{
						//console.log('EXTRMK - 1.1.2키패드가 없는 경우');
						thisObj.isOrientationChanged = false;
					}
				}
				else
				{
					//console.log('EXTRMK - 1.2.이전에 화면이 회전되지 않은 경우');
					// 키보드가 올라가거나 내려가는 경우
					// resize X
					if(afc.isKeypadVisible != isKeypadVisible)
					{
						//console.log('EXTRMK - 1.2.1.키보드 on/off 전환');
						isResize = false;
					}
				}
				
				if(afc.isKeypadVisible != isKeypadVisible)
				{
					if(isKeypadVisible)
					{
						var keyboardH = thisObj.windowHeight - wh;
						//setTimeout(function(){ KeyboardManager.onKeyBoardShow(wh, keyboardH); });
						KeyboardManager.onKeyBoardShow(wh, keyboardH);
					}
					else
					{
						//setTimeout(function(){ KeyboardManager.onKeyBoardHide(); });
						KeyboardManager.onKeyBoardHide();
					}
				}
					
				afc.isKeypadVisible = isKeypadVisible;
			}
			// 회전이 된 경우
			else
			{
				//console.log('EXTRMK - 2.회전이 된 경우');
				thisObj.isOrientationChanged = true;
			}
			
			thisObj.windowHeight = wh;
			thisObj.prevOrientation = thisObj.orientation;
		}
		
		//console.log('EXTRMK - ' + isResize + ' / ' + afc.isKeypadVisible);
		
		// resize를 해도 되는 경우에만 resize 처리한다.
		if(isResize)
		{
			AWindow.reportResizeEvent();

			if(theApp.mainContainer)
				theApp.mainContainer.onResize();

			else ANavigator.reportResizeEvent();
		}
		else if(!afc.isKeypadVisible) AWindow.reportMoveCenter();

		/*//AWindow.reportResizeEvent();
		
		if(theApp.mainContainer)
			theApp.mainContainer.onResize();
		
		else ANavigator.reportResizeEvent();*/
    });
	
	//asoocool, ios 스마트폰 웹에서 body 가 scroll bounce 되는 효과를 제거	
	/*
	if(afc.isIos && !afc.isHybrid)
	{
		this.rootContainer.element.addEventListener('touchstart', function(e)
		{
			e.preventDefault();	
		});
	}
	*/

};

//현재 응용프로그램의 작업 디렉토리 셋팅
AApplication.prototype.setCurrentPath = function()
{
	var curPath = decodeURI(window.location.pathname);
	
    if(afc.OS=='WIN') 
    {
    	curPath = AUtil.extractLoc(curPath.replace(/[/]/g, afc.DIV));
    	//this.curPath = curPath.slice(1, curPath.length);
		this.curPath = curPath.slice(1);
    }
    //mac, linux
    else 
    {
    	curPath = AUtil.extractLoc(curPath);
    	//this.curPath = curPath.slice(0, curPath.length);
		//this.curPath = curPath.slice(0);
		this.curPath = curPath;
    }
};

AApplication.prototype.getCurrentPath = function()
{
	return this.curPath;
};

//android 의 백키 터치시 기본적으로 처리해 줘야 할 것들. 
//true를 리턴하면 받는 곳에서 아무처리도 하지 않도록 한다.
AApplication.prototype.onBackKeyManage = function()
{
    if(AWindow.reportBackKeyEvent()) return true;
    
    /*
    if(this.navigator.canGoPrev())
    {
        this.navigator.goPrevPage(true);
        return true;
    }
    */
   
   /*
   //asoocool
   	var page = this.navigator.getActivePage();
   	if(page && page.onBackKey()) return true;
	*/
	
	return ANavigator.reportBackKeyEvent();
};

AApplication.prototype.getOrientation = function()
{
	return this.orientation;
};

/*
AApplication.prototype.getCurrentPage = function()
{
	//asoocool
	//return this.navigator.getActivePage();
	return null;
};
*/

AApplication.prototype.setMainContainer = function(container)
{
	this.mainContainer = container;
};

AApplication.prototype.getMainContainer = function()
{
	return this.mainContainer;
};

AApplication.prototype.getRootContainer = function()
{
	return this.rootContainer;
};


AApplication.prototype.getActiveContainer = function()
{
	if(this.mdiManager) return this.mdiManager.getActiveContainer();
	else return null;
};

AApplication.prototype.getActiveView = function()
{
    var childContainer = this.getActiveContainer();
    if(childContainer) return childContainer.getView();
    else return null;
};

AApplication.prototype.getActiveDocument = function()
{
    var childContainer = this.getActiveContainer();
    if(childContainer) return childContainer.getView().getDocument();
    else return null;
};


/* 
//------------------------------------------------------------------
var docTmpl = 
{
	containerClass: 'MDIPage',
	documentClass: 'MDIDocument',
	viewUrl: 'views/MainPageView.lay',
	extNames: ['txt','js','cls'],
};
//------------------------------------------------------------------
*/

AApplication.prototype.openDocTmplFile = function(filePath)
{
	if(!this.mdiManager) return false;
	
	return this.mdiManager.openDocContainer(filePath);
};

AApplication.prototype.saveActiveDocTmplFile = function()
{
	if(!this.mdiManager) return false;
	
	var doc = this.getActiveDocument();
	if(doc) this.mdiManager.saveDocContainer(doc.uri);
};

AApplication.prototype.closeActiveDocTmplFile = function(callback, isForce, isSave)
{
	if(!this.mdiManager) return false;
	
	var doc = this.getActiveDocument();
	if(doc) this.mdiManager.closeDocContainer(doc.uri, callback, isForce, isSave);
	else if(callback) callback(-1);
};

AApplication.prototype.initKeyEvent = function()
{
	var keyDownListeners = this.keyDownListeners = [],
		keyUpListeners = this.keyUpListeners = [];

	$(document).keydown(function(e)
	{
		if(afc.OS=='MAC') e.ctrlKey = e.metaKey;

		var listener = null;
		for(var i=keyDownListeners.length-1; i>-1; i--)
		{
			//이전 onKeyDown 에서 리스너가 삭제될 수도 있으므로 null 비교를 해야함.
			listener = keyDownListeners[i];
			
			//onKeyDown 함수에서 true 를 리턴하면 다른 리스너에게 더 이상 전달되지 않는다.
			//마지막에 추가된 리스너가 우선적으로 호출된다.
			if(listener && listener.onKeyDown(e)) break;
		}
	});

	$(document).keyup(function(e)
	{
		if(afc.OS=='MAC') e.ctrlKey = e.metaKey;

		var listener = null;
		for(var i=keyUpListeners.length-1; i>-1; i--)
		{
			//이전 onKeyUp 에서 리스너가 삭제될 수도 있으므로 null 비교를 해야함.
			listener = keyUpListeners[i];
			
			//onKeyUp 함수에서 true 를 리턴하면 다른 리스너에게 더 이상 전달되지 않는다.
			//마지막에 추가된 리스너가 우선적으로 호출된다.
			if(listener && listener.onKeyUp(e)) break;
		}
	});
	
};

AApplication.prototype.addKeyEventListener = function(type, listener)
{
	//기존에 추가된 것이 있으면 제거
	this.removeKeyEventListener(type, listener);

	//마지막에 추가된 리스너가 우선적으로 호출 되도록 
	if(type=='keydown') this.keyDownListeners.push(listener);
	//keyup
	else this.keyUpListeners.push(listener);
};

AApplication.prototype.removeKeyEventListener = function(type, listener)
{
	var keyListeners = this.keyUpListeners;
	
	if(type=='keydown') keyListeners = this.keyDownListeners;
	
   	for(var i=0; i<keyListeners.length; i++)
	{
		if(keyListeners[i]===listener)
		{
			keyListeners.splice(i,1);
			break;
		}
	}
};



AApplication.prototype.onClose = function()
{
	return false;
};



AApplication.prototype.onError = function(message, url, lineNumber)
{
	var totMsg = message + ', Line - ' + lineNumber + ', ' + url;
	
	AfcMessageBox('error', totMsg);
	
	return totMsg;
};


//---------------------------------------------------------------------------------
//	called from native

/*
function onCloseApp()
{
	setTimeout(function()
	{
		if(!theApp.onClose()) 
			window.exec(null, null, 'AppPlugin', 'CloseApp', []);
		
	}, 0);
}
*/

function onCloseApp()
{
	setTimeout(function()
	{
		if(!theApp.onClose()) 
		{
			if(window.exec) window.exec(null, null, 'AppPlugin', 'CloseApp', []);
			else
			{
				var win = theApp.nwGui.Window.get();
				win.close(true);
			}
		}
		
	}, 0);
}

//native open event
function onOpenDocument(filePath)
{
	
}


function AfcMessageBox(title, message, type, callback, modaless)
{
	if(!window['AMessageBox']) return null;
	
	var wnd = new AMessageBox();
	wnd.setWindowOption({isModal: !modaless});
	wnd.openBox(null, message, type, callback);
	wnd.setTitleText(title);
	
	return wnd;
}

