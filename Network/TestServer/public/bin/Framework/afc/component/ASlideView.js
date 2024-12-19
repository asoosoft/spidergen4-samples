
/**
 * @author extrmk
 */

function ASlideView()
{
	AComponent.call(this);
	
	this.inx = 0;
	this.delegator = null;
	this.moveUnit = 0;
	this.moveSpeed = 100;
}
afc.extendsClass(ASlideView, AComponent);

ASlideView.CONTEXT = 
{
    tag: '<div data-base="ASlideView" data-class="ASlideView" class="ASlideView-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    //events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom', 'drop', 'dragStart', 'dragEnd' ]
    events: ['change']
};

ASlideView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	this.enableScrlManagerX();
	this.selectBtn = null;
};

ASlideView.prototype.setSpeed = function(speed)
{
	this.moveSpeed = speed;
};

ASlideView.prototype.enableScrlManagerX = function()
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
	
	this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': '', 'z-index':0});	//가속을 위한 z-index 설정
	
	this.scrollXImplement();
//	this.aevent._scroll();
};

//function bindData(view, dataArray[i], this);
ASlideView.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;	
};

ASlideView.prototype.setButtonView = function(buttonView)
{
	this.btnView = buttonView;
	
	var children = this.btnView.getChildren();
	
	for(var i=0; i<children.length; i++)
	{
		children[i].addEventListener('click', this, 'onBtnClick');
	}
	this.selectButton(children[0]);
};

ASlideView.prototype.onBtnClick = function(comp, info)
{
	var children = this.btnView.getChildren();
	
	//this.$ele.stopAnima();
	for(var i=0; i<this.$ele.children().length; i++)
	{
		if(children[i] == comp)
		{
			this.slideTo(i, true);
			return;
		}
	}
};

ASlideView.prototype.selectButton = function(selBtn)
{
	if(this.selectBtn) this.selectBtn.enable(true);
	if(selBtn)
	{
		selBtn.enable(false);
		this.selectBtn = selBtn;
	}
};

ASlideView.prototype.addItem = function(url, dataArray, isPrepend)
{
	if(!this.moveUnit) this.moveUnit = this.getWidth();
    var thisObj = this, $item, item, aview,
		w = this.getWidth(),
		newItems = [];
	
	for(var i=0; i<dataArray.length; i++)
	{
        $item = $('<div></div>');
        item = $item[0];
		$item.css({
			"position": "absolute",
			"left": this.$ele.children().length*w+'px',
			"top": "0px",
			"width": "100%",
			"height": "100%"
		});
        
		if(isPrepend) this.$ele.prepend(item);
		else this.$ele.append(item);
		
        item.itemData = dataArray[i];
        
        newItems.push(item);
		
		if(typeof(url) == 'string') 
		{
			aview = AView.createView(item, url, this, null);
			url = aview;
		}
		else 
		{
			var compIdPrefix = afc.makeCompIdPrefix();

			aview = url.cloneComponent(compIdPrefix, function(cloneComp)
			{
				cloneComp.owner = thisObj;
			});

			AView.setViewInItem(aview, item, this);

			/*var initView = aview;
			setTimeout(function()
			{
				if(initView.isValid())
					initView._initDoneManage(!thisObj.option.isUpdatePosition);
			}, 0);*/

			//속도에 이슈가 있어 아래 처럼 함.
			aview._initDoneManage(!thisObj.option.isUpdatePosition);
		}
		
		if(this.delegator) this.delegator.bindData(item, item.itemData, this);
		
		//델리게이터를 셋팅하지 않으면 기본적으로 서브뷰의 setData 를 호출해 준다.
		else if(item.view.setData) item.view.setData(item.itemData);
		/*
		view = new AView();
		view.init();
		view.element.container = this.getContainer();
		view.element.rootView = this;
		view.setStyleObj({
			"left": this.getItems().length*w+'px',
			"top": "0px",
			"width": "100%",
			"height": "100%",
			"background": "transparent"
		});
		
		view.viewLoad(url);
		this.addComponent(view);
		view.updatePosition();

		if(isBindData) this.delegator.bindData(view, dataArray[i], this);
		*/
	}
};

ASlideView.prototype.addDisableManager = function(disableManager)
{
	this.scrlManagerX.addDisableManager(disableManager);
	//같은 객체를 중복해서 추가해도 무시된다.
	disableManager.addDisableManager(this.scrlManagerX);
};

ASlideView.prototype.removeAllItems = function()
{
	this.getItems().each(function()
	{
		this.view.removeFromView();

		$(this).remove();
	});
	
	//슬라이드뷰 초기화(버튼뷰가 있다면 버튼 선택해제)
	this.inx = 0;
	if(this.btnView) this.selectButton();
};

ASlideView.prototype.getItem = function(index)
{
    return this.getItems()[index];
};

ASlideView.prototype.getItems = function()
{
    return this.$ele.children();
};

ASlideView.prototype.indexOfItem = function(item)
{
	return this.getItems().index(item);
};

ASlideView.prototype.slideTo = function(index, isReport)
{
	this.$ele.animate({scrollLeft : this.moveUnit*index}, this.moveSpeed);
	
	if(this.inx!=index)
	{
		this.inx = index;
		
		if(this.btnView) this.selectButton(this.btnView.getChildren()[this.inx]);
		if(isReport) this.reportEvent('change', this.inx);
// 		if(this.delegator && this.delegator.onViewChanged) this.delegator.onViewChanged(this.inx, this);
	}
};

ASlideView.prototype.slidePrev = function()
{
	if(this.inx==0) this.inx = 1;
	
	this.slideTo(this.inx-1, true);
};

ASlideView.prototype.slideNext = function()
{
	if(this.inx+1==this.getItems().length) this.inx--;
	
	this.slideTo(this.inx+1, true);
};


ASlideView.prototype.scrollXImplement = function()
{
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var thisObj = this, isDown = false, scrlArea = this.element;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		e.preventDefault();
		thisObj.scrlManagerX.initScroll(e.changedTouches[0].clientX);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		thisObj.scrlManagerX.updateScroll(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;

		e.preventDefault();

		thisObj.scrlManagerX.scrollCheck(e.changedTouches[0].clientX, function(move)
		{
			var ratio = Math.abs(this.totDis)/thisObj.moveUnit;
			
//console.log(this.oldDis);
			
			if(ratio<0.2) thisObj.slideTo(thisObj.inx, true);//20%
			else if(this.totDis<0) thisObj.slidePrev();
			else if(this.totDis>0) thisObj.slideNext();
			else thisObj.slideTo(thisObj.inx, true);//20%
			
			return false;
		});
	});
};



