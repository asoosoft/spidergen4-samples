
/**
Constructor 
Do not call Function in Constructor.
*/
class ItemView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	init(context, evtListener)
	{
		super.init(context, evtListener);

		var data = this._item.itemData;

		this.name.setText(data.name);
		this.code.setText('('+data.code+')');

	}

	onInitDone()
	{
		super.onInitDone();


	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);

		//TODO:edit here

	}

	onDeleteBtnClick(comp, info, e)
	{
		var thisObj = this;

		setTimeout(function()
		{
			//ResultView removeCodeItem
			thisObj.owner.getRootView().removeCodeItem(thisObj._item);

		}, 1);

	}

	onDeleteBtnActionDown(comp, info, e)
	{
		//pc 버전
		//TextField 에 포커스가 남아 있도록

		e.preventDefault();

	}
}


