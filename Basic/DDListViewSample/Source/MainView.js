

class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	init(context, evtListener)
	{
		super.init(context, evtListener);

		/*
		this.listView.setOption(
		{
			'isLongTabDrag': false,
		});
		*/


		//enableGlobalDrag 호출 시, 다른 리스트뷰로 아이템 이동 가능
		//왼쪽 리스트뷰 아이템만 오른쪽으로 옮길 수 있게 함.
		this.listView.enableGlobalDrag();	

	}

	onInitDone()
	{
		super.onInitDone();

		this.listView.addItem('Source/subview1.lay', [1,2,3,4,5,6,7,8,9,0]);

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);

		//TODO:edit here

	}
}


