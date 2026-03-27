

class NormalView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	init(context, evtListener)
	{
		super.init(context, evtListener);

		var contents = [], arr;
		for(var i=1; i<4; i++)
		{
			arr = [];
			for(var j=1; j<4; j++)
				arr.push('data ' + i + '-' + j);

			contents.push(arr);
		}

		var obj = {
			name: '테스트',
			contents: contents
		};

		this.setTxa1.setText(JSON.stringify(obj, null, '\t'));

		arr = ['이름', '아무개', '나이', '30', '성별', '모름'];
		this.setTxa2.setText(JSON.stringify(arr, null, '\t'));
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

	onGetDataBtnClick(comp, info, e)
	{
		var data = this.getView1.getData();
		this.getTxa1.setText(JSON.stringify(data));
	}

	onGetDataBtn2Click(comp, info, e)
	{
		var data = this.getView2.getData();
		this.getTxa2.setText(JSON.stringify(data));
	}

	onSetDataBtnClick(comp, info, e)
	{
		this.grid.removeAll();

		var txt = this.setTxa1.getText();
		try{
			txt = JSON.parse(txt);
		}
		catch(err){
			AToast.show('Object 타입 JSON 구조 에러');
		}
		this.setView1.setData(txt);
	}

	onSetDataBtn2Click(comp, info, e)
	{
		var txt = this.setTxa2.getText();
		try{
			txt = JSON.parse(txt);
		}
		catch(err){
			AToast.show('Array 타입 JSON 구조 에러');
		}
		this.setView2.setData(txt);
	}
}


