
class Subitem1 extends AView
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

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);

		//TODO:edit here

	}

	setData(data)
	{
		for(var i=0; i<5; i++)
			this.grid.addRow(data);

	}
}


