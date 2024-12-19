/**
 * $root 는 <ul> 이다. 다른 하위 아이템은 <li>
 * 루트도 <li>가 되도록 구조 변경하기
 */

function ATree()
{
	AComponent.call(this);
	
    this.$root = null;
    this.historyManager = null;
    this.isDrag = false;
    this.undoStack = null;
    this.redoStack = null;
    this.selectedItems = new Array();
    this.clickedItem = null;
    this.lastSelectedItem = null;
    this.iconMapUrl = null;
    this.upSelect = false;
    this.dropTimer = null;
    
    this.option =
    {
        isSingleSelect: false,       //ctrl 키를 누르고 선택해도 하나만 선택된다. 
        isFullSelect: false,        //아이템 선택시 선택표시가 라인 전체로 표시된다.
        isDraggable: true,   	    //트리 드래그 여부
        useHistory: false,   	    //히스토리 사용여부(undo, redo)
        dragIcon: './Source/img/drag.png'	//드래그 아이콘             
    };
    
	this.selectStyle = 'tree-select'; 	//아이템 선택 ClassName
	this.overStyle = 'tree-over'; 		//드래그 오버 ClassName
	this.afterStyle = 'tree-after';		//롱 오버  ClassName
}
afc.extendsClass(ATree, AComponent);



ATree.CONTEXT = 
{
    tag: '<div data-base="ATree" data-class="ATree" class="ATree-Style">' +
    		'<ul style="margin:0px; padding:0px;">' + 
    			'<li style="list-style-type:none; margin:2px 0px 2px 15px;" class="tree-item">Item</li>' +
    		'</ul></div>',
    
    defStyle: 
    {
        width:'200px', height:'300px'
    },
    
    events: ['select', 'dblclick', 'drop', 'itemMouseOver', 'itemMouseOut']
};



//Expand type
ATree.EXPAND_ALL = 1;
ATree.EXPAND_CHILD = 2;
ATree.EXPAND_COLLAPSE = 3;


ATree.ulFormat = '<ul style="margin:0px; padding:0px;"></ul>';
ATree.liFormat = '<li style="list-style-type:none; margin:2px 0px 2px 15px;" class="tree-item"></li>';


ATree.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	if(!window._afc) this.$ele.children().remove();
	
	this.dnd_scope = '_dnd_'+new Date().getTime();
	
	//this.initTree('./img/tree_item.png');
	//this.initTree('./theme/img/tree_item.png');
	
	this.initTree();
	
	this.actionToFocusComp();
	
};

ATree.prototype.initTree = function(iconMapUrl)
{
	if(iconMapUrl) this.iconMapUrl = 'url("' + iconMapUrl + '")';
	
    this.$root = $(ATree.ulFormat);
    this.$root.css('white-space', 'nowrap');
    
    this.$ele.append(this.$root);
};


ATree.prototype.setOption = function(option)
{
    for(var p in option)
    { 
        if(option[p]!=undefined)
            this.option[p] = option[p];
    }
};

//----------------------------------------------------------
//	* delegate functions *
//	function itemExpandManage(isExpand, item);
//----------------------------------------------------------

ATree.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;
};

//히스토리 사용을 시작함
ATree.prototype.startUseHistory = function()
{
	this.option.useHistory  = true; 
	this.historyManager = new HistoryManager();
	this.undoStack = AUtil.makeUndoStack(this.$ele);
	this.redoStack = AUtil.makeRedoStack(this.$ele);
};

ATree.prototype.getRootItem = function()
{
	return this.$root[0];
};

ATree.prototype.getSelectedItems = function()
{
    return this.selectedItems;
};

ATree.prototype.getSelectedParent = function(mItem)
{
    return $(mItem.pItem).children('label').hasClass(this.selectStyle);
};

ATree.prototype.setItem = function(item, itemInfo)//itemInfo -> name, data, icon, action
{
	for(p in itemInfo)
	{
		if(p=='pItem' || p=='pos' || p=='action') continue;
		else if(p=='name') $(item).children('label').text(itemInfo.name);
		else if(p=='icon') $(item).children('span').css('background-position', (-16 * itemInfo.icon) + 'px 0px');

    	item[p] = itemInfo[p];
	}
};

//mItems 의 아이템들을 pItem 으로 이동시킨다. 자식 아이템이 있을 경우 같이 이동한다.
//TODO: 자신과 자신의 자식이 동시에 선택되어져 있는 경우는 오류가 발생...차후 제거하는 조직 추가해 주기
ATree.prototype.moveItem = function(dropItem, mItems, isInsertAfter)
{
	if(!isInsertAfter) this.insertHelper(dropItem, true);

	var curAfterDom = dropItem;
	var delChecks = [];
	for(var i=0,len=mItems.length; i<len; i++)
	{
		//히스토리에서 쓰임
		var preAfterDom = $(mItems[i]).next('li')[0];
		var preParent = $(mItems[i]).parent();
		var dropParent = dropItem;
		delChecks.push(mItems[i].pItem);
		
		//부모가 이동하면 자식도 자동으로 이동하므로 부모가 선택되어 있으면 통과시킴
	    if($(mItems[i].pItem).children('label').hasClass(this.selectStyle)) continue;
		
	    if(isInsertAfter)
	    {
	    	dropParent = dropItem.pItem;
	    	//동일한 형제 밑으로 들어갈 경우 배열의 뒤에있는 element부터 추가
	    	$(curAfterDom).after(mItems[i]);
	    	curAfterDom = mItems[i];
	    }  
	    else
	    {
	    	$(dropItem).children('ul').append(mItems[i]);
	    } 
	    	
   		//히스토리 사용시
	    if(this.option.useHistory)
	    {
	    	/*this.historyManager.reg(
		    	new ActionInfo('move', mItems[i], {treeParent: $(dropParent).children('ul'), next: $(mItems[i]).next('li')[0]}, {treeParent: preParent, next: preAfterDom}),
		    	(i != 0));*/
				
			this.historyManager.reg({
				targets: mItems[i],
				undoData: {treeParent: preParent, nextDom: preAfterDom},
				redoData: {treeParent: $(dropParent).children('ul'), nextDom: $(mItems[i]).next('li')[0]},
				isMerge: (i != 0)
			},
			function(undoObj)
			{
				var targets = undoObj.targets;
				var undoData = undoObj.undoData;
				
				if(undoData.nextDom) $(targets).insertBefore(undoData.nextDom);
				else undoData.treeParent.append(targets);
			
			}, function(redoObj)
			{
				var targets = redoObj.targets;
				var redoData = redoObj.redoData;
				
				if(redoData.nextDom) $(targets).insertBefore(redoData.nextDom);
				else redoData.treeParent.append(targets);
			});
	    }
	    mItems[i].pItem = dropParent;
	}
	
	var thisObj = this;
	setTimeout(function()
	{
		for(var i=0,len=delChecks.length; i<len; i++)
			thisObj.deleteHelper(delChecks[i]);
	},1);
};


ATree.prototype.insertItem = function(pItem, pos, name, data, icon, isExpand, mergeHistory)
{
	return this.insertItemObj({'pItem': pItem, 'pos': pos, 'name': name, 'data': data, 'icon':icon}, isExpand, mergeHistory);

};

ATree.prototype.setItemComment = function(item, comment)
{
	if(comment)
	{
		$(item).children('label').after('<label title="'+comment+'" style="padding:3px;">['+comment+']</label>');
		item.comment = comment;
	}
};

// return tree item 
// item has pItem(parent item), pos, name, comment, data, icon
//mergeHistory 각각 다른타겟의 액션을 한 history로 묶고 싶을때, true일경우 현재  offset 히스토리 정보에 추가로 등록
ATree.prototype.insertItemObj = function(itemInfo, isExpand, mergeHistory)//itemInfo -> pItem(parent item), pos, name, data, icon, action, isGroup
{
	var thisObj = this; 
    var item = $(ATree.liFormat);
    
    //열기, 접기용 +, - 버튼 공간을 만들어둔다.
    //최초는 보이지 않는 상태이다.
    var expBtn = $('<span class="tree-expand"></span>');
    //var lheight = $.browser.msie ? '10px' : '8px';
	
    var lheight = '8px';
	
	/*
    expBtn.css(
    {
    	marginRight : '3px',
		lineHeight: lheight,
        display: 'inline-block', width: '7px', height: '7px',
        cursor: 'default', visibility: 'hidden',
		padding:0
    });
	*/
	
    item.append(expBtn);
    
    //아이템 아이콘 셋팅
    if(this.iconMapUrl && itemInfo.icon!=undefined) 
    {
        var icon = $('<span></span>');
        icon.css(
        {
        	'vertical-align': 'middle',
            'margin-right': '2px', 
            display: 'inline-block', width: '16px', height: '16px',
            'background-image': this.iconMapUrl,
            'background-position': (-16 * itemInfo.icon) + 'px 0px',
			'background-size': 'auto'
        });
        
        item.append(icon);
    }
    
    //if($.browser.msie) item.append('<label style="padding:3px 3px 1px 3px;">' + itemInfo.name + '</label>');
    //else
    //{
    	/*
    	var appendedItem = $('<label style="padding:3px;"></label>');
    	appendedItem.text(itemInfo.name);
    	item.append(appendedItem);
    	*/
    	item.append('<label style="padding:3px;">'+itemInfo.name+'</label>');
		item[0].lastChild.ownerComp = this;
		item[0].lastChild.onmouseover = function(e)
		{
			if(this.ownerComp) this.ownerComp.reportEvent('itemMouseOver', this, e);
		};
		
		item[0].lastChild.onmouseout = function(e)
		{
			if(this.ownerComp) this.ownerComp.reportEvent('itemMouseOut', this, e);
		};
		
		
		this.setItemComment(item, itemInfo.comment);
    //} 
    
    if(itemInfo.pItem) 
    {
    	var subTree = this.insertHelper(itemInfo.pItem, isExpand);
    	
    	if(itemInfo.pos == undefined) subTree.append(item);
    	else 
    	{
    		var target = subTree.children().eq(itemInfo.pos);
    		if(target[0]) item.insertBefore(target);
    		else subTree.append(item);
    	}
    }
    
    //루트 바로 밑의 아이템은 좌측 여백을 조정한다.
    else 
    {
    	item.css('margin-left', '5px');
    	this.$root.append(item);
    }
    
    //히스토리 사용시
    if(this.option.useHistory)
	{
		var info = {
			targets: item,
			undoData: {},
			redoData: {treeParent: item.parent()},//{treeParent: item.parent(), next: item.next('li')}
			isMerge: mergeHistory,
		};
		this.historyManager.reg(info,
		function(undoObj)
		{
			var targets = undoObj.targets;
			var undoData = undoObj.undoData;
			
			this.redoStack.append(targets);
		},
		function(redoObj)
		{
			var targets = redoObj.targets;
			var redoData = redoObj.redoData;
			
			redoData.treeParent.append(targets);
		});
		/*
		this.historyManager.reg(
			new ActionInfo('append', item[0], {treeParent: item.parent(), next: item.next('li')}, null),
			mergeHistory);*/
	}
    
    //this.itemClickManage(item);
    
    var itemDom = item[0]; 
    for(var key in itemInfo)
		itemDom[key] = itemInfo[key];
		
	this.aevent._select(itemDom);
	this.aevent._dblclick(itemDom);
	
    //드래그가 가능할때 드래그 시키기
    if(this.option.isDraggable)
    {
    	var cssLabel;
    	//맨 상위 루스는 드래그 안시킴
    	if(itemInfo.pItem)
    	{
			this.itemDragManage(itemDom);
		}
		
		if(itemInfo.isDrop)
		{
			this.aevent._drop(itemDom);
		}
    }
	
    return itemDom;
};


//트리 undo 히스토리 처리부분
ATree.prototype.undoTree = function()
{
	/*
	if(this.historyManager.getCurrentOffset() < 0) return;
	var historyDataArr = this.historyManager.getPosHistory(this.historyManager.getCurrentOffset());
	for(var i=historyDataArr.length-1; i>=0; i--)
	{
		var historyData = historyDataArr[i];
		switch(historyData.chgAct)
		{
			case 'append':
			{
				this.redoStack.append(historyData.chgTarget);
			}
			break;
			case 'remove':
			{
				if(historyData.oriVal.next)
				{
					$(historyData.chgTarget).insertBefore(historyData.oriVal.next);
				} 
				else historyData.oriVal.treeParent.append(historyData.chgTarget);
			}
			break;
			case 'move':
			{
				if(historyData.oriVal.next) $(historyData.chgTarget).insertBefore(historyData.oriVal.next);
				else historyData.oriVal.treeParent.append(historyData.chgTarget);
			}
			break;
			case 'text':
			{
				$(historyData.chgTarget).text(historyData.oriVal);
			}
			break;
			default:
			{
				
			}
			break;
		}		
	}
	this.historyManager.undo();	
	*/
	if(this.historyManager.getCurrentOffset() < 0) return;
	
	var historyDataArr = this.historyManager.getPosHistory(this.historyManager.getCurrentOffset());
	var history = null;
	for(var i=historyDataArr.length-1; i>=0; i--)
	{
		history = historyDataArr[i];
		history.undo.call(this, history.info);
	}
	
	this.historyManager.undo();
};

//트리 redo 히스토리 처리부분
ATree.prototype.redoTree = function()
{/*
	if(!this.historyManager.redo()) return; 
	var historyDataArr = this.historyManager.getPosHistory(this.historyManager.getCurrentOffset());
	for(var i=0; i<historyDataArr.length; i++)
	{
		var historyData = historyDataArr[i];
		switch(historyData.chgAct)
		{
			case 'append':
			{
				historyData.chgVal.treeParent.append(historyData.chgTarget);
			}
			break;
			case 'remove':
			{
				this.undoStack.append(historyData.chgTarget);
			}
			break;
			case 'move':
			{
				if(historyData.chgVal.next) $(historyData.chgTarget).insertBefore(historyData.chgVal.next);
				else historyData.chgVal.treeParent.append(historyData.chgTarget);
			}
			break;
			case 'text':
			{
				$(historyData.chgTarget).text(historyData.chgVal);
			}
			break;
			default:
			{
			}
			break;
		}
	}
	*/
	
	if(!this.historyManager.redo()) return;
	
	var historyDataArr = this.historyManager.getPosHistory(this.historyManager.getCurrentOffset());
	var history = null;
	for(var i=0; i<historyDataArr.length; i++)
	{
		history = historyDataArr[i];
		history.redo.call(this, history.info);
	}
};


// Removes the specified item from the control.
ATree.prototype.deleteItem = function(item, mergeHistory)
{
	
	//this.clearSelected();
	
    //부모 아이템 백업
    var pItem = item.pItem;
    
	if(this.option.useHistory)
	{
		var info = {
			targets: item,
			undoData: {treeParent: $(item).parent(), nextDom: $(item).next('li')[0]},
			redoData: {},
			isMerge: mergeHistory,
		};
		this.historyManager.reg(info,
		function(undoObj)
		{
			var targets = undoObj.targets;
			var undoData = undoObj.undoData;
			
			if(undoData.nextDom)
			{
				$(targets).insertBefore(undoData.nextDom);
			} 
			else undoData.treeParent.append(targets);
		},
		function(redoObj)
		{
			var targets = redoObj.targets;
			var redoData = redoObj.redoData;
			
			this.undoStack.append(targets);
		});
		
		this.undoStack.append(item);
		
		/*
		this.historyManager.reg(
    		new ActionInfo('remove', item, null, {treeParent: $(item).parent(), next: $(item).next('li')[0]} ),
    		mergeHistory);
		*/
		
	}
    else
    {
    	//아이템 삭제
    	$(item).remove();
    	//부모아이템이 존재하는 경우
    	if(pItem) this.deleteHelper(pItem);	
    }
    
};


//아이템 리네임
ATree.prototype.rename = function(item, name)
{
	if(this.option.useHistory)
	{
		this.historyManager.reg({
			targets: item,
			undoData: item.name,
			redoData: name,
			isMerge: true
		},
		function(undoObj)
		{
			var targets = undoObj.targets;
			var undoData = undoObj.undoData;
			
			$(targets).text(undoData);
		},
		function(redoObj)
		{
			var targets = redoObj.targets;
			var redoData = redoObj.redoData;
			
			$(targets).text(redoData);
		});
		/*
		this.historyManager.reg(
    	new ActionInfo('text', item, name, item.name),
    	true);*/
	}
    	
	item.name = name;
	$(item).children('label').text(name);
};

ATree.prototype.insertHelper = function(pItem, isExpand)
{
	var parentItem = $(pItem);
	var subTree = parentItem.children('ul');
	//li 하위의 ul --> <li><ul></ul></li>

	//처음 하위로 추가되는 경우
	if (subTree.length == 0) 
	{
		subTree = $(ATree.ulFormat);
		parentItem.append(subTree);
		this.expandEnable(parentItem, subTree, isExpand);
	}
	
	return subTree;
};

ATree.prototype.deleteHelper = function(pItem)
{
	var parentItem = $(pItem);
	var subTree = parentItem.children('ul');
	//li 하위의 ul --> <li><ul></ul></li>
	
	//더이상 하위 노드가 없는 경우
	if(subTree.children().length == 0) 
	{
		subTree.remove();
		this.expandDisable(parentItem);
	}
};


// Removes all items from the control.
ATree.prototype.deleteAllItems = function()
{
    this.selectedItems.length = 0;
	this.$root.children().remove();
};

//선택된 셀들의 배경색을 원래대로 돌려준다.
ATree.prototype.clearSelected = function()
{
    //선택되어져 있던 아이템들의 배경을 원상복귀 한다.
    for(var j = 0; j < this.selectedItems.length; j++) 
    {
    	$(this.selectedItems[j]).children('label').removeClass(this.selectStyle);
    }
    
    //선택 목록에서 모두 제거
    this.selectedItems.length = 0;
};


//가장 마지막에 클릭한 아이템을 리턴
ATree.prototype.getClickedItem = function()
{
	return this.clickedItem;
};

//바로 위 아이템을 선택
ATree.prototype.selectPrevItem = function(doScroll)
{
	if(this.clickedItem)
	{
		var prevItem = AUtil.findPrevByTagName(this.clickedItem, 'li');
		if(prevItem)
		{
			this.lastSelectedItem = prevItem;
			this.selectItem(prevItem);
			this.scrollToItem(prevItem);
		}	
	}
};

//바로 아래 아이템을 선택
ATree.prototype.selectNextItem = function(doScroll)
{
	if(this.clickedItem)
	{
		var nextItem = Util.findNextByTagName(this.clickedItem, 'li');
		if(nextItem)
		{
			this.lastSelectedItem = nextItem;
			this.selectItem(nextItem);
			this.scrollToItem(nextItem);
		}	
	}
};

//아이템이 현재 선택되어 있는지를 체크하고 선택되어 있으면 포지션을 리턴한다.
ATree.prototype.getSelectedIndex = function(item)
{
	for(var i=0; i<this.selectedItems.length; i++)
		if(this.selectedItems[i] === item)	return i; 
	
	return -1;
};

//해당 아이템을 디셀렉트 시킨다.
ATree.prototype.deselectItem = function(item)
{
	var thisObj = this;
	var desIndex = this.getSelectedIndex(item);
	
	if(desIndex<0) return false;
	
	$(item).children('label').removeClass(this.selectStyle);
	/*
	$(item).children('label').css(
    {
        'background-color' : thisObj.option.bgColor,
    	'color' : thisObj.option.textColor
    });
    */
    this.selectedItems.splice(desIndex, 1);
    
    return true;
};

ATree.prototype.expandItem = function(item, isExpand)
{
    var btn = $(item).children('.tree-expand');
	var subTree = $(item).children('ul');
	
	var _expanded = subTree.is(':visible');
	
	if(isExpand===_expanded) return;

	if(isExpand)
	{        
		btn.addClass('expanded'); //btn.text('-');
        subTree.show();
    }
    else
    {
    	btn.removeClass('expanded'); //btn.text('+');
		subTree.hide();
    }
	
	if(this.delegator) this.delegator.itemExpandManage(isExpand, item);

	/*	
	switch(type)
	{
		case ATree.EXPAND_ALL:
		break;
		
		case ATree.EXPAND_CHILD:
		break;
		
		case ATree.EXPAND_COLLAPSE:
		break;
	}
	*/
};

//data로 item 을 찾는다.
//바로 자식 아이템에서만 찾는다.
ATree.prototype.findChildItemByData = function(data, pItem, compare)
{
    var ret = null;
	
	if(compare)
	{
		this.getChildItems(pItem).each(function()
		{
			if(compare(this.data, data))
			{
				ret = this;
				return false;
			}
		}); 
	}
	
	else
	{
		this.getChildItems(pItem).each(function()
		{
			if(this.data == data)
			{
				ret = this;
				return false;
			}
		});
	}
    
    return ret;	
};

//name 으로 item 을 찾는다.
//바로 자식 아이템에서만 찾는다.
ATree.prototype.findChildItemByName = function(name, pItem)
{
    var ret = null;
    
    this.getChildItems(pItem).each(function()
    {
        if (this.name == name)
        {
            ret = this;
            return false;
        }
    }); 
    
    return ret;
};


//data로 item 을 찾는다.
//pItem 밑으로 모든 아이템에서 찾는다.
ATree.prototype.findItemByData = function(data, pItem, compare)
{
    var ret = null, $start = pItem ? $(pItem) : this.$root;
	
	if(compare)
	{
		$start.find('li').each(function()
		{
			if(compare(this.data, data))
			{
				ret = this;
				return false;
			}
		}); 
	}
	
	else
	{
		$start.find('li').each(function()
		{
			if(this.data == data)
			{
				ret = this;
				return false;
			}
		}); 
	}

    
    return ret;
};

//name 으로 item 을 찾는다.
//pItem 밑으로 모든 아이템에서 찾는다.
ATree.prototype.findItemByName = function(name, pItem)
{
    var ret = null, $start = pItem ? $(pItem) : this.$root;

    $start.find('li').each(function()
    {
        if (this.name == name)
        {
            ret = this;
            return false;
        }
    }); 
    
    return ret;
};

/*
ATree.prototype.getChildItems = function(pItem)
{
    var ret = new Array();
    var start = pItem ? $(pItem) : this.$root;

    start.children('ul').children('li').each(function()
	//start.children().each(function()
    {
    	ret.push(this);
    });
    return ret;
};
*/


//asoocool
//2017년 6월 13일 새롭게 수정한 버전
// $root 는 <ul> 이다.... 루트도 <li>가 되도록 구조 변경하기
//다른 하위 아이템은 <li>
ATree.prototype.getChildItems = function(pItem)
{
	if(pItem) return $(pItem).children('ul').children('li');
	else return this.$root.children('li');
};

ATree.prototype.getFirstChildItem = function(pItem)
{
	return this.getChildItems(pItem).first()[0];
};

ATree.prototype.getLastChildItem = function(pItem)
{
	return this.getChildItems(pItem).last()[0];
};


ATree.prototype.isMovePossible = function(moveItem, pItem)
{
    var ret = true;

    this.getChildItems(pItem).each(function()
    {
		if ((this.name == moveItem.name) && (moveItem.pItem !== pItem))
        {
            ret = false;
            return false;
        }
    }); 
    
    return ret;
};

ATree.prototype.findItemsByNameLike = function(name, pItem)
{
    var ret = [];
    var start = pItem ? $(pItem) : this.$root;

    start.find('li').each(function()
    {
		//BKS/20171213
        //if (this.name.toUpperCase().indexOf(name.toUpperCase())>-1)
		if (this.textContent.toUpperCase().indexOf(name.toUpperCase())>-1)		
        {
            ret.push(this);
        }
    }); 
    
    return ret;
};

//getParent함수명변경 - JH
ATree.prototype.getParentItem = function(item)
{
	if(item) return item.pItem;
};

ATree.prototype.getChildren = function(pItem, callback)
{
    this.getChildItems(pItem).each(callback); 
};

ATree.prototype.expandEnable = function(expItem, subTree, isExpand)
{
    //접기,펴기 버튼 활성화
    var btn = expItem.children('.tree-expand'), thisObj = this;
    
    btn.css('visibility', 'visible');

    if(isExpand)
	{
		btn.addClass('expanded'); //btn.text('-');
	} 
    else
    {
        btn.removeClass('expanded'); //btn.text('+');
        subTree.hide();
    }

    //접기,펴기 버튼 클릭 처리    
	btn.bind('click', function()
    {
		var _isExpand = !subTree.is(':visible');
		
        if (_isExpand)
        {
            btn.addClass('expanded'); //$(this).text('-');
            subTree.show();
        }
        else
        {
            btn.removeClass('expanded'); //$(this).text('+');
            subTree.hide();
        }
		
		if(thisObj.delegator) thisObj.delegator.itemExpandManage(_isExpand, expItem[0]);
    });
};

ATree.prototype.expandDisable = function(expItem)
{
    //접기,펴기 버튼 비활성화
    var btn = expItem.children('.tree-expand');
    btn.unbind('click');	
    btn.css('visibility', 'hidden');
};

	
//item 으로 트리를 선택한다.
ATree.prototype.selectItem = function(item, isMulti, e)//li
{
	var thisObj = this;
	
	this.clickedItem = item;
	
	if(this.option.isSingleSelect || !isMulti )
	{
		this.clearSelected();
	} 
	
	if(e && e.shiftKey)
	{
		//루트 아이템이 포함되어 있으면 시프트 선택 안되도록 막기
		if(this.isExistRoot() || !item.pItem) return;
		
		$(item).children('label').addClass(this.selectStyle);
		var selArr = this.$ele.find('.'+this.selectStyle);
		this.itemSelectRange(item);
	}
	else
	{
		$(item).children('label').addClass(this.selectStyle); 
		this.lastSelectedItem = item;
	}
	
	this.selectedItems = new Array();
	this.$ele.find('.'+this.selectStyle).each(function(i, el){
		//하나의 아이템에 선택 클래스를 추가하는 label이 2개라서
		//selectedItems에 같은 내용이 2개 생겨 svn에서 제외메뉴 처리가 되어 수정
		if(thisObj.getSelectedIndex(el.parentNode) < 0)
			thisObj.selectedItems.push(el.parentNode);
	});
	//this.selectedItems.push(item);
};

ATree.prototype.isExistRoot = function()
{
	for(var i = 0; i<this.selectedItems.length; i++)
	{
		if(!this.selectedItems[i].pItem) return true;
	}
	return false;
};

ATree.prototype.itemSelectRange = function(oneItem)
{
	var totLab = this.$root.find('label');
	var oneLab = $(oneItem).children('label')[0];
	var twoLab = $(this.lastSelectedItem).children('label')[0];
	$(twoLab).addClass(this.selectStyle);
	
	//같은 item을 선택했을시 리턴시킴 
	if((this.clickedItem === this.lastSelectedItem) || (oneLab === twoLab)) return;
	
	var tempLab = null;
	var checkLab = null;
	
	//루트 label은 건너뛰고 1부터 시작
	for(var i = 1; i<totLab.length; i++)
	{
		tempLab = totLab[i];
		if(!checkLab)
		{
			if(tempLab == oneLab) checkLab = twoLab; 
			else if(tempLab == twoLab) checkLab = oneLab;	
		}
		else
		{
			$(tempLab).addClass(this.selectStyle);
			if(tempLab == checkLab) break;
		}
	}
	
	
	/*
	var nextItem = null;
	var subTree = $(firstItem).children('ul');

	if(subTree.length == 0) nextItem = $(firstItem).next('li')[0];
	else nextItem = subTree.children('li').first()[0];
	
	if(nextItem)
	{
		if(nextItem == lastItem) return;
		$(nextItem).children('label').addClass(this.selectStyle);
		this.itemSelectRange(nextItem, lastItem);
	}
	*/
};

//clkObj is li
//기본적으로 mousedown 시  바로 선택
//ctrl, shift 키가 눌려졌을 경우는 mouseup 시 선택
//선택되어져 있는 아이템을 다시 선택하는 경우는 mouseup 시 선택 
ATree.prototype.itemClickManage = function(clkEle)
{
    var thisObj = this, clkObj = $(clkEle);
	
    clkObj.mousedown(function(e) 
    {
		
		AComponent.setFocusComp(thisObj);
		
    	//mouse left button
    	if(e.which==1)
        {
        	if(e.ctrlKey || thisObj.getSelectedIndex(clkObj[0])>-1) 
        	{
        		thisObj.upSelect = true;
        		//return false;
        	}
        	else
        	{
        		thisObj.selectItem(this, e.ctrlKey, e);
				
				thisObj.reportEvent('select', this, e);
        	} 
                        	
            //return false;
			e.stopPropagation();
    	}
    });
	
    //contextMenu plug-in 사용을 위해 따로 분리 bind('contextmenu')
    clkObj.mouseup(function(e) 
    {
    	//mouse left button
    	if(e.which==1)
    	{
    		if(thisObj.upSelect)
    		{
    			if(thisObj.getSelectedIndex(clkObj[0])>-1 && e.ctrlKey) thisObj.deselectItem(this);
    			else
    			{
    				thisObj.selectItem(this, e.ctrlKey, e);
    			} 
    			
				thisObj.reportEvent('select', this, e);
    		}

    		thisObj.upSelect = false;
    	}

        //mouse right button
        else if(e.which==3) 
        {
   			if(thisObj.getSelectedIndex(clkObj[0])<0)
   				thisObj.selectItem(this, e.ctrlKey, e);
  
  			thisObj.reportEvent('select', this, e);
			
       		//return false;
			e.stopPropagation();
        }
    });
    
};

ATree.prototype.itemDragManage = function(dragEle)
{
	var thisObj = this;
	
	$(dragEle).draggable(
	{
		scope: thisObj.dnd_scope,
		helper: function(e)
		{
			var temp = $('<div></div>');
			temp.css(
			{
				color:'white',
				'height': '8px',
				'width': '20px',
				'height': '20px',
				'background': '100% 100% no-repeat url('+thisObj.option.dragIcon+')',
				'border-radius': '5px',
				'text-align': 'center',
				'opacity': '0.9'
			});
			temp.text(thisObj.selectedItems.length);
			return temp;
		},
		
		cursorAt: { left:0, top:10 },
		
		start: function(e)
		{
			thisObj.upSelect = false;
		},
		
		stop: function(e)
		{
			window.clearTimeout(thisObj.dropTimer);
    	}
	});

};

ATree.prototype.itemDropManage = function(dropEle)
{
	var $dropEle = $(dropEle);
	var dropItem = $dropEle.children('label'), thisObj = this;
	
	dropItem.css('display', 'inline-block');
	dropItem.droppable(
	{
		scope: thisObj.dnd_scope,
		over: function(e, ui)
		{
			thisObj.dropTimer = window.setTimeout(function()
			{
				if(dropEle.icon == Define.ITEM_FOLDER || dropEle.isGroup)
				{
					dropItem.removeClass(thisObj.overStyle);
					dropEle.isAfter = true;
					
					$dropEle.addClass(thisObj.afterStyle);	
				}
	      				
			}, 1500);
	      			
			$(this).addClass(thisObj.overStyle);
		},
		
	    out: function(e, ui)
	    {
	    	window.clearTimeout(thisObj.dropTimer);
	    	dropEle.isAfter = false;
			
	    	$dropEle.removeClass(thisObj.afterStyle);
	    	$(this).removeClass(thisObj.overStyle);
	  	},
	
	  	drop: function(e, ui)
	  	{ 
	  		window.clearTimeout(thisObj.dropTimer);

	  		$(this).removeClass(thisObj.overStyle);
	  		//드롭하는 대상이 선택되어 있거나, 부모가 선택되어 있으면 이동시키지 않음
	  		if($(this).hasClass(thisObj.selectStyle) || $($(this).parent()[0].pItem).children('label').hasClass(thisObj.selectStyle)) return;
	  				
	  		$dropEle.removeClass(thisObj.afterStyle);
	  		
			thisObj.reportEvent('drop', {dropItem: dropEle, dragItems: thisObj.selectedItems}, e);
			
	       	//if(thisObj.mListeners.dropListener) thisObj.mListeners.dropListener({dropItem: dropEle, dragItems: thisObj.selectedItems});
        	//else thisObj.moveItem(dropEle, thisObj.selectedItems, ((dropEle.icon > Define.ITEM_FOLDER) || dropEle.isAfter));

        	dropEle.isAfter = false;
	  	}
	});
};

ATree.prototype.keyDownManage = function(e)
{

	var selItem = this.getClickedItem();
	switch(e.which)
	{
		case Define.KEY_UP:
			e.preventDefault();
			this.selectPrevItem(true);
		break;
		
		case Define.KEY_LEFT:
			e.preventDefault();
			if($(selItem).children('ul') && $(selItem).children('ul').is(":visible"))
			{
				this.expandItem(selItem, false);
				this.scrollToItem(selItem);
			}
			else if(selItem.pItem)
			{
				this.selectItem(selItem.pItem);
				this.scrollToItem(selItem.pItem);
			}
		break;
		
		case Define.KEY_DOWN: 
			e.preventDefault();
			this.selectNextItem(true);
		break;
		
		case Define.KEY_RIGHT: 
			e.preventDefault();
			this.expandItem(selItem, true);
			this.scrollToItem(selItem);
		break;
	}
};


ATree.prototype.scrollToItem = function(item)
{
	var height = this.$ele.height();
	var top = this.$ele.offset().top
	
	//아이템이 트리보다 위
	if($(item).offset().top < top)
	{
		//현재 스크롤top - ( 트리top - 아이템top + 10 )
		this.$ele.scrollTop(this.$ele.scrollTop() - (top - $(item).offset().top + 10));
	}
	//아이템이 트리보다 아래
	else if($(item).offset().top > top+height-30)
	{
		//현재 스크롤top + ( 아이템top - ( 트리top + 트리height ) + 30 )
		this.$ele.scrollTop(this.$ele.scrollTop()+($(item).offset().top-(top+height)+30));
	}
};
