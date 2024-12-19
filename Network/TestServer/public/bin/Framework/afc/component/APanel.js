/**
 * @author asoocool
 */

//--------------------------------------------------------------------------
//	패널의 역할은 윈도우와 같이 팝업의 기능은 없고 네비게이터에 들어갈 수 없으며 
//	오로지 다른 컨테이너의 부분 컨테이너 역할만 할 수 있다. 
//	→ contaier split 시에 사용한다.
//	open 함수를 호출하여 부모의 불특정 영역에 새로운 컨테이너를 배치할 수 있다.
//--------------------------------------------------------------------------

function APanel(containerId)
{
	AContainer.call(this, containerId);
	
}
afc.extendsClass(APanel, AContainer);


APanel.prototype.init = function(context)
{
	AContainer.prototype.init.call(this, context);

	//afc.log('APanel init');
};


