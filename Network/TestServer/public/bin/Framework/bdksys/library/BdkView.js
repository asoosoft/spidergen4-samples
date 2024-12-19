/**
 * @author asoocool
 */
 
function BdkView()
{
	AView.call(this);
	
	this.bdkCanvas = null;
}
afc.extendsClass(BdkView, AView);


BdkView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
};

BdkView.prototype.createBdkCanvas = function(className)
{
	if(className) this.bdkCanvas = new window[className]();
	else this.bdkCanvas = new BdkCanvas();
	
	this.bdkCanvas.init();
	this.bdkCanvas.setSize('100%', '100%');
	
	this.addComponent(this.bdkCanvas);
};

