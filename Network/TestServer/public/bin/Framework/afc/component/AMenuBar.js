/**
 * @author asoocool
 */

function AMenuBar(rootMenu)
{
	ABar.call(this);
	
	
}
afc.extendsClass(AMenuBar, ABar);

AMenuBar.CONTEXT = 
{
	tag: '<div data-base="AMenuBar" data-class="AMenuBar" data-flag="0000" class="AMenuBar-Style"></div>',

    defStyle:
    {
        width:'100%', height:'40px'
    },

    events: ['select']
};


AMenuBar.prototype.init = function(context, evtListener)
{
	ABar.prototype.init.call(this, context, evtListener);

};

AMenuBar.prototype.initWithMenuInfo = function(menuInfo)
{
	this.init();
	
	for(var i=0; i<menuInfo.length; i++)
	{
		this.addMenuButton(menuInfo[i].text, menuInfo[i].sub);
	}
};

AMenuBar.prototype.addMenuButton = function(text, menuItem)
{
	var $btn = $('<button></button>');
	$btn.html(text);
	$btn.css(
	{
		'color': '#d9d9d9',
		'background-color': '#3A3A3A',
		'border': 'none',
		'padding': '0px 20px 0px 20px',
	});
	
	this.aevent._select($btn[0], menuItem);

	this.$ele.append($btn);
};
