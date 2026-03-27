

class ListViewSampleApp extends AApplication
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
		this.mainContainer.open('Source/Views/MainView.lay');

	}
}


