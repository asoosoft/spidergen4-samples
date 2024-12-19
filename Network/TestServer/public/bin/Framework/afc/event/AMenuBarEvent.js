/**
 * @author asoocool
 * 
 */

function AMenuBarEvent(acomp)
{
	AViewEvent.call(this, acomp);
	
}
afc.extendsClass(AMenuBarEvent, AViewEvent);


//---------------------------------------------------------------------------------------------------
//	Component Event Functions
/*
AMenuBarEvent.prototype.select = function()
{
	this._select();
};
*/
//---------------------------------------------------------------------------------------------------

AMenuBarEvent.prototype._select = function(btnEle, menuItem)
{
	var $btn = $(btnEle);
	var thisObj = this;
	
	AEvent.bindEvent(btnEle, AEvent.ACTION_DOWN, function(e)
	{
		var pos = btnEle.getBoundingClientRect();

		var menu = new AMenu();
		menu.setItemInfoArr(menuItem);
		menu.setSelectListener(thisObj, 'onMenuSelect');

		menu.popup(pos.left, pos.top+$btn.height());
	});

	$btn.hover(
		function() 
		{ 
			$btn.css('color', '#000000'); 
			$btn.css('background-color', '#F0F0F0'); 
		},
		function() 
		{ 
			$btn.css('color', '#FFFFFF'); 
			$btn.css('background-color', '#3A3A3A'); 
		}
	);
};

AMenuBarEvent.prototype.onMenuSelect = function(menu, info, e)
{
	//if(info.id) this.acomp.reportEvent('select', info, e);
	
	this.acomp.reportEvent('select', info, e);
};


