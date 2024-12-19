
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

	//TODO:edit here

};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function MainView*onSendBtnClick(comp, info, e)
{
	var url = 'http://127.0.0.1:3000/users/';
	var param = '?name=' + this.inputTxt.getText();
	
	var thisObj = this;
	
	$.ajax(
	{
		type:'GET',
		url: url + param,
		success: function(result)
		{
			console.log(result);
			
			thisObj.outData.setText(result);
		},
		error: function(error)
		{
			console.error(error);
		}
	});
	
};



function MainView*onSetDataBtnClick(comp, info, e)
{
	var url = 'http://127.0.0.1:3000/users/';
		
	var thisObj = this;
	
	$.ajax(
	{
		type:'GET',
		url: url,
		success: function(result)
		{
			//var str = JSON.stringify(result);
			//console.log(str);
		
			thisObj.dataView.setData(result);
		},
		error: function(error)
		{
			console.error(error);
		}
	});
};
