/**
 * @author asoocool
 */

//--------------------------------------------------------------------
//	insertView 함수를 호출하여 ViewDirection 방향으로 뷰를 추가한다.
//	추가하려는 뷰의 높이가 100% 이면 남은 공간 전체를 차지한다.
//	auto 나 픽셀을 직접 지정한 경우는 원하는 높이가 된다.
//--------------------------------------------------------------------
function AFlexLayout()
{
    ALayout.call(this);
	
}
afc.extendsClass(AFlexLayout, ALayout);

AFlexLayout.CONTEXT = 
{
    tag: '<div data-base="AFlexLayout" data-class="AFlexLayout" class="AFlexLayout-Style"></div>',
    defStyle: 
    {
        width:'300px', height:'100px'
    },

    events: []
};

AFlexLayout.prototype.init = function(context, evtListener)
{
	ALayout.prototype.init.call(this, context, evtListener);
	
	if(window._afc) this.$ele.addClass('dev_AFlexLayout-Style'); //add ukmani100
	else this.$ele.removeClass('dev_AFlexLayout-Style'); 
	
	if(afc.strIEVer=='msie') 
	{
		var ieFlexKey = 
		{
			'flex-direction': '-ms-flex-direction',
			'flex-wrap': '-ms-flex-wrap',
			'justify-content': '-ms-flex-pack',
			'align-items': '-ms-flex-align',
			'align-content': '-ms-flex-line-pack',
			//'place-content' : '-ms-flex-line-pack'
		};
		
		var p, val;
		for(p in ieFlexKey)
		{
			val = this.getStyle(p);// element.style$ele.css('-ms-flex-wrap', 'nowrap');
			if(val)
			{
				this.setStyle(ieFlexKey[p], val.replace('flex-',''));
			}
		}
		
		// 20171123 IE10 이하 버전 예외처리 -김민수
		val = this.getStyle('place-content');
		if(val)
		{
			val = val.replace(/flex-/g, '');
			val = val.split(' ');
			if(val.length > 1)
			{
				this.setStyle(ieFlexKey['align-content'], val[0]);
				this.setStyle(ieFlexKey['justify-content'], val[1]);
			}
			else 
			{
				this.setStyle(ieFlexKey['align-content'], val[0]);
				this.setStyle(ieFlexKey['justify-content'], val[0]);
			}
		}
		
		val = this.getStyle('flex-flow');
		if(val)
		{
			val = val.split(' ');
			this.setStyle(ieFlexKey['flex-direction'], val[0]);
			this.setStyle(ieFlexKey['flex-wrap'], val[1]);
		}
	}
	
	this.initLayoutComp(evtListener);
};

//Data Property 값들 복사.
AFlexLayout.prototype.setDataTo = function(toComp)
{
	var ieFlexKey = 
		{
			'flex-direction': '-ms-flex-direction',
			'flex-wrap': '-ms-flex-wrap',
			'justify-content': '-ms-flex-pack',
			'align-items': '-ms-flex-align',
			'align-content': '-ms-flex-line-pack',
			//'place-content' : '-ms-flex-line-pack'
		};

	var p, val;
	for(p in ieFlexKey)
	{
		val = this.getStyle(p);// element.style$ele.css('-ms-flex-wrap', 'nowrap');
		if(afc.strIEVer=='msie') toComp.setStyle(ieFlexKey[p], val);
		else toComp.setStyle(p, val);
	}
}

AFlexLayout.prototype.initLayoutComp = function(evtListener)
{
	//자신 내부에 있는 컴포넌트들의 init 은 레이아웃이 담당한다.
	var container = this.getContainer(), 
		rootView = this.getRootView(), 
		parentView = this.getParent(), ctx, acomp, thisObj = this;
		
	this.$ele.children().each(function()
	{
		// 20171128 IE10 이하 버전 예외처리 -김민수
		if(afc.strIEVer=='msie') this.style['-ms-flex-positive'] = this.style['flex-grow'];

		ctx = $(this).children()[0];
		
		acomp = AComponent.realizeContext(ctx, container, rootView, parentView, evtListener);
		acomp.layoutItem = this;
		acomp.owner = thisObj;
	});
};

/*
AFlexLayout.prototype.setViewDirection = function(direction)
{
	//this.$ele.css('-webkit-flex-direction', direction);
	//this.$ele.css('-ms-flex-direction', direction);
	
	this.$ele.css('flex-direction', direction);
};

//----------------------------------------------------------
// add ukmani100
//----------------------------------------------------------

AFlexLayout.prototype.getViewDirection = function()
{
	//return this.$ele.css('-webkit-flex-direction');
	return this.$ele.css('flex-direction');
};
*/

//inx 값을 지정하면 그 위치 앞에 추가한다.
AFlexLayout.prototype.layComponent = function(acomp, inx, flexGrow)
{
	var $item = $('<div></div>');
	
	$item.append(acomp.$ele);
	
	//if(inx==undefined || inx==null) this.$ele.append($item);
	
	//gridlayout 파라미터가 넘어올 수도 있다.
	if(inx==null || isNaN(inx)) 
	{
		this.$ele.append($item);
	}
	else 
	{
		this.$ele.children().eq(inx).before($item);
	}
	
	if(flexGrow!=undefined)
	{
		$item.css('flex-grow', flexGrow);
		$item.css('-ms-flex-grow', flexGrow);
	}

	acomp.$ele.css(
	{
		'position': 'relative',
		'left': '0px', 'top':'0px',
		'right': '', 'bottom':'',
	});
	
	
	//for debug
	//$item.css('border', '1px solid red');
	//$item.css('background-color', 'blue');

	acomp.setParent(this.getParent());	
	
	acomp.layoutItem = $item[0];
	acomp.owner = this;
	
	return $item;

};

AFlexLayout.prototype.getCompIndex = function(comp)
{
	var comps = this.getAllLayoutComps();
	for(var index =0 ; index < comps.length; ++index)
		if(comps[index] == comp) return index;

	return -1;
};


AFlexLayout.prototype.getAllLayoutComps = function()
{
	var retArr = [], item;
	this.$ele.children().each(function()
	{
		item = $(this).children()[0];
		if(item && item.acomp) retArr.push(item.acomp);
	});
	
	return retArr;
};

AFlexLayout.prototype.getFlexVal = function(index,valType)
{
	var $div = this.getItem(index);
	
	var val = $div.css(valType);
	if(isNaN(parseInt(val)) || val== 0) return '';
	return val;
}

AFlexLayout.prototype.getFlexStringVal = function(index,valType)
{
	var $div = this.getItem(index);
	
	return $div.css(valType);
}

AFlexLayout.prototype.setFlexVal = function(index,valType, val)
{
	var $div = this.getItem(index);
	$div.css(valType,val);
}

AFlexLayout.prototype.indexOfItem = function(item)
{
	return this.$ele.children().index(item);
};

AFlexLayout.prototype.getItem = function(inx)
{
	return this.$ele.children().eq(inx);
};

AFlexLayout.prototype.eachChild = function(callback, isReverse)
{
	var $children;
	
	if(isReverse) $children = $(this.$ele.children().get().reverse());
	else $children = this.$ele.children();

	$children.each(function(inx)
	{
		var child = $(this).children().get(0);
		if(!child || !child.acomp) return;
		if(callback(child.acomp, inx)==false) return false;
	});
};

AFlexLayout.prototype.removeAllItems = function()
{
	this.eachChild(function(acomp, idx)
	{
		acomp.removeFromView();
		acomp.layoutItem.remove();
		acomp.layoutItem = null;
	});
	
// 	if(afc.andVer<4.4) this.refreshFlexLayout();
};

AFlexLayout.prototype.refreshFlexLayout = function()
{
	this.hide();
	var thisObj = this;
	setTimeout(function(){ thisObj.show(); }, 1);
};

AFlexLayout.prototype.setFlexGrow = function(index, flexGrow) 
{
	this.setFlexVal(index,'flex-grow',flexGrow); 
	this.setFlexVal(index,'-ms-flex-grow', flexGrow);
}

AFlexLayout.prototype.getFlexGrow = function(index) 
{
	var val = this.getFlexVal(index,'flex-grow');
	if( isNaN(val))
		return this.getFlexVal(index,'-ms-flex-grow');
		
	return val;
}

AFlexLayout.prototype.setFlexOrder = function(index, flexOrder) { this.setFlexVal(index,'order', flexOrder); }

AFlexLayout.prototype.getFlexOrder = function(index) { return this.getFlexVal(index,'order');	}

AFlexLayout.prototype.setFlexShrink = function(index, flexShrink) {this.setFlexVal(index,'flex-shrink', flexShrink);}

AFlexLayout.prototype.getFlexShrink = function(index) {	return this.getFlexVal(index,'flex-shrink');}

AFlexLayout.prototype.getFlexAlign = function(index) 
{
	var val = this.getFlexStringVal(index,'align-self'); 
	if(val == '') return 'auto';
	return val;
}

AFlexLayout.prototype.setFlexAlign = function(index, alignSelf) { this.setFlexVal(index, 'align-self', alignSelf); }

AFlexLayout.prototype.setFlexBasis = function(index, flexBasis) 
{ 
	var hasUnit = flexBasis.indexOf('%') >=0;
	if(!hasUnit) hasUnit = flexBasis.indexOf('rem') >=0;
	if(!hasUnit) hasUnit = flexBasis.indexOf('em') >=0;
	if(!hasUnit) hasUnit = flexBasis.indexOf('px') >= 0;
	
	var fixedVal = flexBasis;
	if(!hasUnit) fixedVal += 'px';
	
	this.setFlexVal(index,'flex-basis',fixedVal); 
}

AFlexLayout.prototype.getFlexBasis = function(index) 
{
	var val = this.getFlexVal(index, 'flex-basis'); 
	if(val == '') return 'auto';
	return val;
}




