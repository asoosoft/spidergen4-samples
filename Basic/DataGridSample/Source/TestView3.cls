
/**
Constructor
Do not call Function in Constructor.
*/
class TestView3()
{
	super();

	//TODO:edit here

}
extends AView;


function TestView3:onInitDone()
{
	var data = [];
	
	for(var i=0; i<100; i++)
	{
		data.push([{type:'checkbox'}, {text:"check test"}, {text:100-i}, {text:i+2}, {text:i+3}, {text:i+4}]);
	}
	
	this.dataGrid1.setGridData(data);


	var data2 = [];
	for(i=0; i<100; i++)
	{
		data2.push([{type:'checkbox'}, {text:i+'a'}, {type:'radio'}, {typetext:i+'c'}, {text:i+'d'}, {text:i+'e'}]);
	}
	
	//data2[9][2].select = true;

	
	this.dataGrid2.setGridData(data2);
	
	//this.initDragDrop();

};

//작업중...
function TestView3:initDragDrop()
{
	var row;
	
	this.dragImg = new Image();
	this.dragImg.src = 'Source/icon_10.png';
	
	theApp.dndManager.regDrop(this.dataGrid1.grid.element, this, { hoverClass: 'drag_over'});
	theApp.dndManager.regDrop(this.dataGrid2.grid.element, this, { hoverClass: 'drag_over'});

};

function TestView3:onAButton1Click(comp, info, e)
{

	this.dataGrid1.getSelectRowArrs();

};

function TestView3:onDataGrid1Select(comp, info, e)
{

	afc.log(info);

};

function TestView3:onDataGrid2Select(comp, info, e)
{

	afc.log(info);

};
