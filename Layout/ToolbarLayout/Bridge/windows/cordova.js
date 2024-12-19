


var cordova = {};

cordova.exec = function(successCallback, failCallback, className, funcName, paramArray)
{
	if( className=='AppPlugin' )
	{
		if(funcName=='setPref')
		{
            localStorage.setItem(paramArray[0], paramArray[1]);
            _ret_helper(successCallback);
		}
		else if(funcName=='getPref')
		{
			var localData = localStorage.getItem(paramArray[0]);
            _ret_helper(successCallback, localData);
		}
	}
    else _ret_helper(successCallback);
    
    function _ret_helper(callback, retVal)
    {
        setTimeout(function()
        {
            if(callback) callback(retVal);
        }, 0);
    }
};


var m_document_addEventListener = document.addEventListener;
var m_document_removeEventListener = document.removeEventListener;
var m_window_addEventListener = window.addEventListener;
var m_window_removeEventListener = window.removeEventListener;

var documentEventHandlers = 
{
	'deviceready': window,
	'backbutton': window,
	'pause': window,
	'resume': window,
};

var windowEventHandlers = 
{

};

document.addEventListener = function(evt, handler, capture) 
{
	var val = documentEventHandlers[evt];
    if(val) 
    {
    	//pc 버전이므로 실제로 네이티브를 호출하지 않는다.
    	if(evt=='deviceready' && handler)
    	{
    		setTimeout(function() { handler(); }, 100);
    	}
    	else 
		{
			if(val._addEventListener)
				val._addEventListener(evt, handler);
		}
    }
	else m_document_addEventListener.call(document, evt, handler, capture);
};

window.addEventListener = function(evt, handler, capture) 
{
	var val = windowEventHandlers[evt];
    if(val) val._addEventListener(evt, handler);
	else m_window_addEventListener.call(window, evt, handler, capture);
};

document.removeEventListener = function(evt, handler, capture) 
{
    var val = documentEventHandlers[evt];
    if(val) val._removeEventListener(evt, handler);
    else m_document_removeEventListener.call(document, evt, handler, capture);
};

window.removeEventListener = function(evt, handler, capture) 
{
    var val = windowEventHandlers[evt];
    // If unsubscribing from an event that is handled by a plugin
    if(val) val._removeEventListener(evt, handler);
    else m_window_removeEventListener.call(window, evt, handler, capture);
};


