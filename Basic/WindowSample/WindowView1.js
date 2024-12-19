

WindowView1 = class WindowView1 extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



//init 실행 후 호출되는 함수
WindowView1.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
	
	//open 시 셋팅한 컨테이너 데이터를 얻어온다.
	var data = this.getContainer().getData();
	
	if(data)
	{
		this.TextId.setText(data.id);
		this.TextPwd.setText(data.pw);
	}
	
};

WindowView1.prototype.onButtonOkClick = function(comp, info, event)
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

WindowView1.prototype.onButtonCancelClick = function(comp, info, event)
{
	//뷰의 컨테이너를 찾아서 닫는다.
	this.getContainer().close(1);
};

WindowView1.prototype.onButtonCloseClick = function(comp, info, event)
{
	this.getContainer().close(2);
};
