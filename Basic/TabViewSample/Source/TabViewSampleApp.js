

afc.import("Framework/afc/component/AToast.js");


class TabViewSampleApp extends AApplication
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


