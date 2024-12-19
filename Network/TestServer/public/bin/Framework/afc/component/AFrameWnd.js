
/**
Constructor
Do not call Function in Constructor.
*/
function AFrameWnd(containerId)
{
	AWindow.call(this, containerId);

	//TODO:edit here
	this.title = null;
	this.oldInfo = null;
	this.titleLbl = null;
	
	this.titleHeight = '24px';

}
afc.extendsClass(AFrameWnd, AWindow);

//AFrameWnd.TITLE_HEIGHT = '25';


//옵션을 변경한다던가 타이틀을 만드는 등의 태그 생성 작업
AFrameWnd.prototype.init = function(context)
{
	//not overwrite 이 true 이기때문에 
	//부모의 옵션보다 우선 하려면 init 위에 두어야 한다.
	this.setWindowOption(
	{
		isResizable: true,
		isDraggable: true,
		dragHandle: '._frame_title_'
		
	}, true);
	//----------------------------------------

	AWindow.prototype.init.call(this, context);

	this.$ele.addClass('frm_border');
// 	this.$ele.css({ border: '1px solid #656565' });
	
	this.makeTitle();
};

AFrameWnd.prototype.getTitleText = function()
{
	return this.titleLbl.getText();
};

AFrameWnd.prototype.setTitleText = function(str)
{
	this.titleLbl.setText(str);
};

AFrameWnd.prototype.setTitleHtml = function(str)
{
	this.titleLbl.setHtml(str);
};

AFrameWnd.prototype.showTitle = function()
{
	$(this.title).show();
	
	$(this.viewItem).css('height', 'calc(100% - ' + this.titleHeight + ')');
};

AFrameWnd.prototype.hideTitle = function()
{
	$(this.title).hide();
	
    $(this.viewItem).css('height', '100%');
};


AFrameWnd.prototype.makeTitle = function()
{
	var $title = $('<div class="_frame_title_"></div>');
	
    $title.css(
    {
        width: '100%',
        height: this.titleHeight	//AFrameWnd.TITLE_HEIGHT+'px'
    });

	this.$ele.append($title);
	
	this.title = $title[0];

	//--------------------------------------------------------------------------------------
	
	var tView = AView.createView(this.title, 'Framework/afc/layout/framewnd-title.html', this);
	
	var comps = tView.getChildren(), thisObj = this;
	
	//gridlayout
	comps = comps[0].getAllLayoutComps();
	
	//comps[0].setImage('Framework/afc/image/dock_win_icon.png');
	
	//image
	comps[0].$ele.css(
	{
		'background-position': (-16 * 3) + 'px center',
		'background-size': '64px 15px'
	});
	
	
	//label
	this.titleLbl = comps[1];
	this.titleLbl.$ele.css('overflow', 'hidden');
	
	this.setTitleText(this.className);
	
	//min button
	comps[2].addEventListener('click', this, 'onMinBtnClick');	
	
	//max button
	comps[3].addEventListener('click', this, 'onMaxBtnClick');	
	
	//close button
	comps[4].addEventListener('click', this, 'onCloseBtnClick');
	
};

//container 에서 호출함
AFrameWnd.prototype.makeViewItem = function()
{
	var $item = $('<div></div>');
	
    $item.css(
    {
        width: '100%',
        height: 'calc(100% - ' + this.titleHeight + ')',
    });
	
	return $item;
};

AFrameWnd.prototype.onMinBtnClick = function(acomp, info)
{
	var pos = this.getPos();
	this.oldInfo = { left:pos.left+'px', top:pos.top+'px', width:this.getWidth()+'px', height:this.getHeight()+'px' };
	
	this.enableResize(false);

	this.$ele.css( { width:'150px', height:'27px' });
};

AFrameWnd.prototype.onMaxBtnClick = function(acomp, info)
{
	if(this.oldInfo)
	{
		this.$ele.css(this.oldInfo);
		this.oldInfo = null;
		
		this.enableResize(true);
	}
	else
	{
		var pos = this.getPos();
		this.oldInfo = { left:pos.left+'px', top:pos.top+'px', width:this.getWidth()+'px', height:this.getHeight()+'px' };
		
		this.enableResize(false);
		
		this.$ele.css( { left:'0px', top:'0px', width:'100%', height:'100%' });
	}
	
};

/*
function AFrameWnd(acomp, info)
{
	this.close();
	
};
*/

//프레임 타이틀의 x 버튼이 눌리면 호출된는 함수. 
//뷰의 onCloseFrame 함수를 호출하고 false 를 리턴받으면 창을 닫지 않는다.
AFrameWnd.prototype.onCloseBtnClick = function(acomp, info)
{
	var thisObj = this;
	
	setTimeout(function()
	{
		var view = thisObj.getView();
		if(view && view.onCloseFrame && !view.onCloseFrame()) return;
	
		thisObj.close();
		
	}, 0);
};




