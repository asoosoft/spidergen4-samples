
/**
Constructor
Do not call Function in Constructor.
*/
class SampleView1()
{
	super();

	//TODO:edit here

}
extends AView;


function SampleView1*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function SampleView1*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function SampleView1*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function SampleView1*onQueryBtnClick(comp, info, e)
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
