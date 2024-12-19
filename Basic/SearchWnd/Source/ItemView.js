
/**
Constructor 
Do not call Function in Constructor.
*/
ItemView = class ItemView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



ItemView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	var data = this._item.itemData;

	this.name.setText(data.name);
	this.code.setText('('+data.code+')');

};

ItemView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
	

};

ItemView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

ItemView.prototype.onDeleteBtnClick = function(comp, info, e)
{
	var thisObj = this;
	
	setTimeout(function()
	{
		//ResultView removeCodeItem
		thisObj.owner.getRootView().removeCodeItem(thisObj._item);
		
	}, 1);
	
};

ItemView.prototype.onDeleteBtnActionDown = function(comp, info, e)
{
	//pc 버전
	//TextField 에 포커스가 남아 있도록
	
	e.preventDefault();

};
