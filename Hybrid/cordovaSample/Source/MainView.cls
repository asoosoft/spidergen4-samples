
/**
Constructor
Do not call Function in Constructor.
*/
class MainView()
{
	super();

	//TODO:edit here

}
extends AView;


function MainView*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function MainView*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function MainView*onDeviceInfoClick(comp, info, e)
{
	cordova.exec(result=>
	{
		this.infoBox.setText(JSON.stringify(result));
	} 
	, null, "Device" , "getDeviceInfo", []);
};

function MainView*onPortraitClick(comp, info, e)
{
	cordova.exec( null , null, "AppPlugin" , "setOrientation", [ 1 ]);  

};

function MainView*onLandscapeClick(comp, info, e)
{

	cordova.exec( null , null, "AppPlugin" , "setOrientation", [ 0 ]);  

};
