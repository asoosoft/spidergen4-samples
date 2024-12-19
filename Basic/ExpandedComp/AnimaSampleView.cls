
/**
Constructor
Do not call Function in Constructor.
*/
class AnimaSampleView()
{
	super();

	//TODO:edit here

}
extends AView;


function AnimaSampleView*onInitDone()
{
	super.onInitDone();

	//manual site
	
	//https://github.com/minimit/minimit-anima

};

function AnimaSampleView*onShowBtnClick(comp, info, e)
{
	//var $ele = $(this.aniTarget.element);

	//same with over line
	this.aniTarget.$ele.anima({x:0}, 400, 'easeOut');

};

function AnimaSampleView*onHideBtnClick(comp, info, e)
{
	//var $ele = $(this.aniTarget.element);

	//same with over line
	this.aniTarget.$ele.anima({x:-400}, 400, 'easeIn');

};

function AnimaSampleView*onBackBtnClick(comp, info, e)
{

	this.getContainer().navigator.goPrevPage();

};
