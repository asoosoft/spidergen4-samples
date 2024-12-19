


/**
* TODO:
* 1) 각 셀의 Drag & Drop 기능
* 2) data mapping
* 3) cell merge 후 스크롤 
* 4) data type 에  button 추가 하기
* 5) 정렬시 헤더에 화살표 보이도록 
* 6) 합계 그리드 
* 7) distinct
*/

function ADataGrid()
{
	AView.call(this);
	
	
	
	//-----------------------------------------------------------	
	//	data object format
	//	object = { text: 'abc', type:'check', select:true }
	
	this.dataArr2 = [];
	
	//-----------------------------------------------------------
	
	//보여지는 데이터의 시작 인덱스
	this.dataInx = 0;
	this.renderRowCnt = 0;
	
	this.startCol = 0;
	this.endCol = 0;
	
	// 그리드 옵션
	this.option =
    {
    };
	
	this.sortInfo = [];
	this.sortColInx = -1;
	
	this.selObjs = [];
	
}
afc.extendsClass(ADataGrid, AView);


ADataGrid.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	var childComps = this.getChildren();
	this.scrlView = childComps[0];
	this.grid = this.scrlView.getChildren()[0];
	this.scrollBarV = childComps[1];
	this.scrollBarH = childComps[2];
	
	this.option.isSingleSelect = this.grid.option.isSingleSelect;
	this.option.isSelectable = this.grid.option.isSelectable;
	this.option.isFullRowSelect = this.grid.option.isFullRowSelect;
	this.option.isPivotGrid = this.$ele.attr('data-pivot-grid');
	this.option.isHideHScrollbar = this.$ele.attr('data-hide-hscrollbar');
	
	if(this.option.isPivotGrid) 
	{
		this.pivotGrid = childComps[3];	
		this.pivotGrid.option.isFullRowSelect = false;
	}
	
	//기본 그리드의 fullRowSelect 가 작동되지 않도록, 데이터그리드는 자체적으로 처리한다.
	this.grid.option.isFullRowSelect = false;
	
	for(var i=0; i<this.grid.columnCount; i++)
	{
		this.sortInfo.push({order:1});		//정렬 오름차순 1, 내림차순 -1
	}
	
	if(this.pivotGrid) this.scrollBarV.addWheelArea(this.pivotGrid.element);
	
	this.scrollBarV.addWheelArea(this.grid.element);

	this.scrollBarV.addEventListener('scroll', this, 'onScrollY');
	this.scrollBarH.addEventListener('scroll', this, 'onScrollX');
	
	if(this.pivotGrid) this.pivotGrid.addEventListener('select', this, 'onGridSelect');
	
	this.grid.addEventListener('select', this, 'onGridSelect');
	
	this.grid.scrollArea.css('overflow-y', 'visible');	//or hidden
	
	
	//scrollGap : 하나의 데이터를 표현할 영역의 넓이... 보통 그리드에서 로우
	//scrollPadding : 스크롤 영역에서 제외할 상단 영역.. 보통 그리드에서 헤더
	this.scrollBarV.setScrollArea(this.grid.scrollArea.height(), this.grid.hRowTmplHeight, this.grid.rowTmplHeight, true);	//scrlAreaHeight, scrollPadding, scrollGap
	
	//ADataGrid 에 한해서 모바일인 경우 pc 용 스크롤 바가 보이도록
	if(afc.isMobile)
	{
		this.$ele.addClass('_global_scroll_style_');
		//모바일을 위한 자체 스크롤 활성화
		this.enableScrlManagerY();
		
		if(this.pivotGrid) this.enableScrlManagerX();
	}
};

ADataGrid.prototype.updatePosition = function(width, height)
{
	AView.prototype.updatePosition.call(this, width, height);
	
	this.scrollBarV.setScrollArea(this.grid.scrollArea.height(), this.grid.hRowTmplHeight, this.grid.rowTmplHeight, true);
	
	var pivotAdd = 0;
	
	if(this.pivotGrid) pivotAdd = this.pivotGrid.getWidth();
	
	this.scrollBarH.setScrollArea(this.scrlView.$ele.width(), 0, 1);
	this.scrollBarH.setDataCount(this.grid.$ele.width()+pivotAdd);
	
	if(!window._afc)
	{
		this.resetInitRow();
		this.renderData();
	}
};

//좌우 스크롤시 보여지는 컬럼만 갱신하기 위해 startCol 과 endCol 의 값을 구한다.
ADataGrid.prototype.checkColPos = function()
{
	var chkStart = this.scrlView.element.scrollLeft, 
		chkEnd = chkStart + this.scrlView.element.clientWidth - 17;
	
	var $cells = $(this.grid.getRow(0)).children();
	var end = $cells.length, sum = 0, i = 0;
	
	
	for(; i<end; i++)
	{
		sum += $cells.get(i).offsetWidth;
		
		if(sum>chkStart) 
		{
			this.startCol = i++;
			break;
		}
	}
	
	for(; i<end; i++)
	{
		sum += $cells.get(i).offsetWidth;
		
		if(sum>chkEnd) 
		{
			this.endCol = i;
			break;
		}
	}
		
	//console.log(this.startCol + ', ' + this.endCol);
};

ADataGrid.prototype.clearSelected = function()
{
	//기존에 선택되어져 있는 선택정보를 지운다. 원본 obj 의 원소가 지워지는 것이 아니므로
	for(var i=0; i<this.selObjs.length; i++)
	{
		this.selObjs[i].select = undefined;
		this.selObjs[i].parentArr = undefined;
	}

	this.selObjs.length = 0;
};

ADataGrid.prototype.addSelectObj = function(selObj, existCheck)
{
	if(existCheck)
	{
		//기존에 원소가 존재하면 지우고 추가 실패이므로 return false
		if(this.removeSelectObj(selObj)>-1) return;
	}
	
	selObj.select = true;
	
	this.selObjs.push(selObj);
};

//selObj 가 존재하지 않으면 -1 리턴
ADataGrid.prototype.removeSelectObj = function(selObj)
{
	var inx = this.selObjs.indexOf(selObj);
	
	if(inx>-1) 
	{
		selObj.select = undefined;
		selObj.parentArr = undefined;
		
		this.selObjs.splice(inx, 1);
	}
	
	return inx;
};


ADataGrid.prototype.onGridSelect = function(acomp, info, e)
{
	var cell = info[0], evtObj = {}, addVal = 0;
	
	evtObj.isHeader = cell.isHeader;
	
	if(this.pivotGrid && acomp===this.grid)	//피봇그리드가 존재하면서 스크롤 그리드의 셀을 선택한 경우
		addVal = this.pivotGrid.columnCount;

	var pos = acomp.indexOfCell(cell),
		rowInx = this.dataInx + pos[0],
		colInx = addVal + pos[1],
		parentArr = this.dataArr2[rowInx];
	
	if(e.target.type == 'button')
	{
		acomp.deselectCell(info);
		return;
	}
	
	//헤더를 클릭한 경우
	if(cell.isHeader)
	{
		//colInx = acomp.colIndexOfCell(cell) + addVal;
		
		evtObj.rowInx = 0;
		evtObj.colInx = colInx;
		
		if(this.sortColInx==colInx) 
		{
			this.sortInfo[colInx].order *= -1;
		}
		
		//정렬 컬럼이 바뀌면 
		else 
		{
			//이전 컬럼의 정렬 정보를 초기화
			if(this.sortColInx>-1)
			{
				this.sortInfo[this.sortColInx].order = 1;	//정렬 오름차순 1, 내림차순 -1
			
				this.sortImg.remove();
				this.sortImg = null;
			}
		
			this.sortColInx = colInx;
		}
		
		var sortImgName = this.sortInfo[colInx].order == 1? 'sort_up':'sort_down';
		// sort Image 변경
		if(this.sortImg) this.sortImg.attr('src', 'Framework/afc/image/' + sortImgName + '.png');
		else
		{
			this.sortImg = $('<img src="Framework/afc/image/' + sortImgName + '.png" style="vertical-align: middle; margin-left: 5px; margin-right: -21px"></img>');
			$(cell).append(this.sortImg);
		}
		
		this.sortColumn(this.sortColInx);
	}
	
	//body cell 을 클릭한 경우
	else
	{
		var isClear = (this.option.isSingleSelect || !e.ctrlKey);	//싱글 셀렉트가 아니고 컨트롤키가 눌리면 
		
		if(isClear) this.clearSelected();

		var pos = acomp.indexOfCell(cell), obj,
			rowInx = this.dataInx + pos[0], parentArr = this.dataArr2[rowInx];
		
		//colInx = pos[1] + addVal;
			
		evtObj.rowInx = rowInx;
		evtObj.colInx = colInx;

		if(this.option.isFullRowSelect) 
		{
			var colCnt = this.grid.columnCount;
			
			if(this.pivotGrid) colCnt += this.pivotGrid.columnCount;
			
			for(var i=0; i<colCnt; i++)
			{
				obj = parentArr[i];
				
				obj.parentArr = parentArr;

				this.addSelectObj(obj, !isClear);
				
				//클릭한 셀만 체크
				if(i==colInx)
				{
					//type은 checkbox 또는 radio 임
					if(obj.type) obj.checked = !obj.checked;
				}
			}
			
			evtObj.selObj = parentArr;
		}
		else
		{
			obj = parentArr[colInx];
			
			//향후에 obj 만으로 자신의 배열상의 인덱스를 얻기 위해 저장해 둠.
			obj.parentArr = parentArr;

			this.addSelectObj(obj, !isClear);
			
			evtObj.selObj = obj;
			
			//type은 checkbox 또는 radio 임
			if(obj.type) obj.checked = !obj.checked;
		}
		
		this.renderData();
	}
	
	if(this.aevent.selectBind)
		this.reportEvent('select', evtObj, e);
	
};

ADataGrid.prototype.onScrollX = function(acomp, info)
{
	this.scrlView.element.scrollLeft = info;
	
	this.checkColPos();
	
	this.renderData();
};

ADataGrid.prototype.onScrollY = function(acomp, info)
{
	if(this.scrollBarV.isScrollBottom()) 
	{
		this.dataInx = this.dataArr2.length - this.scrollBarV.getCountPerArea();
		
		if(this.aevent.scrollbottomBind)
			this.reportEvent('scrollbottom', null, e);	
	}
	else 
	{
		if(this.aevent.scrolltopBind && this.scrollBarV.isScrollTop()) this.reportEvent('scrolltop', null, e);
		
		this.dataInx = Math.floor(info/this.grid.rowTmplHeight);
	}
	
	this.renderData();
};

//모든 row 를 지우고 현재의 데이터와 상황에 맞게 row 를 다시 추가한다.
ADataGrid.prototype.resetInitRow = function()
{
	//반대로 로우가 삭제되어 0이 되는 경우도 있으므로 이 비교를 하면 안됨.
	//if(this.dataArr2.length<1) return;
	
	var cnt = Math.min(this.scrollBarV.getCountPerArea(), this.dataArr2.length);
	
	if(cnt==this.renderRowCnt) return;

	if(this.pivotGrid) this.pivotGrid.removeAll();
	
	this.grid.removeAll();
	
	for(var i=0; i<cnt; i++)
	{
		if(this.pivotGrid) this.pivotGrid.addRow([]);
		
		this.grid.addRow([]);
	}
	
	this.renderRowCnt = cnt;
	
	this.checkColPos();
};

//현재의 index 및 offset 정보로 부터 데이터를 얻어와 그리드 셀의 각 값을 갱신한다.
//즉, 화면을 다시 그리는 일을 한다.
ADataGrid.prototype.renderData = function()
{
	var end = this.dataInx + this.renderRowCnt, 
		i = this.dataInx, j = 0;

	if(this.pivotGrid) this.pivotGrid.clearSelected();

	this.grid.clearSelected();

	var dataOffset = this.pivotGrid ? this.pivotGrid.columnCount : 0;

	for(; i<end; i++)
	{
		if(this.pivotGrid) this.pivotGrid.setRowByObj(this, j, this.dataArr2[i]);

		this.grid.setRowByObj(this, j++, this.dataArr2[i], this.startCol, this.endCol, dataOffset);
	}
};

ADataGrid.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;
};

ADataGrid.prototype.buttonClick = function(acomp, info, e)
{
	if(this.delegator && this.delegator.buttonClick) this.delegator.buttonClick(info, e);
};

ADataGrid.prototype.enableScrlManagerY = function()
{
	if(this.scrlManagerY) return;

	var thisObj = this;
	
	this.scrlManagerY = new ScrollManager();
	this.scrlManagerY.setOption({moveDelay: 5});
	
	this.scrollImplementY();
};

ADataGrid.prototype.enableScrlManagerX = function()
{
	if(this.scrlManagerX) return;

	var thisObj = this;
	
	this.scrlManagerX = new ScrollManager();
	this.scrlManagerX.setOption({moveDelay: 10});
	
	
	this.scrollImplementX();
};


ADataGrid.prototype.scrollImplementY = function() 
{
	var thisObj = this,
		isDown = false,	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
		scrlArea = this.element;
		
	//--------------------------------------------------------
	//	scroll 그리드 
	
	//touch start
	AEvent.bindEvent(scrlArea, AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		thisObj.isScrollingY = false;
		thisObj.isScrollingX = false;
		
		e.preventDefault();
		
		thisObj.scrlManagerY.initScroll(e.changedTouches[0].clientY);
		
	});
	
	//touch move
	AEvent.bindEvent(scrlArea, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown || thisObj.isScrollingX) return;
		
		e.preventDefault();
		
		thisObj.scrlManagerY.updateScroll(e.changedTouches[0].clientY, _scrlHelper);
	});
	
	//touch end
	AEvent.bindEvent(scrlArea, AEvent.ACTION_UP, function(e)
	{
		if(!isDown || thisObj.isScrollingX) return;
		isDown = false;
		
		e.preventDefault();
		
		thisObj.scrlManagerY.scrollCheck(e.changedTouches[0].clientY, _scrlHelper);
	});
	
	
	function _scrlHelper(move)
	{
//console.log(move);

		if(move==0) return true;
		
		
		if(!thisObj.isScrollingY) thisObj.isScrollingY = true;
		
	
		//move = Math.floor(move/thisObj.grid.rowTmplHeight);
		
		
		//thisObj.dataInx += move;
		
		//if(thisObj.dataInx<0) return true;
		
		//thisObj.onScrollY(null, move);
		
		
		thisObj.scrollBarV.offsetBarPos(move);
		
		//thisObj.renderData();

		return true;
	}
};

ADataGrid.prototype.scrollImplementX = function() 
{
	var thisObj = this,
		isDown = false,	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
		scrlArea = this.scrlView.element;
		
	//--------------------------------------------------------
	//	scroll 그리드 
	
	//touch start
	AEvent.bindEvent(scrlArea, AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		thisObj.isScrollingX = false;
		thisObj.isScrollingY = false;
		
		e.preventDefault();
		
		thisObj.scrlManagerX.initScroll(e.changedTouches[0].clientX);
		
	});
	
	//touch move
	AEvent.bindEvent(scrlArea, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown || thisObj.isScrollingY) return;
		
		e.preventDefault();
		
		thisObj.scrlManagerX.updateScroll(e.changedTouches[0].clientX, _scrlHelper);
	});
	
	//touch end
	AEvent.bindEvent(scrlArea, AEvent.ACTION_UP, function(e)
	{
		if(!isDown || thisObj.isScrollingY) return;
		isDown = false;
		
		e.preventDefault();
		
		thisObj.scrlManagerX.scrollCheck(e.changedTouches[0].clientX, _scrlHelper);
	});
	
	
	function _scrlHelper(move)
	{
		if(move==0) return true;
		
		if(!thisObj.isScrollingX) thisObj.isScrollingX = true;
	
		thisObj.scrollBarH.offsetBarPos(move);
		
		return true;
	}
};

//-----------------------------------------------------------------------------------
//	public functions

//dataArr2 의 변화값을 스크롤바에 반영하고 그리드의 각 값도 갱신한다.
ADataGrid.prototype.updateDataGrid = function()
{
	this.scrollBarV.setDataCount(this.dataArr2.length);
	
	this.resetInitRow();
	this.renderData();
};

ADataGrid.prototype.getGridData = function()
{
	return this.dataArr2;
};

//	dataArr2 is two dimension array that is composed of objects
//	object = { text: 'abc', type:'check', select:true }
ADataGrid.prototype.setGridData = function(dataArr2, noUpdate)
{
	this.dataArr2 = dataArr2;
	
	//원본 데이터가 사라지므로 데이터만 지워주면 됨.
	this.selObjs.length = 0;
	this.dataInx = 0;
	
	this.maskGridData(dataArr2);
	
	// type이 sum인 경우 위의 항목을 다 더한다.
	this.sum();
	
	if(!noUpdate) this.updateDataGrid();
};

ADataGrid.prototype.removeAllRowData = function(noUpdate)
{
	this.dataArr2.length = 0;
	
	//원본 데이터가 사라지므로 데이터만 지워주면 됨.
	this.selObjs.length = 0;
	this.dataInx = 0;
	
	if(!noUpdate) this.updateDataGrid();
};

ADataGrid.prototype.maskRowData = function(rowData)
{
	this.maskGridData([rowData]);
};

ADataGrid.prototype.maskGridData = function(gridData)
{
	var $tmplCells, dataObj, rowData,
		$pTmplCells = $(),
		pivotColCnt = 0,
		pivotGrid = this.getPivotGrid();

	if(pivotGrid)
	{
		pivotColCnt = pivotGrid.getColumnCount();
		$pTmplCells = pivotGrid.$rowTmpl.eq(0).children('td');
	}
	//차후 매번 호출되지 않도록 멤버 변수로 만들어 놓기
	//var $tmplCells = this.grid.$rowTmpl.eq(0).children('td'), dataObj;
	$tmplCells = this.grid.$rowTmpl.eq(0).children('td');
	
	for(var i=0; i<gridData.length; i++)
	{
		rowData = gridData[i];
		$pTmplCells.each(function(j) {
			if(this.dm)
			{
				dataObj = rowData[j];
				if(this.dm.maskFuncs[0] === ADataMask.DataGrid.dataType)
				{
					this.dm.mask(dataObj); //{ text: '' };
				}
				else
				{
					dataObj.original = dataObj.text;
					dataObj.text = this.dm.mask(dataObj.text);
				}
				
				//dataObj = this.dm.mask(dataObj); { type:'checkbox', checked:dataObj.text};
			}
		});

		$tmplCells.each(function(j)	{
			if(this.dm)
			{
				dataObj = rowData[j + pivotColCnt];
				dataObj.original = dataObj.text;
				dataObj.text = this.dm.mask(dataObj.text);
				
			}
		});
	}
};

ADataGrid.prototype.sum = function()
{
	var rowData, sumRowData, sumColDataArr = [];
	for(var i=this.dataArr2.length-1; i>-1; i--)
	{
		rowData = this.dataArr2[i];
		for(var j=0; j<this.dataArr2[i].length; j++)
		{
			if(this.dataArr2[i][j].type == 'sum')
			{
				if(sumColDataArr[j]) this.maskCellData(i, j, sumColDataArr[j]);
				sumColDataArr[j] = rowData[j];
				sumColDataArr[j].text = 0;
				continue;
			}
			
			if(sumColDataArr[j])
			{
				if(rowData[j].original) sumColDataArr[j].text += parseFloat(rowData[j].original);
				else sumColDataArr[j].text += parseFloat(rowData[j].text);
			}
			
			if(i==0)
			{
				if(sumColDataArr[j]) this.maskCellData(i, j, sumColDataArr[j]);
			}
		}
	}
};

ADataGrid.prototype.insertRowData = function(rowInx, rowData, noUpdate)
{
	this.maskRowData(rowData);
	
	this.dataArr2.splice(rowInx, 0, rowData);

	// type이 sum인 경우 위의 항목을 다 더한다.
	this.sum();
	
	if(!noUpdate) this.updateDataGrid();
};

ADataGrid.prototype.addRowData = function(rowData, noUpdate)
{
	this.insertRowData(this.dataArr2.length, rowData, noUpdate);
};

//특정 row 의 전체 데이터를 덮어 쓴다.
ADataGrid.prototype.setRowData = function(rowInx, rowData, noUpdate)
{
	this.maskRowData(rowData);
	
	this.dataArr2[rowInx] = rowData;
	
	if(!noUpdate) this.updateDataGrid();
};

//this.mergeCellData 함수와 같은 작업을 로우의 전체 cell 에 수행한다.
ADataGrid.prototype.mergeRowData = function(rowInx, rowData, noUpdate)
{
	var curRowData = this.dataArr2[rowInx];
	
	for(var i=0; i<curRowData.length; i++)
		afc.mergeObject(curRowData[i], rowData[i]);
	
	if(!noUpdate) this.updateDataGrid();
};


ADataGrid.prototype.removeRowData = function(rowInx, noUpdate)
{
	this.dataArr2.splice(rowInx, 1);
	
	if(!noUpdate) this.updateDataGrid();
};

ADataGrid.prototype.getRowData = function(rowInx)
{
	return this.dataArr2[rowInx];
};

ADataGrid.prototype.maskCellData = function(rowInx, colInx, cellData)
{
	var pivotColCnt = 0,
		pivotGrid = this.getPivotGrid();

	if(pivotGrid)
	{
		pivotColCnt = pivotGrid.getColumnCount();
		if(colInx < pivotColCnt)
		{
			_mask_func(pivotGrid.$rowTmpl.eq(0).children('td').get(colInx));
			return;
		}
	}
	
	_mask_func(this.grid.$rowTmpl.eq(0).children('td').get(colInx - pivotColCnt));
	
	function _mask_func(cell)
	{
		if(cell.dm)
		{
			if(cell.dm.maskFuncs[0] === ADataMask.DataGrid.dataType)
			{
				cellData.type = cell.dm.maskParams[0][0];
				cell.dm.mask(cellData); //{ text: '' };
			}
			else
			{
				cellData.original = cellData.text;
				cellData.text = cell.dm.mask(cellData.text);
			}
		}
	}
};

//특정 cell 의 데이터를 덮어 쓴다.
ADataGrid.prototype.setCellData = function(rowInx, colInx, cellData, noUpdate)
{
	this.maskCellData(rowInx, colInx, cellData);

	this.dataArr2[rowInx][colInx] = cellData;
	
	if(!noUpdate) this.updateDataGrid();
};

//특정 cell 의 기존 데이터와 새로운 데이터를 머지한다.
ADataGrid.prototype.mergeCellData = function(rowInx, colInx, cellData, noUpdate)
{
	var curData = this.dataArr2[rowInx][colInx];
	
	this.maskCellData(rowInx, colInx, cellData);
	
	afc.mergeObject(curData, cellData);
	
	if(!noUpdate) this.updateDataGrid();
};


ADataGrid.prototype.getCellData = function(rowInx, colInx)
{
	return this.dataArr2[rowInx][colInx];
};

// 데이터 목록 중 colInx 위치의 데이터가 checked 인 데이터 배열을 리턴하는 함수
ADataGrid.prototype.getCheckedData = function(colInx)
{
	var arr = [];
	if(colInx == undefined) colInx = 0;
	for(var i=0; i<this.dataArr2.length; i++)
	{
		if(this.dataArr2[i][colInx].checked)
		{
			arr.push(this.dataArr2[i]);
		}
	}
	
	return arr;
};


ADataGrid.prototype.sortColumn = function(colInx)
{
	var order = this.sortInfo[colInx].order;
	
	this.dataArr2.sort(function(a, b)
	{
		var textA = a[colInx].text;//.toUpperCase();
		var textB = b[colInx].text;//.toUpperCase();
		if (textA < textB) return -order;
		if (textA > textB) return order;
		return 0;
	});
	
	this.renderData();
};

//선택된 모든 object 들을 배열로 리턴한다. 
ADataGrid.prototype.getSelectObjs = function()
{
	return this.selObjs;
};

//선택된 obj 가 포함된 배열들을 배열로 리턴한다.
ADataGrid.prototype.getSelectRowArrs = function()
{
	var retArr = [], parArr;
	
	for(var i=0; i<this.selObjs.length; i++)
	{
		parArr = this.selObjs[i].parentArr;
		
		if(retArr.indexOf(parArr)<0) 
		{
			retArr.push(parArr);
			
			if(this.option.isFullRowSelect) i += this.grid.columnCount - 1;
		}
	}
	
	return retArr;
};

//row array 의 인덱스를 리턴한다. row array 는 object 담고 있는 1차원 배열
ADataGrid.prototype.indexOfRowArr = function(rowArr)
{
	return this.dataArr2.indexOf(rowArr);
};

//select object 가 위치한 row 의 index 를 리턴한다.
ADataGrid.prototype.rowIndexOfSel = function(selObj)
{
	if(selObj.parentArr) return this.dataArr2.indexOf(selObj.parentArr);
	else return -1;
};

//select object 가 위치한 column 의 index 를 리턴한다.
ADataGrid.prototype.colIndexOfSel = function(selObj)
{
	if(selObj.parentArr) return selObj.parentArr.indexOf(selObj);
	else return -1;
};


ADataGrid.prototype.setPivotGrid = function(grid)
{
	this.pivotGrid = grid;
	this.option.isPivotGrid = grid ? true : false;
};

ADataGrid.prototype.getPivotGrid = function()
{
	return this.pivotGrid;
};

// 매핑가능한 개수를 리턴한다.
ADataGrid.prototype.getMappingCount = function()
{
	var mappingArr = this.grid.getMappingCount();
	if(this.pivotGrid)
	{
		var pMappingArr = this.pivotGrid.getMappingCount();
		//pMappingArr[0] = 'P ' + pMappingArr[0];
		mappingArr = pMappingArr.concat(mappingArr);
	}
	
	return mappingArr;
};

ADataGrid.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	//	object = { text: 'abc', type:'check', select:true }
	
	/*	
	this.$rowTmpl.find('td').each(function()
	{
		if(this.dm) this.dm.setQueryData(data, keyArr, queryData);
	});	
	*/
	
	var i, j, rowData, arr, keyVal;
	
	for(i=0; i<dataArr.length; i++)
	{
		rowData = dataArr[i];
		
		arr = new Array(keyArr.length);

		for(j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];

			if(keyVal) arr[j] = { text: rowData[keyVal] };
		}
		
		this.addRowData(arr, true);
	}
	
	this.updateDataGrid();
};



//------------------------------------------------------------------------------


ADataGrid.NAME = "ADataGrid";

ADataGrid.CONTEXT = 
{
    tag: '<div class="ADataGrid-Style" data-base="ADataGrid" data-class="ADataGrid">\
        <div class="AView-Style" data-base="AView" data-class="AView" data-sgap-height="1" data-sgap-width="1" data-stretch-height="true" data-stretch-width="true" style="width: calc((100% - 0px) - 15px); height: calc((100% - 0px) - 15px); left: 0px; top: 0px; overflow: hidden;">\
	<div data-base="AGrid" data-class="AGrid" data-flag="0001" data-selectable="true" data-clear-rowtmpl="true" class="AGrid-Style" style="width: 200%; height: 100%; left: 0px; top: 0px;" data-fullrow-select="true">\
		<table class="grid-header-table" align="center">\
		<colgroup><col><col><col><col><col><col></colgroup>\
		<thead align="center" class="head-prop" style="display: none;">\
			<tr height="22px">\
			<td style="border: 1px solid rgb(194, 194, 194);">col1</td>\
			<td style="border: 1px solid rgb(194, 194, 194);">col2</td>\
			<td style="border: 1px solid rgb(194, 194, 194);">col3</td>\
			<td style="border: 1px solid rgb(194, 194, 194);">col4</td>\
			<td style="border: 1px solid rgb(194, 194, 194);">col5</td>\
			<td style="border: 1px solid rgb(194, 194, 194);">col6</td>\
			</tr>\
		</thead>\
	</table>\
	<div class="grid-scroll-area">\
	<table class="grid-body-table" align="center">\
	<colgroup><col><col><col><col><col><col></colgroup>\
	<thead align="center" class="head-prop" style="">\
	<tr height="22px">\
	<td style="border: 1px solid rgb(194, 194, 194);">col1</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">col2</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">col3</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">col4</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">col5</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">col6</td>\
	</tr>\
	</thead>\
	<tbody align="center" class="body-prop">\
	<tr height="22px">\
	<td style="border: 1px solid rgb(194, 194, 194);">data 1,1</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">data 1,2</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">data 1,3</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">data 1,4</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">data 1,5</td>\
	<td style="border: 1px solid rgb(194, 194, 194);">data 1,6</td>\
	</tr>\
	</tbody>\
	</table>\
	</div></div></div>\
<div class="AScrollBar-Style" data-base="AScrollBar" data-class="AScrollBar" data-scroll-type="" data-sgap-height="1" data-stretch-height="true" style="width: 14px; height: calc(100% - 15px); overflow-y: scroll; position: absolute; right: 0px; top: 0px; overflow-x: hidden;">\
                                                            <span style="width: 100%; height: 0px;"></span>\
                                                            <span style="width: 100%; height: 0px;"></span>\
                                                        </div>\
                                                        <div class="AScrollBar-Style" data-base="AScrollBar" data-class="AScrollBar" data-scroll-type="hori" data-sgap-width="1" data-stretch-width="true" style="height: 14px; overflow-x: scroll; width: calc(100% - 15px); position: absolute; left: 0px; bottom: 0px; overflow-y: hidden;">\
                                                            <span style="width: 830px; height: 100%;"></span>\
                                                            <span style="width: 830px; height: 100%;"></span>\
                                                        </div>\
                                                    </div>',

    defStyle:
    {
        width:'600px', height:'300px'
    },

    events: [ 'dblclick', 'longtab', 'select', 'scrolltop', 'scrollbottom' ]
};



