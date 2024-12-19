

MainView = class MainView extends AView
{
    constructor()
    {
        super()
		
	
		//TODO:edit here
    }

    init(context, evtListener)
    {
        super.init(context, evtListener)

        //TODO:edit here

    }

    onInitDone()
    {
        super.onInitDone()

        //TODO:edit here

    }

    onActiveDone(isFirst)
    {
        super.onActiveDone(isFirst)

        //TODO:edit here

    }

    onDeviceInfoClick(comp, info, e)
    {
        cordova.exec(result=>
        {
            this.infoBox.setText(JSON.stringify(result))
        } 
        , null, "Device" , "getDeviceInfo", [])
    }

    onPortraitClick(comp, info, e)
    {
        cordova.exec( null , null, "AppPlugin" , "setOrientation", [ 1 ])

    }

    onLandscapeClick(comp, info, e)
    {
        cordova.exec( null , null, "AppPlugin" , "setOrientation", [ 0 ])

    }

}



