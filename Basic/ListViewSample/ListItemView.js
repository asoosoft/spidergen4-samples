

ListItemView = class ListItemView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
		
		this.data = null;
	
	

    }
}



ListItemView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	
};

ListItemView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

};

//setData 함수를 생성하면 아이템이 추가될 때 자동으로 호출된다.
//자신이 추가된 index 에 맞는 data 오브젝트가 파라미터로 넘어온다.
ListItemView.prototype.setData = function(data)
{
	this.itemImage.setImage(data.img);
	this.itemLabel.setText(data.title);
	
	this.data = data;
};


ListItemView.prototype.onDeleteButtonClick = function(comp, info)
{
	//owner 는 자신을 로드한 컴포넌트이다. 여기서는 AListView
	//this.owner.removeItem(this._item);
	this.owner.removeItem(this.getItem());

};
