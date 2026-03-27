

class SubareaSampleApp extends AApplication
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

	    // 실제로 test.html 내부에 로드 하려면 
	    // 아래 주석을 풀어서 메인 컨테이너를 relative 로 만들어 준다.
	    // 
	    //this.mainContainer.$ele.css('position', 'relative');
	}

	unitTest(unitUrl)
	{
		//TODO:edit here

		this.onReady();

		super.unitTest(unitUrl);
	}
}


