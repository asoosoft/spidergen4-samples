
/**
Constructor
Do not call Function in Constructor.
*/
class RBMSampleView()
{
	super();

	//TODO:edit here

}
extends AView;


function RBMSampleView*onInitDone()
{
	super.onInitDone();

	//TODO:edit here
	this.rbm = new RadioBtnManager(this);
	
	//현재 선택되어져 있는 버튼 얻어오기
	//var btn = this.rbm.getSelectButton();
	
	//두번째 버튼을 선택된 상태로 셋팅
	this.onTabClick(this.tab2);

};

function RBMSampleView*onTabClick(comp, info, e)
{
	this.rbm.selectButton(comp);
	
	this.testTabview.selectTabById( comp.getComponentId() );

};

function RBMSampleView*onBackBtnClick(comp, info, e)
{

	this.getContainer().navigator.goPrevPage();

};
