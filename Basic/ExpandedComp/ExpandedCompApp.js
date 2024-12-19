


/**
기본 라이브러리를 Framework/afc 의 Default Load Settings 로 설정
또는
다음과 같이 동적으로 import 할 수 있음
*/

afc.import('Framework/afc/component/ANavigator.js')

ExpandedCompApp = class ExpandedCompApp extends AApplication
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



ExpandedCompApp.prototype.onReady = function()
{
	AApplication.prototype.onReady.call(this);

	var navigator = new ANavigator();
	navigator.registerPage('Source/MainView.lay', 'MainView');
	navigator.registerPage('Source/DnDSampleView.lay', 'DnDSampleView');
	navigator.registerPage('Source/AnimaSampleView.lay', 'AnimaSampleView');
	navigator.registerPage('Source/ScrollManagerSampleView.lay', 'ScrollManagerSampleView');
	navigator.registerPage('Source/BackupManagerSampleView.lay', 'BackupManagerSampleView');
	navigator.registerPage('Source/ResponsiveSampleView.lay', 'ResponsiveSampleView');
	navigator.registerPage('Source/RBMSampleView.lay', 'RBMSampleView');
	
	
	navigator.goPage('MainView');

};

ExpandedCompApp.prototype.unitTest = function(unitUrl)
{
	//TODO:edit here

	this.onReady();

	AApplication.prototype.unitTest.call(this, unitUrl);
};

