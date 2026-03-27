

class SubView2 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	init(context, evtListener)
	{
		super.init(context, evtListener);


	}

	onInitDone()
	{
		super.onInitDone();


	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);

		var mainView = this.getContainer().getView();	//MainView 객체는 컨테이너의 기본뷰이므로 이와 같이 얻어올 수 있다.

		mainView.setTitle(this.TitleLabel.getText());
	}

	onSelectBtnClick(comp, info, e)
	{
		//owner 는 자신을 로드한 컴포넌트이다. 여기서는 ATabView 이다.
		this.owner.selectTabById('tab3');

	}
}


//초기화가 완료되면 호출되는 함수

//뷰의 활성화가 완료되면 매번 호출된다.

