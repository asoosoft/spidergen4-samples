

class subview1 extends AView
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

		//this.msgLbl.setText(this._item.itemData + ' : Hello~');
		//--> getItemData 함수 사용
		this.msgLbl.setText(this.getItemData() + ' : Hello~');

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);

		//TODO:edit here

	}

	onALabel1ActionDown(comp, info, e)
	{
		this.owner.changeDragState(this, e);

	}

	onDelBtnClick(comp, info, e)
	{
		var mainView = this.owner.getRootView();

		//왼쪽 리스트 뷰로 이동
		//mainView.listView.itemInsertManage(this._item);
		//--> getItem 함수 사용
		mainView.listView.itemInsertManage(this.getItem());

	}
}


