

DnDSampleView = class DnDSampleView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
		
		
	
	

    }
}



DnDSampleView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	this.ddm = new DnDManager('sample');
	
	this.setDragComp();
	this.setDropComp();

};


//-------------------------------------------
//	* listener event functions *
//	function onDragStart(DnDManager, event);
//	function onDragEnd(DnDManager, event);

DnDSampleView.prototype.setDragComp = function()
{
	var img = new Image();
	img.src = 'Assets/icon02.gif';	

	//---------------------------------------------------------
	//	param
	//	element : 드래그 하려는 컴포넌트의 element
	//	listener : 드래그 관련 이벤트 수신 리스너
	//	option : 드래그 옵션
	this.ddm.regDrag(this.dragComp.element, this, 
	{
		dragImage: img,
		imageOffset: {x:20, y:20}
	});

};


//-------------------------------------------
//	* listener event functions *
//	function onDragEnter(DnDManager, event);
//	function onDragLeave(DnDManager, event);
//	function onElementDrop(DnDManager, event, dragElement);

DnDSampleView.prototype.setDropComp = function()
{
	//---------------------------------------------------------
	//	param
	//	element : 드랍 하려는 컴포넌트의 element
	//	listener : 드랍 관련 이벤트 수신 리스너
	//	option : 드랍 옵션
	this.ddm.regDrop(this.dropTrg1.element, this, 
	{ 
		hoverClass: 'drag_over1',	//드래그 element 가 자신의 위로 올라왔을 때 활성화될 클래스
		applyChild: true			//자식 element 까지 drop 이벤트가 적용되도록, false 이면 over target 이 등록 element 와 같은 경우만 발생.
	});

	this.ddm.regDrop(this.dropTrg2.element, this, 
	{ 
		hoverClass: 'drag_over2',	
		applyChild: true			
	});
	
	//자신에게도 드랍이 가능하도록 허용.
	//아래 주석을 풀고 실행해 보기 
	
	this.ddm.regDrop(this.element, this, 
	{ 
		applyChild: false	//위에서 별도로 등록했으므로 false 를 준다.
	});
	

};

DnDSampleView.prototype.onElementDrop = function(ddm, e, dragEle)
{
	var dropEle = e.currentTarget;	//드랍한 element
			
		
	//	드랍 및 드래그 element 객체로부터 컴포넌트 객체를 얻어올 수 있다.
	//	실제로 아래 두 코드를 주석 달면 아무작동도 하지 않는다.
	//	관련 이벤트 정보만 전달해 줄 뿐이며 원하는 작동이 되도록 코드를 추가하면 된다.
	
	if(dropEle.acomp===this) dragEle.acomp.setPos({left: 30, top: 320});
	else dragEle.acomp.setPos({left: 10, top: 10});
	
	dropEle.acomp.addComponent(dragEle.acomp);
	
};






DnDSampleView.prototype.onBackBtnClick = function(comp, info, e)
{

	this.getContainer().navigator.goPrevPage();

};
