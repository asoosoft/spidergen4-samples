

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
	
	

    }
}



MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

	/*
	this.BasicCalendar1.setCalendarIconRight();
	this.BasicCalendar1.setCalendarIconImage("Assets/images/calendar1.png");
	this.BasicCalendar2.setCalendarIconRight();

	var thisObj = this;
	setTimeout(function(){
		thisObj.BasicCalendar1.setCalendarIconLeft();
		thisObj.BasicCalendar2.setCalendarIconLeft();
	}, 10000);
	
	or
	*/

	this.BasicCalendar1.setCalendarPickerStyle({
		"border": "2px solid red",
		"background-color": "rgb(212,212, 212)"
	});
	//캘린더피커 선택시(캘린더 오픈)..
	this.BasicCalendar1.setCalendarPickerSelectedStyle({
		"border": "2px solid blue",
		"background-color": "rgba(255,255, 255, 0)"
	});
	//아이콘 스타일
	this.BasicCalendar1.setCalendarIconStyle({
		"left": "unset",
		"right": "0px",
		"background-image": "url(Assets/images/calendar1.png)"
	});
	//date 입력 스타일
	this.BasicCalendar1.setCalendarInputStyle({
		"left": "0px",
		"padding-left": "10px"		
	});
};

MainView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here
};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

