var AUtil = 
{
};



AUtil.RgbToHsl = function(r, g, b)
{
	//r = parseInt(r)/255, g = parseInt(g)/255, b = parseInt(b)/255;
	
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r,g,b), min = Math.min(r,g,b),
		h, s, l = (max + min) / 2;
		
	if(max==min)
	{
		h = s = 0;
	}
	else
	{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max)
		{
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		
		h /= 6;
	}
	
	//return [h*360, s*100, l*100];
	return [h, s, l];
};

AUtil.OppositeColor = function(r, g, b)
{
	return [255-r, 255-g, 255-b];
};

	
AUtil.formatDate = function(dateStr)
{
	dateStr += '';
	var date = dateStr.replace(/:/g, '');
	return date.substring(0, 2)+':'+date.substring(2, 4)+':'+date.substring(4, 6);
};

AUtil.makeNumString = function(size, value)
{
	var ret = '';
	value = ''+value;

	//빈자리는 0 으로 채움
	var valueInx = size - value.length; 
	for(var i=0; i<valueInx; i++)
		ret += '0';

	//실제 숫자를 채움
	for(var j=0; i<size; i++, j++)
		ret += value.charAt(j);

	return ret;
};

AUtil.autoShrink = function(ele, info) 
{
	if(info)
	{		
		var $ele = $(ele);
		var len = $.trim($ele.text()).length;
		var unit = info.unit?info.unit:'px';
		len = (info.maxChar-len)/len;
		if(len<0) ele.style.setProperty('font-size', (info.fontSize+info.fontSize*len)+unit, 'important');
		else ele.style.setProperty('font-size', info.fontSize+unit, 'important');
	}
		
};
	
AUtil.makeUndoStack = function(targetDom)
{
	var undoStack = $('<div style="display:none;"></div>');
	targetDom.append(undoStack);
	return undoStack;
};

AUtil.makeRedoStack = function(targetDom)
{
	var redoStack = $('<div style="display:none;"></div>');
	targetDom.append(redoStack);
	return redoStack;
};


//curDom에서 tagName을 가진 바로 이전 돔객체 리턴
AUtil.findPrevByTagName = function(curDom, tagName)
{
	
	var resTag = null;
	var findLen = 0;
	var childTag = null;
	
	resTag = $(curDom).prev(tagName+':visible');
	findLen = resTag.length;
	if(findLen > 0)
	{
		childTag = resTag.find(tagName+':visible');
		findLen = childTag.length;
		if(findLen > 0) resTag = childTag.last();
	}
	else
	{
		resTag = $(curDom).parents(tagName+':visible');
		if(resTag.length > 0) resTag = resTag.first();
		else resTag = null;
	} 
	
	if(resTag) resTag = resTag[0];
	return resTag;
};


//curDom에서 tagName을 가진 바로 다음 돔객체 리턴
AUtil.findNextByTagName = function(curDom, tagName)
{	
	var resTag = null;
	var findLen = 0;
	var childTag = null;
	
	resTag = $(curDom).find(tagName+':visible');
	findLen = resTag.length;
	if(findLen > 0) return resTag.first()[0];
	else
	{
		resTag = $(curDom).next(tagName+':visible');
		if(resTag.length > 0) return resTag[0];
		else
		{
			var parentsTags = $(curDom).parents(tagName+':visible');
			if(parentsTags.length > 0)
			{
				var nextTag = null;
				for(var i = 0; i<parentsTags.length; i++)
				{
					nextTag = parentsTags.eq(i).next(tagName+':visible');
					if(nextTag.length > 0) return nextTag[0];
				}
				return null;
			}
			else return null;
		}  
	}
};

AUtil.extractFileName = function(path, split)
{
	if(!split) split = afc.DIV;
	var start = path.lastIndexOf(split);
 	var end = path.length;
 	return path.substring(start+1, end);
};

AUtil.extractFileNameExceptExt = function(path, split)
{
	if(!split) split = afc.DIV;

	var start = path.lastIndexOf(split);
	var end = path.lastIndexOf('.');
	if(end < 0) end = path.length;
 	return path.substring(start+1, end);
};

AUtil.extractLoc = function(path, split)
{
	if(!split) split = afc.DIV;
 	var end = path.lastIndexOf(split);
 	return path.substring(0, end+1);
};
	
AUtil.extractExtName = function(path)
{
 	var start = path.lastIndexOf(".");
 	var end = path.length;
	
	if(start<0) return '';
	
 	return path.substring(start+1, end);
};

AUtil.filePathExceptExt = function(fileName)
{
 	return fileName.substring(0, fileName.lastIndexOf("."));
};


AUtil.shuffle = function(arr) 
{
    var i, j, x;
    for(i=arr.length-1; i>0; i--) 
	{
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
};

AUtil.randInt = function(min, max) 
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
};


AUtil.readTextFile = function(filePathName, callback){
	$.ajax({
	  dataType: "json",
	  url: filePathName,
	  data: null,
	  async: true, 
	  success: function(data) {
		  callback(true, data);
	  },
	  error: function () {
	  	  callback(false);
	  }
	});
};

AUtil.isExistFile = function(fileUrl)
{
	var result = null;
	$.ajax({
		type: "html",
		url: fileUrl,
		async: false, 
		success: function(data) {
			if(data) result = true;
			else result = false;
		},
		error: function () {
			result = false;
		}
	});
	return result;
};


//----------------------------------------------------------------------------

var CallbackDone = {};

CallbackDone.count = 0;
CallbackDone.endCallback = null;

CallbackDone.begin = function()
{
	if(!CallbackDone.endCallback) return;
	
	CallbackDone.count++;
};

CallbackDone.end = function()
{
	if(!CallbackDone.endCallback) return;
	
	if(--CallbackDone.count==0) 
	{
		var callback = CallbackDone.endCallback;
		CallbackDone.endCallback = null;
		callback();
	}
};

CallbackDone.waitAll = function(endCallback)
{
	CallbackDone.count = 0;
	CallbackDone.endCallback = endCallback;
};

//----------------------------------------------------------------------------


(function($) {
    $.fn.textfill = function(maxFontPixels) 
	{
        var fontSize = maxFontPixels, ourText = $('span:visible:first', this),
        	maxHeight = $(this).height(), maxWidth = $(this).width(), textHeight, textWidth;
			
        do 
		{
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
		
        return this;
    }
})(jQuery);


//info : {maxChar:15, fontSize:24, unit:'px'}
(function($) {
    $.fn.autoShrink = function(info) 
	{
		if(info)
		{
			var $ele = $(this);
			var len = $.trim($ele.text()).length;
			var unit = info.unit?info.unit:'px';
			len = (info.maxChar-len)/len;
			if(len<0) $ele[0].style.setProperty('font-size', (info.fontSize+info.fontSize*len)+unit, 'important');
			else $ele[0].style.setProperty('font-size', info.fontSize+unit, 'important');
		}
		
        return this;
    }
})(jQuery);

/*
(function($) {
    $.fn.removeNoLeak = function() 
	{
		var $ele = $(this);
		//$ele.unbind();
		$ele.remove();
    }
})(jQuery);
*/


var tmpl_style = ['font-family', 'font-size', 'font-weight','font-style','color',
    'word-spacing','line-height','text-align','vertical-align',
    'opacity', 'white-space',
    'background',
	'background-color', 'background-image','background-repeat','background-position', 'background-size',
	
    'border', 'padding',
	
	'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content',
	'border-radius', 'word-break',
    ];

var tmpl_style_obj = {
	'border' : ['border-width', 'border-color', 'border-style'],
	'border-width' : ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
	'border-color' : ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
	'border-style' : ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
	'padding' : ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']
};

(function($) {
    $.fn.getDefinedStyle = function(isComputed) {
        var dom = this.get(0), retObj = {}, style, val;
		
		if(!dom) return retObj;
        
        if(isComputed)
        {
	        if(window.getComputedStyle)
	        {
	            style = window.getComputedStyle(dom, null);
	            
				_style_helper(tmpl_style);
				/*
	            for(var i=0; i<tmpl_style.length; i++)
	            {
	            	val = style.getPropertyValue(tmpl_style[i]);
	            	if(val) retObj[tmpl_style[i]] = val;
	            }*/
	        }
        	
        }
        else
        {
            style = dom.style;
	        
			_style_helper(tmpl_style);
			/*
            for(var i=0; i<tmpl_style.length; i++)
            {
            	val = style[tmpl_style[i]];
            	if(val) retObj[tmpl_style[i]] = val;
            }*/
        }
		
		function _style_helper(styleArr)
		{
            for(var i=0; i<styleArr.length; i++)
            {
				if(isComputed) val = style.getPropertyValue(styleArr[i]);
				else val = style[styleArr[i]];
            	if(val) retObj[styleArr[i]] = val;
				else if(tmpl_style_obj[styleArr[i]])
				{
					_style_helper(tmpl_style_obj[styleArr[i]]);
				}
            }
		}
        
        return retObj;
    };
    
})(jQuery);

(function($) 
{
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };
})(jQuery);


//---------------------------------------------------------------------------------------------------


function AHistoryInfo()
{
    this.infoHistory = new Array();
    this.curHisIndex = -1;
}

AHistoryInfo.prototype.pushInfo = function(info)
{
	this.curHisIndex++;
    this.infoHistory.length = this.curHisIndex;
    this.infoHistory.push(info);
};

AHistoryInfo.prototype.prevInfo = function()
{
	if(this.canGoPrev())
	{
		this.curHisIndex--;
		return this.infoHistory[this.curHisIndex];
	}
	
	else return null;
};

AHistoryInfo.prototype.nextInfo = function()
{
	if(this.canGoNext())
	{
		this.curHisIndex++;
		return this.infoHistory[this.curHisIndex];
	}
	
	else return null;
};

AHistoryInfo.prototype.canGoPrev = function()
{
	return (this.curHisIndex>0);
};

AHistoryInfo.prototype.canGoNext = function()
{
	return (this.curHisIndex<this.infoHistory.length-1);
};

AHistoryInfo.prototype.clearHistory = function()
{
	this.infoHistory.length = 0;
	this.curHisIndex = -1;
};

