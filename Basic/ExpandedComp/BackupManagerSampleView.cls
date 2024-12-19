
/**
Constructor
Do not call Function in Constructor.
*/
class BackupManagerSampleView()
{
	super();

	//TODO:edit here

}
extends AView;


function BackupManagerSampleView*onInitDone()
{
	super.onInitDone();

	this.testListView.createBackup( 60, 20 );
	this.testGrid.createBackup( 60, 20 );
	
};

function BackupManagerSampleView*onBackBtnClick(comp, info, e)
{

	this.getContainer().navigator.goPrevPage();

};

function BackupManagerSampleView*onAddItemBtnClick(comp, info, e)
{
	var data = [], time = new Date().getMilliseconds();
	
	for(var i=0; i<20; i++)
	{
		data.push(time);
	}

	//listview
	this.testListView.addItem('Source/subviews/subview1.lay', data);
	

};

function BackupManagerSampleView*onAddRowBtnClick(comp, info, e)
{
	var data, time = new Date().getMilliseconds(), rowArr = [];
	
	for(var i=0; i<20; i++)
	{
		data = i+':'+time;
		rowArr.push([data, data, data]);
		
		//하나씩 추가하는 경우
		//this.testGrid.addRow([data, data, data]);
	}
	
	//한번에 모두 추가하는 경우, 성능상 이점이 있다.
	this.testGrid.addRows(rowArr);
};


function BackupManagerSampleView*onMoveTopBtnClick(comp, info, e)
{
	this.testListView.scrollToTop();

};
