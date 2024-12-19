

WindowView2 = class WindowView2 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



WindowView2.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

WindowView2.prototype.onButtonCloseClick = function(comp, info)
{

	//TODO:edit here
	
	//뷰의 컨테이너를 찾아서 닫는다.
	this.getContainer().close();

};
