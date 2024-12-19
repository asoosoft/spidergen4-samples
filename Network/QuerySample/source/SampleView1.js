

SampleView1 = class SampleView1 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



SampleView1.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

SampleView1.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

SampleView1.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

SampleView1.prototype.onQueryBtnClick = function(comp, info, e)
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
		
		//var blockData = queryData.getBlockData('OutBlock1');
	});

};
