
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

};

function MainView*onInitDone()
{
	super.onInitDone();

	//--------------------------------------------------------
	//	슬라이드뷰의 사용법은 기본적으로 리스트뷰와 유사합니다.
	
	//	1) 여러 종류의 뷰를 하나씩 추가할 경우, 데이터가 별 의미가 없을 경우라도 배열의 개수만큼 추가되므로 기본적으로 셋팅해 주셔야 합니다.
	
	this.testSlideView.addItem('Source/views/Subview1.lay', [1]);
	this.testSlideView.addItem('Source/views/Subview2.lay', [2]);
	this.testSlideView.addItem('Source/views/Subview3.lay', [3]);
	
	//다음과 같은 방법도 있음.
	//this.testSlideView.addItems(['Source/views/Subview1.lay', 'Source/views/Subview2.lay', 'Source/views/Subview3.lay'], [1, 2, 3]);
	
	
	//------------------------------------------------------------------------------------------------------------------------
	//	2) 같은 종류의 뷰를 여러번 추가하는 경우, lay 경로는 같고 다른 종류의 데이터가 보내지며 그 값을 화면에 셋팅방식으로 개발합니다.
	//	subview1.cls 에 setData(data) 함수를 구현하면 로드 시점에 자신의 인덱스에 맞는 값이 전달됩니다.
	
	//  this.testSlideView.addItem('Source/views/Subview1.lay', ['a', 'b', 'c']);
	
	//슬라이드 페이징 처리를 할 뷰 객체를 지정합니다. 내부에 AButton 을 추가하시면 자동으로 매칭된 뷰로 슬라이드 되는 버튼 기능을 생성해 줍니다.
	this.testSlideView.setButtonView(this.slidePageView);
	
	//move speed setting
	//this.testSlideView.setSpeed(300);
	
	//------------------------------------------------------
	// 특정 위치의 뷰에 접근하는 방법
	// 이 경우 addItem 이 비동기 이므로 
	// 이전에 호출된 비동기 작업이 완료됐는지를 체크하는 afc.asyncReady 를 사용하거나
	afc.asyncReady(()=>
	{
		var item = this.testSlideView.getItem(0);
		item.view.cntLabel.setText('Hello~');
	});
	
	//위에서 this.testSlideView.addItem 호출 시 then 을 사용해야 한다. 
	/*
	this.testSlideView.addItem('Source/views/Subview1.lay', [1]).then(items=>
	{
		items[0].view.cntLabel.setText('Hello~22');
	});
	*/

};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function MainView*onPrevBtnClick(comp, info, e)
{

	this.testSlideView.slidePrev();

};

function MainView*onNextBtnClick(comp, info, e)
{

	this.testSlideView.slideNext();

};

function MainView*onASelectBox1Change(comp, info, e)
{
	//console.log('select index : ' + info);
	
	this.testSlideView.slideTo(info);

};
