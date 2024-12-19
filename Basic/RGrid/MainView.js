

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

MainView.prototype.onInitDone = function()
{
	//lay 파일에서 RGrid - (더블클릭 또는 우클릭) XML EDITOR - dummyData에 지정해둔 데이터를 사용할지 여부
	this.RGrid709698.useDummyData();
	this.detailRGrid709698(false);
};


//셀렉트 박스 change 이벤트
MainView.prototype.onASelectBoxChange = function(comp, info)
{
	var text = comp.getSelectedItem().text;
	if(text =='요약') this.detailRGrid709698(false);
	else if(text == '상세') this.detailRGrid709698(true);
};

MainView.prototype.detailRGrid709698 = function(boolean)
{
	//실제 그리드를 표시하는 객체를 가져오는 방법
	var dataGrid = this.RGrid709698.getDataGrid();
    columns = dataGrid.getColumns();
	for(var i=5;i<columns.length-1;i++)
	{
    	columns[i].setVisible(boolean);
	}
	
	columns[columns.length-1].setVisible(!boolean);
	
	if(boolean) dataGrid.setHeaderHeight(36);
	else dataGrid.setHeaderHeight(54);
};

MainView.prototype.onAButtonClick = function(comp, info)
{
	if(comp.getText() == "행추가") 
	{
		this.RGrid709698.addData([{"col0":"IWC3-RM1본부","col1":"999999","col2":"0.666","col3":"999999","col4":"0.666","col5":"999999","col6":"0.666","col7":"999999","col8":"0.666","col9":"999999","col10":"0.666","rm_internal_uid":"042CE54A-D3F1-0BA6-4C50-3B4B8D85E5F6"}]);
	}
	else if(comp.getText() == "행삭제")
	{
		var selIndex = this.RGrid709698.getDataGrid().selectedIndex;
		if(selIndex == -1) AToast.show('삭제할 행을 선택해주세요');
		else this.RGrid709698.removeItemAt(selIndex);
	}

};
