


function ScrollArrow()
{
	this.scrlElement = null;
	this.checkAlready = false;
	this.scrlDir = 'vertical';//horizontal
	this.topClassName = 'scrollarrow-top';
	this.bottomClassName = 'scrollarrow-bottom';
	this.leftClassName = 'scrollarrow-left';
	this.rightClassName = 'scrollarrow-right';
}

ScrollArrow.DISAPPEAR_TIME = 2000;

ScrollArrow.prototype.setArrow = function(dir, arrow1, arrow2)
{
	this.scrlDir = dir;
	
	if(arrow1) this.arrow1 = arrow1;
	else 
	{
		if(this.scrlDir=='vertical') this.arrow1 = $('<span class="'+this.topClassName+'"></span>');
		else this.arrow1 = $('<span class="'+this.leftClassName+'"></span>');
		
		this.makeDefaultArrow(this.arrow1);
	}
	
	if(arrow2) this.arrow2 = arrow2;
	else 
	{
		if(this.scrlDir=='vertical') this.arrow2 = $('<span class="'+this.bottomClassName+'"></span>');
		else this.arrow2 = $('<span class="'+this.rightClassName+'"></span>');
		
		this.makeDefaultArrow(this.arrow2);
	}
	
	var cssObj = 
	{
		'position': 'absolute',
		'display': 'none',
	};
	
	this.arrow1.css(cssObj);
	this.arrow2.css(cssObj);
};

ScrollArrow.prototype.apply = function(scrlElement)
{
	this.scrlElement = scrlElement;
	
	var thisObj = this;
	
	AEvent.bindEvent(this.scrlElement, AEvent.ACTION_DOWN, function(e)
	{
		thisObj.checkAlready = false;
/*		
		if(thisObj.fadeTimer) 
		{
			clearTimeout(thisObj.fadeTimer);
			thisObj.fadeTimer = null;
		}
*/		
	});
	
	/*
	AEvent.bindEvent(this.scrlElement, AEvent.ACTION_UP, function(e)
	{
		thisObj.autoDisappear();
	});
	*/
	
	if(this.scrlDir=='vertical') this.scrollVertProc();
	else this.scrollHoriProc();
	
	//this.autoDisappear();
};


ScrollArrow.prototype.autoDisappear = function()
{
	var thisObj = this;
	
	if(this.fadeTimer) 
	{
		clearTimeout(this.fadeTimer);
	}
	
	this.fadeTimer = setTimeout(function()
	{
		thisObj.arrow1.fadeOut();
		thisObj.arrow2.fadeOut();
		thisObj.fadeTimer = null;
		
	}, ScrollArrow.DISAPPEAR_TIME);

};


ScrollArrow.prototype.makeDefaultArrow = function($arrow)
{
	/*
	$arrow.css(	
	{
		'width': '20px',
		'height': '20px',
		'opacity': '0.3'
	});
	*/
};

ScrollArrow.prototype.scrollVertProc = function()
{
	var $parent = $(this.scrlElement).parent();
	
	$parent.append(this.arrow1);
	$parent.append(this.arrow2);
	
	this.arrow1.css(
	{
		'right': '5px',	'top': '5px'
	});
	
	this.arrow2.css(
	{
		'right': '5px',	'bottom': '5px'
	});
	
	var thisObj = this;
	AEvent.bindEvent(this.scrlElement, 'scroll', function(e)
	{
		if(!thisObj.checkAlready)
		{
			thisObj.checkAlready = true;
			thisObj.visibleCheckVert();
		}
		
		//if((this.offsetHeight + this.scrollTop-1) == this.scrollHeight) thisObj.onScrollSecond();
		
		if(this.scrollHeight == this.clientHeight + this.scrollTop) thisObj.onScrollSecond();
		else if(this.scrollTop == 0) thisObj.onScrollFirst();
	});
	
	setTimeout(function()
	{
		thisObj.visibleCheckVert();
	}, 100);
};

ScrollArrow.prototype.scrollHoriProc = function()
{
	var $parent = $(this.scrlElement).parent();
	
	$parent.append(this.arrow1);
	$parent.append(this.arrow2);
	
	var top = ( $parent.height() - this.arrow1.height() ) / 2;
	this.arrow1.css(
	{
		'left': '0px',	'top': top+'px'
	});
	
	this.arrow2.css(
	{
		'right': '0px',	'top': top+'px'
	});
	
	var thisObj = this;
	AEvent.bindEvent(this.scrlElement, 'scroll', function(e)
	{
		if(!thisObj.checkAlready)
		{
			thisObj.checkAlready = true;
			thisObj.visibleCheckHori();
		}
		
		//if((this.offsetWidth + this.scrollLeft-1) == this.scrollWidth) thisObj.onScrollSecond();
		
		if(this.scrollWidth == this.clientWidth + this.scrollLeft) thisObj.onScrollSecond();
		else if(this.scrollLeft == 0) thisObj.onScrollFirst();
	});
	
	setTimeout(function()
	{
		thisObj.visibleCheckHori();
	}, 100);
};

ScrollArrow.prototype.onScrollFirst = function()
{
	this.arrow1.hide();
	this.arrow2.show();
};

ScrollArrow.prototype.onScrollSecond = function()
{
	this.arrow1.show();
	this.arrow2.hide();
};

//--------------
//	세로 영역
ScrollArrow.prototype.isMoreScrollTop = function()
{
	return (this.scrlElement.scrollTop > 0);
};

ScrollArrow.prototype.isMoreScrollBottom = function()
{
	//return (this.scrlElement.offsetHeight + this.scrlElement.scrollTop < this.scrlElement.scrollHeight);
	return (this.scrlElement.clientHeight + this.scrlElement.scrollTop < this.scrlElement.scrollHeight);
};

ScrollArrow.prototype.visibleCheckVert = function()
{
	if(this.isMoreScrollTop()) 
	{
		this.arrow1.show();
		this.autoDisappear();
	}
	else this.arrow1.hide();

	if(this.isMoreScrollBottom()) 
	{
		this.arrow2.show();
		this.autoDisappear();
	}
	else this.arrow2.hide();
};

//--------------
//	가로 영역
ScrollArrow.prototype.isMoreScrollLeft = function()
{
	return (this.scrlElement.scrollLeft > 0);
};

ScrollArrow.prototype.isMoreScrollRight = function()
{
	//return (this.scrlElement.offsetWidth + this.scrlElement.scrollLeft < this.scrlElement.scrollWidth);
	return (this.scrlElement.clientWidth + this.scrlElement.scrollLeft < this.scrlElement.scrollWidth);
};

ScrollArrow.prototype.visibleCheckHori = function()
{
	if(this.isMoreScrollLeft()) 
	{
		this.arrow1.show();
		this.autoDisappear();
	}
	else this.arrow1.hide();

	if(this.isMoreScrollRight()) 
	{
		this.arrow2.show();
		this.autoDisappear();
	}
	else this.arrow2.hide();
};




