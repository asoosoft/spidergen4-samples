/**
 * @author cheol
 */

function ARadioGroup()
{
	AView.call(this);
	
	this.radioBtns = null;
	this.selectedBtn = null;
}
afc.extendsClass(ARadioGroup, AView);

ARadioGroup.CONTEXT = 
{
    tag: '<div data-base="ARadioGroup" data-class="ARadioGroup" class="ARadioGroup-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'100px' 
    },

    events: ['change']
};

ARadioGroup.NAME = 'ARadioGroup';

ARadioGroup.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	//버튼 세팅
	this.radioBtns = this.findCompByClass(ARadioButton.NAME);
	
	//이벤트 세팅
	for(var i=0; i<this.radioBtns.length; i++)
	{
		this.radioBtns[i].addEventListener('click', this, 'btnClickEvent');
	}

	var selectId = this.$ele.attr('data-default-select');
	if(selectId) 
	{
		var selBtn = this.getRadioBtnById(selectId);
		if(selBtn)
		{
			this.setSelectBtn(selBtn);
		}
	}
};

ARadioGroup.prototype.btnClickEvent = function(radioBtn, info, e)
{
	if(this.selectedBtn===radioBtn) return;
	
	var oldBtn = this.selectedBtn;
	
	this.setSelectBtn(radioBtn);
	
	this.reportEvent('change', [oldBtn, radioBtn], e);
};

ARadioGroup.prototype.clearAll = function()
{
	//이벤트 세팅
	for(var i=0;i<this.radioBtns.length;i++)
	{
		this.radioBtns[i].setSelect(false);
	}
	
	this.selectedBtn = null;
};

ARadioGroup.prototype.selectBtnByValue = function(value)
{
	var radioBtn = this.getRadioBtnByValue(value);
	if(radioBtn) this.setSelectBtn(radioBtn);
};

ARadioGroup.prototype.setSelectBtn = function(radioBtn)
{
	if(this.selectedBtn===radioBtn) return;
	
	if(this.selectedBtn) this.selectedBtn.setSelect(false);
	
	this.selectedBtn = radioBtn;
	this.selectedBtn.setSelect(true);
};

ARadioGroup.prototype.getSelectBtn = function()
{
	return this.selectedBtn;	
};

ARadioGroup.prototype.getRadioBtns = function()
{
	return this.radioBtns;
};

ARadioGroup.prototype.getRadioBtnById = function(id)
{
	for(var i=0; i<this.radioBtns.length; i++)
	{
		if(this.radioBtns[i].getComponentId()==id) return this.radioBtns[i];
	}
	
	return null;
};

ARadioGroup.prototype.getRadioBtnByValue = function(value)
{
	for(var i=0; i<this.radioBtns.length; i++)
	{
		if(this.radioBtns[i].getValue()==value) return this.radioBtns[i];
	}
	
	return null;
};

ARadioGroup.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	var selBtn = this.getSelectBtn();
	if(selBtn) dataArr[0][keyArr[0]] = selBtn.getValue();
};

ARadioGroup.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	this.clearAll();
	
	this.selectBtnByValue(dataArr[0][keyArr[0]]);
};

// 매핑가능한 개수를 리턴한다.
ARadioGroup.prototype.getMappingCount = function()
{
	return 1;
};

