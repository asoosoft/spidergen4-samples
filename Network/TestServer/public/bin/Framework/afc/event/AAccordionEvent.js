/**
 * @author asoocool
 */

function AAccordionEvent(acomp)
{
	AEvent.call(this, acomp);

}
afc.extendsClass(AAccordionEvent, AEvent);


/*
AAccordionEvent.prototype.defaultAction = function()
{
	
};

//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AAccordionEvent.prototype.select = function()
{
	this._select();
};
*/

//---------------------------------------------------------------------------------------------------



AAccordionEvent.prototype._select = function(selItem)
{
	var acc = this.acomp, $menu = $(selItem.menu), 
		isTrigger = false, timeoutVal = null;

	//각각의 이벤트 타입에 따라 컨텐츠 메뉴를 보여주고 숨기는 로직 처리
	$menu.bind(acc.jOption.showEvent, function(e)
	{
		//mouseover delay 값이 지정된 경우 delay 후에 이벤트가 발생하도록 처리
		if(acc.jOption.mouseOverEventDelay>0)
		{
			if(!isTrigger) //트리거로 이벤트를 발생시켰는지
			{
				timeoutVal = setTimeout(function()
				{
					isTrigger = true;
					$menu.trigger('mouseover');
				}, 
				acc.jOption.mouseOverEventDelay);

				return;
			}

			isTrigger = false;
			timeoutVal = null;
		}

		if(selItem.url && !selItem.contents.view)	//이미 로드되어져 있는 경우는 제외
		{
			AView.createView(selItem.contents, selItem.url, acc, acc.getRootView());
		}
		
		acc.showHideManage(selItem);
		
		acc.reportEvent('select', selItem, e);
	});

	//mouseover delay 값이 지정된 경우 mouseout 발생하면 이벤트를 발생시키지 않는다.
	if(acc.jOption.mouseOverEventDelay>0)
	{
		$menu.mouseout(function()
		{
			if(timeoutVal) 
			{
				clearTimeout(timeoutVal);
				timeoutVal = null;
			}
		}); 
	}
};



