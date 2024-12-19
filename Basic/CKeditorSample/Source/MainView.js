
//---------------------------------------------------------------------------------------
//	프로젝트의 Assets/ckeditor 폴더에 ck에디터 관련 외부 라이브러리 파일 추가 
//---------------------------------------------------------------------------------------

//다음은 필요한 자바스크립트 파일을 동적으로 로딩하는 코드이다.
//필요한 시점에 로드하면 된다. 여러번 호출해도 중복으로 로드되지 않는다. 
afc.import('Assets/ckeditor/ckeditor.js');


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
	AView.prototype.onInitDone.call(this);
	
	//여기서 ck에디터를 적용한다.
	//이후는 ck에이터 매뉴얼을 참고하여 적용한다.
	
 	CKEDITOR.replace(this.ckeditor.getElementId() , { height: 500 });
	
	//this.ckeditor 는 ATextArea 이다.
};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};
