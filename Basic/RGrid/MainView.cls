
/**
Constructor
Do not call Function in Constructor.
*/
class MainView()
{
	super();

	//TODO:edit here

}
extends AView;


function MainView:init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function MainView:onInitDone()
{
	//lay 파일에서 RGrid - (더블클릭 또는 우클릭) XML EDITOR - dummyData에 지정해둔 데이터를 사용할지 여부
	this.RGrid709698.useDummyData();
	this.detailRGrid709698(false);
};


//셀렉트 박스 change 이벤트
function MainView:onASelectBoxChange(comp, info)
{
	var text = comp.getSelectedItem().text;
	if(text =='요약') this.detailRGrid709698(false);
	else if(text == '상세') this.detailRGrid709698(true);
};

function MainView:detailRGrid709698(boolean)
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

function MainView:onAButtonClick(comp, info)
{
	if(comp.getText() == "행추가") 
	{
		debugger;
		this.RGrid709698.addData([{"col0":"IWC3-RM1본부","col1":"999999","col2":"0.666","col3":"999999","col4":"0.666","col5":"999999","col6":"0.666","col7":"999999","col8":"0.666","col9":"999999","col10":"0.666","rm_internal_uid":"042CE54A-D3F1-0BA6-4C50-3B4B8D85E5F6"}]);
	}
	else if(comp.getText() == "행삭제")
	{
		var selIndex = this.RGrid709698.getDataGrid().selectedIndex;
		if(selIndex == -1) AToast.show('삭제할 행을 선택해주세요');
		else this.RGrid709698.removeItemAt(selIndex);
	}

};
