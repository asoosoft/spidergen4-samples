/**
 * @author kyun
 */

function AWebView()
{
	AComponent.call(this);
	
	this.iframe = null;
	this.delegator = null;
	
	this.isEnableZoom = true;
	
	this.scale = 1.0;
	this.minScale = 1.0;
	this.maxScale = 3.0;
	this.readyChkTimer = null;
	
	this.touchStart = null;
	this.touchMove = null;
	this.touchEnd = null;
	
	//핀치 줌 용
	this.lastDist = null;
	
	//자체적인 스크롤 구현
	this.scrlManagerX = null;
	this.scrlManagerY = null;
	
}
afc.extendsClass(AWebView, AComponent);

AWebView.CONTEXT = 
{
    tag: '<div data-base="AWebView" data-class="AWebView" data-flag="0001" class="AWebView-Style"><iframe frameborder="0" scrolling="auto"></iframe></div>',
    
    defStyle: 
    {
        width:'400px', height:'200px'
    },

    events: []
};


AWebView.readyChkTime = 50;
AWebView.chkTotalTime = 5000;

AWebView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//for ios
	if(afc.isIos) this.$ele.css('-webkit-overflow-scrolling', 'touch');
	
	var ifr = this.$ele.children();
	this.iframe = ifr[0];
	
	var thisObj = this;
	//iframe src 로드가 완료되면 호출되는 콜백함수
	ifr.load(function() 
	{ 
		thisObj.docLoad(); 
	});
	
	var urlSrc = this.getAttr('data-url');
	if(urlSrc) this.setUrl(urlSrc);
	
	//samsung
	if(afc.isAndroid && afc.strModuleName.substring(0,2)=='SH')
	{
		//4.1, 4.2, 4.3
		if(afc.andVer>4.0 && afc.andVer<4.4) this.enableScrlManager();
	}
	
	//this.escapePreventTouch();
};

AWebView.prototype.enableScrlManager = function()
{
	this.scrlManagerX = new ScrollManager();
	this.scrlManagerX.setOption(
	{
		startDelay: 10,
		endDelay: 20,
		scrollAmount: 10,
		speedRatio: 0.03
	});
	
	this.scrlManagerY = new ScrollManager();
};

AWebView.prototype.scrollImplement = function()
{
	function _getDist(p1, p2) { return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2)); }
	
	var awebview = this;
	
	this.resetZoom();
	
	this.touchStart = function(e)
	{
		if(awebview.scrlManagerX)
		{
			e.preventDefault();
			
			var touch1 = e.targetTouches[0];
	       	var touch2 = e.targetTouches[1];
	       	
	       	//멀티터치시에는 스크롤을 발생시키지 않는다.
	       	if(touch1 && touch2) return;
	       	
			awebview.scrlManagerX.initScroll(touch1.clientX);
			awebview.scrlManagerY.initScroll(touch1.clientY);
		}
	};
	
	this.touchMove = function(e)
	{
		var touch1 = e.targetTouches[0];
        var touch2 = e.targetTouches[1];

        //멀티터치 줌
        if(touch1 && touch2 && awebview.isEnableZoom) 
		{
			e.preventDefault();
			
			if(awebview.scrlManagerX)
			{
				awebview.scrlManagerX.stopScrollTimer();
				awebview.scrlManagerY.stopScrollTimer();
			}
			
			var dist = _getDist({ x: touch1.pageX, y: touch1.pageY }, { x: touch2.pageX, y: touch2.pageY });
            if(!awebview.lastDist) 
            {
            	awebview.lastDist = dist;
            	return;
            }
            
            awebview.zoom(dist/awebview.lastDist - 1);
			awebview.lastDist = dist;
		}
		
		//scrlManagerX, Y 중 하나만 비교하면 됨.
		else if(awebview.scrlManagerX)
		{
			e.preventDefault();
			
			var scrlArea = this.body;
			awebview.scrlManagerX.updateScroll(touch1.clientX, function(move)
			{
				scrlArea.scrollLeft += move;
			});

			awebview.scrlManagerY.updateScroll(touch1.clientY, function(move)
			{
				scrlArea.scrollTop += move;
			});
		}
	};
	
	this.touchEnd = function(e)
	{
		awebview.lastDist = null;
		
		if(awebview.scrlManagerX)
		{
			e.preventDefault();
			
			var touch1 = e.targetTouches[0];
	       	var touch2 = e.targetTouches[1];
			
	       	//멀티터치시에는 스크롤을 발생시키지 않는다.
	       	if(touch1 && touch2) return;
			
			var scrlArea = this.body;
			awebview.scrlManagerX.scrollCheck(touch1.clientX, function(move)
			{
				scrlArea.scrollLeft += move;
				return true;
			});
			
			awebview.scrlManagerY.scrollCheck(touch1.clientY, function(move)
			{
				scrlArea.scrollTop += move;
				return true;
			});
		}
	};
	
	var cntDoc = this.getDoc();
	AEvent.bindEvent(cntDoc, AEvent.ACTION_DOWN, this.touchStart);
	AEvent.bindEvent(cntDoc, AEvent.ACTION_MOVE, this.touchMove);
	AEvent.bindEvent(cntDoc, AEvent.ACTION_UP, this.touchEnd);
	
	//var $cntDoc = $(this.getDoc());
	//$cntDoc.bind('touchstart', this.touchStart);
	//$cntDoc.bind('touchmove', this.touchMove);
	//$cntDoc.bind('touchend', this.touchEnd);	
};


AWebView.prototype.getDoc = function()
{
	return this.iframe.contentDocument;
};


AWebView.prototype.getWnd = function()
{
	return this.iframe.contentWindow;
};

AWebView.prototype.reload = function()
{
	this.iframe.contentWindow.location.reload();
};


AWebView.prototype.readyCheck = function()
{
	if(afc.isIE) return;
	
	var thisObj = this, totalTime = AWebView.chkTotalTime;
	
	this.readyChkTimer = setInterval(function()
	{
		totalTime -= AWebView.readyChkTime;
		if(totalTime<0)
		{
			thisObj.clear();
			return;
		} 
		
		var doc = thisObj.getDoc();
		if(doc) 
		{
			if(doc.activeElement && doc.activeElement.childElementCount>0)
			{
				clearInterval(thisObj.readyChkTimer);
				thisObj.readyChkTimer = null;

				thisObj.docReady();
			}
		}
		
	}, AWebView.readyChkTime);
};

AWebView.prototype.docLoad = function()
{
	//afc.log('docLoad ####################################');

	if(this.delegator && this.delegator.onDocLoad) 
		this.delegator.onDocLoad(this, this.getDoc());
};

AWebView.prototype.docReady = function()
{
	//afc.log('docReady ------------------------------------');
	
	//if(this.isEnableZoom) AWebViewEvent.implement(this);
	//else this.resetZoom();
	
	//if(this.isEnableZoom) this.scrollImplement();
	//else this.resetZoom();
	
	if(afc.isMobile)
		this.scrollImplement();

	if(this.delegator && this.delegator.onDocReady) 
		this.delegator.onDocReady(this, this.getDoc());
};

AWebView.prototype.setUrl = function(url)
{
	//afc.log('AWebView setUrl ------------------------------------');
	
	if(url && url!='about:blank') this.readyCheck();
	
	this.iframe.src = url;
};

//this.iframe.contentWindow.함수명;
//this.iframe.contentWindow.변수명;
//$(this.iframe).contents().find('#foo').text('안녕하세요');
//$('body', this.getDoc()).append('<body></body>');	

AWebView.prototype.setHtml = function(html)
{
	this.readyCheck();
	
	var doc = this.getDoc();
	doc.open();
	doc.write(html);
	doc.close();
};

AWebView.prototype.clear = function()
{
	if(this.readyChkTimer)
	{
		clearInterval(this.readyChkTimer);
		this.readyChkTimer = null;
	}
	
	this.resetZoom();
	
	var doc = this.getDoc();
	if(doc) window.frames[0].stop();
	
	//if(window.frames[0]) window.frames[0].stop();
	
	//if(this.iframe) this.iframe[0].stop();
};

AWebView.prototype.getUrl = function()
{
	return this.iframe.src;
};

AWebView.prototype.enableZoom = function(enable)
{
	this.isEnableZoom = enable;
};

//----------------------------------------------------------
//  delegate functions
//  function onDocReady(awebview, contentDocument);
//  function onDocLoad(awebview, contentDocument);
//----------------------------------------------------------
AWebView.prototype.setDelegator = function(delegator)
{
    this.delegator = delegator;
};

AWebView.prototype.resetZoom = function()
{
	if(this.touchStart)
	{
		//var $cntDoc = $(this.getDoc());
		//$cntDoc.unbind('touchstart', this.touchStart);
		//$cntDoc.unbind('touchmove', this.touchMove);
		//$cntDoc.unbind('touchend', this.touchEnd);
		var cntDoc = this.getDoc();
		AEvent.unbindEvent(cntDoc, AEvent.ACTION_DOWN, this.touchStart);
		AEvent.unbindEvent(cntDoc, AEvent.ACTION_MOVE, this.touchMove);
		AEvent.unbindEvent(cntDoc, AEvent.ACTION_UP, this.touchEnd);
	}
	
	this.scale = 1.0;
	this.touchStart = null;
	this.touchMove = null;
	this.touchEnd = null;
	
	//핀치 줌 용
	this.lastDist = null;
};

AWebView.prototype.setScale = function(scale)
{
	if(scale<this.minScale) scale = this.minScale;
	else if(scale>this.maxScale) scale = this.maxScale;
	
	this.scale = scale;
	this.applyScale();
};

AWebView.prototype.applyScale = function()
{
	if(afc.isIos)
	{
	/*
		$(this.iframe).css(
		{
			'-webkit-transform': 'scale('+this.scale+')', 
			'-webkit-transform-origin': '0 0'
		});
	*/	
		$(this.getDoc().body).css(
		{
			zoom: this.scale,
			//'-webkit-transform': 'scale(1.0)', 
			'-webkit-transform': 'scale('+this.scale+')', 
			'-webkit-transform-origin': '0 0'
		});
		
	}
	else
	{
		$(this.getDoc().body).css(
		{
			zoom: this.scale
		});
	}
};

AWebView.prototype.zoom = function(ratio)
{
	this.setScale(this.scale + this.scale*ratio); 
};

AWebView.prototype.getScrollEle = function()
{
	if(afc.isIos) return this.element;
	else return this.getDoc().body;
};

AWebView.prototype.scrollTo = function(pos)
{
	this.getScrollEle().scrollTop = pos;
};

AWebView.prototype.scrollOffset = function(offset)
{
	this.getScrollEle().scrollTop += offset;
};

AWebView.prototype.scrollToTop = function()
{
	var scrlEle = this.getScrollEle();
	scrlEle.scrollTop = scrlEle.scrollHeight*-1;
};

AWebView.prototype.scrollToBottom = function()
{
	var scrlEle = this.getScrollEle();
	scrlEle.scrollTop = scrlEle.scrollHeight;
};

AWebView.prototype.scrollToCenter = function()
{
	var scrlEle = this.getScrollEle();
	scrlEle.scrollTop = (scrlEle.scrollHeight - scrlEle.offsetHeight)/2;
};

//바로 스크롤 안되는 버그 픽스
AWebView.prototype.scrollBugFix = function()
{
	this.scrollTo(1);
};



