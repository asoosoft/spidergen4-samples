
afc.import('Framework/afc/component/ADialog.js')

class MainView extends AView
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

	init(context, evtListener)
	{
		super.init(context, evtListener);

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone();


	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);

		//TODO:edit here

	}
}


