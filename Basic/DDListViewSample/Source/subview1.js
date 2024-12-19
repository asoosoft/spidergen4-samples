

subview1 = class subview1 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



subview1.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

subview1.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//this.msgLbl.setText(this._item.itemData + ' : Hello~');
	//--> getItemData 함수 사용
	this.msgLbl.setText(this.getItemData() + ' : Hello~');

};

subview1.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

subview1.prototype.onALabel1ActionDown = function(comp, info, e)
{
	this.owner.changeDragState(this, e);

};

subview1.prototype.onDelBtnClick = function(comp, info, e)
{
	var mainView = this.owner.getRootView();
	
	//왼쪽 리스트 뷰로 이동
	//mainView.listView.itemInsertManage(this._item);
	//--> getItem 함수 사용
	mainView.listView.itemInsertManage(this.getItem());

};
