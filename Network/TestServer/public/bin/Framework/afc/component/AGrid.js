/**
* 기본 그리드 객체 입니다.
*
* @class AGrid
* @constructor
*/

function AGrid()
{
	AComponent.call(this);
	
	//선택된 셀,행 집합
    this.selectedCells = new Array();
	
	// shift로 선택한 셀 목록
	this.shiftSelectedCells = [];
    
	//스크롤 복원값
    this.savedScrollPos = -1;
	this.isScrollVisible = false;
	
	//그리드 터치시 상위로 이벤트 전달 여부
	this.isStoppagation = true;
	
	//그리드 선택시 addClass Name
	this.selectStyleName = null;
	
	// 그리드 옵션
	this.option =
    {
        isSingleSelect: true,      	//ctrl 키를 누르고 선택해도 하나만 선택된다. 
        isFullRowSelect: false,     //특정 cell 을 클릭해도 그 row 전체가 선택된다.
        isSelectable : false,		//선택 [불]가능 옵션 플래그
        isRClickSelect: false,      //우클릭으로 선택 가능한지
        isHideHeader : false,		//헤더를 숨길지
		isFlexibleRow : false,		//TR의 높이를 TABLE 높이에 풀로 맞춤
		isClearRowTmpl: false		//그리드 초기화 후 Template 로우를 그대로 보존할 지
    };
	
	
	this.columnCount = 0;		//컬럼 개수
	this.hRowTmplHeight = 0;	//헤더 로우들의 높이 합
	this.rowTmplHeight = 0;		//바디 템플릿 로우들의 높이 합
	//---------------------------------
	
	//자체적인 스크롤 구현
	this.scrlManager = null;
	
	//그리드 리얼 관련
	this.realMap = null;
	this.realField = null;
	
	this.scrollComp = null;
	
	//text size auto shrink info
	this.shrinkInfo = null;
	
	//바디 상단선 높이(isHideHeader?1:0)
	
	this.isCheckScrl = !((afc.isSimulator && afc.isHybrid) || afc.isMobile || window._afc);
	this.lastSelectedCell = true;
}
afc.extendsClass(AGrid, AComponent);

AGrid.CONTEXT = 
{
    tag: '<div data-base="AGrid" data-class="AGrid" data-flag="0001" data-fullrow-select="true" data-selectable="true" data-clear-rowtmpl="true" class="AGrid-Style">\
			<table class="grid-header-table" align="center">\
				<colgroup><col><col><col></colgroup>\
				<thead align="center" class="head-prop">\
					<tr height="22px"><td>col1</td><td>col2</td><td>col3</td></tr>\
				</thead>\
			</table>\
			<div class="grid-scroll-area">\
				<table class="grid-body-table" align="center">\
					<colgroup><col><col><col></colgroup>\
					<thead align="center" class="head-prop">\
						<tr height="22px"><td>col1</td><td>col2</td><td>col3</td></tr>\
					</thead>\
					<tbody align="center" class="body-prop">\
						<tr height="22px"><td>data 1,1</td><td>data 1,2</td><td>data 1,3</td></tr>\
					</tbody>\
				</table>\
			</div>\
		</div>' ,
    
    defStyle: 
    {
        width:'400px', height:'300px'
    },
    
    events: ['dblclick', 'longtab', 'select', 'scrolltop', 'scrollbottom']
};



AGrid.prototype.initVariables = function()
{
	//--------------------------------------------------
	//	관리 변수 세팅
	//--------------------------------------------------

	this.headerTable = this.$ele.find('.grid-header-table');
	this.bodyTable = this.$ele.find('.grid-body-table');
	this.scrollArea = this.bodyTable.parent();
	
	//this.headerTable.css('z-index', 1);
	//this.scrollArea.css('z-index', 0);
	
	this.showThead = this.headerTable.find('thead');
    this.hideThead = this.bodyTable.find('thead');
	this.hideThead.css('visibility', 'hidden' );
	
	//tbody 태그는 자주 쓰이므로 변수로 저장해 둔다.
	this.tBody = this.bodyTable.find('tbody');
	
	

	//-------------------------------------------------
	//	반복적으로 추가할 템플릿을 복제하여 생성
	//-------------------------------------------------
	
	//헤더 row(tr) 템플릿
	this.$hRowTmpl = this.showThead.children();
	//바디 row(tr) 템플릿, 삭제되므로 복제해 둔다.
	this.$rowTmpl = this.tBody.children().clone();
	
	//로우 템플릿을 얻은 후 삭제한다.
	this.tBody.children().remove();
	
	//컬럼 개수
    this.columnCount = this.$hRowTmpl.eq(0).children().length;
	
	//바디 로우 템플릿의 높이를 구해둔다.
	for(var i=0; i<this.$rowTmpl.length; i++)
		this.rowTmplHeight += parseInt(this.$rowTmpl.eq(i).attr('height'), 10);
	
	//헤더 로우 템플릿의 높이를 구해둔다.
	for(var i=0; i<this.$hRowTmpl.length; i++)
		this.hRowTmplHeight += parseInt(this.$hRowTmpl.eq(i).attr('height'), 10);

};

AGrid.prototype.createElement = function(context)
{
	AComponent.prototype.createElement.call(this, context);
	
	
	this.initVariables();
	
};


//--------------------------------------------------------------------------------------------------------------
//	그리드 구현 기본 알고리즘
//	[헤더] 역할을 하는 <header table> 은 <tbody> 부분이 없으며 최상단으로 띄운다.
//	[바디] 역할을 하는 <table> 은 <thead> 부분을 invisible 시켜 [헤더 table] 밑으로 들어가게 한다.  

AGrid.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//this.initVariables();
	
	//----------------------------------------------------    
	//	옵션값 셋팅
	//----------------------------------------------------
    
	this.setOption({
		isHideHeader : this.$ele.attr('data-hide-header'),
		isSingleSelect : this.$ele.attr('data-single-select'),
		isFullRowSelect : this.$ele.attr('data-fullrow-select'),
		isRClickSelect : this.$ele.attr('data-rclick-select'),
		isSelectable : this.$ele.attr('data-selectable'),
		isFlexibleRow : this.$ele.attr('data-flexible-row'),
		isClearRowTmpl : this.$ele.attr('data-clear-rowtmpl')		//그리드 초기화 후 Template 로우를 그대로 보존할 지
	});

	//개발 시점에 추가되는 그리드는 무조건 보여져야 하므로 옵션을 비교하지 않는다.
	//if(!window._afc && this.option.isClearRowTmpl) this.tBody.children().remove();
	//row tmpl 을 데이터로 사용하는 경우 fullRowSelect 를 해제한다.
	//else this.option.isFullRowSelect = false;

	//if(this.option.isFlexibleRow) this.setFlexibleRow();
	
	//-----------------
	//	select style
	if(!window._afc)
	{
		this.selectStyleName = this.$ele.attr('data-select-class');
		if(!this.selectStyleName) this.selectStyleName = 'agrid_select';
	}
	
	//this.escapePreventTouch();
	
	var thisObj = this;

	if(this.option.isHideHeader) this.hideHeader();
	
	else
	{
		//this.scrollArea.css('border-top', '1px solid transparent');
		this.showHeader();
		
		if(this.option.isSelectable)
		{
			this.showThead.children().each(function()
			{
				$(this).children().each(function()
				{
					this.isHeader = true;
					thisObj.regCellEvent($(this));
				});
			});
		}
	}

	this.loadGridDataMask();
	this.loadGridShrinkInfo();

	this.actionToFocusComp();
	
	
	if(window._afc || !this.option.isClearRowTmpl) 
	{
		// 개발상태에서 reload Comp시에 로우셋이 또 추가되기 때문에 제거한다.
		this.removeAll();
		this.addRow([]);
	}
	/*	basicStyle.css 에 추가
	if(!context)
	{
		this.tBody.children().children('td').css('border', '1px solid #c2c2c2');
		this.showThead.children().children('td').css('border', '1px solid #c2c2c2');
		this.hideThead.children().children('td').css('border', '1px solid #c2c2c2');
	}
	*/
	if(this.option.isFlexibleRow)
		this.setFlexibleRow(this.option.isFlexibleRow);
};

AGrid.prototype.layComponent = function(acomp, row, col, width, height)
{
	if(width==undefined) width = '100%';
	if(height==undefined) height = '100%';
	
	acomp.$ele.css(
	{
		'position': 'static',
		//'position': 'relative',
		//'left': '0px', 'top':'0px',
		'width': width, 'height': height
	});

	$(this.getCell(row, col)).append(acomp.$ele);
};


AGrid.prototype.layHeaderComponent = function(acomp, row, col, width, height)
{
	if(width==undefined) width = '100%';
	if(height==undefined) height = '100%';
	
	acomp.$ele.css(
	{
		'position': 'static',
		//'position': 'relative',
		//'left': '0px', 'top':'0px',
		'width': width, 'height': height
	});

	$(this.getHeaderCell(row, col)).append(acomp.$ele);
};


AGrid.prototype.getAllLaiedComps = function()
{
	var retArr = [],
		$td = this.tBody.children().children();
	
	$td.each(function()
	{
		$(this).children().each(function()
		{
			retArr.push(this.acomp);
		});
	});
	
	return retArr;
};


AGrid.prototype.setScrollArrow = function(headHeight)
{
	var sa = new ScrollArrow();
	sa.setArrow('vertical');
	sa.apply(this.scrollArea[0]);
	
	if(!headHeight)
	{
		if(this.option.isHideHeader) headHeight = 5;
		else headHeight = this.hRowTmplHeight+5;
	}
	sa.arrow1.css('top', headHeight+'px');
};

AGrid.prototype.getDataMask = function(rowIdx, colIdx)
{
	if(rowIdx == undefined || colIdx == undefined) return;
	
    var $row = null;
    if(typeof(rowIdx)=="number")
	{
		if(rowIdx >= this.$rowTmpl.length) rowIdx %= this.$rowTmpl.length;
		$row = this.$rowTmpl.eq(rowIdx); //tbody tr
	}
    else $row = $(rowIdx);
	
	return AComponent.prototype.getDataMask($row.children().get(colIdx));
};

AGrid.prototype.loadGridDataMask = function()
{
	if(this.$rowTmpl)
	{
		var $cells, i, j;

		for(i=0; i<this.$rowTmpl.length; i++)
		{
			$cells = this.$rowTmpl.eq(i).children();

			for(j=0; j<$cells.length; j++)
			{
				this.loadDataMask($cells[j], this);
			}
		}
	}

};

AGrid.prototype.loadGridShrinkInfo = function()
{
	if(this.$rowTmpl)
	{
		var $cells, i, j;

		for(i=0; i<this.$rowTmpl.length; i++)
		{
			$cells = this.$rowTmpl.eq(i).children();

			for(j=0; j<$cells.length; j++)
			{
				if($cells[j].style.display != 'none')
				{
					this.loadShrinkInfo($cells[j]);
				}
			}
		}
	}

};

AGrid.prototype.setFlexibleRow = function(enable)
{
	if(enable)
	{
		this.bodyTable.css('height', '100%');
		this.$rowTmpl.css('height', 'auto');
		this.tBody.find('tr').css('height', 'auto');
		this.scrollArea.css('overflow-y', 'visible');
 		this.scrollArea.css('overflow-x', '');
	}
	else
	{
		this.bodyTable.css('height', 'auto');
		this.$rowTmpl.css('height', '');	//this.$rowTmpl.height()+'px');
		this.tBody.find('tr').css('height', '');
		this.scrollArea.css('overflow-y', 'auto');
 		this.scrollArea.css('overflow-x', 'hidden');
	}
	this.option.isFlexibleRow = enable;
};

/*
AGrid.prototype.transForPivot = function()
{
	this.$ele.append(this.bodyTable);
	this.scrollArea.remove();
	this.scrollArea = null;
};
*/

AGrid.prototype.enableScrlManager = function(leftSyncArea, rightSyncArea)
{
	if(this.scrlManager) return;

	var thisObj = this;
	
	this.scrlManager = new ScrollManager();
	
	//we must delete this option on this mode.
	this.scrollArea.css('-webkit-overflow-scrolling', '');	//ios overflow-scrolling delete
	
	this.scrollImplement(leftSyncArea, rightSyncArea);
	this.aevent._scroll();
};


AGrid.prototype.applyBackupScroll = function()
{
	if(this.bkManager) return this.bkManager.applyBackupScroll();
};


AGrid.prototype.setScrollComp = function(acomp)
{
	this.scrollComp = acomp;
	
};

AGrid.prototype.scrollImplement = function(leftSyncArea, rightSyncArea) 
{
	var thisObj = this;
	
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	var scrlArea = this.scrollArea[0],
		transTop, scrlEle = null, leftEle = null, rightEle = null, compEle = null, 
		scrlFunc = _scrlHelper, initFunc = _initHelper;
		
	//--------------------------------------------------------
	//	scroll 그리드 
	
	//touch start
	AEvent.bindEvent(scrlArea, AEvent.ACTION_DOWN, function(e)
	{
		//다른 그리드로부터 touchstart 가 발생했음을 통보 받은 경우
		if(e.userData)
		{
			//thisObj.scrlManager.initScroll(0);
			thisObj.scrlManager.initScroll(e.changedTouches[0].clientY);
			
			return;
		}
	
		isDown = true;
		
		e.preventDefault();
		
		//자신의 스크롤 매니저가 구동의 주체가 아닌 경우
		//다른 그리드에게 알려준다.
		if(!thisObj.scrlManager.scrlTimer)
		{
			e.userData = true;
			if(leftSyncArea) AEvent.triggerEvent(leftSyncArea, AEvent.ACTION_DOWN, e);
			if(rightSyncArea) AEvent.triggerEvent(rightSyncArea, AEvent.ACTION_DOWN, e);
		}
		
		thisObj.scrlManager.initScroll(e.changedTouches[0].clientY);
		
		//asoocool test
		initFunc();
	});
	
	//touch move
	AEvent.bindEvent(scrlArea, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		thisObj.scrlManager.updateScroll(e.changedTouches[0].clientY, scrlFunc);
	});
	
	//touch end
	AEvent.bindEvent(scrlArea, AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		e.preventDefault();
		
		thisObj.scrlManager.scrollCheck(e.changedTouches[0].clientY, scrlFunc);
	});
	
	function _initHelper()
	{
		if(thisObj.scrollComp)
			transTop = thisObj.scrollComp.getPos().top + scrlArea.scrollTop;
	}
	
	function _scrlHelper(move)
	{
		if(move==0) return true;
		
		var oldTop = scrlArea.scrollTop;

		//scrollComp 는 css 값을 셋팅하기 때문에 똑같이 맞춰주기 위해 소수점을 버림.
		if(thisObj.scrollComp) move = parseInt(move);
		
		scrlArea.scrollTop += move;

		if(leftSyncArea) leftSyncArea.scrollTop = scrlArea.scrollTop;
		if(rightSyncArea) rightSyncArea.scrollTop = scrlArea.scrollTop; 
		
		if(oldTop==scrlArea.scrollTop) return false;
		
		if(thisObj.scrollComp)
		{
			thisObj.scrollComp.setStyle('top', (transTop-scrlArea.scrollTop)+'px');
		}
		
		return true;
	}
	
	function _moveHelper(ele)
	{
		ele.style.webkitTransition = 'all 0.1s linear';
		ele.style.webkitAnimationFillMode = 'forwards';
  		ele.style.webkitTransform = 'translateY(' + ele.transY + 'px)';
	}
	
};


AGrid.prototype.scrollTopManage = function()
{
	//트랜지션 기능을 사용하는 경우는 자체적으로 호출되므로 다시 해주면 안됨.
	if(this.scrlManager) this.scrlManager.stopScrollTimer();
	
//console.log('top rowCount : '+this.getRowCount());

	if(this.bkManager && this.bkManager.checkHeadBackup()) return false;
	else return true;
};

AGrid.prototype.scrollBottomManage = function()
{
	//트랜지션 기능을 사용하는 경우는 자체적으로 호출되므로 다시 해주면 안됨.
	if(this.scrlManager) this.scrlManager.stopScrollTimer();

//console.log('bottom rowCount : '+this.getRowCount());

	if(this.bkManager && this.bkManager.checkTailBackup()) return false;
	else return true;
};

//----------------------------------------------------------------
//   add/remove   
//----------------------------------------------------------------

//하나의 row 를 삽입한다. 
AGrid.prototype.moveRow = function(fromRow, toRow)
{
	if(typeof(fromRow)=="number") fromRow = $(this.getRow(fromRow));
	else fromRow = $(fromRow);

	if(typeof(toRow)=="number") toRow = $(this.getRow(toRow));
	else toRow = $(toRow);

   	toRow.before(fromRow);
};

//rowData : [1,2,3,'abc']
//하나의 row 를 추가한다.
AGrid.prototype.addRow = function(rowData)
{
	var row = this.createRow(rowData);
	
	if(this.bkManager && this.bkManager.appendItemManage(row) )
	{
		return row;
	}
	
	this.tBody.append(row);
	
	if(afc.isPC) this.checkScrollbar(true);
    
    return row;
};

//하나의 row를 상단에 추가한다.
AGrid.prototype.prependRow = function(rowData)
{
	var row = this.createRow(rowData);
	
	if(this.bkManager && this.bkManager.prependItemManage(row) ) return row;
	
	this.tBody.prepend(row);
	
	if(afc.isPC) this.checkScrollbar(true);
	
    return row;
};

//하나의 row 를 삽입한다. 
AGrid.prototype.insertRow = function(nRow, rowData)
{
	var row = this.createRow(rowData);
	
	if(typeof(nRow)=="number") 
		nRow = this.getRow(this.$rowTmpl.length * nRow);
	
   	$(nRow).before(row);
	
	if(afc.isPC) this.checkScrollbar(true);
    
    return row;
};

AGrid.prototype.removeRow = function(rowIdx)
{
	if(typeof(rowIdx)=="number") $(this.getRow(rowIdx)).remove();
	else $(rowIdx).remove();
	
    if(afc.isPC) this.checkScrollbar(false);
    
    /*	차후에 처리 필요
    if(this.bkManager)
    {
    	
    }
    */
};


AGrid.prototype.removeHeaderRow = function(rowIdx)
{
	if(typeof(rowIdx)=="number") 
	{
		this.showThead.children().eq(rowIdx).remove();
		this.hideThead.children().eq(rowIdx).remove();
	}
	else $(rowIdx).remove();
};



AGrid.prototype.removeFirst = function()
{
	this.tBody.children().first().remove();
	
    if(afc.isPC) this.checkScrollbar(false);
};

AGrid.prototype.removeLast = function()
{
	this.tBody.children().last().remove();
	
    if(afc.isPC) this.checkScrollbar(false);
};


//로우셋에 데이터를 넣고 싶은경우 호출
AGrid.prototype.addRowWithData = function(rowData, data)
{
	var rows = this.addRow(rowData);
	if(data == null) data = rowData;
	var cellIdx = 0;
	
	if(this.option.isFullRowSelect)
	{
		//deprecated
		rows.get(0).oridata = data;
		
		//아래처럼 구현하는 단일함수로 만들기 
	}
	else
	{
		for(var i = 0; i < rows.length; i++)
		{
			var row = $(rows[i]);
			var children = row.children();
			for(var j = 0; j < children.length; j++)
			{
				//if(!children.eq(j).attr('data-span'))
				
				if(children[j].style.display != 'none')
					this.setCellData(row, j, data[cellIdx++]);
			}
		}
	}
	
	return rows;
};


AGrid.prototype.getDataByOption = function(rowInfo)
{
	if(this.option.isFullRowSelect)
	{
		if(rowInfo.get(0).oridata) return rowInfo.get(0).oridata;
		else
		{
			var retData = new Array();
			var tdArr = null;
			for(var i = 0; i<rowInfo.length; i++)
			{
				tdArr = rowInfo.eq(i).children();
				for(var j = 0; j<tdArr.length; j++)
					retData.push(tdArr.eq(j).text());	
			}
			return retData;
		}
	} 
	else return rowInfo[0].data;
};

/*
AGrid.prototype.getRowSetByIndex = function(idx)
{
	return this.$getRow(idx*this.$rowTmpl.length).get(0).rowset;
};
*/

AGrid.prototype.getRowSet = function(rowIdx)
{
	var rowSetLength = this.$rowTmpl.length,
		startIdx = rowSetLength*rowIdx;
	
	return $(this.getRows(startIdx, startIdx+rowSetLength));
};

//info값으로 로우 index가져오기
AGrid.prototype.getRowIndexByInfo = function(rowInfo)
{
	//return rowInfo.eq(0).index();
	
	return this.indexOfRow(rowInfo.eq(0));
};

//로우 또는 로우셋 데이터를 가져오기, 
//oridata 사용하는 것 없애기
AGrid.prototype.getRowDataByIndex = function(rowIdx)
{
	return this.tBody.children().get(rowIdx).oridata;
};

AGrid.prototype.removeRowSet = function(rowIdx)
{
	var rowSetLength = this.$rowTmpl.length,
		startIdx = rowSetLength*rowIdx;
	
	$(this.getRows(startIdx, startIdx+rowSetLength)).remove();
	
	if(afc.isPC) this.checkScrollbar(false);
};


AGrid.prototype.removeAll = function()
{
	this.tBody.children().remove();//tbody tr
	
	if(afc.isPC) this.checkScrollbar(false);
	
	if(this.bkManager) this.bkManager.clearAll();
	
	//4.3 안드로이드 로우셋 안지워지는 버그 대응
	if(afc.andVer<4.4 && this.scrollArea)
	{
		this.scrollArea.hide();
		var thisObj = this;
		setTimeout(function(){
			thisObj.scrollArea.show();
		},1);

	}
};

//	cellArr 은 selectCell 설명 참조.
//	$(cellArr) 이 코드는 cellArr 가 Array 나 jQuery 객체여도 동일하게 작동함
AGrid.prototype._addCell = function(cellArr)
{
    //새롭게 선택된 셀을 추가하고 배경 색을 바꾼다.
    this.selectedCells.push(cellArr);
    
	if(this.option.isFullRowSelect)
	{
		//td 에 직접 추가해야 하므로
		$(cellArr).children().addClass(this.selectStyleName);
	}
	
	//cellArr 가 Array 나 jQuery 객체여도 동일하게 작동함
	else $(cellArr).addClass(this.selectStyleName);
};


//----------------------------------------------------------------
//   select cell  
//----------------------------------------------------------------

//	isFullRowSelect 가 참이면 cellArr 은 tr element 의 array or jQuery 집합.
//	rowSet 이 여러개인 경우 인 경우 여러개의 row 객체들을 가지고 있다.

//	cellArr 는 element 를 담고 있는 배열이거나 jQuery 집합 객체이다.
//	그룹지어야 할 cell 이나 row 들을 배열이나 jQuery 집합으로 모아서 넘긴다.

//	※ 주의, cellArr 는 특정 cell 이나 row 를 그룹짓고 있는 배열이나 집합이므로 
//	동등 비교를 할 경우 this.selectedCells[i][0] === cellArr[0] 과 같이 해야 함.
//	그룹지어져 있는 경우 첫번째 원소의 주소만 비교하면 같은 그룹임
AGrid.prototype.selectCell = function(cellArr, e)
{
	if(!this.option.isSelectable) return;
	
	if(!e) e = {};
	
	var isCtrlKey = e.ctrlKey, isShiftKey = e.shiftKey;
	
	if(this.option.isSingleSelect)
	{
		isCtrlKey = false;
		isShiftKey = false;
	}
	
	if(isCtrlKey)
	{
		//이미 선택된 셀이라면 디셀렉트 후 리턴
		if(this.selectedCells.length > 0 && this.deselectCell(cellArr))
		{
			this.lastSelectedCell = this.shiftCurrentCell = this.selectedCells[0];
			return;
		}
		
		this.lastSelectedCell = this.shiftCurrentCell = cellArr;
		this.shiftSelectedCells.length = 0;
		this._addCell(cellArr);
		
	}
	
	else if(isShiftKey)
	{
		if(this.option.isFullRowSelect)
		{
			// 전체 제거 후 다시 선택
			this.clearSelected();
			
			var firstIdx = this.indexOfRow(this.lastSelectedCell);
			var lastIdx = this.indexOfRow(cellArr);
			var i = firstIdx - lastIdx;
			
			//첫 셀이 더 아래에 있음
			if(i > 0)
			{
				firstIdx += this.$rowTmpl.length-1;
				i += this.$rowTmpl.length-1;

				for(;i>=0;i--)
				{
					this._addCell([ this.getRow(firstIdx-i) ]);
				}
			}
			//첫 셀이 더 위에 있음
			else
			{
				i -= this.$rowTmpl.length-1;

				for(;i<=0;i++)
				{
					this._addCell([ this.getRow(firstIdx-i) ]);
				}
			}
		}
		else
		{
			function _indexOfCell(cell)
			{
				var $row = $(cell).parent();
				return [$row.parent().children().index($row), $row.children().index(cell)];
			}
			
			this.shiftCurrentCell = cellArr;
			
			var idxes0 = this.indexOfCell(this.lastSelectedCell),
				idxes1 = this.indexOfCell(cellArr),
				startRowIdx, endRowIdx, startColIdx, endColIdx, $cell, hRowIdx,
				hCellArr = [], bCellArr = [], func;
			
			// 기존에 shift로 선택한 셀들이 있으면 선택해제 처리한다.
			for(var i=0; cell=this.shiftSelectedCells[i]; i++)
			{
				this.deselectCell(cell);
			}
			this.shiftSelectedCells.length = 0;
			
			if(idxes0[0]<0) hCellArr.push(_indexOfCell(this.lastSelectedCell));
			else bCellArr.push(idxes0);
			
			if(idxes1[0]<0) hCellArr.push(_indexOfCell(cellArr));
			else bCellArr.push(idxes1);
			
			if(hCellArr.length != 1)
			{
				if(hCellArr.length>0) func = this.getHeaderCell;
				else
				{
					hCellArr = bCellArr;
					func = this.getCell;
				}
				
				startRowIdx = Math.min(hCellArr[0][0], hCellArr[1][0]);
				endRowIdx = Math.max(hCellArr[0][0], hCellArr[1][0]);
				
				startColIdx = Math.min(hCellArr[0][1], hCellArr[1][1]);
				endColIdx = Math.max(hCellArr[0][1], hCellArr[1][1]);
				
				for(var i=startRowIdx; i<=endRowIdx; i++)
				{
					for(var j=startColIdx; j<=endColIdx; j++)
					{
						cell = func.call(this, i, j);
						if(this.lastSelectedCell[0] === cell) continue;
						this._addCell([cell]);
						this.shiftSelectedCells.push([cell]);
					}
				}
			}
			else
			{
				startColIdx = Math.min(hCellArr[0][1], bCellArr[0][1]);
				endColIdx = Math.max(hCellArr[0][1], bCellArr[0][1]);
				
				startRowIdx = hCellArr[0][0];
				endRowIdx = this.showThead.children().length-1;
				
				for(var i=startRowIdx; i<=endRowIdx; i++)
				{
					for(var j=startColIdx; j<=endColIdx; j++)
					{
						cell = this.getHeaderCell(i,j);
						if(this.lastSelectedCell[0] === cell) continue;
						this._addCell([cell]);
						this.shiftSelectedCells.push([cell]);
					}
				}
				
				startRowIdx = 0;
				endRowIdx = bCellArr[0][0];
				
				for(var i=startRowIdx; i<=endRowIdx; i++)
				{
					for(var j=startColIdx; j<=endColIdx; j++)
					{
						cell = this.getCell(i,j);
						if(this.lastSelectedCell[0] === cell) continue;
						this._addCell([cell]);
						this.shiftSelectedCells.push([cell]);
					}
				}
			}
		}
	}
	
	else
	{
		this.clearSelected();
		
		this._addCell(cellArr);
		this.lastSelectedCell = this.shiftCurrentCell = cellArr;
		this.shiftSelectedCells.length = 0;
	}
};

// isFullRowSelect 가 참이면 cell 은 <tr> 객체임 즉, row
AGrid.prototype.deselectCell = function(cellArr)
{
	if(this.option.isFullRowSelect)
	{
		$(cellArr).children().removeClass(this.selectStyleName);
	}
	else $(cellArr).removeClass(this.selectStyleName);
	
	//this.clearSelected();
	// 전체 클리어가 아니라 넘어온 셀만 제거
	for(var i=0; i<this.selectedCells.length; i++)
	{
		//cellArr 의 첫번째 원소의 주소가 같으면 같은 그룹이다.
		if(this.selectedCells[i][0] === cellArr[0])	
		{
			this.selectedCells.splice(i, 1);
			return true;
		}
	}
	
	return false;
};

//그리드안의 데이터 모두 지우기
AGrid.prototype.clearAll = function()
{
    this.tBody.find('td').each(function()
    {
        this.textContent = '';
		this.style.background = '';
    });
};

AGrid.prototype.clearContents = function()
{
    this.tBody.find('td').each(function()
    {
        this.textContent = '';
    });
};

//선택된 셀(행)을 모두 해제 시키는 함수
AGrid.prototype.clearSelected = function()
{
	var cell = null;

	//선택되어져 있던 셀들의 배경을 원상복귀 한다.
	
	if(this.option.isFullRowSelect)
	{
		var thisObj = this;
		
		for(var i=0; i<this.selectedCells.length; i++) 
		{
			$(this.selectedCells[i]).children().each(function()
			{
				$(this).removeClass(thisObj.selectStyleName);
			});
		}
	}
	else 
	{
		for(var i=0; i<this.selectedCells.length; i++) 
		{
			$(this.selectedCells[i]).removeClass(this.selectStyleName);
		}
	}
	
	
    //선택 목록에서 모두 제거
    this.selectedCells.length = 0;
};


//----------------------------------------------------------------
//   Util functions
//----------------------------------------------------------------

AGrid.prototype.showHeader = function()
{
	//개발 시점에	
	if(window._afc) 
	{
    	this.showThead.hide();//z-index 때문에 숨겨둬야 한다. 다른 컴포넌트들이 뒤로 가려지기 때문에
    	this.hideThead.show();
		this.hideThead.css('visibility', 'visible' );
	}
	else 
	{
    	this.hideThead.show();
    	this.showThead.show();
		this.hideThead.css('visibility', 'hidden' );
	}
};

AGrid.prototype.hideHeader = function()
{
    this.showThead.hide();
    this.hideThead.hide();
};

AGrid.prototype.findRowByCellText = function(nCol, text)
{
	var retRow = null;
	var thisObj = this;
	
	this.tBody.children().each(function()
	{
		if(thisObj.getCellText(this, nCol)==text)
		{
			retRow = this;
			return false;
		}
	});
	
	return retRow;
};

AGrid.prototype.findRowByCellData = function(nCol, data)
{
	var retRow = null;
	var thisObj = this;
	
	this.tBody.children().each(function()
	{
		if(thisObj.getCellData(this, nCol)==data)
		{
			retRow = this;
			return false;
		}
	});
	
	return retRow;
};


//-----------------------
//  get functions
//-----------------------

//row 의 개수를 리턴한다.
AGrid.prototype.getRowCount = function()
{
    return this.tBody.children().length;
};

AGrid.prototype.getHeaderRowCount = function()
{
    return this.showThead.children().length;
};



AGrid.prototype.getRowSetCount = function()
{
	return this.getRowCount()/this.$rowTmpl.length;
};

AGrid.prototype.getColumnCount = function()
{
    return this.columnCount; 
};

//특정 idx 의 cell 을 얻어온다.
//rowIdx 값은 row 객체가 될 수 있다.
AGrid.prototype.getCell = function(rowIdx, colIdx)
{
    var row = null;
    if(typeof(rowIdx)=="number") row = this.tBody.children().eq(rowIdx); //tbody tr
    else row = $(rowIdx);
    
	return row.children().get(colIdx);
};

//특정 header idx 의 cell 을 얻어온다.
//rowIdx 값은 row 객체가 될 수 있다.
AGrid.prototype.getHeaderCell = function(rowIdx, colIdx)
{
    var row = null;
    if(typeof(rowIdx)=="number") row = this.showThead.children().eq(rowIdx); //tbody tr
    else row = $(rowIdx);
    
	return row.children().get(colIdx);
};

AGrid.prototype.getHideHeaderCell = function(rowIdx, colIdx)
{
    var row = null;
    if(typeof(rowIdx)=="number") row = this.hideThead.children().eq(rowIdx); //tbody tr
    else row = $(rowIdx);
    
	return row.children().get(colIdx);
};

//특정 인덱스의 row 를 얻어온다.
AGrid.prototype.getRow = function(rowIdx)
{
	if(this.bkManager) 
		rowIdx -= this.bkManager.getHeadCount();

	return this.tBody.children().get(rowIdx);
};

AGrid.prototype.getLastRow = function()
{
	return this.tBody.children().last()[0];
};

AGrid.prototype.getFirstRow = function()
{
	return this.tBody.children().first()[0];
};


//특정 인덱스의 row 를 얻어온다. 파라미터가 없으면 모든 row 를 리턴한다.
AGrid.prototype.getRows = function(start, end)
{
	if(start!=undefined) return this.tBody.children().slice(start, end);
	else return this.tBody.children();
};

AGrid.prototype.getCellText = function(rowIdx, colIdx)
{
	var cell = this.getCell(rowIdx, colIdx);
	if(cell && cell.dm) return cell.dm.unmask(cell);
	
	return cell.textContent;

    //return $(this.getCell(rowIdx, colIdx)).text();
};

AGrid.prototype.getCellTag = function(rowIdx, colIdx)
{
    return $(this.getCell(rowIdx, colIdx)).html();
};

AGrid.prototype.getCellData = function(rowIdx, colIdx)
{
    return this.getCell(rowIdx, colIdx).data;
};

//파라미터로 넘어온 cell 의 row, col index 를 배열로 리턴한다. -> [row, col]
AGrid.prototype.indexOfCell = function(cell)
{
	var row = $(cell).parent(); 
    return [this.indexOfRow(row), row.children().index(cell)];
};

//파라미터로 넘어온 row 의 index 를 리턴한다.
AGrid.prototype.indexOfRow = function(row)
{
    //return this.tBody.children().index(row);
	
	// row를 넘기지 않을 경우 -1을 리턴한다.
	if(!row) return -1;
	
	if(this.bkManager) 
	{
		var inx = this.tBody.children().index(row);
		if(inx<0) return inx;
		else return inx + this.bkManager.getHeadCount();
	}

	else return this.tBody.children().index(row);
	
};

//파라미터로 넘어온 cell 의 row index 를 리턴한다.
AGrid.prototype.rowIndexOfCell = function(cell)
{
	return this.indexOfRow($(cell).parent());
};

//파라미터로 넘어온 cell 의 column index 를 리턴한다.
AGrid.prototype.colIndexOfCell = function(cell)
{
	return $(cell).parent().children().index(cell);
};

AGrid.prototype.getSelectedCells = function()
{
    return this.selectedCells;
};


//-----------------------
//  set functions
//-----------------------



AGrid.prototype.setHeaderCellText = function(rowIdx, colIdx, txt)
{
    $(this.getHeaderCell(rowIdx, colIdx)).text(txt);
};

AGrid.prototype.setCellText = function(rowIdx, colIdx, text)
{
	var cell = this.getCell(rowIdx, colIdx);
	if(cell) 
	{
		if(cell.dm)
		{
			cell.dm.ele = cell;
			text = cell.dm.mask(text);
		}
		
		cell.textContent = text;
		
		//if(this.shrinkInfo) AUtil.autoShrink(cell, this.shrinkInfo[colIdx]);
		if(cell.shrinkInfo) AUtil.autoShrink(cell, cell.shrinkInfo);
	}
};

AGrid.prototype.setCellTag = function(rowIdx, colIdx, tag)
{
	if(tag==undefined) return;
	
	var cell = this.getCell(rowIdx, colIdx);
	if(cell) 
	{
		cell.innerHTML = tag;
		//cell.childNode[0].nodeValue = tag;
		//if(this.shrinkInfo) AUtil.autoShrink(cell, this.shrinkInfo[colIdx]);
		if(cell.shrinkInfo) AUtil.autoShrink(cell, cell.shrinkInfo);
	}

	//var cell = $(this.getCell(rowIdx, colIdx));
    //cell.html(tag);
	//cell.autoShrink(this.shrinkInfo[colIdx]);
};

AGrid.prototype.setCellData = function(rowIdx, colIdx, data)
{
    this.getCell(rowIdx, colIdx).data = data;
};

AGrid.prototype.loadCellView = function(rowIdx, colIdx, url)
{
    var cell = this.getCell(rowIdx, colIdx);	//td
    var $item = $('<div></div>');

    $item.css(
    {
        width: '100%', height: '100%', overflow: 'auto'
    });
	
    $(cell).html($item);
    
	return AView.createView($item[0], url, this);
};

AGrid.prototype.setCellTextColor = function(rowIdx, colIdx, color)
{
	var cell = this.getCell(rowIdx, colIdx);
	cell.style.setProperty('color', color, 'important');
};

AGrid.prototype.setCellTextColor2 = function(cell,color)
{	
	var cellIndex = this.getCellIndex(cell);
	var headCell = undefined;
	
	if(this.isHeadCell(cell))
		headCell = this.hideThead.children().eq(cellIndex[0]).children().get(cellIndex[1])
	
	if(color == null) 
	{
		cell[0].style.removeProperty('color');
		
		if(headCell)
			headCell.style.removeProperty('color');
	}
	
	cell[0].style['color'] = color;

	if(headCell)
		headCell.style['color'] = color;
}


AGrid.prototype.getCellTextColor2 = function(cell) { return cell[0].style['color']; };

AGrid.prototype.setCellBgColor2 = function(cell, color)
{
	var cellIndex = this.getCellIndex(cell);
	var headCell = undefined;
	
	if(this.isHeadCell(cell))
		headCell = this.hideThead.children().eq(cellIndex[0]).children().get(cellIndex[1])
	
	if(color == null) 
	{
		cell[0].style.removeProperty('background-color');
		
		if(headCell)
			headCell.style.removeProperty('background-color');
	}
	
	cell[0].style['background-color'] = color;

	if(headCell)
		headCell.style['background-color'] = color;
};

AGrid.prototype.getCellBgColor2 = function(cell) { return cell[0].style['background-color']; };

AGrid.prototype.getCellIndex = function(cell)
{
	var $cell = $(cell);
	
	return [$cell.parent().index(), $cell.index()];
}

AGrid.prototype.isHeadCell = function (cell)
{
	return this.getRowParentTag(cell) == 'thead';
};

AGrid.prototype.setCellHAlign = function (cell, align)
{
	if(this.isHeadCell(cell))
	{	
		var cellIndex = this.getCellIndex(cell);
		
		var $headCell = $(this.hideThead.children().eq(cellIndex[0]).children().get(cellIndex[1]));
		$headCell.css('text-align', align);	
	}
	cell.css('text-align', align);
};

AGrid.prototype.setCellVAlign = function (cell,align)
{
	if(this.isHeadCell(cell))
	{
		var cellIndex = this.getCellIndex(cell);
		
		var $headCell = $(this.hideThead.children().eq(cellIndex[0]).children().get(cellIndex[1]));
		$headCell.css('vertical-align', align);	
	}
	cell.css('vertical-align', align);
};

AGrid.prototype.setHeaderCellStyle = function(rowIdx, colIdx, key, value)
{
	$(this.getHeaderCell(rowIdx, colIdx)).css(key, value);
};

AGrid.prototype.setHeaderCellStyleObj = function(rowIdx, colIdx, obj)
{
	$(this.getHeaderCell(rowIdx, colIdx)).css(obj);
};

//key : 문자열 또는 문자열배열
//return: 문자열 또는 오브젝트
AGrid.prototype.getHeaderCellStyle = function(rowIdx, colIdx, key)
{
	return $(this.getHeaderCell(rowIdx, colIdx)).css(key);
};

AGrid.prototype.setCellStyle = function(rowIdx, colIdx, key, value)
{
	$(this.getCell(rowIdx, colIdx)).css(key, value);
};

AGrid.prototype.setCellStyleObj = function(rowIdx, colIdx, obj)
{
	$(this.getCell(rowIdx, colIdx)).css(obj);
};

//key : 문자열 또는 문자열배열
//return: 문자열 또는 오브젝트
AGrid.prototype.getCellStyle = function(rowIdx, colIdx, key)
{
	return $(this.getCell(rowIdx, colIdx)).css(key);
};

AGrid.prototype.cellAddClass = function(rowIdx, colIdx, className)
{
    $(this.getCell(rowIdx, colIdx)).addClass(className);
};

AGrid.prototype.cellRemoveClass = function(rowIdx, colIdx, className)
{
    $(this.getCell(rowIdx, colIdx)).removeClass(className);
};

// 셀의 높이를 변경(row 전체가 바뀌어야 하므로 td 말고 tr 로 변경.)
AGrid.prototype.setCellHeight = function(cell, height)
{
	var isHead = this.isHeadCell(cell);
	var index = this.getCellIndex(cell);
	
	if(isHead)
	{
		this.showThead.children('tr').eq(index[0]).children().eq(index[1]).attr('height', height);
		this.hideThead.children('tr').eq(index[0]).children().eq(index[1]).attr('height', height);
	}
	else
		this.tBody.children('tr').eq(index[0]).children().eq(index[1]).attr('height', height);	
};

AGrid.prototype.getCellHeight = function(cell)
{
	return cell.attr('height');
};

// 헤더의 특정 Row 높이 리턴
AGrid.prototype.getHeadHeight = function(row)
{
	return this.showThead.children('tr').eq(row).attr('height');
};

//헤더 높이 변경
AGrid.prototype.setHeadHeight = function(headHeight)
{
	this.showThead.children('tr').attr('height', headHeight);
	this.hideThead.children('tr').attr('height', headHeight);
};

// 바디 특정 Row 의 높이 리턴.
AGrid.prototype.getBodyHeight = function(row)
{
	return this.tBody.children('tr').eq(row).attr('height');
};

//바디 높이 변경
AGrid.prototype.setBodyHeight = function(bodyHeight)
{
	this.tBody.children('tr').attr('height', bodyHeight);
};

AGrid.prototype.setHeadColor = function(color)
{
	this.showThead.children('tr').css('background-color', color);
	this.hideThead.children('tr').css('background-color', color);
};

AGrid.prototype.getHeadColor = function()
{
	return this.showThead.children('tr').eq(0).css('background-color');
};

AGrid.prototype.setBodyColor = function(color)
{
	this.tBody.children('tr').css('background-color', color);
};

AGrid.prototype.getBodyColor = function()
{
	return this.tBody.children('tr').eq(0).css('background-color');
};

//-----------------------------------------------------------------------------------
// data property 를 위해 차후에 추가된 함수들...

//컬럼 추가
AGrid.prototype.addColumn = function()
{
	var thisObj = this;
    var $cell = null;
    
    this.headerTable.find('colgroup').append($('<col></col>'));
    this.bodyTable.find('colgroup').append($('<col></col>'));
    this.showThead.children().each(_add_helper);
	this.hideThead.children().each(_add_helper);
    this.tBody.children().each(_add_helper);
	
	for(var i=0; i<this.$rowTmpl.length; i++)
		_add_helper.call(this.$rowTmpl[i]);

	this.columnCount ++;
	
	
	function _add_helper(i)
	{
    	$cell = $('<td></td>');
		
// 		thisObj.makeDefaultCellStyle($cell);

    	$(this).append($cell);
    	//$cell.css('border', thisObj.mGridBodyBorder);
        //$cell.css('border-width', thisObj.mGridBodyBorderW);
		
		thisObj.regCellEvent($cell);
	}
};

//컬럼 삭제
AGrid.prototype.removeColumn = function(colIdx)
{
	var thisObj = this;
	var pos = colIdx;
	if(pos == undefined) pos = this.columnCount-1;
	
	this.headerTable.find('colgroup').children().eq(pos).remove();
	this.bodyTable.find('colgroup').children().eq(pos).remove();
	
	this.showThead.children('tr').each(_remove_helper);
	this.hideThead.children('tr').each(_remove_helper);
    this.tBody.children('tr').each(_remove_helper);
        
    this.columnCount --;
	
	function _remove_helper(i)
	{
    	var removeTd = this.children[pos];
		thisObj.decreaseColSpan(removeTd);
		removeTd.remove();
	}
};

// 열 숨기기
// colIdx : number
AGrid.prototype.hideColumn = function(colIdx)
{
	var colCnt = this.getColumnCount(),
		colHidedInfoArr = new Array(colCnt),
		colHidedCnt = 0;
	
	this.headerTable.find('col').each(function(i)
	{
		if(this.style.width == '0px')
		{
			colHidedInfoArr[i] = true;
			colHidedCnt++;
		}
	});
	
	if(colCnt == colHidedCnt+1)
	{
		if(colHidedInfoArr[colIdx] == undefined)
		{
			return false;
		}
	}

	var changeShowHTarget, changeHideHTarget, changeBTarget,
		showTheadArr = this.showThead.children(),
		hideTheadArr = this.hideThead.children(),
		bodyArr = this.tBody.children();
		
	this.headerTable.find('col')[colIdx].style.width = '0px';
	this.bodyTable.find('col')[colIdx].style.width = '0px';

	changeShowHTarget = showTheadArr.children('td:nth-child('+(colIdx+1)+')');
	changeHideHTarget = hideTheadArr.children('td:nth-child('+(colIdx+1)+')');
	changeBTarget = bodyArr.children('td:nth-child('+(colIdx+1)+')');

	changeShowHTarget.css('white-space', 'nowrap');
	changeHideHTarget.css('white-space', 'nowrap');
	changeBTarget.css('white-space', 'nowrap');
	
	return true;
};

// 열 숨기기 취소
// colIdx : number
AGrid.prototype.showColumn = function(colIdx)
{
	var showTheadArr = this.showThead.children(),
		hideTheadArr = this.hideThead.children(),
		bodyArr = this.tBody.children();
	
	this.headerTable.find('col')[colIdx].style.width = '';
	this.bodyTable.find('col')[colIdx].style.width = '';

	var changeShowHTarget = showTheadArr.children('td:nth-child('+(colIdx+1)+')');
	var changeHideHTarget = hideTheadArr.children('td:nth-child('+(colIdx+1)+')');
	var changeBTarget = bodyArr.children('td:nth-child('+(colIdx+1)+')');

	changeShowHTarget.css('white-space', '');
	changeHideHTarget.css('white-space', '');
	changeBTarget.css('white-space', '');
	
	return true;
};

// 열 숨기기 여부
// colIdx : number
AGrid.prototype.isColumnHided = function(colIdx)
{
	if(colIdx < 0 || colIdx >= this.getColumnCount()) return;
	if(this.headerTable.find('col')[colIdx].style.width == '0px') return true;
	else return;
};

AGrid.prototype.decreaseColSpan = function(tdDom)
{
	var curColSpan = tdDom.getAttribute('colspan');
	
	if(curColSpan)
	{
		var newColSpan = parseInt(curColSpan, 10) - 1;
		if(newColSpan <= 1) tdDom.removeAttribute('colspan');
		else tdDom.setAttribute('colspan', newColSpan);
		return false;
	}  
	else
	{
		if(tdDom.style.display == 'none')
		{
			this.decreaseColSpan(tdDom.previousElementSibling);
		}	
		else return true;
	}
};

AGrid.prototype.insertDefaultCell = function(table, row, col, isAfter)
{
	var $newCell = $('<td></td>');
// 	this.makeDefaultCellStyle($newCell);
		
	var fromCell = table.children('tr').eq(row).children('td').eq(col);
	if(isAfter)
		fromCell.after($newCell);
	else 
		fromCell.before($newCell);
		
	this.regCellEvent($newCell);
};

AGrid.prototype.insertSingleCol = function(colIndex, isAfter)
{
	// headerTable과 bodyTable의 colgroup 에 col 을 넣는다.
	_add_col_helper(this.headerTable, colIndex, isAfter);
	_add_col_helper(this.bodyTable, colIndex, isAfter);

	var headRowCount = this.showThead.children('tr').length;
	for(var rIndex = 0; rIndex < headRowCount; ++rIndex)
	{
		this.insertDefaultCell(this.showThead, rIndex, colIndex, isAfter);
		this.insertDefaultCell(this.hideThead, rIndex, colIndex, isAfter);
	}
	
	var bodyRowCount = this.tBody.children('tr').length;
	for(var rIndex = 0; rIndex < bodyRowCount; ++rIndex)
	{
		this.insertDefaultCell(this.tBody, rIndex, colIndex, isAfter);
	}	
	
	++this.columnCount;
	
	function _add_col_helper($table, i, isAfter)
	{
		var fromCol = $table.find('colgroup').children('col').eq(i);
		var newCol = $('<col></col>');
		
		if(isAfter) fromCol.after(newCol);
		else fromCol.before(newCol);
	}
};

AGrid.prototype.insertSingleRow = function(rowIndex,isAfter,isHead)
{
	var rowHeight = 0;
	var $cell = null;

	if(isHead)
		rowHeight = this.showThead.children('tr').attr('height');
	else
		rowHeight = this.tBody.children('tr').attr('height');

	var row = $('<tr height = "'+rowHeight+';"></tr>');

	for(var i=0; i<this.columnCount; i++)
	{
		$cell = $('<td></td>');
// 		this.makeDefaultCellStyle($cell);
		
		row.append($cell);
		
		this.regCellEvent($cell);
	}
	
	
	if(isHead)
	{
		var color = this.getHeadColor();
		var colors = color.substring(5, color.length -1).replace(/ /gi,'').split(',');
		if(! ((colors[0] == 0) && (colors[1] == 0) && (colors[2] == 0) && (colors[3] == 0)))
			row.css('background-color', color);
		
		this.showThead.children('tr')

		if(isAfter)
		{		
			$(this.showThead.children().get(rowIndex)).after(row);
			$(this.hideThead.children().get(rowIndex)).after(row.clone());
		}
		else
		{
			$(this.showThead.children().get(rowIndex)).before(row);
			$(this.hideThead.children().get(rowIndex)).before(row.clone());
		}
	}
	else
	{
		var color = this.getBodyColor();
		var colors = color.substring(5, color.length -1).replace(/ /gi,'').split(',');
		if(! ((colors[0] == 0) && (colors[1] == 0) && (colors[2] == 0) && (colors[3] == 0)))
			row.css('background-color', color);
			
		if(isAfter)
			$(this.tBody.children().get(rowIndex)).after(row);
		else
			$(this.tBody.children().get(rowIndex)).before(row);
	}

	return row[0];
};
/*
AGrid.prototype.makeDefaultCellStyle = function($cell)
{
	$cell.css('border', '1px solid #c2c2c2');

	if(this.isHeadCell($cell))
	{
		var index = this.getCellIndex($cell);
		
		var hideCell = this.getHideHeaderCell(index[0], index[1]);
		hideCell.css('border', '1px solid #c2c2c2');
	}
};	
*/

//로우셋 카운트 변경
AGrid.prototype.changeRowCount = function(count, isHead)
{
	var calcValue = 0;
	var thisObj = this;
	var headRowCnt = this.showThead.children().length;
	var bodyRowCnt = this.tBody.children().length;
	
	if(isHead) calcValue = count - headRowCnt
	else calcValue = count - bodyRowCnt;
	
	//로우 추가
	if(calcValue > 0)
	{
		for(var i=0; i<Math.abs(calcValue); i++)
			this.insertSingleRow(isHead?headRowCnt-1:bodyRowCnt-1, true ,isHead)			
	}
	//로우삭제
	else if(calcValue < 0)
	{
		for(var i=0; i<Math.abs(calcValue); i++)
			_removeRow_helper(isHead);			
	}
	
	function _removeRow_helper(isHead)
	{
		var pos;
		if(isHead) pos = headRowCnt-1; 
		else pos = bodyRowCnt -1;		

		if(isHead)
		{
			var target = thisObj.showThead.children().eq(pos);
			target.children('td').each(function(i){
				_decreaseRowSpan(this);	
			});
			target.remove();
			
			target = thisObj.hideThead.children().eq(pos);
			target.children('td').each(function(i){
				_decreaseRowSpan(this);	
			});
			target.remove();
			
			headRowCnt--;
		}
		else
		{
			var target = thisObj.tBody.children().eq(pos); 
			target.children('td').each(function(i){
				_decreaseRowSpan(this);	
				$(thisObj).remove();	
			});
			target.remove();
			
			bodyRowCnt--;
		}
	}
	
	function _decreaseRowSpan(tdDom)
	{
		var tdObj = $(tdDom);
		var tdIdx = tdObj.index();

		if(tdObj.attr('rowspan'))
		{
			var curRowSpan = tdObj.attr('rowspan');
			var newRowSpan = parseInt(curRowSpan, 10) - 1;
			if(newRowSpan <= 1) tdObj.removeAttr('rowspan');
			else tdObj.attr('rowspan', newRowSpan);
			return false;
		}  
		else
		{
			//if(tdObj.attr('data-span') == 'row_hide')
			if(tdDom.style.display == 'none')
			{
				var preTrIndex = tdObj.parent().prev();
				var preTd = preTrIndex.children('td').eq(tdIdx);
				_decreaseRowSpan(preTd[0]);
			}
			else return true;	
		}
	}
};

//여기까지
//-----------------------------------------------------------------------------------




//----------------------------------------------------------------
//   SCROLL AREA
//----------------------------------------------------------------
//스크롤

AGrid.prototype.getScrollPos = function()
{
	return this.scrollArea[0].scrollTop;
};

AGrid.prototype.scrollTo = function(pos)
{
	this.scrollArea[0].scrollTop = pos;
};

AGrid.prototype.scrollOffset = function(offset)
{
	this.scrollArea[0].scrollTop += offset;
};

//row or rowIndex
AGrid.prototype.scrollIntoArea = function(row, isAlignTop)
{
	if(typeof(row)=="number") row = this.getRow(row);
	
	row.scrollIntoView(isAlignTop);
};

AGrid.prototype.scrollToTop = function()
{
	this.scrollArea[0].scrollTop = this.scrollArea[0].scrollHeight*-1;
};

AGrid.prototype.scrollToBottom = function()
{
	this.scrollArea[0].scrollTop = this.scrollArea[0].scrollHeight;
};

AGrid.prototype.scrollToCenter = function()
{
	this.scrollArea[0].scrollTop = (this.scrollArea[0].scrollHeight - this.element.offsetHeight)/2;
};

AGrid.prototype.saveScrollPos = function()
{
	this.savedScrollPos = this.scrollArea[0].scrollTop;
};

AGrid.prototype.restoreScrollPos = function()
{
	if(this.savedScrollPos!=-1) 
	{
		this.scrollArea[0].scrollTop = this.savedScrollPos;
		this.savedScrollPos = -1;
	}
};

AGrid.prototype.isScrollTop = function()
{
	return (this.scrollArea[0].scrollTop == 0);
};

AGrid.prototype.isScrollBottom = function()
{
	var scrlEle = this.scrollArea[0];
	return (scrlEle.scrollHeight-scrlEle.clientHeight-scrlEle.scrollTop == 1);
};

AGrid.prototype.isMoreScrollTop = function()
{
	return (this.scrollArea[0].scrollTop > 0);
};

AGrid.prototype.isMoreScrollBottom = function()
{
	var scrlEle = this.scrollArea[0];
	return (scrlEle.scrollHeight-scrlEle.clientHeight-scrlEle.scrollTop > 1);
};

AGrid.prototype.isScroll = function()
{
    return (this.scrollArea[0].offsetHeight < this.scrollArea[0].scrollHeight);
};


AGrid.prototype.setRow = function(rowInx, rowData, start, end)
{
	var $cells = $(this.getRow(rowInx)).children();
	
	if(start==undefined) 
	{
		start = 0; 
		end = $cells.length;
	}
	
	for(var i=start; i<end; i++)
	{
		$cells.get(i).textContent = rowData[i];
	}

};

//rowData = [ {}, {}, ... ];
//{} --> { text: 'abc', type:'check', select:true, rowSpan:2 }
//{} --> { type:'sum', select:true, rowSpan:2 }

AGrid.prototype.setRowByObj = function(dataGrid, rowInx, rowData, start, end, dataOffset)
{
	var thisObj = this;
	var $cells = $(this.getRow(rowInx)).children();
	
	if(start==undefined) 
	{
		start = 0; 
		end = $cells.length - 1;
	}
	
	if(dataOffset==undefined) dataOffset = 0;
	
	var obj, cell;
	for(var i=start; i<=end; i++)
	{
		obj = rowData[i+dataOffset];
		
		if(!obj) continue;
		
		cell = $cells[i];
		
		//이 코드가 들어가면 row, col 동시 머지가 안된다.
		//if(cell.style.display=='none') continue;
		
		if(obj.select) this._addCell(cell);
		
		if(obj.type)
		{
			if(obj.type == 'button')
			{
				cell.innerHTML = '<button type="button">'+ (obj.text == undefined? '': obj.text) +'</button>';
				cell.children[0].addEventListener('click', function(e){ dataGrid.buttonClick(thisObj, rowData, e); });
			}
			else if(obj.type == 'sum')
			{
				if(obj.text != undefined) cell.textContent = obj.text;
			}
			else
			{
				if(obj.checked) cell.innerHTML = '<input type="' + obj.type + '" checked />';
				else cell.innerHTML = '<input type="' + obj.type + '"/>';
			}
		}
		else if(obj.text != undefined) cell.textContent = obj.text;
		
		if(obj.rowSpan)
		{
			this.mergeRow(rowInx, i, obj.rowSpan);
		}
		
		if(obj.colSpan)
		{
			this.mergeCol(rowInx, i, obj.colSpan);
			i += obj.colSpan - 1;
		}
		
	}

};






///////////////////////////////////////////////////////////////////////
//
//	private area
//
///////////////////////////////////////////////////////////////////////


//rowSet 객체를 리턴한다.
AGrid.prototype.createRow = function(rowData)
{
	var $rowSet = null;
	
	//템플릿이 있으면 복제하여 사용
	if(this.$rowTmpl)
	{
		var idx = 0, $cell, $colSet, cellData, thisObj = this; 
		
		$rowSet = this.$rowTmpl.clone();	//<tr></tr> <tr></tr> ...
		
		$rowSet.each(function(i)
		{
			$colSet = $(this).children('td');	//<td><td> ...
			
			var $tmplCells = thisObj.$rowTmpl.eq(i).children('td');
			
			$colSet.each(function(j)
			{
				$cell = $(this);
				
				//if(!$cell.attr('data-span')) 
				if(this.style.display != 'none')
				{
					cellData = rowData[idx];
					
					//템플릿의 data mask 객체를 셋팅한다.
					this.dm = $tmplCells[j].dm;
					
					if(rowData.length>idx)
					{
						if(this.dm) cellData = this.dm.mask(cellData, this);
						
						if(typeof cellData == 'object')
						{	
							$cell.append(cellData.element);
							this.data = cellData;
						}
						else if(cellData != undefined) $cell.html(cellData);
						//else $cell.html(cellData);
						
						//$cell.text(cellData);
					}
					
					//if(thisObj.shrinkInfo) $cell.autoShrink(thisObj.shrinkInfo[idx]);
					//템플릿의 shrinkInfo 객체를 셋팅한다.
					if($tmplCells[j].shrinkInfo)
					{
						this.shrinkInfo = $tmplCells[j].shrinkInfo;
						$cell.autoShrink(this.shrinkInfo);
					}
					
					idx++;
				}
				
				//각 셀에 이벤트를 셋팅한다.
				if(!thisObj.option.isFullRowSelect)
				{
					thisObj.regCellEvent($cell);
				}
				
			});
		
		});
		
		//로우 전체에 이벤트를 셋팅한다.
        if(this.option.isFullRowSelect)
		{
			this.regCellEvent($rowSet);
		}
	}
	
	return $rowSet;
};

//----------------------------------------------------------------------
//	evtEles 는 이벤트 element 를 담고 있는 배열이거나 jQuery 집합 객체이다.
//	그룹지어야 할 cell들을 배열이나 jQuery 집합으로 모아서 넘긴다.
//	이벤트 발생시 그룹지어진 evtEles 값이 전달된다.
AGrid.prototype.regCellEvent = function(evtEles)
{
	if(!this.option.isSelectable) return;
	
	this.aevent._select(evtEles);
	this.aevent._longtab(evtEles);
	this.aevent._dblclick(evtEles);
};

/*
AGrid.prototype.checkAutoShrink = function(col, cell)
{
	var info = this.shrinkInfo[col];
	if(info)
	{
		var txt = cell.text();
		var len = (info.maxChar-txt.length)/txt.length;

		//afc.log(len);
		if(len<0)
		{
			//afc.log((info.fontSize+info.fontSize*len));
			cell.css('font-size', (info.fontSize+info.fontSize*len)+'px');
		}
	}
};
*/

//스크롤바 존재 여부에 따라 headerTable 의 사이즈를 조정한다.
AGrid.prototype.checkScrollbar = function(isAdd)
{
	if(!this.isCheckScrl) return;
	
   //add 인 경우는 스크롤바가 안 보이는 경우만 체크하고
    //remove 인 경우는 스크롤바가 보이는 경우만 체크한다. 
    if(isAdd!=this.isScrollVisible)
    {
        this.isScrollVisible = this.scrollArea.hasScrollBar(); 
        if(isAdd==this.isScrollVisible) 
		{
			var add = afc.scrlWidth*isAdd;
			this.headerTable[0].style.width = 'calc(100% - ' + add + 'px)';
		}
    }
};

AGrid.prototype.setRealMap = function(realField)
{
	this.realField = realField;
	this.realMap = null;
};

AGrid.prototype.getRealKey = function(data)
{
	return data[this.realField];
};

AGrid.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	if(this.option.isClearRowTmpl)
	{
		if(queryData.isReal) this.doRealPattern(dataArr, keyArr, queryData);
		else this.doAddPattern(dataArr, keyArr, queryData);
	}
	else this.doUpdatePattern(dataArr, keyArr, queryData);
};

//rowSet 즉 멀티로우에 대한 리얼 처리가 안되어 있음.
//row = this.realMap[this.getRealKey(data)]; 이 부분에서 row.each 를 실행해 처리할 필요가 있음.
AGrid.prototype.doRealPattern = function(dataArr, keyArr, queryData)
{
	var data, row, keyVal, arr, dataObj, ret;
	
	data = dataArr[0];
	//dataObj = AQueryData.getDataKeyObj(data.key);

	//update
	if(this.updateType==0)
	{
		row = this.realMap[this.getRealKey(data)];
		
		if(!row) return;
		
		var idx = 0, cell, cellData;
		for(var j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];
			cell = this.getCell(row, idx);
			
			//if(!cell) continue;
			
			//if(cell.getAttribute('data-span'))
			if(cell.style.display == 'none')
			{
				idx++;
				j--;
				continue;
			}

			if(keyVal) 
			{
				/*
				//ret = this.getMaskValue(j, dataObj, keyVal, cell);
				//if(ret) this.setCellText(row, idx, ret);
				
				//this.setCellText(row, idx, dataObj[keyVal]);

				if(cell.dm) cell.dm.setQueryData(data, keyArr, queryData);
				
				this.setCellText(row, idx, data[keyVal]);
				*/
				
				cellData = data[keyVal];
				
				if(cell.dm)
				{
					cellData = cell.dm.mask(cellData, cell);
				}
					
				if(cellData != undefined) cell.innerHTML = cellData;
				
				if(cell.shrinkInfo) AUtil.autoShrink(cell, cell.shrinkInfo);				
			}
			
			idx++;
		}
	}
	
	//insert
	else
	{
		arr = new Array(keyArr.length);
		for(var j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];

			//if(keyVal) arr[j] = this.getMaskValue(j, dataObj, keyVal);
			//if(keyVal) arr[j] = dataObj[keyVal];
			if(keyVal) arr[j] = data[keyVal];
			//else arr[j] = '';
		}
		
		/*this.$rowTmpl.find('td').each(function()
		{
			if(this.dm) this.dm.setQueryData(data, keyArr, queryData);
		});*/

		//prepend
		if(this.updateType==-1) row = this.prependRow(arr);
		//append
		else if(this.updateType==1) row = this.addRow(arr, true);
	}
	
};

AGrid.prototype.doAddPattern = function(dataArr, keyArr, queryData)
{
	var data, row, keyVal, arr;
	
	//조회하는 경우 기존의 맵 정보를 지운다.
	if(this.realField!=null) this.realMap = {};
	
	for(var i=0; i<dataArr.length; i++)
	{
		data = dataArr[i];
		arr = new Array(keyArr.length);

		for(var j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];

			//if(keyVal) arr[j] = this.getMaskValue(j, data, keyVal);
			
			if(keyVal) arr[j] = data[keyVal];
			//else arr[j] = ''; 
		}

		/*
		//속도에 영향을 줄 것 같은데... 한번만 호출할 수 있는 다른 방법은 없는가?
		this.$rowTmpl.find('td').each(function()
		{
			if(this.dm) this.dm.setQueryData(data, keyArr, queryData);
		});*/
		ADataMask.setQueryData(data, keyArr, queryData);

		row = this.addRow(arr);
		
		if(data.row_data) this.setCellData(row, 0, data.row_data);

		//리얼맵이 활성화 되어 있으면 조회 시점에 리얼맵을 만든다.
		if(this.realField!=null) 
		{
			//if(!this.realMap[data.key]) this.realMap[data.key] = row;

			this.realMap[this.getRealKey(data)] = row;
		}
	}

	//내부에서 자체적으로 호출되는 것으로 변경
	//if(this.bkManager) this.bkManager.applyBackupScroll();
};

//조회시 단건 데이터의 업데이트, fixed grid 에서 사용함.
AGrid.prototype.doUpdatePattern = function(dataArr, keyArr, queryData)
{
	var $rowSet = this.getRowSet(0), $colSet, $cell, cellData, thisObj = this,
		data, rowData, keyVal, idx = 0;
		
	data = dataArr[0];
		
	rowData = new Array(keyArr.length);

	for(var k=0; k<keyArr.length; k++)
	{
		keyVal = keyArr[k];

		if(keyVal) rowData[k] = data[keyVal];
		//else rowData[k] = '';
	}
	
	
	$rowSet.each(function(i)
	{
		$colSet = $(this).children('td');	//<td><td> ...

		var $tmplCells = thisObj.$rowTmpl.eq(i).children('td');
			
		$colSet.each(function(j)
		{
			$cell = $(this);
				
			//if(!$cell.attr('data-span'))
			if(this.style.display != 'none')
			{
				cellData = rowData[idx];
					
				//템플릿의 data mask 객체를 셋팅한다.
				this.dm = $tmplCells[j].dm;
					
				if(this.dm)
				{
					// clearRowTmpl 은 ele 를 다시 지정할 필요가 있는지 판단 필요
					//this.dm.ele = this;
					cellData = this.dm.mask(cellData, this);
				}
					
				if(rowData.length>idx)
				{
					if(typeof cellData == 'object')
					{	
						$cell.append(cellData.element);
						this.data = cellData;
					}
					else if(cellData != undefined) $cell.html(cellData);
				}
				
				//if(thisObj.shrinkInfo) $cell.autoShrink(thisObj.shrinkInfo[idx]);
				if(this.shrinkInfo) $cell.autoShrink(this.shrinkInfo);
				
				idx++;
			}
		});
	});	

};

// 백업 관련 처리는 되어있지 않음
AGrid.prototype.getQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length == 0) return;

	var rowTmplCount = this.$rowTmpl.length,
		rowsetCount = this.getRowCount() / rowTmplCount,
		columnCount = this.getColumnCount(),
		rowsetIndex, colIndex, keyVal, rowIndex, idx, cell, cellData;
	
	for(var i=0; i<rowsetCount; i++)
	{
		rowsetIndex = i * rowTmplCount;
		idx = 0;

		for(var j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];
			rowIndex = parseInt(idx/columnCount);
			colIndex = idx % columnCount;
			cell = this.getCell(rowsetIndex + rowIndex, colIndex);

			// cell 이 merge된 셀이면 넘어간다.
			if(cell.style.display == 'none')
			{
				idx++;
				j--;
				continue;
			}

			if(keyVal)
			{
				// 만약 셀에 데이터가 있는 경우 매핑을 데이터로 해야할지?
				if(!dataArr[i]) dataArr[i] = {};
				dataArr[i][keyVal] = this.getCellText(rowsetIndex + rowIndex, colIndex);
			}
			idx++;
		}
	}
};

AGrid.prototype.createBackup = function(maxRow, restoreCount)
{
	if(afc.isIos) return;
	
	if(!window['BackupManager']) return;
	
	//if(this.bkManager) return;//this.bkManager.destroy();
	
	this.destroyBackup();

	this.bkManager = new BackupManager();
	this.bkManager.create(this, maxRow, restoreCount);
	this.bkManager.setBackupInfo(this.rowTmplHeight, this.$rowTmpl.length, this.scrollArea[0], this.tBody);
	
	//we don't use grid scroll in PivotGridView
	if(this.scrollArea) this.aevent._scroll();
	
	//ios must enable scrollManager in backup
	if(afc.isIos) this.enableScrlManager();
};

AGrid.prototype.destroyBackup = function()
{
	if(this.bkManager)
	{
		this.bkManager.destroy();
		this.bkManager = null;
	}
};

//-----------------------------------------------------
//	BackupManager delegate function

AGrid.prototype.getTopItem = function()
{
	return this.getFirstRow();
};

AGrid.prototype.getBottomItem = function()
{
	return this.getLastRow();
};

AGrid.prototype.getTotalCount = function()
{
	return this.getRowCount();
};

//--------------------------------------------------------------

//	현재 스타일을 객체로 반환한다.
AGrid.prototype.getCompStyleObj = function()
{
	//	getDefinedStyle 함수는 AUtil에서 만든 함수
	var obj = {}, ele = this.get$ele();
	obj.main = ele.getDefinedStyle();
	obj.thead = ele.find('thead').eq(0).getDefinedStyle();
	obj.td = ele.find('td').eq(0).getDefinedStyle();
	obj.select = ele.find('.agrid_select').eq(0).getDefinedStyle();
	
	return obj;
};

//	스타일을 다른 컴포넌트의 스타일로 변경한다.
AGrid.prototype.setCompStyleObj = function(obj)
{
	var p, ele = this.get$ele();
	for(p in obj.main) this.setStyle(p, obj.main[p]);
	for(p in obj.thead) this.showThead.css(p, obj.thead[p]);
	for(p in obj.td) ele.find('td').eq(0).css(p, obj.td[p]);
	for(p in obj.select) ele.find('.agrid_select').eq(0).css(p, obj.select[p]);
};


//cell이 tHead인지 tBody인지 판단
AGrid.prototype.getRowParentTag = function(cell)
{
	cell = $(cell);
	var parentTagStr = '';
	var parentDom = cell.parent().parent()[0];
	if(parentDom) parentTagStr = parentDom.tagName.toLowerCase();
	return parentTagStr;
};

AGrid.prototype.getCellPos = function(cell)
{
    return [this.rowIndexOfCell(cell), this.colIndexOfCell(cell)];
};

// 매핑가능한 개수를 리턴한다.
AGrid.prototype.getMappingCount = function()
{
	var thisObj = this, arr = [];
	for(var i=0; i<this.getRowCount(); i++)
	{
		for(var j=0; j<this.getColumnCount(); j++)
		{
			//if( !$(this.getCell(i, j)).attr('data-span') ) arr.push((i+1)+'-'+(j+1));
			if( this.getCell(i, j).style.display != 'none' ) arr.push((i+1)+'-'+(j+1));
		}
	}
	return arr;
};

//----------------------------------------------
//	merge row

AGrid.prototype.mergeHeadRow = function(row, col, span)
{
	this._mergeRow(row, col, span, this.showThead.children());
	this._mergeRow(row, col, span, this.hideThead.children());
};


AGrid.prototype.mergeRow = function(row, col, span)
{
	this._mergeRow(row, col, span, this.tBody.children() );
};


AGrid.prototype._mergeRow = function (row, col, span, $rowEles)
{
	var start = row + 1;
	var end = start + span -1;
	
	var totalSpan = span;
	
	var $row = $rowEles.eq(row),
		startCol = $row.children().eq(col), curCol;
	
	for(var index = start; index < end; ++index)
	{
		curCol = $rowEles.eq(index).children().eq(col);
		
		if(index == end-1)
		{
			var addSpan = curCol.attr('rowspan');
			if(typeof addSpan != 'undefined')
				totalSpan += (addSpan -1);
		}
		
		startCol.append(curCol.children());
		
		curCol.removeAttr('rowspan');
		curCol.removeAttr('colspan');
		curCol.hide();
	}

  startCol.attr('rowspan', totalSpan); //add ukmani100	
};

//----------------------------------------------
//	merge column

AGrid.prototype.mergeHeadCol = function(row, col, span)
{
	this._mergeCol(this.showThead.children().get(row), col, span);
	this._mergeCol(this.hideThead.children().get(row), col, span);
};

AGrid.prototype.mergeCol = function(row, col, span)
{
	this._mergeCol(this.getRow(row), col, span);
};

AGrid.prototype._mergeCol = function(rowEle, colInx, span)
{
	var $row = $(rowEle);

	// colspan td 다음부터(+1) 
	var start = colInx + 1; 
	var end = start + span-1;
	var totalSpan = span;
	
	var startCol = $row.children().eq(colInx);
		
	for(var index = start; index < end; ++index)
	{
		var curCol = $row.children().eq(index);
		// 마지막 col 에 colspan 존재하면 이를 더해야 함.
		// 중간의 colspan 은 이미 param 에 합쳐진 수치이므로 걍 attr 만 지우면 됨.		
		if(index == end -1)
		{
			var addSpan = curCol.attr('colspan');
			if(typeof addSpan != 'undefined')
				totalSpan += (addSpan-1);
		}
		
		startCol.append(curCol.children());
		
		curCol.removeAttr('rowspan');
		curCol.removeAttr('colspan');
		curCol.hide();	
	}
	startCol.attr('colspan', totalSpan); //add ukmani100
};



//----------------------------------------------
//	split column


AGrid.prototype.splitHeadCell = function(row,col)
{
	this._splitCell(row, col, this.showThead.children().eq(row).children().get(col));	
	this._splitCell(row, col, this.hideThead.children().eq(row).children().get(col));
};

AGrid.prototype.splitCell = function(row, col)
{
	this._splitCell(row, col, this.getCell(row,col));	
};

// merge 된 cell 의 row, col 을 전부 분리.
AGrid.prototype._splitCell = function(row, col, cellEle)
{	
	var $td = $(cellEle);
	
	var rowSpanCount = $td.attr('rowspan');
	if(rowSpanCount == undefined) rowSpanCount = 1;
		
	var colSpanCount = $td.attr('colspan');
	if(colSpanCount == undefined) colSpanCount = 1;
	
	//정수형으로 만들기 위해 
	var rStart = Number(row);
	var rEnd = rStart + Number(rowSpanCount);
		
	var cStart = Number(col);
	var cEnd = cStart + Number(colSpanCount);

	var $parent = $td.parent().parent();
	var $tr, $curTd;
	for(var rIndex = rStart; rIndex < rEnd; ++rIndex)
	{
		$tr = $parent.children().eq(rIndex);
		for(var cIndex = cStart; cIndex < cEnd; ++cIndex)
		{
			$curTd = $tr.children().eq(cIndex);
			$curTd.show();
		}
	}
		
	$td.removeAttr('rowspan');
	$td.removeAttr('colspan');
};

AGrid.prototype.splitRow = function(row, col)
{
	var $row = $(this.getRow(row));
	
	$row.children().eq(col).removeAttr('rowspan'); //add ukmani100
};

AGrid.prototype.splitCol = function(row, col)
{
	var $row = $(this.getRow(row));
	
	$row.children().eq(col).removeAttr('colspan'); //add ukmani100
};

AGrid.prototype.showGridMsg = function(isShow, msg)
{
	if(isShow)
	{
		var $msg = $('<p>no data</p>');
		$msg.css(
		{
			'float': 'left',
			width: '100%',
			'line-height': '150px',
			'text-align': 'center',
		});

		this.scrollArea.append($msg);
	}
	else
	{
		this.scrollArea.find('p').remove();
	}

};

AGrid.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
	
	var keyArr = ['data-select-class', 'data-style-header', 'data-style-body'], val;
	
	for(var i=0; i<keyArr.length; i++)
	{
		if(i==1) val = this.$ele.find('thead').attr(keyArr[i]);
		else if(i==2) val = this.$ele.find('tbody').attr(keyArr[i]);
		else val = this.getAttr(keyArr[i]);	//data-select-class

		//attr value 에 null 이나 undefined 가 들어가지 않도록
		ret[keyArr[i]] = val ? val : '';
	}
	
	return ret;
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
AGrid.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) AComponent.prototype._setDataStyleObj.call(this, styleObj);
		
		else if(p=='data-style-header') this._set_class_helper(this.$ele.find('thead'), null, styleObj, p);
		else if(p=='data-style-body') this._set_class_helper(this.$ele.find('tbody'), null, styleObj, p);
		else this.setAttr(p, styleObj[p]);	//data-select-class
	}
};

AGrid.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);

	//무조건 체크되도록 현재 상태의 반대값을 넣어준다.
	if(afc.isPC) this.checkScrollbar(!this.isScrollVisible);	
};










