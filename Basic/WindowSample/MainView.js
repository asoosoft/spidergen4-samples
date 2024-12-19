
afc.import('Framework/afc/component/ADialog.js')

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

    init(context, evtListener)
    {
        super.init(context, evtListener)

        //TODO:edit here

    }

    onInitDone()
    {
        super.onInitDone()

        //TODO:edit here

    }


    //window option 
    //	{
    //		isModal: false,				//모달로 띄울지
    //		isCenter: false,			//자동 중앙정렬 할지
    //		isFocusLostClose: false,	//모달인 경우 포커스를 잃을 때 창을 닫을지
    //		isFocusLostHide: false,		//모달인 경우 포커스를 잃을 때 창을 숨길지
    //		modalBgOption: afc.isMobile ? 'dark' : 'none',		//none, light, dark 모달인 경우 배경을 어둡기 정도
    //		overflow: 'hidden',			//hidden, auto, visible, scroll
    //		dragHandle: null,			//드래그 핸들이 될 클래스명이나 아이디, .windowHandle or #windowHandle
    //		isResizable: false,			//윈도우 창을 리사이즈 가능하게 할지
    //		isDraggable: false,			//윈도우 창을 드래그로 움직이게 할지
    //		inParent: false,			//부모 컨테이너 안에 창을 띄울 경우, 모달리스(isModal:false)이고 부모를 클릭해도 항상 부모보다 위에 보이게 하려면 이 값을 true 로 셋팅해야 한다.
    //		focusOnInit: true,			//init될때 자동으로 윈도우의 첫번째 컴포넌트(tabIndex기준)에 포커스
    //		activePropagation: true		//윈도우가 닫힐 때 활성화 되는 컨테이너의 active 호출여부(onWillActive, onActive, onActiveDone)
    //	}

    onOptionBtnClick(comp, info, e)
    {
        // 컨테이너 id 를 설정하고 AWindow 를 생성한다.
        var wnd = new AWindow('sample03')
        
        // 윈도우의 옵션을 설정한다.
        wnd.setWindowOption({
            isModal : true,
            isFocusLostClose : true,
            modalBgOption : 'light',
            isDraggable: true,
            isResizable: true
        })
        
        //콜백함수가 아니고 객체를 셋팅하면 onWindowResult 함수가 호출된다.
        wnd.setResultListener(this)
        
        // url, parnt, top, left, width, height
        // 컨테이너의 open 함수는 비동기이므로 open 호출 후 로드가 완료된 view 에 접근하려면 
        // then 이나 async, await 를 사용해야 한다.
        wnd.open('Views/WindowView1.lay', null, 100, 100, 400, 240).then(()=>
        {
            let view = wnd.getView()
            view.ButtonOk.setText('Ok')
            view.ButtonCancel.setText('Cancel')
        })
    }

    onFullWindowBtnClick(comp, info, e)
    {
        var wnd = new AWindow('sample02')
        wnd.openFull('Views/WindowView2.lay')

    }

	onOpenDialogBtnClick(comp, info, e)
	{
        // 컨테이너 id 를 설정하고 ADialog 를 생성한다.
        var wnd = new ADialog('dialog');
        
        wnd.setData({ id: "asoosoft", pw: "test1234" })
        wnd.openDialog('Views/FrameView.lay', null, 400, 280)
	}

	onOpenFrameBtnClick(comp, info, e)
	{
        // AFrameWnd 는 모달리스 이므로 다중창 생성 가능
        // 창 생성 후 다시 Open FrameWnd 버튼을 누르면 같은 위치에 창이 다시 생성
        // 타이틀 드래그를 통해 위치 이동 및 창 리사이즈 가능
        var wnd = new AFrameWnd('frameWnd');
        wnd.open('Views/FrameView.lay', null, 100, 100, 400, 280)
	}

    //콜백함수가 아닌 리스너를 셋팅한 경우
    onWindowResult(result, data, wnd)
    {
        let cid = wnd.getContainerId()
        
        if(cid=='sample03')
        {
            //확인 버튼을 누른 경우
            if(result==0)
            {
                AToast.show('User ID : ' + data.uid + '\n User PW : ' + data.upw)
            }
        }
    }

}







