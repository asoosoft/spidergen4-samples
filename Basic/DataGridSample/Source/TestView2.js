

TestView2 = class TestView2 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



TestView2.prototype.onInitDone = function()
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

TestView2.prototype.addTmplData = function()
{
	this.testGrid.addRowData([ {text:'1', colSpan:3, rowSpan:2 }, {}, {}, {text:'4'}, {text:'5'}, 	{text:'6', rowSpan:2} ], true);
	this.testGrid.addRowData([ {text:'1', colSpan:3 }, 			  {}, {}, {text:'test', colSpan:2}, {}, {} ], true);
	
	this.testGrid.updateDataGrid();
};

TestView2.prototype.onAButton1Click = function(comp, info, e)
{
	this.addTmplData();

};

//remove all
TestView2.prototype.onAButton2Click = function(comp, info, e)
{

	this.testGrid.removeAllRowData();

};

TestView2.prototype.onHideColumnClick = function(comp, info, e)
{

	this.testGrid.grid.hideColumn(3);

};

TestView2.prototype.onShowColumnClick = function(comp, info, e)
{

	this.testGrid.grid.showColumn(3);

};
