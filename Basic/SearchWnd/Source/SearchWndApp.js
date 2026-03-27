

class SearchWndApp extends AApplication
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	onReady()
	{
		super.onReady();

		this.setMainContainer(new APage('main'));
		this.mainContainer.open('Source/MainView.lay');

	}

	unitTest(unitUrl)
	{
		//TODO:edit here

		this.onReady();

		super.unitTest(unitUrl);
	}
}


