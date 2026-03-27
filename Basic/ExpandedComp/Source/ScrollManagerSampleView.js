

class ScrollManagerSampleView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	onInitDone()
	{
		super.onInitDone();

		var data = [];
		for(var i=0; i<40; i++)
			data.push(i);

		//listview
		this.testListView.addItem('Source/subviews/subview1.lay', data);


		//grid
		for(var i=0; i<50; i++)
			this.testGrid.addRow([i+1, i+2, i+3]);

	}

	onBackBtnClick(comp, info, e)
	{

		this.getContainer().navigator.goPrevPage();

	}

	onListEnableBtnClick(comp, info, e)
	{

		this.testListView.enableScrlManager();

	}

	onGridEnableBtnClick(comp, info, e)
	{

		this.testGrid.enableScrlManager();

	}
}


