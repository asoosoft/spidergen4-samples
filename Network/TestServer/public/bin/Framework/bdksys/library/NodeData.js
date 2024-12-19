

bs.NodeData = function(nX, nY, chKind)
{
	this.chKind = (chKind==undefined) ? -1 : chKind;	// 0 검은돌, 1 흰돌, 3 마크
	
	this.nX = nX ? nX : 0;				// 바둑판위의 x 좌표
	this.nY = nY ? nY : 0;				// 바둑판위의 y 좌표
	this.isShow = true;					//	화면에 돌을 보여줄지(잡힌돌은 안 보여준다.)
	this.nOrder = 0;					// 수순번호, 마크인 경우 각 문자
	this.nOwnerStone = bs.MARKON_VALUE; //자신돌의 주인, 즉 주인돌이 보여질 때만 자신이 보여짐.(기본돌이나 마크에서 사용)
	this.mExplain = null;               // 돌에 대한 설명
	//this.deadStones = new Array();		// 잡은돌 NodeData 의 배열
	this.deadStones = new bs.NodeGroup();		// 잡은돌 NodeData 의 배열
	this.mChildContents = new Array();	//돌과 연관된 연관기보(BdkContent Array)
	this.isMyDeadShowing = true;        //자신이 잡은 돌이 보여지고 있는지 숨겨져 있는지, 초기값은 TRUE
	
	//asoo update
	this.extLists = new Array();		// NodeList 를 담고 있는 배열
	this.selExtList = null;				// 선택된 NodeList
};

bs.NodeData.prototype.copy = function(source)
{
	this.chKind = source.chKind;
	this.nX = source.nX;
	this.nY = source.nY;
	this.isShow = source.isShow;
	this.nOrder = source.nOrder;
	this.nOwnerStone = source.nOwnerStone; 
	this.mExplain = source.mExplain;
	
	/*
	var length = source.deadStones.length;
	for(var i=0; i<length; i++)
		this.deadStones.push(source.deadStones[i]);
		
	length = source.mChildContents.length;
	for(var i=0; i<length; i++)
		this.mChildContents.push(source.mChildContents[i]);
	*/
};

bs.NodeData.prototype.getChildContents = function() { return this.mChildContents; }
bs.NodeData.prototype.addChildContent = function(content) { this.mChildContents.push(content); }
bs.NodeData.prototype.hasChildContent = function() { return (this.mChildContents.length>0); }
bs.NodeData.prototype.removeChildContent = function(content)
{ 
    var index = this.mChildContents.indexOf(content);
    this.mChildContents.splice(index,1);
};

//자신을 부모로 삼고 있는 자식과의 연결을 끊는다. 
bs.NodeData.prototype.disconnectWithChild = function(content)
{
	var child;
	for(var i=0; i<this.mChildContents.length; i++)
	{
		child = this.mChildContents[i];
		child.setParentContent(null, false);
		child.setParentNodeData(null);
		
		content.removeChildContent(child);
	}

	this.mChildContents.length = 0;
};

//- asoo update
bs.NodeData.prototype.addExtList = function(parentList, isSelect)	//NodeList parentList, BOOL bSelect = FALSE
{
	var dataList = new bs.NodeList();
	
	this.extLists.push(dataList);

	dataList.setParentNodeList(parentList);

	if(isSelect) this.selExtList = dataList;

	return dataList;
};

bs.NodeData.prototype.removeExtList = function(nodeList)	//NodeList
{
	var pos = this.extLists.indexOf(nodeList);
	return this.removeExtListByPos(pos);
};

bs.NodeData.prototype.removeExtListByPos = function(pos)	//index
{
	if(pos>-1) return this.extLists.splice(pos, 1)[0];	//삭제된 원소만 리턴
	else return null;
};

bs.NodeData.prototype.removeAllExtLists = function() 
{ 
	this.extLists.length = 0;
};

bs.NodeData.prototype.isExtListEmpty = function() 
{ 
	return (this.extLists.length==0); 
};

bs.NodeData.prototype.getSelExtList = function() 
{ 
	return this.selExtList; 
};

bs.NodeData.prototype.selectExtList = function(selExtList) 
{
	this.selExtList = selExtList;
};

bs.NodeData.prototype.getExtLists = function() 
{ 
	return this.extLists; 
};

