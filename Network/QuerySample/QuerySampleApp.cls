
/**
Constructor
Do not call Function in Constructor.
*/
class QuerySampleApp()
{
	super();

	//TODO:edit here
	
	this.serverUrl = 'http://127.0.0.1:3000/users/';
	
	this.qm = null;

}
extends AApplication;


function QuerySampleApp*onReady()
{
	super.onReady();

	var navigator = new ANavigator();
	navigator.registerPage('Source/MainView.lay', 'MainView');
	navigator.registerPage('Source/SampleView1.lay', 'SampleView1');
	
	navigator.goPage('MainView');

	//or

	//this.setMainContainer(new APage('main'));
	//this.mainContainer.open('Source/MainView.lay');

	this.connectServer();

};

function QuerySampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};

function QuerySampleApp*connectServer()
{
	this.qm = new WebQueryManager();
	
	var nio = new HttpIO(this.qm);
	this.qm.setNetworkIo(nio);
	
	this.qm.startManager(this.serverUrl);
};








