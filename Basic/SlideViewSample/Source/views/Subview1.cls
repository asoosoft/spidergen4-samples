
/**
Constructor
Do not call Function in Constructor.
*/
class Subview1()
{
	super();

	//TODO:edit here

}
extends AView;


function Subview1*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function Subview1*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function Subview1*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};


function Subview1*setData(data)
{

	this.cntLabel.setText( 'Data : ' + data );

};
