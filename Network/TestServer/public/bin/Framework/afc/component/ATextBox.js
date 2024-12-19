/**
 * @author asoocool
 */


function ATextBox()
{
	AComponent.call(this);


}
afc.extendsClass(ATextBox, AComponent);

ATextBox.CONTEXT = 
{
    tag:'<pre data-base="ATextBox" data-class="ATextBox" class="ATextBox-Style">Be thankful for what you have.\r\nyou will end up having more.\r\nIf you concentrate on what you do not have,\r\nyou will never, ever have enough</pre>',
	
    defStyle: { width:'320px', height:'60px' },
	
    events: []
};

ATextBox.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//this.isPre = this.getAttr('data-pre');
	
};

ATextBox.prototype.setHtml = function(strHtml)
{
	this.$ele.html(strHtml);
};

ATextBox.prototype.getHtml = function()
{
	return this.$ele.html();
};

ATextBox.prototype.setText = function(text)
{
	if(this.element.dm) text = this.element.dm.mask(text);
	
	this.$ele.text(text);
	
	//if(this.isPre) this.$ele.html('<pre>'+text+'</pre>');
	//else this.$ele.text(text);
	
	//if(this.shrinkInfo) this.autoShrink(this.shrinkInfo);
	//var ele = this.element;
	//if(ele.shrinkInfo) AUtil.autoShrink(ele, ele.shrinkInfo);
};

ATextBox.prototype.getText = function()
{
	if(this.element.dm) return this.element.dm.unmask();
	
	return this.$ele.text();
};

ATextBox.prototype.setTextAlign = function(align)
{
	this.$ele.css('justify-content', align);
	
	//-webkit-justify-content: flex-start flex-end center
};

ATextBox.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length == 0) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
};

ATextBox.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(dataArr.length==0) return;
	
	//리얼컴포넌트로 등록되면 
	//리얼데이터 수신 시 매핑되지 않은 데이터도 들어온다.	
	var value = dataArr[0][keyArr[0]];
	if(value==undefined) return;
	
	this.setText(value);
};





