
/**
Constructor 
Do not call Function in Constructor.
*/
class ItemView()
{
	super();

	//TODO:edit here

}
extends AView;


function ItemView*init(context, evtListener)
{
	super.init(context, evtListener);

	var data = this._item.itemData;

	this.name.setText(data.name);
	this.code.setText('('+data.code+')');

};

function ItemView*onInitDone()
{
	super.onInitDone();
	

};

function ItemView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function ItemView*onDeleteBtnClick(comp, info, e)
{
	var thisObj = this;
	
	setTimeout(function()
	{
		//ResultView removeCodeItem
		thisObj.owner.getRootView().removeCodeItem(thisObj._item);
		
	}, 1);
	
};

function ItemView*onDeleteBtnActionDown(comp, info, e)
{
	//pc 버전
	//TextField 에 포커스가 남아 있도록
	
	e.preventDefault();

};
