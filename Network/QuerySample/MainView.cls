
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


function MainView*onInitDone()
{
	super.onInitDone();
	
	

};

function MainView*onTestBtnClick(comp, info, e)
{
	var thisObj = this;
	
	theApp.qm.sendProcessByName('ac003', this.getContainerId(), null,
	
	//inblock function, 서버로 전송되기 바로 전에 호출되는 함수
	function(queryData)
	{
		var blockData = queryData.getBlockData('InBlock1');
		blockData[0].input1 = 'hello';
		
		queryData.printQueryData();
	},
	
	//outblock function, 서버로부터 데이터를 수신한 후 바로 호출되는 함수
	function(queryData)
	{
		queryData.printQueryData();
		
		//var blockData = queryData.getBlockData('OutBlock1');
		
		//thisObj.outLbl.setText(blockData[0].output2);
		
	});

};

function MainView*onConfirmBtnClick(comp, info, e)
{
	theApp.qm.sendProcessByName('ac001', this.getContainerId(), null,
	
	//inblock function, 서버로 전송되기 바로 전에 호출되는 함수
	function(queryData)
	{
		var blockData = queryData.getBlockData('InBlock1');
		blockData[0].login_id = '7777';
		
		queryData.printQueryData();
	},
	
	//outblock function, 서버로부터 데이터를 수신한 후 바로 호출되는 함수
	function(queryData)
	{
		queryData.printQueryData();
		
		var blockData = queryData.getBlockData('OutBlock1');
		blockData[0].uid = 456789;		
	});

};

function MainView*onSendBtnClick(comp, info, e)
{
	theApp.qm.sendProcessByName('ac002', this.getContainerId(), null,
	
	//inblock function, 서버로 전송되기 바로 전에 호출되는 함수
	function(queryData)
	{
		queryData.printQueryData();
		
	},
	
	//outblock function, 서버로부터 데이터를 수신한 후 바로 호출되는 함수
	function(queryData)
	{
		queryData.printQueryData();
		
		var blockData = queryData.getBlockData('OutBlock1');
		
		if(blockData[0].sex==1) blockData[0].sex = '남성';
		else blockData[0].sex = '여성';
	});
};


function MainView*onNextBtnClick(comp, info, e)
{
	this.getContainer().navigator.goPage('SampleView1');

};
