
//--------------------------------------------------------------------------------
//  Accordion class
//
//  특정 구조(p,div)로 된 태그 정보를 파라미터로 받아 accordion 메뉴를 구성한다.
//--------------------------------------------------------------------------------

function AAccordion()
{
	AComponent.call(this);

    this.menuHeight = 22;
	this.paddingX = 20;
	this.paddingY = 5;
	
    //현재 컨텐츠가 보여지고 있는 Item Element 
    this.selectedItem = null;
    
    this.jOption =
    {
    	showContent: false,			//아코디언 메뉴 추가시점에 바로 컨텐츠가 보여질지 여부
        speed: 'fast',
        isSingleShow: true,
        isAnimation: true,
        isShowToggle: true,
        showEvent: 'click',
        mouseOverEventDelay: 0,
        
        beforeShow: null,
        afterShow: null,
        beforeHide: null,
        afterHide: null,
        //isMobile: false
    };
	
	//add ukmani
	this.upcss = {backgroundImage : 'url("Source/img/arrow_left.png")', backgroundRepeat : 'no-repeat', backgroundPosition : '3px center', backgroundSize : '16px 16px'};
	this.downcss = {backgroundImage : 'url("Source/img/arrow_down.png")', backgroundRepeat : 'no-repeat', backgroundPosition : '3px center', backgroundSize : '16px 16px'};
}
afc.extendsClass(AAccordion, AComponent);

AAccordion.CONTEXT = 
{
    tag: '<div data-base="AAccordion" data-class="AAccordion" data-flag="0001" class="AAccordion-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    events: ['select']
};

AAccordion.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

};


//speed(에니메이션 속도), isSingleShow(하나의 메뉴만 펼칠지),  isAnimation, isShowToggle(펼쳐진 항목 다시 클릭시 숨길지), showEvent(bind event name)
AAccordion.prototype.setAccordionOption = function(jOption)
{
	for(var p in jOption)
	{ 
		if(jOption[p]!=undefined) 
			this.jOption[p] = jOption[p];
	}
};

AAccordion.prototype.setMenuPadding = function(paddingX, paddingY)
{
	this.paddingX = paddingX;
	this.paddingY = paddingY;
};

AAccordion.prototype.insertItem = function(menuText, url, isOpenLoad)
{
	var $item = this.createItem(menuText, url, isOpenLoad);
	
	this.$ele.append($item);
	
	return $item[0];
};

AAccordion.prototype.createItem = function(menuText, url, isOpenLoad)
{
	var $item = $('<div></div>'), $menu = $('<div class="AAccordion-Menu"></div>'),
		$contents = $('<div class="AAccordion-Contents"></div>'), 
		item = $item[0];
		
	item.menu = $menu[0];
	item.contents = $contents[0];
		
	//$menu.css({'height':this.menuHeight+'px', 'padding-left':this.paddingX+'px',
	//			   'padding-top':this.paddingY+'px', 'padding-right':this.paddingX+'px'});
	
	$menu.css({'height':this.menuHeight+'px', 'line-height':this.menuHeight+'px', 'padding-left':this.paddingX+'px' });
				   
	$menu.text(menuText);
	
	
	if(typeof(url)=='string') 
	{
		item.url = url;
		
		if(!isOpenLoad)
			AView.createView($contents[0], url, this, this.getRootView());
	}
	
	//url is aview
	else
	{
		AView.setViewInItem(url, $contents[0], this);
	}
	
	/*
	if(isUrl)
	{
		item.url = strContents;
		AView.createView($contents[0], strContents, this, this.getRootView());
	}
	else
	{
		//$contents.css({'padding-left':this.paddingX+'px', 'padding-top':this.paddingY+'px', 
		//			'padding-right':this.paddingX+'px', 'padding-bottom':this.paddingY+'px'});

		if(typeof(strContents)=='string') $contents.html(strContents);
		else 
		{
			strContents.css(
			{
				position: 'relative',
				left: '0px', top: '0px'
			});
			
			$contents.append(strContents);
		}
	}
	*/
	
	item.isOpen = this.jOption.showContent;

	//add ukmani
	if(!this.jOption.showContent){
		$contents.hide();	//$contents.css('display','none');
		$menu.css(this.upcss);
	}else{
		$menu.css(this.downcss);
	}
	
	//this.showHideManage(item);
	
	$item.append($menu);
	
	$item.append($contents);
	
	this.aevent._select(item);
	
	return $item;
};

//파라미터 selItem 은 클릭되어진 메뉴의 상위 item Element 이다.
AAccordion.prototype.showHideManage = function(selItem)
{
	var thisObj = this;

	if(selItem.isOpen) 
	{
		//현재 오픈되어져 있는 메뉴를 다시 클릭했을 때 토글 옵션이 없으면
		//아무 작동도 되지 않는다.
		if(!this.jOption.isShowToggle) return;
		
		_hideContents(selItem);
	}
	else 
	{
		if(this.jOption.isSingleShow && this.selectedItem) _hideContents(this.selectedItem);

		_showContents(selItem);
	}

	/////////////////////////////////////

	function _hideContents(item)
	{
		if(thisObj.jOption.beforeHide) thisObj.jOption.beforeHide(item);

		var $contents = $(item.contents);
		if(thisObj.jOption.isAnimation) 
		{
			$contents.slideUp(thisObj.jOption.speed, function() 
			{
				if(thisObj.jOption.afterHide) thisObj.jOption.afterHide(item);
			});
		}
		else 
		{
			$contents.hide();
			if(thisObj.jOption.afterHide) thisObj.jOption.afterHide(item);
		}

		item.isOpen = false;
		thisObj.selectedItem = null;
		
		//add ukmani
		$(item.menu).css(thisObj.upcss);
		
	}

	function _showContents(item)
	{
		if(thisObj.jOption.beforeShow) thisObj.jOption.beforeShow(item);

		var $contents = $(item.contents);
		if(thisObj.jOption.isAnimation) 
		{
			$contents.slideDown(thisObj.jOption.speed, function() 
			{ 
				if(thisObj.jOption.afterShow) thisObj.jOption.afterShow(item);
			});
		}
		else 
		{
			$contents.show();
			if(thisObj.jOption.afterShow) thisObj.jOption.afterShow(item);
		}

		item.isOpen = true;
		thisObj.selectedItem = item;
		
		//add ukmani
		$(item.menu).css(thisObj.downcss);
	}

};

AAccordion.prototype.showHideByIndex = function(index, isAnimation)
{
	var backUp = this.jOption.isAnimation;
	this.jOption.isAnimation = isAnimation;
	
	
	var eventMenu = this.$ele.find('.AAccordion-Menu').eq(index);

	//var eventMenu = this.menu.eq(index);
	if(eventMenu) eventMenu.trigger(this.jOption.showEvent);

	this.jOption.isAnimation = backUp;
};

AAccordion.prototype.showHideByName = function(name, isAnimation)
{
	var backUp = this.jOption.isAnimation;
	this.jOption.isAnimation = isAnimation;

	var thisObj = this;
	//this.menu.children().each(function()
	this.$ele.find('.AAccordion-Menu').each(function()
	{
		if($(this).text()==name)
		{
			$(this).trigger(thisObj.jOption.showEvent);
			return false;	
		}
	});

	this.jOption.isAnimation = backUp;
};


//add ukmani
AAccordion.prototype.setMenuUpIcon = function(upIcon)
{
	this.upcss.backgroundImage = 'url("' + upIcon + '")';
};

AAccordion.prototype.setMenuDownIcon = function(downIcon)
{
	this.upcss.backgroundImage = 'url("' + downIcon + '")';
};