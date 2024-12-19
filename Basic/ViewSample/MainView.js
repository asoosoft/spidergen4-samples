

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
};

MainView.prototype.onInitDone = async function()
{
	AView.prototype.onInitDone.call(this);


	// 새로 만들 뷰의 url을 이용하여 뷰 컴포넌트를 만든다.
	// createView 는 비동기 함수이므로 로드된 view 에 접근하려면 
	// then 이나 async, await 를 사용해야 한다.
	var innerView = await AView.createView(null, 'Source/InnerView.lay');
	
	innerView.setCompRect(10, 10, 300, 300);
    innerView.TitleLabel.setText('Hello World!')
	
	//새로 만든 뷰 객체를 자식으로 추가한다.
	this.blankView1.addComponent(innerView);
	
	
	// 뷰 내부에 외뷰 모듈뷰를 로드한다.
	// loadView 는 비동기 함수이므로 로드된 view 에 접근하려면 
	// then 이나 async, await 를 사용해야 한다.
	this.blankView2.loadView('Source/InnerView.lay').then(view=>
	{
		view.TitleLabel.setText('Hello LoadView!');
	});
};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

