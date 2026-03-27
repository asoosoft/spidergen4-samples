
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

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone();

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);

		//TODO:edit here

	}

	onInputEditFocus(comp, info, e)
	{
		if(this.searchWnd) return;

		var wnd = new AWindow('search_result');

		var pos = comp.getPos(),
			width = comp.element.style.width, thisObj = this;

		wnd.setOption(
		{
			isModal: false,
			focusOnInit: false
		});

		wnd.setResultCallback(function(result)
		{
			thisObj.searchWnd = null;

			comp.$ele.blur();

			if(result)
			{
				thisObj.inputEdit.setText(result.name);

				console.log(result.name);
			}
		});

		//컨테이너의 open 은 비동기 함수이므로 로드가 완료된 후의 작업은 then 이나 async, await 를 사용한다.
		wnd.open('Source/ResultView.lay', this.getContainer(), pos.left, pos.top+40, width).then(d=>
		{
			this.searchWnd = wnd;
		});

	}

	onInputEditChange(comp, info, e)
	{
		if(this.searchWnd)
		{
			this.searchWnd.getView().filterData(comp.getText());
		}
	}

	onInputEditBlur(comp, info, e)
	{
		if(this.searchWnd)
		{
			this.searchWnd.getView().closeManage();
		}

	}

	onInputEditKeyDown(comp, info, e)
	{
		if(!this.searchWnd) return;

		var resultView = this.searchWnd.getView(), item;

		if(e.which==38 || e.which==40)
		{
			item = resultView.selectItemManage(e.which==38);

			this.inputEdit.setText(item.itemData.name);
		}

		//enter
		else if(e.which==13)
		{
			item = resultView.resultListview.getSelectItem();
			resultView.onResultListviewSelect(null, item);
		}


	}

	onSearchBtnClick(comp, info, e)
	{

		console.log('검색어 : ' + this.inputEdit.getText());

	}
}


