/**
 * @author asoo
 */

function GameTree()
{
	this.treeObj = null;
	this.dataArr = null;
	this.caseInx = 0;
	
	this.caseArr = [];
}

GameTree.prototype.makeGameTree = function(dataArr)
{
    this.treeObj = { value: null, children: [], depth: 0 };
	this.dataArr = dataArr;
	
	for(var i=0; i<this.dataArr.length; i++)
	{
		this._makeChild(this.treeObj, this.dataArr, i);
	}
	
	this.caseInx = 0;
	this.caseArr.length = 0;
};

//nodeObj 의 children 배열에 dataArr 배열 중에 inx 의 원소를 추가한 후  dataArr 에서는 제거
//그 추가한 원소를 다시 nodeObj 로 하여 재귀 호출을 한다.
GameTree.prototype._makeChild = function(nodeObj, dataArr, inx)
{
	if(dataArr.length==0) return;
	
	var remArr = dataArr.splice(inx, 1);
	var obj = {};
	
	obj.value = remArr[0];
	obj.children = [];
	obj.parent = nodeObj;
	obj.depth = nodeObj.depth + 1;
	//obj.score = -9999;

	nodeObj.children.push(obj);

	//자기 자신(obj) 은 제외한 배열로 다시 재귀호출
	for(var i=0; i<dataArr.length; i++)
	{
		this._makeChild(obj, dataArr, i);
	}

	//자신을 제외하고 재귀호출이 끝났으면 다시 제거했던 위치에 추가
	dataArr.splice(inx, 0, remArr[0]);
};

//깊이 우선 탐색을 이용하여 각 케이스에 대해 하나씩 돌을 놓아 볼 수 있도록 해준다.
GameTree.prototype.layGameTreeNode = function(pushCallback, popCallback, caseDoneCallback)
{
	this._dfsHelp(this.treeObj, pushCallback, popCallback, caseDoneCallback);
};

GameTree.prototype.traversalTree = function(callback, parentChanged, depthChanged)
{
	this._bfsHelp(this.treeObj, new Array(), callback, parentChanged, depthChanged);
};

//깊이 우선 탐색
GameTree.prototype._dfsHelp = function(nodeObj, pushCallback, popCallback, caseDoneCallback)
{
	var isPush = false;
	
	if(nodeObj.value) 
	{
		//pushCallback 함수에서 성공적으로 착수가 됐으면 true 를 리턴한다. 
		isPush = pushCallback(nodeObj);
	}
	
	var arr = nodeObj.children;	//다음 착수 가능 정보들
	
	for(var i=0; i<arr.length; i++)
		this._dfsHelp(arr[i], pushCallback, popCallback, caseDoneCallback);
	
	if(arr.length==0 && caseDoneCallback) caseDoneCallback(this.caseInx++, nodeObj);
	
	if(isPush && popCallback) popCallback(nodeObj);
};

//넓이 우선 탐색
GameTree.prototype._bfsHelp = function(nodeObj, searchQ, callback, parentChanged, depthChanged)
{
	var arr = nodeObj.children, i, j, k;
	
	for(i=0; i<arr.length; i++)
		searchQ.push(arr[i]);
	
	if(nodeObj.value) callback(nodeObj);
	
	var qObj = searchQ.shift();
	
	if(qObj)
	{
		if(qObj.parent!=nodeObj.parent) 
		{
			if(parentChanged(qObj)==false) return;
		}
		
		//depth 가 바뀌었으면 
		if(qObj.depth!=nodeObj.depth) 
		{
			//false 가 리턴되면 탐색 중단.
			if(depthChanged(qObj)==false) return;
		}
		
		this._bfsHelp(qObj, searchQ, callback, parentChanged, depthChanged);
	}
};

//-----------------------------------------------------------------------------------------------------------------

GameTree.prototype.printGameTree = function()
{
	this._dfsHelp(this.treeObj, 
	function(nodeObj)
	{
		var tab = '';
		for(var i=1; i<nodeObj.depth; i++)
			tab += '------ ';
		console.log(tab + '(' + nodeObj.value.nX + ','+nodeObj.value.nY + ') : '+ nodeObj.score);
	}
	, null, null);
};

GameTree.prototype.eachCaseArray = function(callback)
{
	this._makeCallbackArr(this.treeObj, callback);
};

GameTree.prototype._makeCallbackArr = function(nodeObj, callback)
{
	//루트 노드는 생략
	if(nodeObj.value) this.caseArr.push(nodeObj);
	
	var arr = nodeObj.children;
	
	for(var i=0; i<arr.length; i++)
		this._makeCallbackArr(arr[i], callback);
	
	if(arr.length==0) 
	{
		//afc.log(this.caseArr);
		callback(this.caseArr, this.caseInx++);
	}
	
	if(nodeObj.value) this.caseArr.pop();
};


