

class RBMSampleView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	onInitDone()
	{
		super.onInitDone();

		//TODO:edit here
		this.rbm = new RadioBtnManager(this);

		//현재 선택되어져 있는 버튼 얻어오기
		//var btn = this.rbm.getSelectButton();

		//두번째 버튼을 선택된 상태로 셋팅
		this.onTabClick(this.tab2);

	}

	onTabClick(comp, info, e)
	{
		this.rbm.selectButton(comp);

		this.testTabview.selectTabById( comp.getComponentId() );

	}

	onBackBtnClick(comp, info, e)
	{

		this.getContainer().navigator.goPrevPage();

	}
}


