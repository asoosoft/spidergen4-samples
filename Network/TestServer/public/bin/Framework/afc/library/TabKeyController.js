function TabKeyController()
{
	this.focusableComponent = [];
}

//탭키로 이동이 가능한 컴포넌트 배열
TabKeyController.tabkeyPosibleComp = ['ATextField','ACheckBox','AButton','ARadioButton', 'ADropBox', 'ASelectBox', 'ATextArea', 'ASwitchButton', 'ACalendarPicker', 'EXSecureTextField'];

//서브뷰(탭키로 이동이 가능한 컴포넌트들을 가진뷰)를 가질수있는 컴포넌트 배열
TabKeyController.compHasSubArr = ['AView', 'ATabView', 'AListView','ListViewItem'];

TabKeyController.prototype.init = function(rootView)
{
	var thisObj = this, nextComp;
	rootView.element.addEventListener('keydown', function(e){
		if(e.keyCode == 9)
		{
			nextComp = thisObj.focusNextTabLogic(e.shiftKey);
			if(nextComp) nextComp.setFocus();
			e.preventDefault();
		}
	});
};

TabKeyController.prototype.focusNextTabLogic = function(isShift)
{
	var index = this.focusableComponent.indexOf(AComponent.getFocusComp()), nextComp, result;
	if(index > -1)
	{
		if(isShift)
		{
			if(AComponent.getFocusComp() === this.firstTabStop) nextComp = this.lastTabStop;
			else nextComp = this.focusableComponent[index-1];
		}
		else
		{
			if(AComponent.getFocusComp() === this.lastTabStop) nextComp = this.firstTabStop;
			else nextComp = this.focusableComponent[index+1];
		}
	}
	else 
	{
		if(this.focusableComponent[0]) nextComp = this.focusableComponent[0];
	}

	result = TabKeyController.findSubComp(nextComp, isShift);
	if(result) return result;
	else if(nextComp)
	{
		nextComp.setFocus();
		return this.focusNextTabLogic(isShift);
	}
	else return this.focusableComponent[0] ? this.focusableComponent[0] : null;
};

TabKeyController.prototype.setTabKeyComponent = function(rootView, nofocus)
{
	this.focusableComponent = [];
	TabKeyController.findTabIndex(rootView, this.focusableComponent);
	
	if(!this.focusableComponent[0]) return;
		
	this.firstTabStop = this.focusableComponent[0];
	this.lastTabStop = this.focusableComponent[this.focusableComponent.length-1];
	
	if(nofocus) return;
	if(TabKeyController.compHasSubArr.indexOf(this.firstTabStop.baseName) > -1)
	{	
		var thisObj = this;
		setTimeout(function() 
		{
			if(typeof rootView == "undefined") return;
			if(!rootView.isValid()) return;
			var result = TabKeyController.findSubComp(thisObj.firstTabStop);
			if(result) result.setFocus();
			else thisObj.firstTabStop.setFocus();
		}, 100);
		
	}
	else this.firstTabStop.setFocus();
};

////////////////////////////////////////////////////////////////////////////
//////////////////////////////전역함수영역////////////////////////////////////

//1. 서브뷰를 가질수있는 컴포넌트인지 체크하고 아니라면 그대로 리턴한다.
//2. 맞다면 컴포넌트가 있는지를 체크하고
//3. 쉬프트키 여부에 따라 가장 앞 또는 가장 뒤의 컴포넌트를 리턴한다.
TabKeyController.findSubComp = function(comp, isShift)
{
	if(comp && TabKeyController.compHasSubArr.indexOf(comp.baseName) > -1)
	{
		var compArr = TabKeyController.findTabSubArr(comp, isShift);
		if(compArr && compArr.length > 0) 
		{
			if(isShift) return TabKeyController.findSubComp(compArr[compArr.length-1], isShift);
			return TabKeyController.findSubComp(compArr[0], isShift);
		}
		else return comp;
	}
	else return comp;
}

//1. 탭인덱스의 순서를 나타내는 배열은 각 뷰가 가지고 있다.
TabKeyController.findTabSubArr = function(comp, isShift)
{
	var arr;
	switch(comp.baseName)
	{
		case 'AView':
			if(comp.getLoadView()) 
			{
				arr = comp.getLoadView().focusableComponent;
				if(arr.length > 0) return arr;
			}
		break;
		case 'ATabView':
			if(comp.getSelectedView())
			{
				arr = comp.getSelectedView().focusableComponent;
				if(arr.length > 0) return arr;
			}
		break;
		case 'AListView':
			if(isShift)
			{
				var items = comp.getItems();
				if(items.length > 0)
				{
					comp.nowTabOffset = items.length-1;
					arr = items[items.length-1].view.focusableComponent;
					return arr;
				}
			}
			else
			{
				var items = comp.getItems();
				if(items.length > 0)
				{
					comp.nowTabOffset = 0;
					arr = items[0].view.focusableComponent;
					return arr;
				}
			}
		break;
		case 'ListViewItem':
			arr = comp.focusableComponent;
			if(arr.length > 0) return arr;
		break;
	}
	
	return null;
};

//컴포넌트의 순서와 tabIndex에 따라 순서대로 배열에 넣어주는 함수
TabKeyController.findTabIndex = function(comp, arr)
{
	if(!comp.isEnable) return;
	if(!comp.element) return;
	if(comp.$ele.css('display') == "none") return;
	
	if(comp.getAttr('data-base') == 'ARadioGroup')
	{
		var childView = comp.getChildren();
		for(var i in childView)
		{
			TabKeyController.findTabIndex(childView[i], arr);
		}
	}
	else if(comp.getAttr('data-base') == 'AGridLayout' || comp.getAttr('data-base') == 'AFlexLayout')
	{
		comp.eachChild(function(acomp){
			TabKeyController.findTabIndex(acomp, arr);
		});
	}
	else if(TabKeyController.checkCanTabOrder(comp.getAttr('data-base')) > -1 && comp.getParent())
	{	
		var attrStop = comp.getAttr('data-tabstop');
		if(!attrStop)
		{	
			if(comp.getAttr('data-base') != 'AView') comp.enableKeyPropagation(true);
			var attr = comp.getAttr('tabindex');
			if(attr == null) 
			{
				comp.setAttr('tabindex', 1000);
				arr.push(comp);
			}
			else 
			{
				if(arr.length == 0) arr.push(comp);
				else 
				{
					var chk = false;
					for(var i in arr)
					{
						if(!arr[i].getAttr('tabindex') || parseInt(attr) < parseInt(arr[i].getAttr('tabindex')))
						{
							arr.splice(i, false, comp);
							chk = true;
							break;
						}
					}
					if(!chk) arr.push(comp);
				}
			}
		}
	}
	
	if(comp.getAttr('data-base') == 'AView')
	{
		var childView = comp.getChildren();
		for(var i in childView)
		{
			TabKeyController.findTabIndex(childView[i], arr);
		}
	}
	
	switch(comp.baseName)
	{
		case 'AView':
			if(comp.getLoadView()) 
			{
				arr = comp.getLoadView().createTabIndexArr(true);
			}
		break;
		case 'ATabView':
			if(comp.getSelectedView())
			{
				arr = comp.getSelectedView().createTabIndexArr(true);
			}
		break;
		/*case 'AListView':
			if(isShift)
			{
				var items = comp.getItems();
				if(items.length > 0)
				{
					comp.nowTabOffset = items.length-1;
					items[items.length-1].view.createTabIndexArr(true);
					
				}
			}
			else
			{
				var items = comp.getItems();
				if(items.length > 0)
				{
					comp.nowTabOffset = 0;
					items[0].view.createTabIndexArr(true);
				}
			}
		break;*/
		case 'ListViewItem':
			comp.createTabIndexArr(true);
		break;
	}
	
};

//탭키 이동이 가능하도록 지정한 컴포넌트인지 확인
TabKeyController.checkCanTabOrder = function(name)
{
	for(var i in TabKeyController.tabkeyPosibleComp)
	{
		if(TabKeyController.tabkeyPosibleComp[i] == name) return i;
	}
	
	for(var i in TabKeyController.compHasSubArr)
	{
		if(TabKeyController.compHasSubArr[i] == name) return i;
	}
	
	return -1;
};

//뷰에서 포커스가 나갈때
TabKeyController.findNextFocusInView = function(comp, nextComp, e)
{
	if(nextComp == 'outFocusView')
	{
		var owner = comp.owner;
		if(owner.baseName == 'AListView')
		{
			if(e.shiftKey) owner.nowTabOffset -= 1;
			else owner.nowTabOffset += 1;
			var item = owner.getItem(owner.nowTabOffset);
			if(item)
			{
				var result = TabKeyController.findSubComp(item.view, e.shiftKey);
				result.setFocus();
				e.preventDefault();		
				e.stopPropagation();
				
			}
			else
			{
				owner.nowTabOffset = null;
				owner.setFocus();
				e.preventDefault();		
			}
		}
		else
		{
			owner.setFocus();
			e.preventDefault();	
		}
	}
	else
	{
		nextComp.setFocus();
		e.preventDefault();
		e.stopPropagation();
	}
};
