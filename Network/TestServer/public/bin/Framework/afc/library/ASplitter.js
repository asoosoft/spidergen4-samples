/**
 * @author asoocool
 */

//-------------------------------------------------------------------
//	컴포넌트나 컨테이너를 셋팅하지 않는다. 
//	순수하게 div 태그로만 분리시켜 놓는 기능
//	이후에 호출한 곳에서 태그에 컨테이너나 뷰를 셋팅하여 확장한다.
//-------------------------------------------------------------------
function ASplitter(listener, barSize)
{
	this.splitDir = 'column';
	this.targetEle = null;
	this.$target = null;
	
	this.listener = listener;
	
	this.defSplitSize = 200;
	
	if(barSize==undefined || barSize==null) this.barSize = 5;
	else this.barSize = barSize;
	
	//스플릿 컨테이너의 position 을 static 으로 셋팅할 지
	//createSplit 호출 시 sizeArr 사이즈 정보 배열을 넘기면 absolute 로 설정되고
	//-1 을 넘기면 static 으로 설정된다.
	this.isStatic = false;	
}

ASplitter.FRAME_TAG = '<div></div>';
//ASplitter.FRAME_TAG = '<div style="border:1px solid cyan;"></div>';




ASplitter.prototype.setDefSplitSize = function(defSplitSize)
{
	this.defSplitSize = defSplitSize;
};

//targetEle : AContainer, AView
//row : 좌우로 분리, column : 상하로 분리
ASplitter.prototype.createSplit = function(targetEle, count, sizeArr, splitDir)
{
	this.targetEle = targetEle;
	this.$target = $(targetEle);
	
	if(!count || count<1) count = 1;
	
	if(splitDir) this.splitDir = splitDir;
	
	//target Size
	var trgSize, i, $frmEle, barCount = count - 1, size;
	
	
	if(this.splitDir=='row') trgSize = this.$target.width();
	else trgSize = this.$target.height();
	
	//-----------------------------------------------
	//sizeArr을 지정하지 않으면 자동계산 빈 배열만 만들어 둔다.
	
	if(!sizeArr) sizeArr = new Array(count);
	
	//sizeArr == -1 <-- 이렇게 비교하면 sizeArr 이 [-1] 인 경우도 equal 도 판단함
	else if(sizeArr === -1) 
	{
		this.isStatic = true;
		this.barSize = 0;
	}

	if(!this.isStatic) 
	{
		for(i=0; i<count; i++)
		{
			size = sizeArr[i];

			//sizeArr 을 지정 안 한 경우 또는 -1 인 경우는 자동 계산(auto)
			if(size==undefined || size<0)
			{
				sizeArr[i] = undefined;	//자동 계산임을 구별하기 위해 일관된 값으로 변경
			}

			//비율 지정(0.2,0.5, 0.9 ...)인 경우 계산
			//else if(size<1) sizeArr[i] = trgSize*size;
		}
	}

	
	//-----------------------------------------------
	
	var isSplitBar, totCount = count + barCount;
	
	//프레임 삽입
	for(i=0; i<totCount; i++)
	{
		//-------------------------------
		//	split bar, 1,3,5 ...
		//-------------------------------
		isSplitBar = (i%2!=0);
		
		$frmEle = $(ASplitter.FRAME_TAG);
		
		if(!this.isStatic) 
		{
			if(isSplitBar) this.eventProcess($frmEle);
			else $frmEle[0].curSize = sizeArr[i/2];
		}
		
		this._insert_helper(isSplitBar, $frmEle, -1, true);
	}
	
	this.updateSize();
};

//inx 가 음수(-1) 인 경우는 마지막 인덱스를 의미한다.
//splitSize 가 음수이면 자동 계산된다.
ASplitter.prototype.insertSplit = function(inx, splitSize, isAfter)
{
	var i, $frmEle, isSplitBar, retVal;
	
	isAfter = isAfter ? 1 : 0;
	
	//프레임 삽입
	for(i=0; i<2; i++)
	{
		//inx : 음수, isAfter : true->[스플릿바/프레임], false->[프레임/스플릿바]
		//inx : 양수, isAfter : true->[프레임/스플릿바], false->[스플릿바/프레임]
		isSplitBar = inx<0 ? i!=isAfter : i==isAfter;
		
		$frmEle = $(ASplitter.FRAME_TAG);
		
		if(!this.isStatic) 
		{
			//split bar
			if(isSplitBar) this.eventProcess($frmEle);
			else if(splitSize!=undefined && splitSize>-1) $frmEle[0].curSize = splitSize;
		}
		
		if(!isSplitBar) retVal = $frmEle[0];
		
		this._insert_helper(isSplitBar, $frmEle, inx*2, isAfter);
	}
	
	this.updateSize();
	
	//마지막 추가된 실제 프레임 엘리먼트 리턴
	return retVal;
};

ASplitter.prototype.prependSplit = function(splitSize)
{
	return this.insertSplit(0, splitSize, false);
};

ASplitter.prototype.appendSplit = function(splitSize)
{
	return this.insertSplit(-1, splitSize, true);
};

ASplitter.prototype.removeSplit = function(inx, beforeRemove)
{
	var $removeFrm, $barFrm;
	
	if(inx<0) $removeFrm = this.$target.children().last();
	else $removeFrm = this.$target.children().eq(inx*2);
	
	if(inx==0) $barFrm = $removeFrm.next();
	else $barFrm = $removeFrm.prev();
	
	if(beforeRemove) beforeRemove($removeFrm[0]);
	
	$removeFrm.remove();
	$barFrm.remove();
	
	this.updateSize(true);
};

//--------------------------------------------------------------------------------------------------------
//	asoocoo test
/*
ASplitter.prototype.hideSplit = function(inx)
{
	var $removeFrm, $barFrm;
	
	if(inx<0) $removeFrm = this.$target.children().last();
	else $removeFrm = this.$target.children().eq(inx*2);
	
	if(inx==0) $barFrm = $removeFrm.next();
	else $barFrm = $removeFrm.prev();
	
	$removeFrm.hide();
	$barFrm.hide();
	
	this.setSplitSize(inx, 0);
};
*/

ASplitter.prototype.enableSplitBar = function(inx, enable)
{
	var bar = this.$target.children()[inx*2+1];
	
	bar.moveDisable = !enable;
	$(bar).draggable('option', 'disabled', !enable);
};

ASplitter.prototype.setSplitSize = function(inx, splitSize)
{
	var frmEle = this.getSplit(inx);
	
	if(splitSize!=undefined && splitSize>-1) frmEle.curSize = splitSize;
	else frmEle.curSize = undefined;
	
	this.updateSize();
};


ASplitter.prototype.getSplitSize = function(inx)
{
	var $frmEle = $(this.getSplit(inx));
	
	if(this.splitDir=='row') return $frmEle.width();
	else return $frmEle.height();
};


//-----------------------------------------------------------------------------------------------------------



ASplitter.prototype.getSplit = function(inx)
{
	if(inx<0) return this.$target.children().last()[0];
	else return this.$target.children()[inx*2];
};

ASplitter.prototype.getSplitCount = function()
{
	return parseInt((this.$target.children().length+1)/2);
};

ASplitter.prototype.getBarCount = function()
{
	return (this.getSplitCount()-1);
};

ASplitter.prototype.removeAllSplit = function()
{
	this.$target.children().remove();
};


//현재 셋팅되어져 있는 사이즈 정보를 분할된 모든 프레임에 다시 적용한다.
ASplitter.prototype.updateSize = function(isRemove)
{
	if(this.isStatic) return;

	var trgSize, sumColSize = 0, autoCount = 0, autoSize = 0, i, curSize,
		$splitEle = this.$target.children(), barCount, isBarHide,
		count = $splitEle.length;
	
	if(this.splitDir=='row') trgSize = this.$target.width();
	else trgSize = this.$target.height();
	
	
	//프레임이 삭제되어 업데이트 하는 경우 첫번째 프레임을 오토 사이즈로 지정한다.
	//asoocool test
	//if(isRemove && count>0) $splitEle[0].curSize = undefined;
		
	//-----------------------------------------------
	
	barCount = this.getBarCount();
		
	for(i=0; i<count; i+=2)
	{
		curSize = $splitEle[i].curSize;
		
		//size 를 지정 안 한 경우는 자동 계산(auto)
		if(curSize==undefined || curSize<0) 
		{
			isBarHide = false;
			autoCount++;
		}
		
		else 
		{
			//0.5, 0.1 ... 비율
			if(curSize<1) 
				$splitEle[i].curSize = curSize = trgSize*curSize;
			
			isBarHide = (curSize==0);
			
			//splitFrame 사이즈가 0 이면 하나의 barSize 공간이 숨겨지므로
			if(isBarHide) barCount--;
			
			sumColSize += curSize;
		}
		
		//console.log(i + ':' + count);	
		
		//마지막이 아니면 다음 스플릇바를 숨긴다.
		if(i < count-1) $splitEle[i+1].hideBar = isBarHide;
				
		//마지막 프레임이면 바로 이전 스플릿바를 숨기고				
		else if(count>1) $splitEle[i-1].hideBar = isBarHide;
	}
	
	if(autoCount>0)
		autoSize = parseInt( (trgSize - this.barSize*barCount - sumColSize)/autoCount );
		
	var $frmEle, offset = 0, addSize = 0, isSplitBar;
	
	for(i=0; i<count; i++)
	{
		//-------------------------------
		//	split bar, 1,3,5 ...
		//-------------------------------
		isSplitBar = (i%2!=0);
		
		$frmEle = $splitEle.eq(i);
		
		if(isSplitBar) 
		{
			//스플릿 프레임의 사이즈가 0 보다 큰 경우만 스플릿바가 보여지도록
			
			if($frmEle[0].hideBar) addSize = 0;
			else addSize = this.barSize;
			
			$frmEle[0].curPos = offset;
		}
		else 
		{
			curSize = $frmEle[0].curSize;
		
			if(curSize==undefined) addSize = autoSize;
			else addSize = curSize;
		}
		
		if(this.splitDir=='row')
		{
			$frmEle.css(
			{
				'left': offset+'px',
				'width': addSize+'px',
			});
		}
		else
		{
			$frmEle.css(
			{
				'top': offset+'px',
				'height': addSize+'px'
			});
		}
		
		offset += addSize;
		
		if(!isSplitBar && this.listener) this.listener.onSplitChanged($frmEle[0]);
	}
};

//inx : 스플릿바를 포함한 전체 개수를 기준으로 한 index
//inx 가 0보다 작으면 마지막 원소이다.
ASplitter.prototype._insert_helper = function(isSplitBar, $frmEle, inx, isAfter)
{
	if(!this.isStatic)
	{
		if(this.splitDir=='row')
		{
			$frmEle.css(
			{
				'position': 'absolute',
				'top': '0px',
				'height': '100%'
			});
		}
		else
		{
			$frmEle.css(
			{
				'position': 'absolute',
				'left': '0px',
				'width': '100%',
			});
		}
		
		//add split bar 
		if(isSplitBar)
		{
			$frmEle.css(
			{
				'background-color': '#bbb',
				'z-index': 1
			});
		}
		else
		{
			$frmEle.css({'z-index': 0});
		}
	}
	
	
	//----------------------------------------------
	var $pos = null;
	
	if(inx<0) $pos = this.$target.children().last();
	else $pos = this.$target.children().eq(inx);

	if($pos.length>0) 
	{
		if(isAfter) $frmEle.insertAfter($pos);
		else $frmEle.insertBefore($pos);
	}
	else this.$target.append($frmEle);
};

ASplitter.prototype.eventProcess = function($splitBar)
{
	var thisObj = this;
	
	if(this.splitDir=='row')
	{
		$splitBar.draggable(
		{ 
			axis: 'x',
			containment: "parent",
			cursor: "e-resize",
			helper: "clone",

			stop: function( event, ui ) 
			{
				thisObj._moveSplitBar(this, ui.position.left);
			},

			drag: function( event, ui ) 
			{
				return thisObj._autoFoldingManage(ui, 'left', 'width', 250);
			}
		});
		
		$splitBar.mouseenter(function()
		{
			if(!this.moveDisable) $(this).css('cursor','e-resize');
		});
	}
	else
	{
		$splitBar.draggable(
		{ 
			axis: 'y',
			containment: "parent",
			cursor: "s-resize",
			helper: "clone",

			stop: function( event, ui ) 
			{
				thisObj._moveSplitBar(this, ui.position.top);
			},

			drag: function( event, ui ) 
			{
				return thisObj._autoFoldingManage(ui, 'top', 'height', 450);
			}
		});
		
		$splitBar.mouseenter(function()
		{
			if(!this.moveDisable) $(this).css('cursor','s-resize');
		});
	}
};

ASplitter.prototype._autoFoldingManage = function(ui, posKey, sizeKey, openSize)
{
	var min = 0, max = this.$target[sizeKey]() - this.barSize;

	//자동 펼침
	if(ui.position[posKey] > min && ui.position[posKey]< min+70) 
	{
		if(ui.position[posKey] > min+50)
		{
			ui.position[posKey] = openSize;
			return false;
		}
	}
	//자동 숨김
	else if(ui.position[posKey] < 150) 
	{
		ui.position[posKey] = min;
		return false;
	}

	else if(ui.position[posKey] < max && ui.position[posKey] > max-70) 
	{
		if(ui.position[posKey] < max-50)
		{
			ui.position[posKey] = max - openSize;
			return false;
		}
	}

	else if(ui.position[posKey] > max-150) 
	{
		ui.position[posKey] = max;
		return false;
	}
};

ASplitter.prototype._moveSplitBar = function(splitBar, newPos)
{
	var moveSize = newPos - splitBar.curPos, prevSize, nextSize,
		$prev = $(splitBar).prev(),
		$next = $(splitBar).next();

	if(this.splitDir=='row')
	{
		prevSize = $prev.width() + moveSize;
		$prev.css('width', prevSize+'px');
		
		$(splitBar).css('left', newPos+'px');
		
		nextSize = $next.width() - moveSize;
		$next.css(
		{
			left: (newPos+this.barSize)+'px',
			width: nextSize+'px'
		});
	}
	else
	{
		prevSize = $prev.height() + moveSize;
		$prev.css('height', prevSize+'px');
		
		$(splitBar).css('top', newPos+'px');
		
		nextSize = $next.height() - moveSize;
		$next.css(
		{
			top: (newPos+this.barSize)+'px',
			height: nextSize+'px'
		});
	}

	splitBar.curPos = newPos;

	if($prev[0].curSize!=undefined) $prev[0].curSize = prevSize;
	if($next[0].curSize!=undefined) $next[0].curSize = nextSize;
	
	//리사이즈 이벤트 통보
	if(this.listener)
	{
		this.listener.onSplitChanged($prev[0]);
		this.listener.onSplitChanged($next[0]);
	}
};


