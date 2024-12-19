

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

LoginView.prototype.onLoginBtnClick = function(comp, info, e)
{
	var navi = ANavigator.getRootNavigator();
	
	navi.goPage('MainView');
};
