
/**
Constructor
Do not call Function in Constructor.
*/
class subview1()
{
	super();

	//TODO:edit here

}
extends AView;


function subview1*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};


function subview1*setData(data)
{

	this.lbl1.setText(data);
	this.msg1.setText(data + ' message.');

};
