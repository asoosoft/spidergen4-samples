

bs.NodeList = function()
{
	Array.call(this);
	
	//데이터 리스트가 마지막으로 보여주고 있는 포지션
	this.showPos = -1;
	
	this.parentNodeList = null;
	
};

afc.extendsClass(bs.NodeList, Array);


bs.NodeList.prototype.isEmpty = function() 
{ 
	return (this.length==0);
};

bs.NodeList.prototype.isShowPosBegin = function() 
{ 
	return (this.showPos==-1) 
};

bs.NodeList.prototype.isShowPosEnd = function() 
{ 
	return (this.showPos==this.length-1); 
};

//보여지는 Offset의 위치를 원소의 처음으로, 즉 아무돌도 안보이는 상태
bs.NodeList.prototype.setShowPosBegin = function() 
{ 
	this.showPos = -1; 
};

//보여지는 Offset의 위치를 원소의 끝으로 
bs.NodeList.prototype.setShowPosEnd = function() 
{ 
	this.showPos = this.length - 1;
};

bs.NodeList.prototype.getShowPos = function() 
{ 
	return this.showPos; 
};


bs.NodeList.prototype.getLastNode = function() 
{
	if(this.isEmpty()) return null;
	else return this[this.length-1]; 
};

bs.NodeList.prototype.getShowPosNode = function() 
{
	if(this.isShowPosBegin()) return null;
	else return this[this.showPos]; 
};

bs.NodeList.prototype.getShowNextNode = function() 
{
	if(this.isShowPosEnd()) return null;
	else return this[this.showPos+1];
};

bs.NodeList.prototype.getParentNodeList = function() 
{ 
	return this.parentNodeList; 
};

bs.NodeList.prototype.setParentNodeList = function(parentList) 
{ 
	this.parentNodeList = parentList; 
};

//원소를 모두 지우고 SetShowPosBegin 함수가 추가적으로 호출된다.
bs.NodeList.prototype.clearAll = function()
{
	this.length = 0;
	
	this.setShowPosBegin();
};

bs.NodeList.prototype.clear = function()
{
	this.length = 0;
	
	this.setShowPosBegin();
};
