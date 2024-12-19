

AnimaSampleView = class AnimaSampleView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



AnimaSampleView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//manual site
	
	//https://github.com/minimit/minimit-anima

};

AnimaSampleView.prototype.onShowBtnClick = function(comp, info, e)
{
	//var $ele = $(this.aniTarget.element);

	//same with over line
	this.aniTarget.$ele.anima({x:0}, 400, 'easeOut');

};

AnimaSampleView.prototype.onHideBtnClick = function(comp, info, e)
{
	//var $ele = $(this.aniTarget.element);

	//same with over line
	this.aniTarget.$ele.anima({x:-400}, 400, 'easeIn');

};

AnimaSampleView.prototype.onBackBtnClick = function(comp, info, e)
{

	this.getContainer().navigator.goPrevPage();

};
