
QuerySampleApp = class QuerySampleApp extends AApplication
{
    constructor()
    {
        super()
		
		this.serverUrl = 'http://127.0.0.1:3000/users/';
		
		this.qm = null;
    }

    onReady()
    {
        super.onReady()

        let navigator = new ANavigator()
        navigator.registerPage('Source/MainView.lay', 'MainView')
        navigator.registerPage('Source/SampleView1.lay', 'SampleView1')
        
        navigator.goPage('MainView')

        //or

        //this.setMainContainer(new APage('main'))
        //this.mainContainer.open('Source/MainView.lay')

        this.connectServer()

    }

    unitTest(unitUrl)
    {
        //TODO:edit here

        this.onReady()

        super.unitTest(unitUrl)
    }

    connectServer()
    {
        this.qm = new WebQueryManager()
        
        let nio = new HttpIO(this.qm)
        this.qm.setNetworkIo(nio)
        
        this.qm.startManager(this.serverUrl)
    }

}












