/**
 * @author asoocool
 */

//--------------------------------------------------------------------
//	insertView 함수를 호출하여 ViewDirection 방향으로 뷰를 추가한다.
//	추가하려는 뷰의 높이가 100% 이면 남은 공간 전체를 차지한다.
//	auto 나 픽셀을 직접 지정한 경우는 원하는 높이가 된다.
//--------------------------------------------------------------------
function AFlexView()
{
    AComponent.call(this);
    
	this.views = [];
	this.viewDirection = 'column';//row, column
}
afc.extendsClass(AFlexView, AComponent);

AFlexView.CONTEXT = 
{
    tag: '<div data-base="AFlexView" data-class="AFlexView" class="AFlexView-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    events: []
};


AFlexView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
    
};

//column, row
AFlexView.prototype.setViewDirection = function(direction)
{
	this.viewDirection = direction;
	
	this.$ele.css('-webkit-flex-direction', direction);
	this.$ele.css('-ms-flex-direction', direction);
};

AFlexView.prototype.insertView = function(view, index)
{
	var $item = $('<div></div>');
	
	var isAppend = (index==undefined || index<0 || this.views.length==0);
	
	//if(isAppend) this.$ele.append($item);
	//else $(this.views[index].item).before($item);
	//item 을 컨테이너에 추가한 후 뷰를 로드해야 오류가 나지 않는다.
	
	if(typeof(view)=='string') view = AView.createView($item[0], view, this);
	else
	{
		$item.append(view.$ele);
	
		//기존의 뷰가 들어올 경우 새로운 값으로 변경
		view.owner = this;
		view.item = $item[0];
		$item[0].view = view;
		view.element.container = this.getContainer();
		view.element.rootView = view;
	}
	
	
	if(isAppend) 
	{
		this.$ele.append($item);
		this.views.push(view);
	}
	else 
	{
		$(this.views[index].item).before($item);
		this.views.splice(index, 0, view);
	}
	
	/*
	if(isAppend) this.$ele.append($item);
	else $(this.views[index].item).before($item);
	
	if(isAppend) this.views.push(view);
	else this.views.splice(index, 0, view);
	*/	
	
	
	var hwVal = null;
	if(this.viewDirection=='column') hwVal = view.getStyle('height');
	else hwVal = view.getStyle('width');
	
	//100% 는 남은 영역을 전부 차지하도록 flex-grow 값을 준다.
	if(hwVal=='100%')
	{
		$item.css('-webkit-flex', 1);
		$item.css('-ms-flex', 1);
		
		//아래 두 코드가 없으면 $item 은 배치되지만 view.$ele 는 보이지 않는 위치에 배치된다.
		//flex layout 이 적용되려면 item 을 relative 로 바꾸고  
		//item 밑으로 들어간 view 의 element 를 다시 absolute 바꿔줘야
		//view 의 elemeent 가 item 밑으로 배치되어 보여진다. 
		$item.css('position', 'relative');
		view.$ele.css('position', 'absolute');
		
		//for debug
		//$item.css('border', '1px solid red');
		//$item.css('background-color', 'blue');
	}
	
	//auto 나 픽셀을 직접 지정한 경우는 원하는 높이가 되도록 한다.
	else
	{
		//flexbox 안의 item 내부에 배치되도록 relative 로 변경해 준다.
		view.$ele.css('position', 'relative');
	}
	
};

AFlexView.prototype.updatePosition = function(pWidth, pHeight)
{
    AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	for(var i=0; i<this.views.length; i++)
		this.views[i].updatePosition();
};


AFlexView.prototype.callSubActiveEvent = function(funcName, isFirst)
{
	for(var i=0; i<this.views.length; i++)
	{
		this.views[i][funcName](isFirst);
	}
};


AFlexView.prototype.getView = function(index)
{
	return this.views[index];
};


AFlexView.prototype.removeAllViews = function()
{
	for(var i=0; i<this.views.length; i++)
	{
		this.views[i].removeFromView();
		$(is.views[i].item).remove();
	}
	
	this.views.length = 0;
};


AFlexView.prototype.removeFromView = function(onlyRelease)
{
	this.removeAllViews();
	
	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

