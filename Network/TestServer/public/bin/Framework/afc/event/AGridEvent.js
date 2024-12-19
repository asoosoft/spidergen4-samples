/**
 * @author asoocool
 */

function AGridEvent(acomp)
{
	AEvent.call(this, acomp);

	this.bScrollBind = false;
	this.isTouchLeave = true;
	
	//this.longtabBind = false;
	//this.dblclickBind = false;
}
afc.extendsClass(AGridEvent, AEvent);


/*
AGridEvent.prototype.defaultAction = function()
{
	this._scroll();
};
*/

//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AGridEvent.prototype.scrolltop = function()
{
	this._scroll();
};

AGridEvent.prototype.scrollbottom = function()
{
	this._scroll();
};

AGridEvent.prototype.longtab = function()
{
	this.longtabBind = true;
};

AGridEvent.prototype.dblclick = function()
{
	this.dblclickBind = true;
};



//---------------------------------------------------------------------------------------------------

AGridEvent.prototype._scroll = function()
{
	//한번만 호출되도록
	if(this.bScrollBind) return;
	this.bScrollBind = true;
	
	var agrid = this.acomp;

	agrid.scrollArea[0].addEventListener('scroll', function(e)
	{
		//console.log(this.scrollHeight - this.clientHeight - this.scrollTop);
		//console.log(this.scrollTop);
		
		//scroll bottom
		if(this.scrollHeight == this.clientHeight + this.scrollTop)
		{
//console.log('scroll bottom');	
			if(agrid.scrollBottomManage())
				agrid.reportEvent('scrollbottom', null, e);	
		}
		
		//scroll top
		else if(this.scrollTop == 0)
		{
//console.log('scroll top');				
			if(agrid.scrollTopManage())
				agrid.reportEvent('scrolltop', null,  e);
		}
	});
};

//---------------------------------------------------------------------
//	cell, row 이벤트 처리
//	evtEles 는 이벤트 element 를 담고 있는 배열이거나 jQuery 집합 객체이다.
//	그룹지어야 할 cell 이나 row 들을 배열이나 jQuery 집합으로 모아서 넘어온다.
//	rowSet 이 여러줄이고 FullRowSelect 이면 evtEles 는 row element 의 배열이나 jQuery 집합이다.
//	이벤트 발생시 그룹지어진 evtEles 값이 전달된다.

AGridEvent.prototype._select = function(evtEles)
{
	//selectable 인 경우, 기본 동작이므로 무조건 등록
	
	var thisObj = this,
		agrid = this.acomp, timeout = null,
		startX = 0, startY = 0, ele;

	for(var i=0; i<evtEles.length; i++)
	{
		ele = evtEles[i];
		
		AEvent.bindEvent(ele, AEvent.ACTION_DOWN, function(e)
		{
			thisObj.isTouchLeave = false;

			//자체적으로 스크롤을 구현하고 현재 스크롤이 진행중일 경우는 셀렉트 이벤트를 발생시키지 않는다. 
			if(agrid.scrlManager &&  agrid.scrlManager.scrlTimer)
			{
				thisObj.isTouchLeave = true;
				return;
			}

			var oe = e.changedTouches[0];
			startX = oe.clientX;
			startY = oe.clientY;

			timeout = setTimeout(function() 
			{
				timeout = null;
				if(!thisObj.isTouchLeave)
				{
					agrid.selectCell(evtEles, e);
				}

			}, 300);
		});

		AEvent.bindEvent(ele, AEvent.ACTION_MOVE, function(e)
		{
			if(thisObj.isTouchLeave) return;

			var oe = e.changedTouches[0];
			
			if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE) 
			{
				thisObj.isTouchLeave = true;

				if(timeout) 
				{
					clearTimeout(timeout);
					timeout = null;
				}
				agrid.deselectCell(evtEles);
			}
		});

		AEvent.bindEvent(ele, AEvent.ACTION_UP, function(e)
		{
			if(thisObj.isTouchLeave) return;

			thisObj.isTouchLeave = true;

			if(timeout)
			{
				clearTimeout(timeout);
				timeout = null;
			}
			
			if(agrid.timeout) 
	        {
	        	clearTimeout(agrid.timeout);
	        	agrid.timeout = null;
	        }

			//우클릭인 경우 셀렉트 되지 않은 경우만 셀렉트한다. ( 다중선택 후 우클릭 시 다른 셀들이 디셀렉트 되는 문제 해결 )
			if(e.which == 3)
			{
				if(!$(evtEles).hasClass(agrid.selectStyleName)) agrid.selectCell(evtEles, e);
			}
			else
			{
				agrid.selectCell(evtEles, e);
			}
			
			//agrid.reportEventDelay('select', $evtEle, 100, e);
			agrid.reportEvent('select', evtEles, e);
		});
		
		AEvent.bindEvent(ele, AEvent.ACTION_CANCEL, function(e)
		{
			thisObj.isTouchLeave = true;
			if(timeout) 
			{
				clearTimeout(timeout);
				timeout = null;
			}
			agrid.deselectCell(evtEles);
		});
	}
};

//	evtEles 는 이벤트 element 를 담고 있는 배열이거나 jQuery 집합 객체이다.
AGridEvent.prototype._longtab = function(evtEles)
{
	//컴포넌트에 이벤트를 매핑한 경우만  
	if(!this.longtabBind) return;
	
	//var thisObj = this;
	var thisObj = this, agrid = this.acomp, timeout = null, startX = 0, startY = 0, ele;
	
	for(var i=0; i<evtEles.length; i++)
	{
		ele = evtEles[i];
		
		AEvent.bindEvent(ele, AEvent.ACTION_DOWN, function(e)
		{
			if(e.touches.length > 1) return;
			
			if((new Date().getTime() - AEvent.TOUCHTIME) < afc.DISABLE_TIME) return; 

			thisObj.actionDownState();
			
			var oe = e.changedTouches[0];
			startX = oe.clientX;
			startY = oe.clientY;
	        
	        agrid.timeout = setTimeout(function()
	        {
				thisObj.isTouchLeave = true;
	        	agrid.timeout = null;
	            agrid.reportEvent('longtab', evtEles, e);
	            
	        }, 700);
	        
		});
		
		AEvent.bindEvent(ele, AEvent.ACTION_MOVE, function(e)
		{
			var oe = e.changedTouches[0];
			
			if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE)
			{
				if(agrid.timeout) 
				{
					clearTimeout(agrid.timeout);
					agrid.timeout = null;
				}

				thisObj.actionMoveState();
				if(!afc.isSimulator) AEvent.TOUCHTIME = new Date().getTime();
			}
		});
		
		AEvent.bindEvent(ele, AEvent.ACTION_UP, function(e)
		{
			//if(!agrid.option.isSelectable) return;
			
			if(agrid.timeout) 
	        {
	        	clearTimeout(agrid.timeout);
	        	agrid.timeout = null;
	        }
			
			thisObj.actionUpState();
			
			if((new Date().getTime() - AEvent.TOUCHTIME) > afc.DISABLE_TIME) AEvent.TOUCHTIME = new Date().getTime();
			
		});
		
		AEvent.bindEvent(ele, AEvent.ACTION_CANCEL, function(e)
		{
			if(agrid.timeout) 
			{
				clearTimeout(agrid.timeout);
				agrid.timeout = null;
			}
		});
	}
};

//	evtEles 는 이벤트 element 를 담고 있는 배열이거나 jQuery 집합 객체이다.
AGridEvent.prototype._dblclick = function(evtEles)
{
	//컴포넌트에 이벤트를 매핑한 경우만 
	if(!this.dblclickBind) return;

	var thisObj = this, ele;
	
	//$evtEle.each(function()
	for(var i=0; i<evtEles.length; i++)
	{
		ele = evtEles[i];
		
		ele.addEventListener('dblclick', function(e)
		{
			thisObj.acomp.reportEvent('dblclick', evtEles, e);
		});
	}
	
};

