
TestView3 = class TestView3 extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone()

        for(let i=0; i<50; i++)
		{
			let rowData = [
				{text:'삼성전자보통주'}, {text:'005930'}, {text:999999999-i}, {text:'999,999,999'}, {text:'999,999,999'},{text:999999999-i*9},
			];

			this.dataGrid.addRowData(rowData, null, true);
		}

		//모두 추가한 후에 그리드를 갱신한다.
		this.dataGrid.updateDataGrid();
	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

}

