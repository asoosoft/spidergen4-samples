/**
 * @author asoocool
 */
//ASelectBox 컴포넌트에서 Item은 option태그를 사용

function ASelectBox()
{
	AComponent.call(this);
}
afc.extendsClass(ASelectBox, AComponent);

ASelectBox.CONTEXT = 
{
    tag: '<select data-base="ASelectBox" data-class="ASelectBox" data-flag="0001" class="ASelectBox-Style"><option value="value1">item1</option></select>',

    defStyle: 
    {
        width:'140px', height:'22px'
    },

    events: ['change']
};



ASelectBox.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
};

ASelectBox.prototype.insertItem = function(text, value, data, index)
{
	var opt = new Option(text, value);
	
	this.element.options.add(opt, index);
	opt.data = data;
};

ASelectBox.prototype.addItem = function(text, value, data)
{
	this.insertItem(text, value, data);
};

ASelectBox.prototype.removeItem = function(index)
{
	this.element.remove(index);	
};

ASelectBox.prototype.removeAll = function()
{
	$(this.element).children().remove();	
};

ASelectBox.prototype.setItemData = function(index, data)
{
	this.element.options[index].data = data;
};

ASelectBox.prototype.setItemValue = function(index, value)
{
	this.element.options[index].value = value;
};

ASelectBox.prototype.getItemData = function(index)
{
	return this.element.options[index].data;
};

ASelectBox.prototype.getItemValue = function(index)
{
	return this.element.options[index].value;
};

ASelectBox.prototype.getItem = function(index)
{
	return this.element.options[index];
};

ASelectBox.prototype.selectItem = function(index)
{
	this.element.selectedIndex = index;
};

ASelectBox.prototype.getSelectedIndex = function()
{
	return this.element.selectedIndex;
};

ASelectBox.prototype.getSelectedItem = function()
{
	return this.getItem(this.element.selectedIndex);
};

ASelectBox.prototype.getSelectedItemData = function()
{
	return this.getItemData(this.element.selectedIndex);
};

ASelectBox.prototype.getSelectedItemValue = function()
{
	return this.getItemValue(this.element.selectedIndex);
};

ASelectBox.prototype.indexOfValue = function(value)
{
	for(var i=0; i<this.element.options.length; i++)
	{
		if(this.element.options[i].value==value) return i;
	}
	
	return -1;
};

ASelectBox.prototype.indexOfData = function(data)
{
	for(var i=0; i<this.element.options.length; i++)
	{
		if(this.element.options[i].data==data) return i;
	}
	
	return -1;
};

ASelectBox.prototype.selectItemByData = function(data)
{
	this.selectItem(this.indexOfData(data));
};

ASelectBox.prototype.selectItemByValue = function(value)
{
	this.selectItem(this.indexOfValue(value));
};


ASelectBox.prototype.setTextAlign = function(align)
{
	this.setStyle('textAlign', align);
};

ASelectBox.prototype.getTextAlign = function()
{
	return this.getStyle('textAlign');
};

ASelectBox.prototype.setPadding = function(padding)
{
	this.setStyle('padding', parseInt(padding, 10)+'px');
};

ASelectBox.prototype.getPadding = function()
{
	return this.getStyle('padding');
};

ASelectBox.prototype.getItemSize = function()
{
	return this.element.options.length;
};

// 매핑가능한 개수를 리턴한다.
ASelectBox.prototype.getMappingCount = function()
{
	return ['value', 'text'];
};

ASelectBox.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	var item = this.getSelectedItem();
	dataArr[0][keyArr[0]] = item.value;
	dataArr[0][keyArr[1]] = item.text;
};

ASelectBox.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr || !dataArr) return;
	
	this.removeAll();
	
	for(var i=0; i<dataArr.length; i++)
		this.addItem(dataArr[i][keyArr[1]], dataArr[i][keyArr[0]]);
};
