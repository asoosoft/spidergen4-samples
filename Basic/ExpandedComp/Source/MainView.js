

class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	onInitDone()
	{
		super.onInitDone();

		//TODO:edit here

	}

	onMenuBtnClick(comp, info, e)
	{

		this.getContainer().navigator.goPage(comp.getComponentId());

	}
}


