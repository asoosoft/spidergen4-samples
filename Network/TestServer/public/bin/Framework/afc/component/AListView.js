/**
 * @author asoocool
 * 
 */

function AListView()
{
    AComponent.call(this);
    
    this.delegator = null;
    
    this.itemHeight = null;
    //this.selectBgColor = '#0000d0';
    this.dividerColor = null;
    this.selectClass = null;
    this.selectItem = null;
	
	this.scrollArea = null;
	
	this.scrollComp = null;
    
	//리스트뷰 옵션
	this.option =
    {
        isSelectable: true,			//선택 [불]가능 옵션 플래그
    	isUpdatePosition: false,	//리스트 뷰는 성능을 위해 기본적으로 updatePosition 이 호출되지 않도록 한다.
    	isViewPool: false,
    	isFloat: false 				//isFloat:true (가로로 배치하다 공간이 없으면 세로로 추가)
    };
    
	this.scrlManager = null;
    //스크롤 위치를 복원하기 위해 저장해둠.
    this.savedScrollPos = -1;
	
	this.defaultUrl = '';
	
	this.realMap = null;
	this.realField = null;
	
}
afc.extendsClass(AListView, AComponent);

//style="height: 60px;" --> attribute 에서 정보를 참조하기 위해 필요
AListView.CONTEXT = 
{
    tag: '<div data-base="AListView" data-class="AListView" class="AListView-Style">'+
            '<div class="listview-row" style="height: 60px;"></div><div class="listview-row AListView-select"></div>'+ 
			'<div class="listview-row"></div><div class="listview-row"></div></div>',

    defStyle: 
    {
        width:'380px', height:'270px'
    },

    events: ['select', 'scroll', 'scrolltop', 'scrollbottom', 'drop']
};


AListView.prototype.init = function(context, evtListener)
{
	//---------------------------------------------------------------
	//	이벤트 구현시 필요하므로 init 전에 변수를 만들어 두어야 한다.
		//this.scrollArea = $('<div style="position:absolute; width:100%; height:100%; overflow:auto;"></div>');
		this.scrollArea = $('<div style="position:relative; z-index:0; width:100%; height:100%; overflow:auto; -webkit-overflow-scrolling:touch;"></div>');
	//------------------------------------------------------------------


    AComponent.prototype.init.call(this, context, evtListener);

    var items = this.$ele.children();
    this.itemHeight = items[0].style.height;
    //this.setSelectBgColor(items[0].style.background);
    
    this.setSelectClass(this.element.getAttribute('data-style-selectitem'));
	this.setDefaultUrl(this.getAttr('data-default-url'));
    
	if(!window._afc) 
	{
		this.$ele.children().remove();
		this.$ele.append(this.scrollArea);
	}
    
    //this.escapePreventTouch();
	
	//this.setScrollArrow();
	
	//this.createBackup(50, 20);
};

AListView.prototype.setItemHeight = function(height)
{
	this.itemHeight = height;
};


AListView.prototype.setDefaultUrl = function(url)
{
	this.defaultUrl = url;
};


AListView.prototype.getDefaultUrl = function()
{
	return this.defaultUrl;
};

AListView.prototype.callSubActiveEvent = function(funcName, isFirst)
{
	if(this.option.isUpdatePosition)
	{
	    this.getItems().each(function()
	    {
	    	this.view[funcName](isFirst);
	    });
	}
	//var selView = this.getSelectedView();
	//if(selView) selView[funcName](isFirst);
};


AListView.prototype.enableScrlManager = function()
{
	if(this.scrlManager) return;
	
	this.scrlManager = new ScrollManager();
	
	//this.$ele.css('-webkit-overflow-scrolling', '');
	this.scrollArea.css('-webkit-overflow-scrolling', '');
	
	this.scrollImplement();
};

AListView.prototype.setScrollComp = function(acomp)
{
	this.scrollComp = acomp;
	
};

/*
AListView.prototype.setOption = function(option)
{
    for(var p in option)
    {
    	if(!option.hasOwnProperty(p) || this.option[p]==undefined) continue;
    	
        this.option[p] = option[p];
    }
};
*/

AListView.prototype.scrollImplement = function()
{
	var thisObj = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	
	var scrlArea = this.scrollArea[0], transTop;
	
	AEvent.bindEvent(scrlArea, AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		e.preventDefault();
		
		thisObj.scrlManager.initScroll(e.changedTouches[0].clientY);
		
		if(thisObj.scrollComp)
			transTop = thisObj.scrollComp.getPos().top + scrlArea.scrollTop;
	});
	
	AEvent.bindEvent(scrlArea, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		thisObj.scrlManager.updateScroll(e.changedTouches[0].clientY, _scrlHelper);
	});
	
	AEvent.bindEvent(scrlArea, AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		e.preventDefault();
		
		thisObj.scrlManager.scrollCheck(e.changedTouches[0].clientY, _scrlHelper);
	});
	
	function _scrlHelper(move)
	{
		if(move==0) return true;
		
		var oldTop = scrlArea.scrollTop;

		//scrollComp 는 css 값을 셋팅하기 때문에 똑같이 맞춰주기 위해 소수점을 버림.
		if(thisObj.scrollComp) move = parseInt(move);
		
		scrlArea.scrollTop += move;

		if(oldTop==scrlArea.scrollTop) return false;
		
		if(thisObj.scrollComp)
		{
			thisObj.scrollComp.setStyle('top', (transTop-scrlArea.scrollTop)+'px');
		}
		
		return true;
	}
	
	
};

AListView.prototype.setScrollArrow = function(topHeight)
{
	var sa = new ScrollArrow();
	sa.setArrow('vertical');
	//sa.apply(this.element);
	sa.apply(this.scrollArea[0]);
	
	if(topHeight) sa.arrow1.css('top', topHeight+'px');
};


AListView.prototype.scrollTopManage = function()
{
	if(this.scrlManager) this.scrlManager.stopScrollTimer();

	if(this.bkManager && this.bkManager.checkHeadBackup()) return false;
	else return true;
};

AListView.prototype.scrollBottomManage = function()
{
	if(this.scrlManager) this.scrlManager.stopScrollTimer();

	if(this.bkManager && this.bkManager.checkTailBackup()) return false;
	else return true;
};


//----------------------------------------------------------
//  delegate functions
//  function bindData(item, data, alistview);
//  function itemState(item, isSelect, alistview);
//----------------------------------------------------------
AListView.prototype.setDelegator = function(delegator)
{
    this.delegator = delegator;
};

/*
AListView.prototype.setSelectBgColor = function(selectBgColor)
{
    this.selectBgColor = selectBgColor;
};
*/

AListView.prototype.setSelectClass = function(selectClass)
{
    this.selectClass = selectClass;
};

AListView.prototype.setDividerColor = function(color)
{
	this.dividerColor = color;
};


//데이터 매칭은 bindData 에서 처리된다.
//dataArray 는 배열이다.
AListView.prototype.insertItem = function(url, dataArray, posItem, isPrepend)
{
    var newItems = this.createItems(url, dataArray, posItem, isPrepend);
    
    this.aevent._select($(newItems));
    
    return newItems; 
};

AListView.prototype.addItem = function(url, dataArray, isPrepend)
{
	return this.insertItem(url, dataArray, null, isPrepend);
};


/*
AListView.prototype.setSelectItem = function(item)
{
    if(this.delegator && this.delegator.itemState)
    {
        if(this.selectItem) this.delegator.itemState(this.selectItem, false, this);
    
        this.selectItem = item;
        if(this.selectItem) this.delegator.itemState(this.selectItem, true, this);
    }
    else
    {
        if(this.selectItem)
        {
            $(this.selectItem).css('background-color', '');
            if(this.selectClass) $(this.selectItem).removeClass(this.selectClass); 
        } 
        
        this.selectItem = item;
        if(this.selectItem)
        { 
            $(this.selectItem).css('background-color', this.selectBgColor);
            if(this.selectClass) $(this.selectItem).addClass(this.selectClass);
        }
    }
};
*/

AListView.prototype.setSelectItem = function(item)
{
    if(this.selectItem)
    {
	    if(this.delegator && this.delegator.itemState)
	        this.delegator.itemState(this.selectItem, false, this);
    	
        //$(this.selectItem).css('background-color', '');
        if(this.selectClass) $(this.selectItem).removeClass(this.selectClass); 
    } 
    
    this.selectItem = item;
    if(this.selectItem)
    { 
    	if(this.delegator && this.delegator.itemState)
    		this.delegator.itemState(this.selectItem, true, this);
    	
        //$(this.selectItem).css('background-color', this.selectBgColor);
        if(this.selectClass) $(this.selectItem).addClass(this.selectClass);
    }
};

AListView.prototype.getSelectItem = function()
{
    return this.selectItem;
};

AListView.prototype.getFirstItem = function()
{
    return this.getItems()[0];
};

AListView.prototype.getLastItem = function()
{
    var items = this.scrollArea.children();
	
	if(items.length==0) return null;
	else return items[items.length - 1];
};

AListView.prototype.getItem = function(index)
{
    return this.getItems()[index];
};

AListView.prototype.getItems = function()
{
    return this.scrollArea.children();
};

AListView.prototype.getItemCount = function()
{
    return this.scrollArea.children().length;
};

/*
AListView.prototype.indexOfItem_backup = function(item)
{
	if(this.bkManager) 
	{
		var inx = this.getItems().index(item);
		if(inx<0) return inx;
		else return inx + this.bkManager.getHeadCount();
	}

	else return this.getItems().index(item);
};
*/

AListView.prototype.indexOfItem = function(item)
{
	return this.getItems().index(item);
};

AListView.prototype.removeItem = function(item)
{
    if(this.option.isViewPool) 
    {
    	item.view.removeFromView(true);
    	theApp.resPool.pushView(item.view);
    }
    else item.view.removeFromView();
    
    if(item===this.selectItem) this.selectItem = null;
    
    $(item).remove();
};

AListView.prototype.removeItemByIndex = function(index)
{
    var item = this.getItems()[index];
    this.removeItem(item);
    //this.getItems().eq(index).remove();
};

AListView.prototype.removeAllItems = function()
{
    if(this.option.isViewPool)
    {
	    this.getItems().each(function()
	    {
	    	this.view.removeFromView(true);
	    	theApp.resPool.pushView(this.view);
			
	    	$(this).remove();
	    });
    }
    else
    {
	    this.getItems().each(function()
	    {
	    	this.view.removeFromView();
			
	    	$(this).remove();
	    });
    }
	
	if(this.bkManager) this.bkManager.clearAll();
	
	this.selectItem = null;
	
	if(afc.andVer<4.4) this.refreshListView();
};

AListView.prototype.refreshListView = function()
{
	this.scrollArea.hide();
	var thisObj = this;
	setTimeout(function(){ thisObj.scrollArea.show(); }, 1);
};

AListView.prototype.scrollTo = function(pos)
{
	this.scrollArea[0].scrollTop = pos;
};

AListView.prototype.scrollOffset = function(offset)
{
	this.scrollArea[0].scrollTop += offset;
};

AListView.prototype.scrollToTop = function()
{
    this.scrollArea[0].scrollTop = this.scrollArea[0].scrollHeight*-1;
};

AListView.prototype.scrollToBottom = function()
{
    this.scrollArea[0].scrollTop = this.scrollArea[0].scrollHeight;
};

AListView.prototype.saveScrollPos = function()
{
    this.savedScrollPos = this.scrollArea[0].scrollTop;
};

AListView.prototype.restoreScrollPos = function()
{
    if(this.savedScrollPos!=-1) 
    {
        this.scrollArea[0].scrollTop = this.savedScrollPos;
        this.savedScrollPos = -1;
    }
};

AListView.prototype.createItems = function(url, dataArray, posItem, isPrepend)
{
    var thisObj = this, $item, item, aview;
    //var curListItems = this.$ele.children();	//현재 추가되어져 있는 아이템
    //var start = 0, end;							//추가할 아이템의 시작과 끝 인덱스
    
    //if(!isPrepend) start = curListItems.length;
    //end = start + dataArray.length;
    
    var newItems = [];
	
	if(!url) 
	{
		if(!this.defaultUrl) return newItems;
		
		url = this.defaultUrl;
	}
    
    //요청한 개수만큼 생성한다.
    for(var i=0; i<dataArray.length; i++)
    {
        $item = $('<div></div>');
        item = $item[0]; 

        //$item.css('background-color', this.normalBgColor);
        
        //구분선 색을 추가했으면 구분선색 표현
        if(this.dividerColor) $item.css('border-bottom', '1px solid '+this.dividerColor);
        
		//this.itemHeight 가 auto 이면 밑에서 로드되는 뷰의 높이만큼 자동으로 아이템의 높이가 늘어난다.
		//단, 로드되는 뷰의 height 값을 명확히 px 단위로 지정해야 한다. 퍼센트(ex, 100%)로 지정하면 나오지 않는다.
		//뷰의 height 를 퍼센트로 지정했다면 itemHeight 를 명확히 지정해야 한다.
        //if(this.itemHeight!='' && this.itemHeight!='auto') $item.css('height', this.itemHeight);
		if(this.itemHeight) $item.css('height', this.itemHeight);

        //if(isPrepend) this.$ele.prepend(item);
        //else this.$ele.append(item);
        
		this.itemInsertManage(item, posItem, isPrepend);
		
		if(this.option.isFloat) $item.css('float', 'left');		
        
        //item.itemData = dataArray[i-start];
        item.itemData = dataArray[i];
        
        newItems.push(item);
		
		if(this.option.isViewPool) 
		{
			aview = theApp.resPool.popView(url);
			
			if(aview)
			{
				aview.init(aview.element);
			
				AView.setViewInItem(aview, item, this);
				
				/*
				var initView = aview;
				setTimeout(function()
				{
					if(initView.isValid())
						initView._initDoneManage(!thisObj.option.isUpdatePosition);
				}, 0);
				*/
				
				//속도에 이슈가 있어 아래 처럼 함.
				aview._initDoneManage(!thisObj.option.isUpdatePosition);
			}
			else aview = AView.createView(item, url, this, null, !this.option.isUpdatePosition);
		}
		
		else
		{
			if(typeof(url) == 'string') 
			{
				aview = AView.createView(item, url, this, null, !this.option.isUpdatePosition);
				url = aview;
			}
			else 
			{
				var compIdPrefix = afc.makeCompIdPrefix();

				aview = url.cloneComponent(compIdPrefix, function(cloneComp, context)
				{
					cloneComp.owner = thisObj;
					context.container = thisObj.getContainer();
				});

				AView.setViewInItem(aview, item, this);
				
				/*
				var initView = aview;
				setTimeout(function()
				{
					if(initView.isValid())
						initView._initDoneManage(!thisObj.option.isUpdatePosition);
				}, 0);
				*/
				
				//속도에 이슈가 있어 아래 처럼 함.
				aview._initDoneManage(!thisObj.option.isUpdatePosition);
			}
		}
        
		if(this.delegator) this.delegator.bindData(item, item.itemData, this);
		
		//델리게이터를 셋팅하지 않으면 기본적으로 서브뷰의 setData 를 호출해 준다.
		else if(item.view.setData) item.view.setData(item.itemData);
		
		if(this.bkManager) 
		{
			if(this.itemHeight) this.bkManager.setItemHeight($item.height());
			else this.bkManager.setItemHeight(aview.getHeight());
		}
		
		//this.itemInsertManage(item, posItem, isPrepend);
    }
	
	//내부에서 자체적으로 호출되도록 바뀜
	//if(this.bkManager) this.bkManager.applyBackupScroll();

    //복사하여 추가된 아이템들만 얻어온다.
    //if(isPrepend) curListItems = this.$ele.children().slice(0, end);
    //else curListItems = this.$ele.children().slice(start);
    
    //가로로 배치하다 가로사이즈를 넘기면 자동으로 밑으로 추가
    //if(this.option.isFloat) curListItems.css('float','left');
    
    
    return newItems;
};

AListView.prototype.updatePosition = function(pWidth, pHeight)
{
    AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
    
    if(this.option.isUpdatePosition)
    {
    	this.getItems().each(function()
    	{
        	if(this.view)
            	this.view.updatePosition();
    	});
    }
};

AListView.prototype.itemInsertManage = function(item, posItem, isPrepend)
{
	if(posItem)
	{
		if(isPrepend) $(item).insertBefore(posItem);
		else $(item).insertAfter(posItem);
	}
	else
	{
		if(isPrepend) 
		{
			if(this.bkManager && this.bkManager.prependItemManage($(item)) ) return;
		
			this.scrollArea.prepend(item);
		}
		else 
		{
			if(this.bkManager && this.bkManager.appendItemManage($(item)) ) return;
			
			this.scrollArea.append(item);
		}
	}
};

AListView.prototype.moveTopItems = function(items)
{
	for(var i = items.length-1; i>=0; i--)
	{
		this.itemInsertManage(items[i], null, true);
	}
};

AListView.prototype.moveBottomItems = function(items)
{
	for(var i = 0; i<items.length; i++)
	{
		this.itemInsertManage(items[i], null, false);
	}
};

AListView.prototype.moveUpItems = function(items)
{
	var itemsLen = items.length;
	for(var i = 0; i<itemsLen; i++)
	{
		var index = this.indexOfItem(items[i])-1;
		if(index > -1)
		{
			var preItem = this.getItem(index);
			if(preItem === items[i-1]) continue;
			else this.itemInsertManage(items[i], preItem, true);
		}
	}
};

AListView.prototype.moveDownItems = function(items)
{
	var itemsLen = this.getItems().length;
	for(var i = items.length-1; i>=0; i--)
	{
		var index = this.indexOfItem(items[i])+1;
		var nextItem = this.getItem(index);
		if(itemsLen > index)
		{
			if(nextItem === items[i+1]) continue;
			else this.itemInsertManage(items[i], nextItem, false);
		}
	}
};

AListView.prototype.isMoreScrollTop = function()
{
	if(this.scrollArea[0].scrollTop > 0) return true;
	else return false;	
};

AListView.prototype.isMoreScrollBottom = function()
{
	if(this.scrollArea[0].offsetHeight + this.scrollArea[0].scrollTop < this.scrollArea[0].scrollHeight) return true;
	else return false;	
};

AListView.prototype.isScroll = function()
{
    return (this.scrollArea[0].offsetHeight < this.scrollArea[0].scrollHeight);
};

AListView.prototype.removeFromView = function(onlyRelease)
{
	this.removeAllItems();
	
	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

//-----------------------------------------------------
// About Backup

AListView.prototype.createBackup = function(maxRow, restoreCount)
{
	if(afc.isIos) return;
	
	//if(!window['BackupManager']) return;
	
	this.destroyBackup();

	this.bkManager = new BackupManager();
	this.bkManager.create(this, maxRow, restoreCount);
	this.bkManager.setBackupInfo(this.itemHeight, 1, this.scrollArea[0], this.scrollArea);
	
	this.aevent._scroll();
	
	//ios must enable scrollManager in backup
	if(afc.isIos) this.enableScrlManager();
};

AListView.prototype.destroyBackup = function()
{
	if(this.bkManager)
	{
		this.bkManager.destroy();
		this.bkManager = null;
	}
};

//-----------------------------------------------------
//	BackupManager delegate function

AListView.prototype.getTopItem = function()
{
	return this.getFirstItem();
};

AListView.prototype.getBottomItem = function()
{
	return this.getLastItem();
};

AListView.prototype.getTotalCount = function()
{
	return this.getItemCount();
};

//--------------------------------------------------------------


AListView.prototype.setRealMap = function(realField)
{
	this.realField = realField;
	this.realMap = null;
};

AListView.prototype.getRealKey = function(data)
{
	return data[this.realField];
};



AListView.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(queryData.isReal) this.doRealPattern(dataArr, keyArr, queryData);
	else this.doAddPattern(dataArr, keyArr, queryData);
};

AListView.prototype.doRealPattern = function(dataArr, keyArr, queryData)
{
	var item;
	
	//리얼은 원소가 하나인 배열만 온다.
	//data = dataArr[0];

	//update
	if(this.updateType==0)
	{
		item = this.realMap[this.getRealKey(dataArr[0])];
		
		if(!item) return;
		
		item.view.updateChildMappingComp(dataArr, queryData);
	}
	
	//insert
	else
	{
		item = this.addItem(null, dataArr, (this.updateType==-1) )[0];
		item.view.updateChildMappingComp(dataArr, queryData);
	}
};

AListView.prototype.doAddPattern = function(dataArr, keyArr, queryData)
{
	//조회하는 경우 기존의 맵 정보를 지운다.
	if(this.realField!=null) this.realMap = {};

	var items = this.addItem(null, dataArr), data;
	
	for(var i=0; i<items.length; i++)
	{
		data = dataArr[i];
		items[i].view.updateChildMappingComp([data], queryData);
		
		//리얼맵이 활성화 되어 있으면 조회 시점에 리얼맵을 만든다.
		if(this.realField!=null) 
		{
			this.realMap[this.getRealKey(data)] = items[i];
		}
		
	}
};



AListView.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
		
	var val = this.getAttr('data-style-selectitem');

	//attr value 에 null 이나 undefined 가 들어가지 않도록
	ret['data-style-selectitem'] = val ? val : '';
	
	return ret;
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
AListView.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) AComponent.prototype._setDataStyleObj.call(this, styleObj);
		
		else if(p=='data-style-selectitem') this._set_class_helper(this.$ele, this.$ele.find('.AListView-select'), styleObj, p);
	}
};















