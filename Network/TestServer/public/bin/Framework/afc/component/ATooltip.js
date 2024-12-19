  /**
 * @author ukmani
 */

function ATooltip()
{
	AFloat.call(this);
	
	this.isBgCheck = false;
	
	this.basicCss = {
		'width' : 'auto',
		'min-width' : '10px',
		'max-width' : '300px',
		'height' : 'auto',
		'background-color' : '#ffffcd',
		'border-radius' : '2px',
		'border' : '1px solid #494949',
		'color':'#242424',
		'padding' : '2px',
		'font-size' : '11px',
		'word-wrap': 'break-word',
		'overflow' : 'auto',
		'scroll' : 'no'
	};
	
}
afc.extendsClass(ATooltip, AFloat);


ATooltip.prototype.init = function()
{
	AFloat.prototype.init.call(this);
	
};

ATooltip.prototype.show = function(tooltipMsg, targetRect, isImage)
{
	var thisObj = this;
	
	//툴팁 div 생성
	this.init();
	
	//툴팁 메시지 삽입
	if(isImage) 
	{
		this.basicCss = {
			'width' : '120px',
			'height' : '120px',
			'background-image' : tooltipMsg,
			'background-size' : 'contain',
			'background-position' : 'center center',
			'background-repeat' : 'no-repeat'
		};		
	}
	else this.append(tooltipMsg);
		
	var $doc = $(document), docW = $doc.width(), docH = $doc.height(),
		$thisFrame = this.$frame;
	
	//툴팁 css 정보 추가
	this.basicCss['left'] = [targetRect.left + (targetRect.width / 2), 'px'].join('');
	this.basicCss['top'] = [targetRect.top + targetRect.height + 1, 'px'].join('');
	
	this.popupEx(this.basicCss, null);
	
	setTimeout(function(){
	
		var recLeft = targetRect.left + (targetRect.width/2),
			recTop = targetRect.top + targetRect.height,
			frameW = $thisFrame.width(),
			frameH = $thisFrame.height();
			
		if( docW < (recLeft+frameW+2)){
			$thisFrame.css('left', recLeft - frameW);
		}else{
			$thisFrame.css('left', recLeft);
		}
		
		if(docH < (recTop + frameH + 2)){
			$thisFrame.css('top', targetRect.top - frameH);
		}else{
			$thisFrame.css('top', recTop);
		}
		
	}, 10);
	
};

ATooltip.prototype.hide = function()
{	
	this.close();	
	
};










