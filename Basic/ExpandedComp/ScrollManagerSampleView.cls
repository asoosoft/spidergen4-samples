
/**
Constructor
Do not call Function in Constructor.
*/
class ScrollManagerSampleView()
{
	super();

	//TODO:edit here

}
extends AView;


function ScrollManagerSampleView*onInitDone()
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
	
};

function ScrollManagerSampleView*onBackBtnClick(comp, info, e)
{

	this.getContainer().navigator.goPrevPage();

};

function ScrollManagerSampleView*onListEnableBtnClick(comp, info, e)
{

	this.testListView.enableScrlManager();

};

function ScrollManagerSampleView*onGridEnableBtnClick(comp, info, e)
{

	this.testGrid.enableScrlManager();

};
