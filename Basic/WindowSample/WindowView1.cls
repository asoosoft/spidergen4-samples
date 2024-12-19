
/**
Constructor
Do not call Function in Constructor.
*/
class WindowView1()
{
	super();

	//TODO:edit here

}
extends AView;


//init 실행 후 호출되는 함수
function WindowView1*onInitDone()
{
	super.onInitDone();
	
	//open 시 셋팅한 컨테이너 데이터를 얻어온다.
	var data = this.getContainer().getData();
	
	if(data)
	{
		this.TextId.setText(data.id);
		this.TextPwd.setText(data.pw);
	}
	
};

function WindowView1*onButtonOkClick(comp, info, event)
{
	var uid = this.TextId.getText(),
		upw = this.TextPwd.getText();

	// 텍스트박스 체크
	if(!uid || !upw)
	{
		AToast.show('정보를 입력해주세요.');
		return;
	}
	
	// 뷰의 컨테이너를 찾아서 닫는다. 닫을때 텍스트박스의 데이터를 보낸다.
	var data = { 'uid' : uid, 'upw' : upw };
	
	this.getContainer().close(0, data);
};

function WindowView1*onButtonCancelClick(comp, info, event)
{
	//뷰의 컨테이너를 찾아서 닫는다.
	this.getContainer().close(1);
};

function WindowView1*onButtonCloseClick(comp, info, event)
{
	this.getContainer().close(2);
};
