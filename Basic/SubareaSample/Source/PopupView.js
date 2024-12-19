
afc.import('Framework/afc/component/AMessageBox.js')

PopupView = class PopupView extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}


	onMessageBtnClick(comp, info, e)
	{
        let wnd = new AMessageBox()
        wnd.openBox(null, 'Hello World!')

	}
}

