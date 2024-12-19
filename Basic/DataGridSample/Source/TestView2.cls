
/**
Constructor
Do not call Function in Constructor.
*/
class TestView2()
{
	super();

	//TODO:edit here

}
extends AView;


function TestView2:onInitDone()
{
	var data = 
	[
		[ {text:'1', colSpan:3, rowSpan:2 }, {}, {}, {text:'4', type:'radio'}, {text:'5', select:true}, 	{text:'6', rowSpan:2} ],
		[ {text:'1', colSpan:3 }, 			  {}, {}, {text:'test', colSpan:2}, {}, {} ] ,
		[ {text:'1'}, {text:'2'}, {text:'3'}, {text:'4'}, {text:'5'}, {text:'6'} ] ,
		[ {text:'1'}, {text:'2'}, {text:'3'}, {text:'4'}, {text:'5'}, {text:'6'} ] ,
		[ {text:'1'}, {text:'2'}, {text:'3'}, {text:'4'}, {text:'5'}, {text:'6'} ] ,
		[ {text:'1'}, {text:'2'}, {text:'3', colSpan:2, rowSpan:2}, {text:'4'}, {text:'5'}, {text:'6'} ] ,
		[ {text:'1'}, {text:'2'}, {text:'3', colSpan:2}, {text:'4'}, {text:'5'}, {text:'6'} ] ,
		[ {text:'1'}, {text:'2'}, {text:'3'}, {text:'4'}, {text:'5'}, {text:'6'} ] ,
		[ {text:'1'}, {text:'2'}, {text:'3'}, {text:'4'}, {text:'5'}, {text:'6'} ] ,
		[ {text:'1'}, {text:'2'}, {text:'3'}, {text:'4'}, {text:'5'}, {text:'6'} ] ,
		
	
	];
	
	this.testGrid.setGridData(data);
};

function TestView2:addTmplData()
{
	this.testGrid.addRowData([ {text:'1', colSpan:3, rowSpan:2 }, {}, {}, {text:'4'}, {text:'5'}, 	{text:'6', rowSpan:2} ], true);
	this.testGrid.addRowData([ {text:'1', colSpan:3 }, 			  {}, {}, {text:'test', colSpan:2}, {}, {} ], true);
	
	this.testGrid.updateDataGrid();
};

function TestView2:onAButton1Click(comp, info, e)
{
	this.addTmplData();

};

//remove all
function TestView2:onAButton2Click(comp, info, e)
{

	this.testGrid.removeAllRowData();

};

function TestView2:onHideColumnClick(comp, info, e)
{

	this.testGrid.grid.hideColumn(3);

};

function TestView2:onShowColumnClick(comp, info, e)
{

	this.testGrid.grid.showColumn(3);

};
