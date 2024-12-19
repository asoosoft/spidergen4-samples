/**
 * @author asoocool
 */

function ABar()
{
	AView.call(this);
	
}
afc.extendsClass(ABar, AView);

ABar.CONTEXT = 
{
    tag: '<div data-base="ABar" data-class="ABar" data-flag="0000" class="ABar-Style"></div>',

    defStyle: 
    {
        width:'100%', height:'40px'
    },

    events: []
};



ABar.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	//ABar 는 기본적으로 full size 가 되게 한다.
	this.$ele.css({ left:'0px', top:'0px', width:'100%', height:'100%' });
};

ABar.prototype.addToolButton = function(text)
{
	var btn = new AButton();
	btn.init();
	btn.setText(text);

	btn.setStyleObj(
	{
		position: 'static',
		width: 'auto', height: 'auto',
		padding: '0 20px 0 20px'
	});
	
	//남아 있는 공간을 균등하게 사용하고자 할 경우 
	//'-webkit-flex': '1',
	//'-ms-flex': '1',
		
	this.addComponent(btn);
};

ABar.prototype.test = function()
{
	for(var i=0; i<4; i++)
	{
		var btn = new AButton();
		btn.init();
		btn.setText('btn'+i);
		
		btn.setStyleObj(
		{
			'position': 'static',
			'-webkit-flex': '1',
			'-ms-flex': '1',
			'padding': '0 20px 0 20px',
			'border': '1px solid blue'
		});

		this.addComponent(btn);
	}

};