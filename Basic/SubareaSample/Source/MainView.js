
afc.import('Framework/afc/component/ADialog.js')

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here

    }

	onButtonClick(comp, info, e)
	{
		let wnd = new ADialog()
        wnd.openDialog('Source/PopupView.lay', null, 400, 300)
	}
}



MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

MainView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);


};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};
