

class SampleView1 extends AView
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

	onQueryBtnClick(comp, info, e)
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

	}
}


