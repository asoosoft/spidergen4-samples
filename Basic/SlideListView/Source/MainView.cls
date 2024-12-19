
/**
Constructor
Do not call Function in Constructor.
*/
class MainView()
{
	super();

	//TODO:edit here

}
extends AView;

function MainView*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here
	
	//리스트뷰는 isUpdatePosition 옵션이 기본적으로 false 이다.
	//리스트뷰가 동적으로 리사이즈 될 때 
	//슬라이드뷰의 아이템이 리사이즈 되려면 옵션을 true 로 셋팅해야 한다.
	
	
	//리스트뷰의 항목이 많을 경우 속도가 저하됨
	this.listView.setOption({isUpdatePosition: true});
	

};

function MainView*onInitDone()
{
	super.onInitDone();
	
	
	this.listView.addItem('Source/subview1.lay', [1]);
	this.listView.addItem('Source/SlideSubview.lay', [1]);
	this.listView.addItem('Source/subview1.lay', [1]);
	this.listView.addItem('Source/SlideSubview.lay', [1]);
	this.listView.addItem('Source/subview1.lay', [1]);

};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function MainView*onAView1Swipe(comp, info, e)
{

	AToast.show('Main View Swipe');

};
