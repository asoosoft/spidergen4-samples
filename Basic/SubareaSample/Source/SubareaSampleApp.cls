
/**
Constructor
Do not call Function in Constructor.
*/
class SubareaSampleApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function SubareaSampleApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	// 스파이더젠 영역의 TAG 에 relative 셋팅을 할 수 없다면 여기에 다음 코드 추가
	// ---->
	// this.mainContainer.$ele.css('position', 'relative');

};

function SubareaSampleApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
