
/**
Constructor
Do not call Function in Constructor.d
*/
ResultView = class ResultView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



ResultView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

ResultView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	this.data = 
	[
		{ 'name':'삼성전자', 'code':'005930' },
		{ 'name':'대우조선해양', 'code':'042660' },
		{ 'name':'이베스트투자증권', 'code':'078020' },
		{ 'name':'기아차', 'code':'000270' },
		{ 'name':'셀트리온', 'code':'068270' },
		{ 'name':'바이오', 'code':'' },
		{ 'name':'삼성전자', 'code':'005930' },
		{ 'name':'대우조선해양', 'code':'042660' },
		{ 'name':'이베스트투자증권', 'code':'078020' },
		{ 'name':'기아차', 'code':'000270' },
		{ 'name':'셀트리온', 'code':'068270' },
		{ 'name':'바이오', 'code':'' }
	];
	
	this.resultListview.addItem('Source/ItemView.lay', this.data );
	
	
	this.selectItemManage();
	
};

ResultView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};


ResultView.prototype.filterData = function(text)
{
	this.resultListview.removeAllItems();

	var data = this.data.filter(function(item)
	{
		return (item.name.indexOf(text)>-1);
	
	});

	this.resultListview.addItem('Source/ItemView.lay', data );

};

ResultView.prototype.removeCodeItem = function(item)
{
	//console.log(item);
	
	this.resultListview.removeItem( item );
};

ResultView.prototype.onResultListviewSelect = function(comp, info, e)
{
	//console.log('select');
	
	this.getContainer().close(info.itemData);

};

ResultView.prototype.closeManage = function()
{
	//var fcomp = AComponent.getFocusComp();
	
	//if(fcomp.isValid() && fcomp.getContainer()===this.getContainer()) return;
	
	this.getContainer().close();
	
};


ResultView.prototype.selectItemManage = function(isDown)
{
	var item = this.resultListview.getSelectItem();
	
	var inx = 0;

	if(item)
	{
		inx = this.resultListview.indexOfItem( item );
		
		if(isDown) inx--;
		else inx++;

		var max = this.resultListview.getItemCount() - 1;

		if(inx<0) inx = 0;
		else if(inx>max) inx = max;
	}

	item = this.resultListview.getItem(inx);
	this.resultListview.setSelectItem(item);

	return item;
};

ResultView.prototype.onAutoSaveBtnClick = function(comp, info, e)
{

};

ResultView.prototype.onClearAllBtnClick = function(comp, info, e)
{
	this.data = [];

	this.resultListview.removeAllItems();
};

ResultView.prototype.onClearAllBtnActionDown = function(comp, info, e)
{
	//pc 버전
	//버튼을 클릭해도 TextField 에 포커스가 남아 있도록
	e.preventDefault();

};

ResultView.prototype.onAutoSaveBtnActionDown = function(comp, info, e)
{
	//pc 버전
	//버튼을 클릭해도 TextField 에 포커스가 남아 있도록
	e.preventDefault();

};

ResultView.prototype.onResultViewActionDown = function(comp, info, e)
{
	//클릭해도 TextField 에 포커스가 남아 있도록
	e.preventDefault();

};
