
/**
Constructor
Do not call Function in Constructor.
*/
class Subitem1()
{
	super();

	//TODO:edit here

}
extends AView;


function Subitem1*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function Subitem1*onInitDone()
{
	super.onInitDone();

};

function Subitem1*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function Subitem1*setData(data)
{
	for(var i=0; i<5; i++)
		this.grid.addRow(data);

};
