
/**
Constructor
Do not call Function in Constructor.d
*/
class ResultView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	init(context, evtListener)
	{
		super.init(context, evtListener);

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone();

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

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);

		//TODO:edit here

	}

	filterData(text)
	{
		this.resultListview.removeAllItems();

		var data = this.data.filter(function(item)
		{
			return (item.name.indexOf(text)>-1);

		});

		this.resultListview.addItem('Source/ItemView.lay', data );

	}

	removeCodeItem(item)
	{
		//console.log(item);

		this.resultListview.removeItem( item );
	}

	onResultListviewSelect(comp, info, e)
	{
		//console.log('select');

		this.getContainer().close(info.itemData);

	}

	closeManage()
	{
		//var fcomp = AComponent.getFocusComp();

		//if(fcomp.isValid() && fcomp.getContainer()===this.getContainer()) return;

		this.getContainer().close();

	}

	selectItemManage(isDown)
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
	}

	onAutoSaveBtnClick(comp, info, e)
	{

	}

	onClearAllBtnClick(comp, info, e)
	{
		this.data = [];

		this.resultListview.removeAllItems();
	}

	onClearAllBtnActionDown(comp, info, e)
	{
		//pc 버전
		//버튼을 클릭해도 TextField 에 포커스가 남아 있도록
		e.preventDefault();

	}

	onAutoSaveBtnActionDown(comp, info, e)
	{
		//pc 버전
		//버튼을 클릭해도 TextField 에 포커스가 남아 있도록
		e.preventDefault();

	}

	onResultViewActionDown(comp, info, e)
	{
		//클릭해도 TextField 에 포커스가 남아 있도록
		e.preventDefault();

	}
}


