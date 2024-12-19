

SubareaSampleApp = class SubareaSampleApp extends AApplication
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



SubareaSampleApp.prototype.onReady = function()
{
	AApplication.prototype.onReady.call(this);

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

    // 실제로 test.html 내부에 로드 하려면 
    // 아래 주석을 풀어서 메인 컨테이너를 relative 로 만들어 준다.
    // 
    //this.mainContainer.$ele.css('position', 'relative');
};

SubareaSampleApp.prototype.unitTest = function(unitUrl)
{
	//TODO:edit here

	this.onReady();

	AApplication.prototype.unitTest.call(this, unitUrl);
};

