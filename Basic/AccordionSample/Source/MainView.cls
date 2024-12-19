
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
	
	//다음과 같은 옵션이 있다.
	/*
	this.acc.setOption(
	{
    	showContent: false,			//아코디언 메뉴 추가시점에 바로 컨텐츠가 보여질지 여부
        speed: 'fast',											//에니메이션 속도
        isSingleShow: true,			//하나의 메뉴만 펼칠지
        isNoAnimation: false,		//펼쳐질 때 에니메이션 효과를 줄지
        isNoToggle: false,				//펼쳐진 항목 다시 클릭시 숨길지
        showEvent: 'click',			//bind event name,(ex: mouseover, ...)
        mouseOverEventDelay: 0,
        
        beforeShow: null,
        afterShow: null,
        beforeHide: null,
        afterHide: null,
    });	
	*/

};

function MainView*onInitDone()
{
	super.onInitDone();
	
	//------------------------------------
	// (1) 뷰 객체를 얻어 추가하는 방식
	//
	this.acc.insertItem('testView', this.testView);
	
	
	//(2) 모듈뷰를 동적으로 로드하여 추가하는 방식
	for(var i=0; i<3; i++)
		this.acc.insertItem('menu'+i, 'Source/items/Subitem1.lay', [1+i, 2+i, 3+i]);


	//------------------------------------
	// (3) 다음과 같이 응용할 수도 있다.
	// AView.createView 는 비동기 함수이므로 then 이나 await 를 사용해야 한다.
	
	AView.createView(null, 'Source/ViewItems.lay').then(view=>
	{
		//ViewItems.lay 내부에 있는 자식뷰를 아코디언뷰에 추가
		view.eachChild((acomp, inx)=>
		{
			this.acc.insertItem('menu'+inx, acomp);
		});
	});
	
};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};
