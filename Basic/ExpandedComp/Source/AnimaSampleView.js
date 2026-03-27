

class AnimaSampleView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }

	onInitDone()
	{
		super.onInitDone();

		//manual site

		//https://github.com/minimit/minimit-anima

	}

	onShowBtnClick(comp, info, e)
	{
		//var $ele = $(this.aniTarget.element);

		//same with over line
		this.aniTarget.$ele.anima({x:0}, 400, 'easeOut');

	}

	onHideBtnClick(comp, info, e)
	{
		//var $ele = $(this.aniTarget.element);

		//same with over line
		this.aniTarget.$ele.anima({x:-400}, 400, 'easeIn');

	}

	onBackBtnClick(comp, info, e)
	{

		this.getContainer().navigator.goPrevPage();

	}
}


