

class MainView extends AView
{
    constructor()
    {
        super()
		
	

    }

    init(context, evtListener)
    {
	    super.init(context, evtListener)

    }

    onInitDone()
    {
        super.onInitDone()

        this.onTabBtnClick(this.normal)


    }

    onActiveDone(isFirst)
    {
        super.onActiveDone(isFirst)


    }

	onTabBtnClick(comp, info, e)
	{


		this.tabview.selectTabById(comp.getComponentId())

	}
}


