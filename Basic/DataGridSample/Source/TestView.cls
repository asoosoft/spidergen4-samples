
/**
Constructor
Do not call Function in Constructor.
*/
class TestView()
{
	super();

	//TODO:edit here

}
extends AView;


function TestView:onInitDone()
{

	//TODO:edit here

	var data = 
	[
	
	];
	
	for(var i=0; i<100; i++)
	{
		if(i%2==0)
		{
			data.push([ 
				//left grid data
				{text:i}, { type:'checkbox', /*checked:true 초기값 선택*/ }, { type:'button', text:'button'+i, class:'btn-style' },
				
				//right grid data
				{text:i+1, style:'color:rgb(255,0,0); font-weight:bold;' }, 
				{text:i+2, style:'color:blue;', class:'test-style'}, {text:i+3}, {text:i+4}, {text:i+5}, {text:i+6},
				{text:i+7}, {text:i+8}, {text:i+9}, {text:i+10}, {text:i+11}, {text:i+12},
				{text:i+13}, {text:i+14}, {text:i+15}, {text:i+16}, {text:i+17}, {text:i+18},
				{text:i+19}, {text:i+20}, {text:i+21}, {text:i+22}, {text:i+23}, {text:i+24}
			]);
		}
		else
		{
			data.push([ 
				//left grid data
				{text:i}, { type:'checkbox', class:'test-style' }, { type:'button', text:'button'+i, class:'btn-style' },
				
				//right grid data
				{text:i+1}, {text:i+2}, {text:i+3}, {text:i+4}, {text:i+5}, {text:i+6},
				{text:i+7}, {text:i+8}, {text:i+9}, {text:i+10}, {text:i+11}, {text:i+12},
				{text:i+13}, {text:i+14}, {text:i+15}, {text:i+16}, {text:i+17}, {text:i+18},
				{text:i+19}, {text:i+20}, {text:i+21}, {text:i+22}, {text:i+23}, {text:i+24}
			]);
		
		}
	}

	//-----------------------------------------------
	//	delegate functions 
	//	onDataGridBtnClick(comp, info, e)
	//	onDataGridChkClick(comp, info, e)
	
	// button, checkbox, radio 클릭 이벤트
	this.dataGrid1.setDelegator(this);
	
	//전체 데이터를 한번에 셋팅
	this.dataGrid1.setGridData(data);
	


	//-----------------------------------------------------------------
	//	기존 정보를 얻어, 셀에 있는 체크박스를 체크상태로 바꾸기 (2)
	this.dataGrid1.getCellData(0, 1).checked = true;
	this.dataGrid1.updateDataGrid();

	//기존 정보를 얻어, 셀에 있는 체크박스를 체크상태로 바꾸기 (1)
	var dataObj = this.dataGrid1.getCellData(1, 1);
	dataObj.checked = true;
	this.dataGrid1.setCellData(1, 1, dataObj);
		
	//새로운 데이터로 셋팅하기
	this.dataGrid1.setCellData(2, 1, { type:'checkbox', checked:true });
		

};

//---------------------------------------------------------
//	ADataGrid delegate function
function TestView*onDataGridBtnClick(comp, info, e)
{
	//info is button element
	console.log('Btn Clicked : ' + info.textContent);

};

function TestView*onDataGridChkClick(comp, info, e)
{
	//info is checkbox element
	console.log('Checked : ' + info.checked);
	
	
	//comp is this.dataGrid1
	var inxArr = comp.getCheckedIndices(1);	//2번째 컬럼에서 체크된 인덱스를 얻어온다.
	
	console.log(inxArr);

};

function TestView*onDataGrid1Select(comp, info, e)
{
	//info is select row
	console.log('Grid Select : ' + info);

};
