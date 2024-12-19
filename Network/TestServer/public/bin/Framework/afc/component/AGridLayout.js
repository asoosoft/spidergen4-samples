/**
 * @author asoocool
 */

//--------------------------------------------------------------------
//	insertView 함수를 호출하여 ViewDirection 방향으로 뷰를 추가한다.
//	추가하려는 뷰의 높이가 100% 이면 남은 공간 전체를 차지한다.
//	auto 나 픽셀을 직접 지정한 경우는 원하는 높이가 된다.
//--------------------------------------------------------------------
function AGridLayout()
{
    ALayout.call(this);
	
	this.$table = null;
	this.$body = null;
	this.$colGroup = null;
}
afc.extendsClass(AGridLayout, ALayout);

AGridLayout.CONTEXT = 
{
	tag: '<div data-base="AGridLayout" data-class="AGridLayout" data-flag="0001" class="AGridLayout-Style" >' + 
			'<table cellpadding="0" cellspacing="0" ><colgroup><col><col></colgroup>' + 	//border="1"
    		'<tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table></div>',	//2 by 2
			
			//<colgroup><col><col></colgroup>
/*
	tag: '<div data-base="AGridLayout" data-class="AGridLayout" data-flag="0001" class="AGridLayout-Style" >' + 
			'<table cellpadding="0" cellspacing="0" border="1">' + 	//border="1"
    		'<tbody></tbody></table></div>',	//2 by 2
*/
    defStyle: 
    {
        width:'300px', height:'300px'  
    },

    events: []
};

AGridLayout.prototype.init = function(context, evtListener)
{
	ALayout.prototype.init.call(this, context, evtListener);

	this.$table = this.$ele.children(); 
	this.$body = this.$table.children('tbody');
	this.$colGroup = this.$table.children('colgroup');
		
	if(window._afc) this.$ele.addClass('dev_AGridLayout-Style'); //add ukmani100
	else this.$ele.removeClass('dev_AGridLayout-Style');

	this.initLayoutComp(evtListener);
};

// td 내에서 width 를 사용한 작업물의 하위호환을 위한 작업. 
// 전부 colgroup 내에서 width 를 설정하는 상황이 된다면 이 코드는 삭제 필요.
AGridLayout.prototype.convertColInfo = function()
{
	var $tags= $('<colgroup></colgroup>');
	
	var cols = this.getCols();
	
	for(var index = 0; index < cols; ++index)
	{
		var $td = $(this.getCell(0,index));
		
		var width = $td.get(0).style.width;
		
		var $tag = $('<col>');
		
		if(width.length > 0)
			$tag.attr('width', isNaN(width)? width:width+'px');
		
		$tags.append($tag);
	}	
	
	this.$table.append($tags);
	
	this.$colGroup = this.$table.children('colgroup');	
}

AGridLayout.prototype.initLayoutComp = function(evtListener)
{
	//자신 내부에 있는 컴포넌트들의 init 은 레이아웃이 담당한다.
	var container = this.getContainer(), 
		rootView = this.getRootView(), 
		parentView = this.getParent(), acomp, $item, thisObj = this;

	this._findChildTd().each(function()
	{
		$item = $(this);
		
		$item.children().each(function()
		{
			acomp = AComponent.realizeContext(this, container, rootView, parentView, evtListener);
			acomp.layoutItem = $item[0];
			acomp.owner = thisObj;
		});
	});

};

AGridLayout.prototype.createLayout = function(rowCount, colCount, rowSizeArr, colSizeArr)
{
	var strRow = '', strCol = '', strColGroup ='' , i;
	
	for(i = 0; i<colCount;i++)
		strColGroup += '<col>';	
	
	//strColGroup = '<colgroup>'+strColGroup+'</colgroup>';	
		
	for(i=0; i<colCount; i++)
		strCol += '<td></td>';

	for(i=0; i<rowCount; i++)
		strRow += '<tr>' + strCol + '</tr>';
		
	this.$body.append(strRow);
	this.$colGroup.append(strColGroup);
	
	this.setLayoutSize(rowSizeArr, colSizeArr);
};

//width, height 파라미터를 생략하면 100% 로 셋팅된다.
AGridLayout.prototype.layComponentAt = function(acomp, row, col, width, height)
{
	this.layComponent(acomp, this.getCell(row, col), width, height);
};

//cell 파람 내부에 posEle 란 값이 셋팅되어져 있으면 
//cell 내부에서 posEle 앞에 추가된다.
AGridLayout.prototype.layComponent = function(acomp, cell, width, height)
{
	//if(width==undefined) width = '100%';
	//if(height==undefined) height = '100%';
	
	//cell 이 null 이면 빈자리를 찾아 그 곳에 추가한다.
	if(!cell)
	{
		this._findChildTd().each(function()
		{
			if(this.style.display != 'none' && $(this).children().length==0)
			{
				cell = this;
				return false;
			}
		});
		
		//빈 자리가 없으면 첫번째 셀에 추가한다.
		if(!cell) 
		{
			cell = this._findChildTd()[0];
		}
		
		//빈 자리가 없으면 추가하지 않도록 변경
		//if(!cell) return;
	}
	/*
	else
	{
		//비어있지 않은 경우 추가하지 않는다.
		if($(cell).children().length>0) return;
	}
	*/
	
	acomp.$ele.css(
	{
		//'position': 'static',
		'position': 'relative',
		'left': '0px', 'top':'0px',
		'right': '', 'bottom':'',
		//'width': width, 'height': height
	});
	
	//posEle 값이 셋팅되어져 있으면 그 앞으로 추가
	if(cell.posEle) 
	{
		$(cell.posEle).before(acomp.$ele);
		cell.posEle = undefined;
	}
	else $(cell).append(acomp.$ele);
	
	acomp.setParent(this.getParent());
	
	acomp.layoutItem = cell;
	acomp.owner = this;
};

AGridLayout.prototype.getAllLayoutComps = function()
{
	var retArr = [], $child;
	this._findChildTd().each(function()
	{
		$(this).children().each(function()
		{
			if(this.acomp) retArr.push(this.acomp);
		});
	});
	
	return retArr;
};

AGridLayout.prototype.eachChild = function(callback, isReverse)
{
	var $children;
	
	if(isReverse) $children = $(this._findChildTd().get().reverse());
	else $children = this._findChildTd();

	$children.each(function(inx)
	{
		var children = $(this).children(),
			child;
		for(var i=0; i<children.length; i++)
		{
			child = children[i];
			if(!child || !child.acomp) continue;
			if(callback(child.acomp, inx)==false) return false;
		}
	});
};


AGridLayout.prototype.getLayoutComp = function(row, col)
{
	var $cell = $(this.getCell(row, col));
	return $cell.children().get(0).acomp;
};

AGridLayout.prototype.getColGroupItems = function()
{
	return this.$colGroup.children().length;
}

AGridLayout.prototype.getColGroupItem = function(col)
{
	 return this.$colGroup.children().eq(col);
}

AGridLayout.prototype.getCell = function(row, col)
{
    var $row = this.$body.children().eq(row); //tr

	return $row.children().get(col);	//td
};

AGridLayout.prototype.getRow = function(row)
{
    return this.$body.children().get(row); //tr
};

AGridLayout.prototype.insertRow = function(row , isAfter)
{
	var $row = $(this.getRow(row)),
		count = $row.children().length, strCol = '';

	var height = this.getRowSize(row);

	for(var i=0; i<count; i++)
		strCol += '<td></td>';

	strCol = '<tr>' + strCol + '</tr>';

	if(isAfter) $row.after(strCol);
	else $row.before(strCol);
	
	if(height!=undefined)
		this.setRowSize(isAfter? row+1:row, height);
};

AGridLayout.prototype.insertCol = function(col, isAfter)
{
	var width = this.getColSize(col);
	var $colGroupItem = this.$colGroup.children().eq(col);
	
	col++;
	
	var $ret = this._findChildTd( 'td:nth-child('+col+')' );
	
	if(isAfter)
	{
		$ret.after('<td></td>');
		$colGroupItem.after('<col>');
	} 
	else 
	{
		$ret.before('<td></td>'); 
		$colGroupItem.before('<col>');
	}

	this.setColSize(isAfter? col: col-1, width);
};

AGridLayout.prototype.removeRow = function(row)
{
	var $row = $(this.getRow(row));
	
	$row.remove();
}

// 숨겨진 cell 에 colspan 이 존재하면 안됨!!
AGridLayout.prototype.removeCol = function(col)
{
	var rowCount = this.getRows();
	/*
	// colspan 이거나 colspan 에 의해 가려진 cell 처리
	for(var index = 0; index < rowCount; ++index)
	{
		var $td = $(this.getCell(index, col));

		// 숨겨져있었던 cell 이면 colspan 카운트 감소
		if($td.css('display')=='none')
		{
			this.reduceColSpanCount(index,col);
			continue;
		}
			
		// colspan 인경우 colspan cell 재정의
		var colspan = $td.attr('colspan');
		if(colspan!=undefined) 
		{
			var $nextTd = $(this.getCell(index, (col*1)+1))
			
			var result = colspan -1;
			if(result <= 1) $nextTd.removeAttr('colspan');
			else $nextTd.attr('colspan', result);
			
			$nextTd.show();
		}
	}
	*/
	
	this.$colGroup.children().eq(col).remove();
	
	var removeCol = (col*1) +1;
	// 정리된후 col 삭제
	this._findChildTd( 'td:nth-child('+removeCol+')' ).remove();	
}

AGridLayout.prototype.reduceColSpanCount = function(row, col)
{	
	var start = col-1;
	var end = 0;
	
	for(var index = start; index >= 0; --index)
	{
		var $td = $(this.getCell(row,index))
		
		var colspan = $td.attr('colspan');
	
		if(colspan!=undefined) 
		{
			var result = colspan -1;

			if(result <= 1) $td.removeAttr('colspan');
			else $td.attr('colspan', result);
		}
	}
}

AGridLayout.prototype.setLayoutSize = function(rowSizeArr, colSizeArr)
{
	if(rowSizeArr)
	{
		for(var i=0; i<rowSizeArr.length; i++)
			this.setRowSize(i, rowSizeArr[i]);
	}
	
	if(colSizeArr)
	{
		for(var i=0; i<colSizeArr.length; i++)
			this.setColSize(i, colSizeArr[i]);
	}
};

AGridLayout.prototype.setColSize = function(col, size)
{
	if(!isNaN(size) && size != '') size += 'px';

	this.$colGroup.children().eq(col).attr('width', size);

	//$(this.getCell(0, col)).width(size);
};

AGridLayout.prototype.setRowSize = function(row, size)
{
	$(this.getRow(row)).children('td').css('height', size);
};


AGridLayout.prototype.setLayoutPadding = function(padding)
{
	//this.$table.attr('cellpadding', padding);
	this._findChildTd().css('padding', padding); //add ukmani100
	
};

//add ukmani100
AGridLayout.prototype.setCellPadding = function(row, col, padding)
{	
	$(this.getCell(row, col)).css('padding', padding);
};

AGridLayout.prototype.setLayoutAlign = function(align)
{
	this.$table.css('text-align', align);
};

AGridLayout.prototype.setCellAlign = function(row, col, align)
{
	var $cell = $(this.getCell(row, col));
	$cell.css('text-align', align);
	
};

AGridLayout.prototype.setCellValign = function(row, col, align)
{
	var $cell = $(this.getCell(row, col));
	$cell.css('vertical-align', align);
};


//----------------------------------------------------------------------

AGridLayout.prototype.mergeRow = function(row, col, span)
{
	var $row = $(this.getRow(row));

	var start = row +1;
	var end = start + span -1;
	
	var totalSpan = span;
	
	var startCol = $row.children().eq(col);
	
	for(var index = start; index < end; ++index)
	{
		var $currow = $(this.getRow(index));
		
		var curCol = $currow.children().eq(col);
		
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

AGridLayout.prototype.mergeCol = function(row, col, span)
{
	var $row = $(this.getRow(row));

	// colspan td 다음부터(+1) 
	var start = col+1; 
	var end = start + span-1;
	var totalSpan = span;
	
	var startCol = $row.children().eq(col);
		
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

// merge 된 cell 의 row, col 을 전부 분리.
AGridLayout.prototype.splitCell = function(row,col)
{	
	var $td = $(this.getCell(row,col));
	
	var rowSpanCount = $td.attr('rowspan');
	if(rowSpanCount == undefined) rowSpanCount = 1;
		
	var colSpanCount = $td.attr('colspan');
	if(colSpanCount == undefined) colSpanCount = 1;
	
	//정수형으로 만들기 위해 *1
	var rStart = Number(row);
	var rEnd = Number(rStart) + Number(rowSpanCount);
		
	var cStart = Number(col);
	var cEnd = Number(cStart) + Number(colSpanCount);

	for(var rIndex = rStart; rIndex < rEnd; ++rIndex)
	{
		for(var cIndex = cStart; cIndex < cEnd; ++cIndex)
		{
			var $curTd = $(this.getCell(rIndex,cIndex));
			$curTd.show();
		}
	}
		
	$td.removeAttr('rowspan');
	$td.removeAttr('colspan');		
}

AGridLayout.prototype.splitRow = function(row, col)
{
	var $row = $(this.getRow(row));
	//$row.children().eq(col).removeAttr('colspan');
	$row.children().eq(col).removeAttr('rowspan'); //add ukmani100
};

AGridLayout.prototype.splitCol = function(row, col)
{
	var $row = $(this.getRow(row));
	//$row.children().eq(col).removeAttr('rowspan');
	$row.children().eq(col).removeAttr('colspan'); //add ukmani100
};


//----------------------------------------------------------------------
// add ukmani100
//----------------------------------------------------------------------


AGridLayout.prototype.getLayoutPadding = function()
{	
	return this.getCell(0,0).style.padding;
};


AGridLayout.prototype.getCellPadding = function(row, col)
{	
	return this.getCell(row, col).style.padding;
};


AGridLayout.prototype.getLayoutAlign = function()
{
	return this.$table.get(0).style.textAlign; //this.$table.css('text-align');
};

AGridLayout.prototype.getCellAlign = function(row, col)
{
	return this.getCell(row, col).style.textAlign;
};

AGridLayout.prototype.getCellValign = function(row, col)
{
	return this.getCell(row, col).style.verticalAlign;	
};

AGridLayout.prototype.getColSize = function(col)
{	
	var width = this.$colGroup.children().eq(col).attr('width');
	if(width == undefined) return '';
	return width;
	//return this.getCell(0, col).style.width;
};

AGridLayout.prototype.getRowSize = function(row)
{	
	//return $(this.getRow(row)).children().eq(0).css('height');
	return $(this.getRow(row)).children('td')[0].style.height;
};


AGridLayout.prototype.getRows = function()
{
	return  this.$body.children().length;
};

AGridLayout.prototype.setRows = function(rows)
{	
	var i=0, rowsCnt = this.getRows(); //현재 rows
	
	if(rows < 1) rows = 1;
		
	if(rows < rowsCnt)
	{	
		for(i = rowsCnt-1 ; i > rows-1 ; i--){
		
			$(this.getRow(i)).remove();
		}
	}
	else if(rows > rowsCnt)
	{	
		for(i = rowsCnt-1 ; i < rows-1 ; i++){
			this.insertRow(i, true);
		}
	}
	this.setRowsDivPercent();
};


AGridLayout.prototype.getCols = function()
{	
	return  $(this.getRow(0)).children().length;
};

AGridLayout.prototype.setCols = function(cols)
{	
	var rows = this.getRows(), colsCnt = this.getCols();
	var r=0, i=0;
	
	if(cols < 1) cols = 1;
	
	
	if(cols < colsCnt)
	{
		for(i=colsCnt-1; i > cols-1; i--)
			this._findChildTd( 'td:nth-child('+i+')' ).remove();
	}
	else if(cols > colsCnt)
	{
				
		for(i=colsCnt-1; i < cols-1; i++){
			this.insertCol(i, true);
		}
		
	}
	
	this.setColsDivPercent();
		
};


AGridLayout.prototype.setRowsDivPercent = function()
{

	var i=0, rowsCnt = this.getRows(),
		divper = parseInt(100/rowsCnt, 10); //현재 rows
	
	for(i; i < rowsCnt; i++){
		this.setRowSize(i, [divper, '%'].join(''));
	}

};

AGridLayout.prototype.setColsDivPercent = function()
{
	
	var i=0, colsCnt = this.getCols(),
		divper = parseInt(100/colsCnt, 10); //현재 rows
	
	for(i; i < colsCnt; i++){
		this.setColSize(i, [divper, '%'].join(''));
	}
	
};

AGridLayout.prototype._findChildTd = function(selector)
{
	return this.$body.children().children(selector);
};

