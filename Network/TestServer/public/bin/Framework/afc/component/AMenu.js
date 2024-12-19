/**
 * @author asoocool
 */

function AMenu(rootMenu, menuId, iconMapUrl)
{
	AFloat.call(this);
	
	this.$ele = null;
	this.itemInfoArr = [];
	this.selItem = null;
	
	this.listener = null;
	this.funcName = null;
	
	if(rootMenu) this.rootMenu = rootMenu;
	else this.rootMenu = this;
	
	this.menuId = menuId;
	this.iconMapUrl = iconMapUrl;
	
}
afc.extendsClass(AMenu, AFloat);


AMenu.tag = '<table class="AMenu-Style"></table>';

//menu icon 중앙 정렬을 위해 span 추가
AMenu.itemFormat = '<tr><td><span></span></td><td></td><td></td><td></td></tr>';

AMenu.prototype.init = function()
{
	AFloat.prototype.init.call(this);

	this.$ele = $(AMenu.tag);
	this.$frame.append(this.$ele);
};

AMenu.prototype.setIconMapUrl = function(iconMapUrl)
{
	this.iconMapUrl = iconMapUrl;
};

//when a menu pops up, we put menuItems in a menu
//AMenu overrides popup function
AMenu.prototype.popup = function(left, top, width, height)
{
	this.init();
	
	for(var i=0; i<this.itemInfoArr.length; i++)
		this.addMenuItem(this.itemInfoArr[i]);

	AFloat.prototype.popup.call(this, left, top, width, height);
};

AMenu.prototype.popupEx = function(info)
{
	this.init();
	
	for(var i=0; i<this.itemInfoArr.length; i++)
		this.addMenuItem(this.itemInfoArr[i]);

	AFloat.prototype.popupEx.call(this, info);
};



AMenu.prototype.close = function()
{
	if(this.selItem && this.selItem.subMenu) this.selItem.subMenu.close();

	AFloat.prototype.close.call(this);
};



//if index is undefined, we put the itemInfo at the last position. 
//itemInfo = { text:'Open File...', icon:'', sub: itemInfoArr }
AMenu.prototype.insertItemInfo = function(itemInfo, index)
{
	if(index==undefined) this.itemInfoArr.push(itemInfo);
	else this.itemInfoArr.splice(index, 0, itemInfo);
};


AMenu.prototype.setItemInfo = function(itemInfo, index)
{
	this.itemInfoArr[index] = itemInfo;
};

AMenu.prototype.setItemInfoArr = function(itemInfoArr)
{
	this.itemInfoArr = itemInfoArr.slice();
};

//내부적으로만 사용
AMenu.prototype.popupSubmenu = function(itemEle, itemInfoArr)
{
	var rect = itemEle.getBoundingClientRect();
	
	var menu = new AMenu(this.rootMenu, null, this.iconMapUrl);
	menu.isBgCheck = false;
	menu.zIndex = this.zIndex + 10;
	menu.setItemInfoArr(itemInfoArr);
	menu.popup(rect.right, rect.top);
	
	itemEle.subMenu = menu;
};

//내부적으로만 사용함
//AMenu.itemFormat = 
//<tr>
//		<td><span></span></td>	menu-icon
//		<td></td>				menu-text
//		<td></td>				menu-sub-mark
//</tr>
AMenu.prototype.addMenuItem = function(itemInfo)
{
    var $item = $(AMenu.itemFormat);
	
	$item[0].info = itemInfo;
    
	var thisObj = this;
	
	
	if(itemInfo.id=='MENU_SPLITTER') 
	{
		//span 이 높이를 차지하므로 제거한다.
		$item.find('span').remove();
		$item.css('height','1px');
		$item.css('border-top','1px solid #595959');
	}
	else
	{
		$item.mouseover(function(e)
		{
			if(thisObj.selItem && thisObj.selItem.subMenu) thisObj.selItem.subMenu.close();

			thisObj.selItem = this;

			$item.addClass('amenu-over');

			if(itemInfo.sub) 
				thisObj.popupSubmenu(this, itemInfo.sub);
		});

		$item.mouseout(function(e)
		{
			$item.removeClass('amenu-over');
		});

		$item.click(function(e)
		{
			if(itemInfo.sub) return;

			thisObj.rootMenu.reportEvent(this, e);
			thisObj.rootMenu.close();
		});

		var $children = $item.children();
		
		//BKS/20170724
		var iconMapUrl = !itemInfo.iconMapUrl ? this.iconMapUrl : itemInfo.iconMapUrl;
		
		if(iconMapUrl && itemInfo.icon > -1)
		{			
			//아이콘 셋팅, span
			$children.eq(0).children().css(
			{
				//'background-image': 'url("' + this.iconMapUrl + '")',
				'background-image': 'url("' + iconMapUrl + '")',
				'background-position': (-16 * itemInfo.icon) + 'px center',
				'background-repeat': 'no-repeat'
			});
		}
		
		/*if(this.iconMapUrl && itemInfo.icon!=undefined) 
		{
			//아이콘 셋팅, span
			$children.eq(0).children().css(
			{
				'background-image': 'url("' + this.iconMapUrl + '")',
				'background-position': (-16 * itemInfo.icon) + 'px center',
				'background-repeat': 'no-repeat'
			});
		}*/
		
		$children.eq(1).html(itemInfo.text);

		//BKS/2017.08.21/short key
		if(itemInfo.shortKey) 
		{
			$children.eq(2)
				.html(itemInfo.shortKey)
				.css("padding-left","15px")
				.css("text-align","left");
		}
		
		if(itemInfo.sub) $children.eq(3).text('▶');
		
		/*if(itemInfo.sub) $children.eq(2).text('▶');*/
	}
	
	
   	this.$ele.append($item);
	
	return $item[0];
};

AMenu.prototype.setSelectListener = function(listener, funcName)
{
	this.listener = listener;
	this.funcName = funcName;
};

AMenu.prototype.reportEvent = function(item, e)
{
	//if(item.info==undefined) item.info = {};
	
	this.listener[this.funcName](this, item.info, e);
};






