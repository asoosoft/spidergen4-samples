

cordovaSampleApp = class cordovaSampleApp extends AApplication
{
    constructor()
    {
        super()
		

    }


    onReady()
    {
        super.onReady()
                
        document.addEventListener('deviceready', ()=>
        {
            this.onDeviceReady()
        })

    }

    onDeviceReady()
    {
        this.setMainContainer(new APage('main'))
        this.mainContainer.open('Source/MainView.lay')
    }

    unitTest(unitUrl)
    {
        //TODO:edit here

        this.onReady()

        super.unitTest(unitUrl)
    }



}




