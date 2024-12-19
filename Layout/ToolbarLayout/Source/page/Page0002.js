

Page0002 = class Page0002 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



Page0002.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

Page0002.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

Page0002.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

Page0002.prototype.onPrevBtnClick = function(comp, info, e)
{

	//자신이 속해 있는 네비게이터를 얻어 이전으로 이동
	this.getContainer().navigator.goPrevPage();
	

};
