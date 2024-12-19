
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
	
};

//init이 된 후 불려지는 함수
function MainView*onInitDone()
{
	super.onInitDone();
	
	//탭 정보를 추가한다. 
	//정보만 추가하고 실제로 화면이 로드되지는 않는다.
	//화면은 탭이 선택되는 시점에 로드된다.
	this.tabView.addTab('탭1', 'Source/Views/SubView1.lay', 'tab1');
	this.tabView.addTab('탭2', 'Source/Views/SubView2.lay', 'tab2');
	this.tabView.addTab('탭3', 'Source/Views/SubView3.lay', 'tab3');
	
	
	//기본적으로 첫번째 탭이 선택되도록
	//탭 아이디로 선택
	//selectTab 은 비동기 함수이므로 함수 호출 후, 탭의 컨텐츠 로드가 완료된 후의 작업이 필요하면 
	//then 이나 async, await 를 사용해야 한다.
	this.tabView.selectTabById('tab1').then(data=>
	{
		var selView = this.tabView.getSelectedView();
		console.log(selView.TitleLabel.getText());
	});	
	
	//로드되어지는 각 뷰에서 처리할 경우 단순히 호출해도 됨.
	//this.tabView.selectTabByIndex(0);	//인덱스로 선택
	
};

function MainView*onButtonTabShowClick(comp, info)
{	
	// 탭 영역을 보여준다.
	this.tabView.showTabArea();
};


function MainView*onButtonTabHideClick(comp, info)
{
	// 탭 영역을 숨긴다.
	this.tabView.hideTabArea();
};

// 라벨을 변경한다.
function MainView*setTitle(title)
{
	this.titleLabel.setText(title);
};





