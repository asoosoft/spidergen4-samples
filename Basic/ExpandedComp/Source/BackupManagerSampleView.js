

BackupManagerSampleView = class BackupManagerSampleView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



BackupManagerSampleView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	this.testListView.createBackup( 60, 20 );
	this.testGrid.createBackup( 60, 20 );
	
};

BackupManagerSampleView.prototype.onBackBtnClick = function(comp, info, e)
{

	this.getContainer().navigator.goPrevPage();

};

BackupManagerSampleView.prototype.onAddItemBtnClick = function(comp, info, e)
{
	var data = [], time = new Date().getMilliseconds();
	
	for(var i=0; i<20; i++)
	{
		data.push(time);
	}

	//listview
	this.testListView.addItem('Source/subviews/subview1.lay', data);
	

};

BackupManagerSampleView.prototype.onAddRowBtnClick = function(comp, info, e)
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


BackupManagerSampleView.prototype.onMoveTopBtnClick = function(comp, info, e)
{
	this.testListView.scrollToTop();

};
