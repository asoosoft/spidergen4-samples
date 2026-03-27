

class SlideSubview extends AView
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

		this.slideView.addItems(['Source/items/item1.lay', 'Source/items/item2.lay', 'Source/items/item3.lay'] , [1,2,3]);

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);

		//TODO:edit here

	}
}


