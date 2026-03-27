

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

	onSendBtnClick(comp, info, e)
	{
		var url = 'http://127.0.0.1:3000/users/';
		var param = '?name=' + this.inputTxt.getText();

		$.ajax(
		{
			type:'GET',
			url: url + param,
			success: (result)=>
			{
				console.log(result);

				this.outData.setText(result);
			},
			error: (error)=>
			{
				console.error(error);
			}
		});

	}

	onSetDataBtnClick(comp, info, e)
	{
		var url = 'http://127.0.0.1:3000/users/';

		$.ajax(
		{
			type:'GET',
			url: url,
			success: (result)=>
			{
				//var str = JSON.stringify(result);
				//console.log(str);

				this.dataView.setData(result);
			},
			error: (error)=>
			{
				console.error(error);
			}
		});
	}
}


