

bs.NodeGroup = function(brdChecker)
{
	Array.call(this);
	
	this.mBrdChecker = brdChecker;
	this.isAlive = false;
	
};

afc.extendsClass(bs.NodeGroup, Array);


bs.NodeGroup.prototype.isEmpty = function() 
{ 
	return (this.length==0);
};


bs.NodeGroup.prototype.getKind = function() 
{ 
	var node = this.getSafeNode();
	if(node) return node.chKind;
	else return -1;
};

bs.NodeGroup.prototype.getSafeNode = function() 
{
	var i, node;
	
	for(i=0; i<this.length; i++)
	{
		node = this[i];
		if(node.isShow) return node;
	}
	
	return null;
};


//자신과 근접한 노드그룹인지 체크
bs.NodeGroup.prototype.isAdjoiningGroup = function(nodeGroup) 
{
	var i, j, k, node, dnode, dX, dY,
		boardLine = this.mBrdChecker.mContent.mBoardLine; 
	
	for(i=0; i<this.length; i++)
	{
		node = this[i];
		
		for(j=0; j<4; ++j)
		{
			dX = node.nX + bs.RoundLoc[j][0];
			dY = node.nY + bs.RoundLoc[j][1];
			
			if(dX<0 || dY<0 || dX>boardLine-1 || dY>boardLine-1) continue;

			dnode = this.mBrdChecker.getNodeData(dX, dY);
			
			if(dnode && dnode.chKind!=node.chKind)
			{
				for(k=0; k<nodeGroup.length; k++)
				{
					if(dnode===nodeGroup[k]) return true;
				}
			}
		}
	}

	return false;

};

bs.NodeGroup.prototype.compareNodeGroup = function(nodeGroup) 
{
	return (this.getEmptyCount() - nodeGroup.getEmptyCount());
};

//공배 개수 리턴
bs.NodeGroup.prototype.getEmptyCount = function() 
{
	return this.getEmptyPts().length;
};

bs.NodeGroup.prototype.getEmptyPts = function() 
{
	var i, j, node, dnode, dX, dY, emptyObj = {}, isDead,
		boardLine = this.mBrdChecker.mContent.mBoardLine;
	
	for(i=0; i<this.length; i++)
	{
		node = this[i];
		
		//사석 또는 임의로 숨긴상태인 돌은 체크하지 않는다.
		if(!node.isShow) continue;
		
		for(j=0; j<4; ++j)
		{
			dX = node.nX + bs.RoundLoc[j][0];
			dY = node.nY + bs.RoundLoc[j][1];
			
			if(dX<0 || dY<0 || dX>boardLine-1 || dY>boardLine-1) continue;

			dnode = this.mBrdChecker.getNodeData(dX, dY);
			
			/*
			if(ignoreDead) isDead = this.mBrdChecker.mDomChecker.isDeadCheck(dX, dY);
			else isDead = false;
			
			if(!dnode || isDead) emptyObj[dX+','+dY] = new bs.BDK_PT(dX, dY);	//중복된 위치는 덮어 써짐
			*/
			
			if(!dnode) emptyObj[dX+','+dY] = new bs.BDK_PT(dX, dY);	//중복된 위치는 덮어 써짐
		}
	}
	
	var retArr = [];
	for(var p in emptyObj)
		retArr.push(emptyObj[p]);
	
	return retArr;
};

//중복된 좌표를 하나로 모은다.
bs.NodeGroup.prototype.distinctPts = function() 
{
	var i, node, emptyObj = {};
	
	for(i=0; i<this.length; i++)
	{
		node = this[i];
		emptyObj[node.nX+','+node.nY] = node;//중복된 위치는 덮어 써짐
	}
	
	var retArr = new bs.NodeGroup();
	for(var p in emptyObj)
		retArr.push(emptyObj[p]);
	
	return retArr;
};


bs.NodeGroup.prototype.appendNodeGroup = function(nodeGroup)
{
	for(var i=0; i<nodeGroup.length; i++)
		this.push(nodeGroup[i]);
};


bs.NodeGroup.prototype.clear = function()
{
	this.length = 0;
};

/*
bs.NodeGroup.prototype.clearWithUnlink = function()
{
	for(var i=0; i<this.length; i++)
		this[i].nodeGroup = undefined;
	
	this.clear();
};

bs.NodeGroup.prototype.pushWithLink = function(node)
{
	this.push(node);
	
	node.nodeGroup = this;
};
*/

bs.NodeGroup.prototype.linkWithNode = function()
{
	for(var i=0; i<this.length; i++)
		this[i].nodeGroup = this;
};

bs.NodeGroup.prototype.unlinkWithNode = function()
{
	for(var i=0; i<this.length; i++)
		this[i].nodeGroup = undefined;
};
