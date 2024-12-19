

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

MainView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

MainView.prototype.onSendBtnClick = function(comp, info, e)
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
	
};



MainView.prototype.onSetDataBtnClick = function(comp, info, e)
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
};
