
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

function MainView*onGetDataBtnClick(comp, info, e)
{
	var data = this.getView1.getData();
	this.getTxa1.setText(JSON.stringify(data));
};

function MainView*onGetDataBtn2Click(comp, info, e)
{
	var data = this.getView2.getData();
	this.getTxa2.setText(JSON.stringify(data));
};

function MainView*onSetDataBtnClick(comp, info, e)
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
};

function MainView*onSetDataBtn2Click(comp, info, e)
{
	var txt = this.setTxa2.getText();
	try{
		txt = JSON.parse(txt);
	}
	catch(err){
		AToast.show('Array 타입 JSON 구조 에러');
	}
	this.setView2.setData(txt);
};
