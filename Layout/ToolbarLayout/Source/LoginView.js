

LoginView = class LoginView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



LoginView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

LoginView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

LoginView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

LoginView.prototype.onNextBtnClick = function(comp, info, e)
{

	this.getContainer().navigator.goPage('MainView');

};