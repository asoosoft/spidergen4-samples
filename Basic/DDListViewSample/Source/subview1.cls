
/**
Constructor
Do not call Function in Constructor.
*/
class subview1()
{
	super();

	//TODO:edit here

}
extends AView;


function subview1*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function subview1*onInitDone()
{
	super.onInitDone();

	//this.msgLbl.setText(this._item.itemData + ' : Hello~');
	//--> getItemData 함수 사용
	this.msgLbl.setText(this.getItemData() + ' : Hello~');

};

function subview1*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function subview1*onALabel1ActionDown(comp, info, e)
{
	this.owner.changeDragState(this, e);

};

function subview1*onDelBtnClick(comp, info, e)
{
	var mainView = this.owner.getRootView();
	
	//왼쪽 리스트 뷰로 이동
	//mainView.listView.itemInsertManage(this._item);
	//--> getItem 함수 사용
	mainView.listView.itemInsertManage(this.getItem());

};
