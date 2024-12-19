
/**
Constructor
Do not call Function in Constructor.
*/
class SlideSubview()
{
	super();

	//TODO:edit here

}
extends AView;


function SlideSubview*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function SlideSubview*onInitDone()
{
	super.onInitDone();

	this.slideView.addItems(['Source/items/item1.lay', 'Source/items/item2.lay', 'Source/items/item3.lay'] , [1,2,3]);
	
};

function SlideSubview*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};
