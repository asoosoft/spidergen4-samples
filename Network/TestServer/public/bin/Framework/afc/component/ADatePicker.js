/**
 * @author asoocool
 */

function ADatePicker()
{
	AComponent.call(this);
	
	this.date = null;
	this.type = 'date';
	//this.type = 'time';
	
	//중복 오픈 방지
	this.isPickerOpen = false;
	
	this.option =
	{
        allowOldDates: true,			//ios
        allowFutureDates: true,			//ios
        minDate: null,
        maxDate: null,
        doneButtonLabel: 'Done',		//ios
        doneButtonColor: '#0000FF',		//ios
        cancelButtonLabel: 'Cancel',	//ios
        cancelButtonColor: '#000000',	//ios
        x: '0',							//ios
        y: '0'							//ios
	};
}
afc.extendsClass(ADatePicker, AComponent);

ADatePicker.CONTEXT = 
{
    tag: '<input data-base="ADatePicker" data-class="ADatePicker" type="text" class="ADatePicker-Style"/>',

    defStyle: 
    {
        width:'130px', height:'25px'  
    },

    events: ['change']
};


ADatePicker.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	if(afc.isPC) this.$ele.attr('type', 'date');
};

ADatePicker.prototype.setOption = function(option)
{
	for(var p in option)
    { 
    	if(option[p]!=undefined)
    		this.option[p] = option[p];
    }
};

ADatePicker.prototype.openPicker = function()
{
	theApp.offLifeCycle = true;
	if(this.isPickerOpen) return;
	
	//resume될 때 refresh를 하지 않게 하기 위한 변수
	//theApp.noPause = true;
	
	if(afc.isAndroid) this.show_android();
	else if(afc.isIos) this.show_ios();
	
	this.isPickerOpen = true;
};

ADatePicker.prototype.show_android = function()
{
	var thisObj = this;
	
	if(!this.option.minDate) this.option.minDate = 0;
	if(!this.option.maxDate) this.option.maxDate = 0;
	
	var strDate = this.androidFormatDate(this.date);
	
	cordova.exec(
	function(retValue)
	{
		thisObj.isPickerOpen = false;
		
		if(retValue!='cancel') 
		{
			retValue = new Date(retValue);
			thisObj.setValue(retValue);
			thisObj.reportEvent('change', retValue);
		}

	}, null, 'DatePickPlugin', 'show', [this.type, strDate, this.option]);	
};

ADatePicker.prototype.show_ios = function()
{
	var thisObj = this;
	
	if(!this.option.minDate) this.option.minDate = '';
	if(!this.option.maxDate) this.option.maxDate = '';
	
	this.option.mode = this.type;
	this.option.date = this.iosFormatDate(this.date);
	
	cordova.exec(
	function(retValue)
	{
		thisObj.isPickerOpen = false;
		
		if(retValue!='cancel')
		{
			retValue = new Date(parseFloat(retValue) * 1000);
			
			thisObj.setValue(retValue);
			thisObj.reportEvent('change', retValue);
		}
		
	}, null, 'DatePickPlugin', 'show', [this.option]);
};

ADatePicker.prototype.androidFormatDate = function(date)
{
	if(!date || date=='') date = new Date();
	
	return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getHours() + "/" + date.getMinutes();
};

ADatePicker.prototype.iosFormatDate = function(date)
{
	function padDate(val) 
	{
		val = val+'';
    	if (val.length == 1) return ('0' + val);
    	else return val;
	}
	
	if(!date || date=='') date = new Date();
	
    return date.getFullYear() + "-" + padDate(date.getMonth()+1) 
            + "-" + padDate(date.getDate()) + "T" + padDate(date.getHours()) 
            + ":" + padDate(date.getMinutes()) + ":00Z";
};

ADatePicker.prototype.setType = function(type)
{
	this.type = type;
};

ADatePicker.prototype.getType = function()
{
	return this.type;
};

ADatePicker.prototype.setValue = function(date)
{
	if(!date || date=='')
	{
		this.date = null;
		this.$ele.val('');
		return;
	}
	else if(typeof date == 'string')
	{
		date = date.replace(/-/g, '');
		date = date.substring(0, 4)+'/'+date.substring(4, 6)+'/'+date.substring(6, 8);
		
		this.date = new Date(date);
	}
	else this.date = date;
	
	if(afc.isPC) this.$ele.val(this.date.format('yyyy-MM-dd'));
	else this.$ele.val(this.date.format('yyyy/MM/dd'));
};

ADatePicker.prototype.getValue = function()
{
	if(!this.date) return '';
	else return this.date.format('yyyyMMdd');
};
/*
ADatePicker.prototype.enable = function(isEnable)
{
	this.isEnable = isEnable;
	
	if(this.isEnable) this.$ele.removeAttr('disabled');
	else this.$ele.attr('disabled', 'disabled');

};*/

ADatePicker.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getValue();
};

ADatePicker.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var data = dataArr[0];
	
	if(data[keyArr[0]] == undefined) return;
	
	this.setValue(data[keyArr[0]]);
};




