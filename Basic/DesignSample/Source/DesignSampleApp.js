

class DesignSampleApp extends AApplication
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
		this.mainContainer.open('Source/DirectSample.lay');
		//this.mainContainer.open('Source/WorkView.lay');

		//TODO:edit here

	}

	unitTest(unitUrl)
	{
		//TODO:edit here

		this.onReady();

		super.unitTest(unitUrl);
	}
}


