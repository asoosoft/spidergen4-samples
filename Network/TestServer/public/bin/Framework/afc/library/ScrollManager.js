/**
 * @author asoocool
 */

function ScrollManager()
{
	this.scrlTimer = null;
	
	this.startTime = null;
	this.oldTime = null;
	
	this.startPos = 0;
	this.oldPos = 0;
	this.posGap = 0;
	
	this.oldDis = 0;//distance
	this.totDis = 0;
	
	this.scrollState = 0;	//1: initScroll, 2: updateScroll, 3: scrollCheck
	this.isScrollStop = false;
	this.scrollEnable = true;
	//this.disableManager = null;
	this.disableManagers = null;
	
	this.moveStart = false;
	this.stopCallback = null;
	
	//this option is not used with animationFrame 
	//except moveDelay
	this.option = 
	{
		startDelay: 10,
		endDelay: 20,
		scrollAmount: 50,
		velocityRatio: 0.02,
		moveDelay: 40
	};
	
	this.endVelocity = 0;
	
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
	window.cancelAnimationFrame  = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
}


ScrollManager.prototype.setOption = function(option)
{
    for(var p in option)
    {
		if(!option.hasOwnProperty(p)) continue;
        this.option[p] = option[p];
    }
};

//스크롤 on/off 기능
ScrollManager.prototype.enableScroll = function(enable)
{
	this.scrollEnable = enable;
};

//자신이 스크롤될 때 움직이지 말아야할 스크롤 매니저 지정
/*
ScrollManager.prototype.setDisableManager = function(manager)
{
	this.disableManager = manager;
};
*/
ScrollManager.prototype.addDisableManager = function(manager)
{
	if(!this.disableManagers) this.disableManagers = [];
	
	for(var i=0; i<this.disableManagers.length; i++)
		if(this.disableManagers[i]===manager) return;
	
	this.disableManagers.push(manager);
};

ScrollManager.prototype.removeDisableManager = function(manager)
{
	for(var i=0; i<this.disableManagers.length; i++)
	{
		if(this.disableManagers[i]===manager)
		{
			manager.enableScroll(true);
			this.disableManagers.splice(i, 1);
			return;
		}
	}
};

ScrollManager.prototype.removeAllDisableManager = function()
{
	for(var i=0; i<this.disableManagers.length; i++)
		this.disableManagers[i].enableScroll(true);

	this.disableManagers = [];
};


//스크롤 애니메이션이 중지됐을 때 호출할 함수 지정
ScrollManager.prototype.setStopCallback = function(callback)
{
	this.stopCallback = callback;
};

ScrollManager.prototype.stopScrollTimer = function()
{
	//touchmove 인 경우는 계속해서 updateScroll 이 발생할 수 있으므로 
	//DisableManager 를 초기화 하지 않는다.
	if(this.scrollState==2) return;

	this.isScrollStop = true;

	if(this.scrlTimer)
	{
		if(window.cancelAnimationFrame) window.cancelAnimationFrame(this.scrlTimer);
		else clearTimeout(this.scrlTimer);

		this.scrlTimer = null;
	}

	if(this.stopCallback) 
	{
		this.stopCallback.call(this);
	}
	
	if(this.disableManagers) 
	{
		for(var i=0; i<this.disableManagers.length; i++)
			this.disableManagers[i].enableScroll(true);
	}
};

ScrollManager.prototype.initScroll = function(pos)
{
	this.scrollState = 1;
	
	//if(!this.scrollEnable) return;

	this.stopScrollTimer();
	
	this.oldTime = this.startTime = Date.now();
	
	this.posGap = 0;
	this.oldPos = this.startPos = pos;
	
	this.oldDis = 0;
	this.totDis = 0;
	
	this.isScrollStop = false;
	this.moveStart = false;

/*
	if(this.disableManagers) 
	{
		for(var i=0; i<this.disableManagers.length; i++)
			this.disableManagers[i].enableScroll(true);
	}
	*/
};

ScrollManager.prototype.updateScroll = function(pos, updateFunc)
{
	if(!this.scrollEnable) return;
	
	this.scrollState = 2;

	var dis = this.oldPos - pos;
	var newTime = Date.now();
	var elapse = newTime - this.oldTime;
	var velocity = dis/elapse;
	
	this.oldTime = newTime;
	this.oldPos = pos;
	
	this.totDis += dis;
	
	//일정한 속도 밑으로 떨어지면 시작 지점을 재설정한다.
	//if(Math.abs(velocity*10)<1)

	//방향이 바뀌면 시작 지점을 재설정한다.
	if(this.oldDis*dis<0 || Math.abs(velocity*10)<1)
	{
		this.startTime = newTime;
		this.startPos = pos;
		
		//if(!this.moveStart) this.posGap = 0;
	}
	
	this.oldDis = dis;	
	
	if(!this.moveStart)
	{
		this.posGap += dis;
		if(Math.abs(this.posGap)<this.option.moveDelay) return;
		
		this.moveStart = true;
		
		if(this.disableManagers) 
		{
			for(var i=0; i<this.disableManagers.length; i++)
				this.disableManagers[i].enableScroll(false);
		}
	}
	
	updateFunc.call(this, dis);
};

ScrollManager.prototype.scrollCheck = function(pos, scrollFunc)
{
	if(!this.scrollEnable || this.isScrollStop) return;

	this.scrollState = 3;
	
	//var dis = (this.startPos+this.posGap) - pos;
	var chkDis = this.startPos - pos;
	var dis = this.oldPos - pos;

	//최종 이동 거리를 이곳에 저장해 둔다.
	this.oldDis = dis;
	this.totDis += dis;

	//if(Math.abs(dis)<this.option.moveDelay) 
	if(!this.moveStart)
	{
		if(Math.abs(chkDis)<this.option.moveDelay) 
		{
			this.stopScrollTimer();
			//this.initScroll(0);
			return;
		}
	}

	//터치 다운부터 터치 업까지 걸린 시간
	var elapse = Date.now() - this.startTime, velocity;
	
	if(window.requestAnimationFrame)
	{
		velocity = chkDis/elapse;
		this.autoScroll2(velocity, scrollFunc);
	}
	else
	{
		velocity = (chkDis*Math.abs(chkDis))/(elapse*elapse);
		this.endVelocity = this.option.endDelay + Math.abs(velocity*10);
		this.autoScroll(this.option.startDelay, velocity*this.option.scrollAmount, scrollFunc);
	}
};

ScrollManager.prototype.autoScroll = function(velocity, move, scrollFunc)
{
	if(velocity>this.endVelocity) 
	{
		this.stopScrollTimer();
		return;
	}

    var thisObj = this;
    this.scrlTimer = setTimeout(function()
    {
    	if(thisObj.isScrollStop) return;
		
   		if(!scrollFunc.call(thisObj, move)) 
		{
			setTimeout(function()
			{
				thisObj.stopScrollTimer();
				//thisObj.initScroll(0);
			}, 50);
			
			return;
		}
		
  		thisObj.autoScroll(velocity + velocity*thisObj.option.velocityRatio, move - move/velocity, scrollFunc);
        
    }, velocity);
	
};

ScrollManager.prototype.autoScroll2 = function(acceleration, scrollFunc)
{
	var thisObj = this, elapsed, move;
	var oldTime = 0, velocity = acceleration*1500, resistance = -0.1;//, totalElapsed = 0;
	
	//scroll up, or scroll down
	if(acceleration<0) resistance = 0.1;
	
	function render(timestamp) 
	{
		if(thisObj.isScrollStop) return;
	
		if(oldTime==0) oldTime = timestamp;

		elapsed = timestamp - oldTime;
		oldTime = timestamp;
		
		//totalElapsed += elapsed;
		
		//console.log('totalElapsed : ' + totalElapsed);
		
		/*
		//after one second, resistance is down of its 10%
		if(totalElapsed>500) 
		{
			resistance = resistance*0.5;
			totalElapsed = 0;
		}
		*/
		
		acceleration += resistance;
		
		velocity += acceleration * elapsed;
		move = (velocity * elapsed)/1000;

		//저항값과 이동값의 부호는 반대이다. 
		//즉, move 값의 부호가 바뀌면 이동을 멈춰야 한다.
		if(resistance*move>0 || !scrollFunc.call(thisObj, move)) 
		{
			setTimeout(function()
			{
				thisObj.stopScrollTimer();
				//thisObj.initScroll(0);
			}, 50);
			
			return;
		}
		
	  	thisObj.scrlTimer = window.requestAnimationFrame(render);
	}

	this.scrlTimer = window.requestAnimationFrame(render);

};

