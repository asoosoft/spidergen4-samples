
/**
 * @author bks
 * @working date 2017-08-18
 */
 
function AToast()
{
	AFloat.call(this);
	
	this.isBgCheck = false;
	this.curSpan = null;
	
	this.divCss = {
		'position': 'absolute',
		'width': '100%',
		'bottom': '100px',
		'text-align': 'center',
		'z-index': '2147483647'
	};
	
	this.spanCss = [
		'background-color:rgba(32, 32, 32, 0.7)',
		'border-radius:6px',
		'color:#fff',
		'padding:20px',
		'margin:20px',
		'box-shadow:3px 3px 8px #222222',
		'font-size:20px',
		'white-space:pre-line',
		'display:inline-block',
		'word-break:break-all'
	];
	
}
afc.extendsClass(AToast, AFloat);

AToast.globalToast = null;
AToast.single = function(){
	AToast.globalToast = new AToast();
};

AToast.show = function(text, duration)
{
	var toast;
	if(AToast.globalToast) toast = AToast.globalToast;
	else toast = new AToast();
	toast.show(text, duration);
};

AToast.callback = function(text, callback, duration)
{
	var toast;
	if(AToast.globalToast) toast = AToast.globalToast;
	else toast = new AToast();
	toast.callback(text, callback, duration);
};


AToast.prototype.init = function()
{
	AFloat.prototype.init.call(this);
	
};

AToast.prototype.createSpan = function(text)
{
	this.curSpan =  document.createElement('span');
	this.curSpan.style.cssText = this.spanCss.join(";");
	this.curSpan.innerHTML = text;
};

AToast.prototype.show = function(text, duration)
{
	if(this.curSpan) this.curSpan.innerHTML = text;
	else
	{
		var thisObj = this;
		if(!duration) duration = 2;	
		
		this.init();	//Toast div 생성
		
		this.createSpan(text);	//Toast Span 생성

		AFloat.prototype.append.call(this, this.curSpan);	//Toast 객체 삽입
		//this.$frame.addClass('show-toast' + duration);

		//Toast DIV css 정보 추가
		AFloat.prototype.popupEx.call(this, this.divCss, null);
		
		setTimeout(function(){
			thisObj.curSpan = null;
			AFloat.prototype.close.call(thisObj);
		}, duration*1000);

	}
};


AToast.prototype.callback = function(text, callback, duration)
{
	callback({"proc": "start"});
	
	if(this.curSpan) this.curSpan.innerHTML = text;
	else
	{
		var thisObj = this;
		if(!duration) duration = 2;	
		
		this.init();	//Toast div 생성
		
		this.createSpan(text);	//Toast Span 생성

		AFloat.prototype.append.call(this, this.curSpan);	//Toast 객체 삽입
		//this.$frame.addClass('show-toast' + duration);

		//Toast DIV css 정보 추가
		AFloat.prototype.popupEx.call(this, this.divCss, null);
		
		setTimeout(function(){
			thisObj.curSpan = null;
			AFloat.prototype.close.call(thisObj);
			
			callback({"proc": "end"});
		}, duration*1000);

	}
};

