

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



MainView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
	
	

}

MainView.prototype.onTestBtnClick = function(comp, info, e)
{
	theApp.qm.sendProcessByName('ac003', this.getContainerId(), null,
	
	//inblock function, 서버로 전송되기 바로 전에 호출되는 함수
	(queryData)=>
	{
		let blockData = queryData.getBlockData('InBlock1')
		blockData[0].input1 = 'hello'
		
		queryData.printQueryData()
	},
	
	//outblock function, 서버로부터 데이터를 수신한 후 바로 호출되는 함수
	(queryData)=>
	{
		queryData.printQueryData()
		
		//let blockData = queryData.getBlockData('OutBlock1')
		
		//this.outLbl.setText(blockData[0].output2)
		
	})

}

MainView.prototype.onConfirmBtnClick = function(comp, info, e)
{
	theApp.qm.sendProcessByName('ac001', this.getContainerId(), null,
	
	//inblock function, 서버로 전송되기 바로 전에 호출되는 함수
	(queryData)=>
	{
		let blockData = queryData.getBlockData('InBlock1');
		blockData[0].login_id = '7777';
		
		queryData.printQueryData();
	},
	
	//outblock function, 서버로부터 데이터를 수신한 후 바로 호출되는 함수
	(queryData)=>
	{
		queryData.printQueryData()
		
		let blockData = queryData.getBlockData('OutBlock1')
		blockData[0].uid = 456789
	})

}

MainView.prototype.onSendBtnClick = function(comp, info, e)
{
	theApp.qm.sendProcessByName('ac002', this.getContainerId(), null,
	
	//inblock function, 서버로 전송되기 바로 전에 호출되는 함수
	(queryData)=>
	{
		queryData.printQueryData()
		
	},
	
	//outblock function, 서버로부터 데이터를 수신한 후 바로 호출되는 함수
	(queryData)=>
	{
		queryData.printQueryData()
		
		let blockData = queryData.getBlockData('OutBlock1')
		
		if(blockData[0].sex==1) blockData[0].sex = '남성'
		else blockData[0].sex = '여성'
	})
}


MainView.prototype.onNextBtnClick = function(comp, info, e)
{
	this.getContainer().navigator.goPage('SampleView1')

}
