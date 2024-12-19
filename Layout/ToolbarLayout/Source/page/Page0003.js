

Page0003 = class Page0003 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



Page0003.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

Page0003.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

Page0003.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

Page0003.prototype.onPrevBtnClick = function(comp, info, e)
{

	//자신이 속해 있는 네비게이터를 얻어 이전으로 이동
	this.getContainer().navigator.goPrevPage();

};
