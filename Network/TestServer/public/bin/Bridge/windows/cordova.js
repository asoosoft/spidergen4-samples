


var cordova = {};

cordova.exec = function(successCallback, failCallback, className, funcName, paramArray)
{
	if( className=='AppPlugin' )
	{
		if(funcName=='setPref')
		{
			localStorage.setItem(paramArray[0], paramArray[1]);
		}
		else if(funcName=='getPref')
		{
			var localData = localStorage.getItem(paramArray[0]);
			successCallback(localData);
		}
	}
	else window._exec(successCallback, failCallback, className, funcName, paramArray);
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
var windowEventHandlers = {};

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


//-----------------------------------------------------------------------------------------------
//	for sqlite

window.openSimulatorDB = function(fileName)
{
	var db = null;
	
	cordova.exec(function()
	{
		db = {};
		
		db.transaction = function(callback)
		{
			var tx = {};

			tx.executeSql = function(sql, valArr, successCallback, failCallback)
			{
				cordova.exec(function(rs) 
				{
					var payload = { _rs: rs	};
					
					payload.rows = 
					{
						item: function(i) { return payload._rs[i]; },
						length: rs.length
				  	};

					successCallback(tx, payload); 
				}, 
				function() { failCallback(tx, null); }, "SQLitePlugin", "executeSql", [sql, valArr]);
			};

			callback(tx);
		};

		db.close = function()
		{
			cordova.exec(null, null, "SQLitePlugin", "close", []);
		};
		
	}
	, function() { alert('sqlite open fail!'); } , "SQLitePlugin", "open", [fileName]);
			
	
	return db;
};
