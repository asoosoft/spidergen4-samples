

/**
Constructor
Do not call Function in Constructor.
*/
class MainView()
{
	super();

	this.inx = 0;
	this.isAsc = true;

}
extends AView;


function MainView*init(context, evtListener)
{
	super.init(context, evtListener);

	this.simpleGridData = 
	[
		['아수소프트', '40', '20150001'],
		['아수소프트', '30', '20150002'],
		['아수소프트', '20', '20150003']
	];
	
};

function MainView*onInitDone()
{
	super.onInitDone();
	
	
};


//심플그리드의 셀을 선택했을 시...
function MainView*onSimpleGridSelect(comp:AGrid, info, event)
{
	var cell = info[0];
	
	if(cell.isHeader)
	{
		var colInx = comp.colIndexOfCell(cell);	//선택한 cell 의 컬럼 index 를 얻어온다.
		
		//그리드 옵션으로 sort 기능을 활성화 할 수 있지만 
		//샘플로 기능을 구현해 본다.
		comp.sortColumn(colInx, this.isAsc);
		
		this.isAsc = !this.isAsc;
	}
	else
	{
		//파라미터로 넘어온 cell 의 row, column 정보를 배열로 리턴한다. -> [row, col]
		var pos = comp.indexOfCell(info);
		
		//추가된 로우가 없는 경우
		if(pos[0]<0) return;

		//셀의 텍스트를 가져온다.
		AToast.show( comp.getCellText(pos[0], pos[1]) );
	}

};

function MainView*onAddBtnClick(comp, info, e)
{
	//해당 그리드 컴포넌트의 row 객체를 추가한다.
	
	this.simpleGrid.addRow(this.simpleGridData[this.inx]);
	
	this.inx++;
	if(this.inx == 3) this.inx = 0;

};

function MainView*onDeleteBtnClick(comp, info, e)
{
	//row의 index 값을 넣으면 해당 그리드 컴포넌트의 row 객체를 삭제한다.
	this.simpleGrid.removeRow(0);
	
};
