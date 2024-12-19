

bs.BoardChecker = function(content)
{
	this.mNodes = null;			//Array:놓여진 돌의 NodeData 저장
	this.mCheck = null;			//Array:돌 따내기 체크가 이미 되었는지를 구별하기 위해
	this.mTrnTemps = null;		//Array
	
	this.mContent = content;	//BdkContent
	this.mDomChecker = null;
	
	this.isUnderSiege = true;
	
	//연속적인 수상전을 위해 테스트로 놓아본 돌들을 차후에 복원하기 위해 저장하고 있는 배열
	this.testNodes = [];
};


//체크를 위한 2차원 배열 생성
bs.BoardChecker.prototype.createBoardData = function()
{
	this.mNodes = bs.allocArray2(this.mContent.mBoardLine);
	this.mCheck = bs.allocArray2(this.mContent.mBoardLine);
	this.mTrnTemps = bs.allocArray2(this.mContent.mBoardLine);
		
	this.resetChecker();
};

//생성한 배열 및 기타 해제
bs.BoardChecker.prototype.destroyBoardData = function()
{
	bs.freeArray2(this.mNodes, this.mContent.mBoardLine);
	bs.freeArray2(this.mCheck, this.mContent.mBoardLine);
	bs.freeArray2(this.mTrnTemps, this.mContent.mBoardLine);
	
	this.mNodes = null;
	this.mCheck = null;
	this.mTrnTemps = null;
};

bs.BoardChecker.prototype.setDomainChecker = function(domChecker) { this.mDomChecker = domChecker; };
bs.BoardChecker.prototype.getNodeData = function(nX, nY) { return this.mNodes[nX][nY]; };

		
//기본값으로 초기화
bs.BoardChecker.prototype.resetChecker = function()
{
	bs.setArray2(this.mNodes, this.mContent.mBoardLine, null);
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);
};

//
/**
 *	배열의 특정 위치에 값 셋팅
 * @params  {NodeData} node
 */
bs.BoardChecker.prototype.setValue = function(nX, nY, node) 
{
	//정보 제거
	if(!node) 
	{
		node = this.mNodes[nX][nY];
		
		//이미 숨겨진 돌일 경우는 처리하지 않는다.
		if(node)
		{
			if(this.mDomChecker.isDeadCheck(nX, nY)) this.mDomChecker.setDeadCheck(nX, nY, node, false);
			//else this.mDomChecker.setDomainCount(nX, nY, node, false);
			
			this.mDomChecker.setDomainCount(nX, nY, node, false);
			this.mNodes[nX][nY] = null;
		}
	}

	//돌 추가
	else 
	{
		this.mNodes[nX][nY] = node;
		this.mDomChecker.setDomainCount(nX, nY, node, true);
	}	
	
};

//isSingleEmpty : 놓으면서 단수가 되는 자리인지
//isSingleEmpty 가 true 이고 리턴값이 false 일 경우만 값을 리턴한다. 즉, 하나 남아 있는 공배의 위치를 셋팅해 준다.
bs.BoardChecker.prototype.isAbleToLay = function(nX, nY, nKind, isSingleEmpty, emptyPt)
{
	var data, nodeGroup, bRet = false, thisObj = this;
	
    data = new bs.NodeData();
    data.nX = nX;
    data.nY = nY;
    data.chKind = nKind;

	//체크하고 싶은 자리에 원하는 돌을 실제로 놓아 본다.
	this.mNodes[nX][nY] = data;

	//돌 그룹을 구하기 위한 임시 변수
	nodeGroup = new bs.NodeGroup(this);
	
	//놓여진 자리부터 자신을 포함하여 같은 종류의 돌들을 모두 모은다.
	this.getLinkedStones(nX, nY, nodeGroup, true);
	
	//같은 종류의 돌들의 공배를 배열로 얻어온다.
	var pts = nodeGroup.getEmptyPts();
	
	//단수가 되어서 바로 먹히는 자리 체크
	if(isSingleEmpty)
	{
		//공배가 없고  
		if(pts.length==0) 
		{
			var group = new bs.NodeGroup(this);
			
			//놓으면서 돌을 따낼 수 있는 자리인지 체크  
			bRet = this.checkDeadStone(nX, nY, nKind, group);
			
			//따낼 수 있는 자리이지만 
			if(bRet)
			{
				//따낸 돌이 1개이면 바로 단수가되어 버리는 자리(환격)여서 놓을 수 없다.
				//bRet = (group.length>1);
				
				//따낸 돌이 여러개여서 환격이 아니거나 따낸 돌이 1개이지만 놓은 돌도 1개 이면 패이므로 놓을 수 있다.
				bRet = (group.length>1 || nodeGroup.length==1);
			}
		}
		
		//mctr 에서 무한루프를 도는 버그가 있어 임시로 주석
		/*
		//공배가 1이면 놓은 후 바로 먹히는 자리이지만 놓으면서 돌을 따낼수 있는 자리인지 체크 
		else if(pts.length==1) 
		{
			var tmpGroup = new bs.NodeGroup(this);
			bRet = this.checkDeadStone(nX, nY, nKind, tmpGroup);
			
			//패인 경우
			if(bRet && tmpGroup.length==1) bRet = false;
		}
		*/
		
		//착수 가능 
		else bRet = true;
		
		if(emptyPt)
		{
			if(!bRet && pts.length>0) emptyPt.setBdPt(pts[0]);
			else emptyPt.invalidPt();
		}
	}
	
	//착수 금지 체크, 단순히 바둑 룰상 돌을 놓을 수 있는가 없는가만 체크한다.
	else
	{
		//공배가 없으면 놓을 수 없는 자리이지만 놓으면서 돌을 따낼수 있는 자리인지 체크 
		if(pts.length==0) bRet = this.checkDeadStone(nX, nY, nKind);

		//착수 가능 
		else bRet = true;
	
	}
	
	//체크를 위해 셋팅했던 값을 복원한다.
	this.mNodes[nX][nY] = null;
	
	return bRet;
};		

//nX, nY 를 중심으로 잡힌돌이 있는지 체크해서 존재할 경우 retGroup 에 추가해 준다.
//하나라도 돌을 잡았으면 true 를 리턴한다. nX, nY 에는 이미 돌이 놓여져 있는 상태임
bs.BoardChecker.prototype.checkDeadStone = function(nX, nY, nKind, retGroup)
{
	var thisObj = this, bRet = false, tmpGroup = new bs.NodeGroup(this);

	if(retGroup==undefined) retGroup = new bs.NodeGroup();
	else retGroup.clear();
	
	//체크 변수 초기화
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);

	//놓여진 돌을 중심으로 각 방향으로 죽은 돌을 체크하여 추가
	if(nX>0) _link_dead_stones(nX-1, nY);
	if(nX<this.mContent.mBoardLine-1) _link_dead_stones(nX+1, nY);
	if(nY>0) _link_dead_stones(nX, nY-1);
	if(nY<this.mContent.mBoardLine-1) _link_dead_stones(nX, nY+1);
	
	return bRet;

	function _link_dead_stones(_x, _y)
	{
		var node = thisObj.getNodeData(_x, _y);
		
		//빈 자리이거나 놓여진 돌과 같은 종류의 돌은 제외
		if(!node || node.chKind==nKind) return;

		tmpGroup.clear();
		
		thisObj._searchSameNode(_x, _y, node.chKind, tmpGroup, true);	
		
		if(tmpGroup.length>0 && tmpGroup.getEmptyCount()==0) 
		{
			retGroup.appendNodeGroup(tmpGroup);
			bRet = true;
		}
	}
};

bs.BoardChecker.prototype.isValid = function(nX, nY)
{ 
	return (this.mNodes[nX][nY]==null); 
};


//연결되어 있는 같은 종류의 돌들의 좌표를 얻어온다.
//isStrict 가 true 이면 실제로 연결된 돌들만 얻어온다.
bs.BoardChecker.prototype.getLinkedStones = function(nX, nY, nodeGroup, isStrict)
{
	var node = this.mNodes[nX][nY];
	if(!node) return;
	
	//체크 변수 초기화
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);

	this._searchSameNode(nX, nY, node.chKind, nodeGroup, isStrict);
};

//getLinkedStones 에서 호출, 내부적으로만 사용되며 재귀호출된다.
bs.BoardChecker.prototype._searchSameNode = function(nX, nY, chKind, nodeGroup, isStrict)
{
	var node = this.mNodes[nX][nY];
	
	if(isStrict)
	{
		if(this.mCheck[nX][nY] || !node || node.chKind!=chKind) return;
	}
	else
	{
		if(this.mCheck[nX][nY]) return;

		//비어 있는 자리이면 
		if(!node)
		{
			var nWhich = this.mDomChecker.whichDomain(nX, nY);
			
			//asoocool test
			if(nWhich!=chKind && this.getRSC(nX, nY, chKind, true)<2) return;
			//if(nWhich!=chKind && this.getRSC(nX, nY, chKind, false)<2) return;
		}
		
		//다른 종류의 돌이면 검색 중단.
		else if(node.chKind!=chKind) return;
	}

	this.mCheck[nX][nY] = 1;
	
	if(node) nodeGroup.push(node);

	if(nX>0) this._searchSameNode(nX-1, nY, chKind, nodeGroup, isStrict);
	if(nX<this.mContent.mBoardLine-1) this._searchSameNode(nX+1, nY, chKind, nodeGroup, isStrict);
	if(nY>0) this._searchSameNode(nX, nY-1, chKind, nodeGroup, isStrict);
	if(nY<this.mContent.mBoardLine-1) this._searchSameNode(nX, nY+1, chKind, nodeGroup, isStrict);
};


bs.BoardChecker.prototype.getLinkedEmpty = function(nX, nY, ptArr)
{
	//체크 변수 초기화
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);

	this._searchEmpty(nX, nY, ptArr);
};

bs.BoardChecker.prototype._searchEmpty = function(nX, nY, ptArr)
{
	var node = this.mNodes[nX][nY];

	if(this.mCheck[nX][nY] || node) return;

	this.mCheck[nX][nY] = 1;
	
	ptArr.push(new bs.BDK_PT(nX, nY));

	if(nX>0) this._searchEmpty(nX-1, nY, ptArr);
	if(nX<this.mContent.mBoardLine-1) this._searchEmpty(nX+1, nY, ptArr);
	if(nY>0) this._searchEmpty(nX, nY-1, ptArr);
	if(nY<this.mContent.mBoardLine-1) this._searchEmpty(nX, nY+1, ptArr);
};


bs.BoardChecker.prototype.turnLeft = function()
{
	var nBoardLine = this.mContent.mBoardLine - 1;

	for(var nY=0; nY<this.mContent.mBoardLine; ++nY)
	{
		for(var nX=0; nX<this.mContent.mBoardLine; ++nX)
			this.mTrnTemps[nY][nBoardLine - nX] = this.mNodes[nX][nY];
	}

	bs.cpyArray2(this.mNodes, this.mTrnTemps, this.mContent.mBoardLine);
};

bs.BoardChecker.prototype.turnRight = function()
{
	var nBoardLine = this.mContent.mBoardLine - 1;
	
	for(var nY=0; nY<this.mContent.mBoardLine; ++nY)
	{
		for(var nX=0; nX<this.mContent.mBoardLine; ++nX)
			this.mTrnTemps[nBoardLine - nY][nX] = this.mNodes[nX][nY];
	}

	bs.cpyArray2(this.mNodes, this.mTrnTemps, this.mContent.mBoardLine);
};


//nX, nY 자리의 nodeData 가 포위되어져 있는지
bs.BoardChecker.prototype.isUnderSiegeStone = function(nX, nY)
{
	var node = this.mNodes[nX][nY];
	
	if(!node) return false;
	
	//체크 변수 초기화
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);
	this.isUnderSiege = true;

	this._searchUnderSiege(nX, nY, node.chKind, 0);

	return this.isUnderSiege;
};

//node 로 부터 시작해서 단계적으로 하나씩 체크해 나가며 다른 그룹과 만나는지 체크한다.
//만나는 다른 그룹들을 리턴한다.
/*
bs.BoardChecker.prototype.isContactAnotherGroup = function(node)
{
	//체크 변수 초기화
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);
	this.isUnderSiege = true;

	this._searchGroup(node.nX, node.nY, node, 0);
	
	return !this.isUnderSiege;
};
*/

bs.BoardChecker.prototype.isContactAnotherGroup = function(nodeGroup)
{
	//체크 변수 초기화
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);
	this.isUnderSiege = true;
	
	var node;
	for(var i=0; i<nodeGroup.length; i++)
	{
		node = nodeGroup[i];
		
		this._searchGroup(node.nX, node.nY, node, 0);
		
		if(!this.isUnderSiege) break;
	}
	
	return !this.isUnderSiege;
};

bs.BoardChecker.prototype._searchGroup = function(nX, nY, checkNode, fromDir)
{
	//포위당하지 않은 경우 또는 이미 체크한 자리이면 
	if(!this.isUnderSiege || this.mCheck[nX][nY]==1) return;
	
	var node = this.mNodes[nX][nY];
	
	//돌이 놓여져 있는 경우
	if(node && !this.mDomChecker.isDeadCheck(nX, nY))
	{
		//자신과 다른 종류의 돌을 만나면 현재 방향 검색 중단
		if(node.chKind!=checkNode.chKind) return;
		
		//자신과 다른 그룹을 만났고 살아 있으면 포위된게 아니다.
		//임시로 놓여진 돌 때문에 nodeGroup 이 null 인 경우도 있다.
		if(node.nodeGroup && node.nodeGroup!==checkNode.nodeGroup)
		{
			//asoocool test
			//if(node.nodeGroup.isAlive || node.nodeGroup.domains.length>0)
			if(node.nodeGroup.isAlive)
			{
				this.isUnderSiege = false;
				return;
			}
		}
	}
	else
	{
		//다른 종류의 도메인을 만나면 검색 중단
		var nWhich = this.mDomChecker.whichDomain(nX, nY);
		
		//반대 도메인 인 경우 현재 방향 검색 중단
		if(nWhich==(checkNode.chKind^1)) return;
				
		else if(nWhich==bs.EMPTY)
		{
			/*
			var node1 = null, node2 = null;
			
			if(fromDir==bs.LEFT || fromDir==bs.RIGHT)
			{
				if(nY>0) node1 = this.mNodes[nX][nY-1];
				if(nY<this.mContent.mBoardLine-1) node2 = this.mNodes[nX][nY+1];
			}
			else if(fromDir==bs.TOP || fromDir==bs.BOTTOM)
			{
				if(nX>0) node1 = this.mNodes[nX-1][nY];
				if(nX<this.mContent.mBoardLine-1) node2 = this.mNodes[nX+1][nY];
			}
			
			if( (node1 && node1.chKind!=checkNode.chKind) || (node2 && node2.chKind!=checkNode.chKind)) 
			{
				return;
			}
			*/
			
			//asoocool test
			//빈 공백으로 이동 후 자신과 같은 색의 돌이 한개 이하인 경우
			if(this.getRSC(nX, nY, checkNode.chKind, true)<2)
			{
				//반대색 돌의 개수가 2개 이상이면 검색 중단
				if(this.getRSC(nX, nY, checkNode.chKind^1, true)>1) return;
			
			}
		}
	}
	
	
	this.mCheck[nX][nY] = 1;

	if(nX>0) this._searchGroup(nX-1, nY, checkNode, bs.LEFT);
	if(nX<this.mContent.mBoardLine-1) this._searchGroup(nX+1, nY, checkNode, bs.RIGHT);
	if(nY>0) this._searchGroup(nX, nY-1, checkNode, bs.TOP);
	if(nY<this.mContent.mBoardLine-1) this._searchGroup(nX, nY+1, checkNode, bs.BOTTOM);
};



//nX, nY 의 공배가 같은 도메인으로 둘려쌓여져 있는지
bs.BoardChecker.prototype.isSameDomainAround = function(nX, nY, nKind, emptyPtArr)
{
	//체크 변수 초기화
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);
	this.isUnderSiege = true;

	this._searchUnderSiege(nX, nY, nKind, 0, emptyPtArr);	//최초 자신의 자리는 count 되지 않도록 -1

	return this.isUnderSiege;
};

/*
//특정 위치의 공백을 기준으로 하고 사방으로 갖혀있는 돌을 가지고 있는지
bs.BoardChecker.prototype.hasUnderSiegeStone = function(nX, nY, nKind)
{
	var thisObj = this;
	
	if(nX>0 && _is_under_siege(nX-1, nY, bs.LEFT)) return true;
	if(nX<this.mContent.mBoardLine-1 && _is_under_siege(nX+1, nY, bs.RIGHT)) return true;
	if(nY>0 && _is_under_siege(nX, nY-1, bs.TOP)) return true;
	if(nY<this.mContent.mBoardLine-1 && _is_under_siege(nX, nY+1, bs.BOTTOM)) return true;

	return false;

	function _is_under_siege(dX, dY, dir)
	{
		//체크 변수 초기화
		bs.setArray2(thisObj.mCheck, thisObj.mContent.mBoardLine, 0);
		
		//중심점은 체크된 것으로 
		thisObj.mCheck[nX][nY] = 1;
		thisObj.isUnderSiege = true;

		thisObj._searchUnderSiege(dX, dY, nKind, dir);
		
		return thisObj.isUnderSiege;
	}

};
*/

//특정 위치의 공백을 기준으로 하고 사방으로 갖혀있는 돌을 가지고 있는지
bs.BoardChecker.prototype.hasUnderSiegeStone = function(nX, nY, nKind)
{
	var thisObj = this;
	
	if(nX>0 && _is_under_siege(nX-1, nY, bs.LEFT)) return true;
	if(nX<this.mContent.mBoardLine-1 && _is_under_siege(nX+1, nY, bs.RIGHT)) return true;
	if(nY>0 && _is_under_siege(nX, nY-1, bs.TOP)) return true;
	if(nY<this.mContent.mBoardLine-1 && _is_under_siege(nX, nY+1, bs.BOTTOM)) return true;

	return false;

	function _is_under_siege(dX, dY, dir)
	{
		//체크 변수 초기화
		bs.setArray2(thisObj.mCheck, thisObj.mContent.mBoardLine, 0);
		
		//중심점은 체크된 것으로 
		thisObj.mCheck[nX][nY] = 1;
		thisObj.isUnderSiege = true;
		
		//네 방향을 먼저 체크된 것으로 셋팅해야 한쪽 방향으로만 흐른다.
		var tX, tY;
		for(var i=0; i<4; ++i)
		{
			tX = nX + bs.RoundLoc[i][0];
			tY = nY + bs.RoundLoc[i][1];

			if(tX<0 || tY<0 || tX>thisObj.mContent.mBoardLine-1 || tY>thisObj.mContent.mBoardLine-1) continue;
			thisObj.mCheck[tX][tY] = 1;
		}
		
		//가려는 방향만 체크를 해제한다.
		thisObj.mCheck[dX][dY] = 0;

		thisObj._searchUnderSiege(dX, dY, nKind, dir);
		
		return thisObj.isUnderSiege;
	}

};


//포위 당했는지 체크하는 함수
bs.BoardChecker.prototype._searchUnderSiege = function(nX, nY, checkStone, fromDir, emptyPtArr)
{
	//포위당하지 않은 경우 또는 이미 체크한 자리이면 
	if(!this.isUnderSiege || this.mCheck[nX][nY]==1) return;
	
	var node = this.mNodes[nX][nY];
	
	//돌이 놓여져 있는 경우
	if(node && !this.mDomChecker.isDeadCheck(nX, nY))
	{
		//자신과 다른 종류의 돌을 만나면 현재 방향 검색 중단
		if(node.chKind!=checkStone) return;
	}
	
	//돌이 놓여져 있지 않은 경우
	else
	{
		var nWhich = this.mDomChecker.whichDomain(nX, nY);
		
		//자신과 같은 domain 을 만나면 포위 당하지 않은 것으로 판단하고 검색 종료
		if(nWhich==checkStone)
		{
			this.isUnderSiege = false;
			return;
		}
		
		//반대 도메인 인 경우
		else if(nWhich==(checkStone^1))
		{
			//현재 방향 검색 중단
			return;
		}
		
		else //if(nWhich==bs.EMPTY)
		{
			if(emptyPtArr) emptyPtArr.push({nX: nX, nY: nY});
			
			var node1 = null, node2 = null;
			
			if(fromDir==bs.LEFT || fromDir==bs.RIGHT)
			{
				if(nY>0) node1 = this.mNodes[nX][nY-1];
				if(nY<this.mContent.mBoardLine-1) node2 = this.mNodes[nX][nY+1];
			}
			else if(fromDir==bs.TOP || fromDir==bs.BOTTOM)
			{
				if(nX>0) node1 = this.mNodes[nX-1][nY];
				if(nX<this.mContent.mBoardLine-1) node2 = this.mNodes[nX+1][nY];
			}
			
			if( (node1 && node1.chKind!=checkStone) || (node2 && node2.chKind!=checkStone)) return;
			
		}
	}
	
	this.mCheck[nX][nY] = 1;

	if(nX>0) this._searchUnderSiege(nX-1, nY, checkStone, bs.LEFT, emptyPtArr);
	if(nX<this.mContent.mBoardLine-1) this._searchUnderSiege(nX+1, nY, checkStone, bs.RIGHT, emptyPtArr);
	if(nY>0) this._searchUnderSiege(nX, nY-1, checkStone, bs.TOP, emptyPtArr);
	if(nY<this.mContent.mBoardLine-1) this._searchUnderSiege(nX, nY+1, checkStone, bs.BOTTOM, emptyPtArr);

};

bs.BoardChecker.prototype.clearAllDeadStones = function()
{
	var nX, nY, node;
	
	/*
	//자신이 속해 있던 노드 그룹 변수 초기화
	for(nY=0; nY<this.mContent.mBoardLine; nY++)
	{
		for(nX=0; nX<this.mContent.mBoardLine; nX++)
		{
			node = this.getNodeData(nX, nY);
			if(node) node.nodeGroup = undefined;
		}
	}
	*/

	//작업 초기화 
	this.mDomChecker.initDeadChecks();
	
	//기존에 셋팅되어져 있던 도메인카운트 객체에 값을 적용시킨 후 포위 체크를 한다.	
	this.mDomChecker.updateDomain();
};

//asoocool test
bs.BoardChecker.prototype.getNodeGroupDomains2 = function(nodeGroup)
{
	//돌 그룹의 공배를 구한 후
	var pts = nodeGroup.getEmptyPts(), nWhich = bs.EMPTY, i, chkKind = nodeGroup.getKind();

	nodeGroup.domains = [];

	for(i=0; i<pts.length; i++)
	{
		nWhich = this.mDomChecker.whichDomain(pts[i].nX, pts[i].nY);

		//nodeGroup 과 같은 종류의 도메인이 있는 공배이면 
		//if(nWhich!=bs.EMPTY && nWhich==nodeGroup.getKind()) 
		if(nWhich==chkKind) 
		{
			//연결되어 있는 도메인을 구해(즉, 돌 그룹이 가지고 있는 모든 도메인을 얻는다.) 노드그룹 정보에 포함시킨다.
			this.mDomChecker.getLinkedDomain(pts[i].nX, pts[i].nY, nodeGroup.domains, true);
			
			var temp = [];
			
			this.mDomChecker.getLinkedDomain(pts[i].nX, pts[i].nY, temp, false);
			
			//얻어진 도메인이 두개 이상으로 분리되어져 있는지
			nodeGroup.domains.isSplit = (nodeGroup.domains.length!=temp.length);
			
			break;
		}
	}

};


//asoocool test
//##############################################################################################
//바로 돌 부터 시작하면 도메인과 떨어져 있는 돌부터 시작할 경우 도메인을 가져오지 못한다.
//emptypt 로 부터 가져오는 방법과 혼용을 하던 아니면 노드그룹을 구하는 getLinkedStones 와 
//같은 규칙으로 getLinkedDomain 을 구성해야 할 듯.

bs.BoardChecker.prototype.getNodeGroupDomains = function(nodeGroup)
{
	//돌 그룹의 공배를 구한 후
	var node = nodeGroup.getSafeNode();

	nodeGroup.domains = [];

	//연결되어 있는 도메인을 구해(즉, 돌 그룹이 가지고 있는 모든 도메인을 얻는다.) 노드그룹 정보에 포함시킨다.
	
	this.mDomChecker.getLinkedDomain(node.nX, node.nY, nodeGroup.domains, true);
	
	if(nodeGroup.domains.length>0)
	{
		var temp = [];

		this.mDomChecker.getLinkedDomain(nodeGroup.domains[0].nX, nodeGroup.domains[0].nY, temp, false);

		//얻어진 도메인이 두개 이상으로 분리되어져 있는지
		nodeGroup.domains.isSplit = (nodeGroup.domains.length!=temp.length);
	}
	else
	{
		this.getNodeGroupDomains2(nodeGroup);
	}
};

/*
//위에것은 떨어져 있는 도메인을 못 얻어오고 이 함수는 다른 그룹의 도메인까지 얻어오는 버그
//수정하기
bs.BoardChecker.prototype.getNodeGroupDomains = function(nodeGroup)
{
	var domPts = new bs.NodeGroup(this), pts;
	
	for(var i=0; i<nodeGroup.length; i++)
	{
		pts = this.mDomChecker.getNodeDomains(nodeGroup[i]);
		domPts.appendNodeGroup(pts);
	}
	
	domPts.distinctPts();
	
	
	if(domPts.length>0)
	{
		var temp = [];

		this.mDomChecker.getLinkedDomain(domPts[0].nX, domPts[0].nY, temp, false);

		//얻어진 도메인이 두개 이상으로 분리되어져 있는지
		domPts.isSplit = (domPts.length!=temp.length);	
	}
	
	nodeGroup.domains = domPts;

};
*/

bs.BoardChecker.prototype.findAllDeadStones = function(isDeadCheck)
{
	var node, nX, nY, nodeGroup, groupArr = [], i, j, nodeCnt = 0;
	
	this.groupArr = groupArr;
	
	this.isShowDeadMark = isDeadCheck;
	
	//최초 노드그룹을 구하기 위해 updateDomain 대신 
	//순수한 기본 도메인만을 구한다.(checkLeakDomain, clearFalseDomain 을 호출하지 않는다.)
	this.mDomChecker.applyCountToDomain();
	this.mDomChecker.checkLeakDomain();
	
	for(nY=0; nY<this.mContent.mBoardLine; nY++)
	{
		for(nX=0; nX<this.mContent.mBoardLine; nX++)
		{
			node = this.getNodeData(nX, nY);
			
			//if(node && !node.nodeGroup)	//처음 체크하는 돌이면
			if(node)
			{
				nodeCnt++;
				
				//처음 체크하는 돌이면
				if(!node.nodeGroup)
				{
					//연결되어 있는 각각의 돌 그룹을 모두 구한다.
					nodeGroup = new bs.NodeGroup(this);
					this.getLinkedStones(nX, nY, nodeGroup, false);

					//최초 모든 그룹을 생성할 경우 한번만 링크해준다.
					nodeGroup.linkWithNode();

					groupArr.push(nodeGroup);
				}
			}
		}
	}
	
	//화면에 돌이 20개 이하이면 사활체크를 하지 않는다.
	if(nodeCnt<21)
	{
		this.mDomChecker.updateDomain();
	
		for(i=0; i<groupArr.length; i++)
			groupArr[i].unlinkWithNode();

		return;
	}
	
	//console.log(groupArr);
	
	//노드 그룹을 구한 후 사활이 정확히 체크되도록 updateDomain 을 호출해 준다.
	this.mDomChecker.updateDomain();
	
	for(i=0; i<groupArr.length; i++)
	{
		nodeGroup = groupArr[i];

		//얻어진 돌 그룹의 도메인을 구한 후
		this.getNodeGroupDomains(nodeGroup);

		//위 정보를 셋팅 후 살아 있는 돌인지 판단한다.
		nodeGroup.isAlive = this.isAliveDomains(nodeGroup.domains, nodeGroup.getKind());
				
		//isContactAnotherGroup 함수가 nodeGroup.isAlive 변수에 의존적이기 때문에
		//isAlive 변수 셋팅 후 다시 체크해 준다.
	}	
	
	
	var checkArr = [];
	
	for(i=0; i<groupArr.length; i++)
	{
		nodeGroup = groupArr[i];
		
		//단독으로는 죽은 모양이지만 
		if(!nodeGroup.isAlive)
		{
			//세력에 포위당하지 않고 살아 있는 다른 그룹과 만날 수 있으면 제외
			//if(this.isContactAnotherGroup( nodeGroup.getSafeNode() )) nodeGroup.isAlive = true;
			if(this.isContactAnotherGroup(nodeGroup)) nodeGroup.isAlive = true;
			
			else
			{
				//서로 공배를 체크해야 할 근접한 노드그룹을 저장할 배열
				nodeGroup.others = [];
				checkArr.push(nodeGroup);
			}
		}
	}
	
	//console.log(checkArr);
	
	
	this.adjoiningGroupCheck(checkArr);
	

	//남아 있는 checkArr 들의 others 가 모두 죽은 상태이면
	//자신은 다시 살아 있는 상태로 셋팅한다.
	//-> 자신은 수상전에서 졌지만 이긴돌이 자신편의 다른 돌과 수상전 후 따내어지면 자신은 다시 산돌이 되기 때문에 
	
	for(i=0; i<checkArr.length; i++)
	{
		nodeGroup = checkArr[i];
		
		//인접한 돌 그룹이 있는 돌그룹중에서
		if(nodeGroup.others.length>0)
		{
			for(j=0; j<nodeGroup.others.length; j++)
			{
				//하나라도 산 돌이 있으면 break
				if(nodeGroup.others[j].isAlive) break;
			}

			//즉, 상대돌이 모두 죽은 상태이면 자신을 산돌로 셋팅한다.
			if(j==nodeGroup.others.length) nodeGroup.isAlive = true;
		}
	
		//화면에 사석을 표시한다.
		if(!nodeGroup.isAlive) this.groupToDeadCheck(nodeGroup, true);
	}
	
	//사석을 지정한 후 도메인을 갱신한다.
	this.mDomChecker.updateDomain();

	//----------------------
	
	//인접하지 않은 돌 중에서 사석 체크 후 다시 살아날 돌들 복원
	
	for(i=0; i<checkArr.length; i++)
	{
		nodeGroup = checkArr[i];
		
		//if(!nodeGroup.isAlive && nodeGroup.others.length==0 && this.isContactAnotherGroup(nodeGroup.getSafeNode()))
		if(!nodeGroup.isAlive && nodeGroup.others.length==0 && this.isContactAnotherGroup(nodeGroup))
		{
			nodeGroup.isAlive = true;
			this.groupToDeadCheck(nodeGroup, false);
		}
	}
	
	//----------------------
		
	
	//사석을 지정한 후 도메인을 갱신한다.
	this.mDomChecker.updateDomain();
	

	for(i=0; i<groupArr.length; i++)
		groupArr[i].unlinkWithNode();
	
};

// 링크(인접한 돌그룹)가 가장 많은 돌그룹부터, 자신과 인접한 돌그룹과 수상전, 링크가 같을 경우 공배가 적은 돌그룹 우선 
// 자신과 인접한 돌 그룹중에서 공배가 가장 적은 돌 그룹부터 수상전

bs.BoardChecker.prototype.adjoiningGroupCheck = function(checkArr)
{
	var i, j, k, group, other;
	
	
	//공배가 가장 적게 남아 있는 순서로 정렬했기 때문에
	checkArr.sort(function(a, b) { return a.compareNodeGroup(b); });
	
	//같은 순서로 others 도 추가된다.
	for(i=0; i<checkArr.length; i++)
	{
		group = checkArr[i];
		
		for(j=i+1; j<checkArr.length; j++)
		{
			if(group.isAdjoiningGroup(checkArr[j]))
			{
				group.others.push(checkArr[j]);
				checkArr[j].others.push(group);
			}
		}
	}
	
	//링크(인접한 돌그룹)가 많은 순서로 다시 정렬한다. 같을 경우 공배가 더 적은 순서
	checkArr.sort(function(a, b) 
	{
		var ret = b.others.length - a.others.length;
		if(ret==0) ret = a.compareNodeGroup(b);
		
		return ret;
	});
	
	var firstKind, winInfo1, winInfo2, winGroup, loseGroup;
	//var curTurn = this.mContent.getCurTurnStone();
	
	for(i=0; i<checkArr.length; i++)
	{
		group = checkArr[i];
		
		if(group.isCheckDone) continue;
		
		firstKind = group.getKind();
		
		//asoocool test
		if(firstKind==-1) 
		{
			group.isCheckDone = true;
			continue;
		}
		
		for(j=0; j<group.others.length; j++)
		{
			other = group.others[j];
			
			if(other.isCheckDone) continue;
		
			//각 한번씩 먼저 착수하는 모드로 두번 체크
			winInfo1 = this.emptyNumberFight(group, other, firstKind);
			winInfo2 = this.emptyNumberFight(other, group, firstKind^1);
			
			//if(curTurn==firstKind) winInfo1 = this.emptyNumberFight(group, other, firstKind);
			//else winInfo1 = this.emptyNumberFight(other, group, firstKind^1);
			
			//이긴 돌의 종류(흑,백)가 둘다 같으면 한쪽으로 승패가 난 것이다.
			if(winInfo1==winInfo2)
			//if(true)
			{
				//즉, 이긴돌의 유형이 firstKind 이면 checkArr[i](group) 가 이긴 경우이다.
				if(winInfo1==firstKind) 
				{
					winGroup = group;
					loseGroup = other;
				}
				else if(winInfo1==(firstKind^1) ) 
				{
					winGroup = other;
					loseGroup = group;
				}
				
				// nkind 가 -1 인 경우는 빅인 경우이다.
				else
				{
					//group.isSameEmpty = true;
					//other.isSameEmpty = true;
					
					group.isCheckDone = true;
					other.isCheckDone = true;
					
				
					continue;
				}
				
				//asoocool test
				if(winGroup.getKind()==-1) 
				{
					winGroup.isCheckDone = true;
					continue;
				}
				
				
				//수상전에서 진 돌을 제거해야 이긴돌이 자신과 연결된 또 다른 노드그룹과 수상전을 할 수 있다.
				//noReset 이 true 이면 따낸돌을 복원하지 않는다. winGroup 에 저장하고 있다 차후에 복원한다.
				this.emptyNumberFight(winGroup, loseGroup, winGroup.getKind(), true);
				
				//현재 죽은 돌과 수상전을 해서 예전에 죽었던 돌이 살아나는 모양인지 체크 
				var tOther, snode;
				for(k=0; k<loseGroup.others.length; k++)
				{
					tOther = loseGroup.others[k];
					
					if(tOther.isCheckDone) continue;
					
					snode = tOther.getSafeNode();
					
					if(!snode) 
					{
						tOther.isCheckDone = true;
						continue;	//asoocool test
					}
					
					var tmpGroup = new bs.NodeGroup(this);
					this.getLinkedStones(snode.nX, snode.nY, tmpGroup, false);
					
					//if(tmpGroup.length==0) continue;	//asoocool test
					
					if(this._alive_check(tmpGroup, true)) 
					{
						tOther.isAlive = true;
						tOther.isCheckDone = true;
						
						if(tOther.isSameEmpty)
						{
							_reset_same_empty(tOther);
						}
					}
				}
				
				
				loseGroup.isCheckDone = true;
				
				//현재 체크 그룹이 졌거나 혹은 이겨서 살아난 경우는 더 이상 others 와 체크하지 않는다.
				if(group===loseGroup || group.isAlive) break;
			}
			
			//먼저 둔 경우가 이기면 공배가 같은 경우이다(빅이 아니고 아직 처리되지 않은 케이스, 먼저 놓는 사람이 이김)
			else
			{
				group.isSameEmpty = true;
				other.isSameEmpty = true;
			}

		}
	}
	
	//연속적인 수상전을 위해 복원하지 않았던 돌들을 복원한다.
	this.resetTestNodes(this.testNodes);
	
	for(i=0; i<checkArr.length; i++)
	{
		group = checkArr[i];

		//isSameEmpty 이 true 이면 산돌이다.( 빅 )
		if(group.isSameEmpty) group.isAlive = true;
	}
	
	
	function _reset_same_empty(chkGroup)
	{
		var tmp;
		for(var h=0; h<chkGroup.others.length; h++)
		{
			tmp = chkGroup.others[h];
			
			if(tmp.isSameEmpty) 
			{
				tmp.isSameEmpty = false;
				chkGroup.isCheckDone = false;
			}
		}
	
	}
};

//수상전 함수, 비교할 돌 그룹, firstKind 는 group1 의 종류이고 먼저 착수할 돌의 종류이다.
//noReset 이 true 이면 차후에 복원하기 위해 this.testNodes 변수를 저장해 둔다.
//noReset 이 false 이면 수상전 후 바로 원래 상태로 복원한다.
//리턴값은 이긴 돌의 유형과 따낸 후 돌의 유형이 살아있는지 여부를 배열로 리턴한다. -> [nKind, isAlive]
//
bs.BoardChecker.prototype.emptyNumberFight = function(group1, group2, firstKind, noReset)
{
	var pts1, pts2, thisObj = this, pt, emptyPt = new bs.BDK_PT(), newNode1, newNode2, isAlive, isSameCnt = 0, tmpTestNodes = [];
	
	pts1 = group1.getEmptyPts();
	pts2 = group2.getEmptyPts();
	
	//착수 금지나 단수 자리 등으로 착수에 실패한 회수
	pts1.layFail = 0;
	pts2.layFail = 0;
	
	while(true)
	{
		//asoocool test
		//if(pts1.length==0 && pts2.length==0) return -1;
		
		//-------------------------------------------------
		//	first turn
	
		newNode1 = _lay_helper(pts2, firstKind, group1);	//반대편 공배에 돌을 착수 하므로 pts2
		
		if(newNode1!=-1)
		{
			//빅이면
			if(newNode1==null)
			{
				if(++isSameCnt==2)
				{
					this.resetTestNodes(tmpTestNodes);
					return -1;
				}
			}
			else if(newNode1.deadStones.length>0 && pts2.length==0) 
			{
				if(!noReset) this.resetTestNodes(tmpTestNodes);

				//return [ firstKind, isAlive ];
				return firstKind;
			}
			else isSameCnt = 0;
		}
		
		
		//-------------------------------------------------
		//	next turn
		
		newNode2 = _lay_helper(pts1, firstKind^1, group2);

		if(newNode2!=-1)
		{
			//빅이면
			if(newNode2==null)
			{
				if(++isSameCnt==2)
				{
					this.resetTestNodes(tmpTestNodes);
					return -1;
				}
			}
			else if(newNode2.deadStones.length>0 && pts1.length==0) 
			{
				if(!noReset) this.resetTestNodes(tmpTestNodes);

				//return [ (firstKind^1), isAlive ];
				return (firstKind^1);
			}
			else isSameCnt = 0;
		}
		
		if(newNode1==-1 && newNode2==-1) 
		{
			this.resetTestNodes(tmpTestNodes);
			return -1;
		}

	}
	
	function _lay_helper(otherPts, nKind, myGroup)
	{
		//뒤에서부터 꺼내온다
		pt = otherPts.pop();	//반대편 공배를 얻어와야 하므로
		
		//상대편은 더 놓을 자리가 있어도 자신은 없을 수도 있다.
		if(!pt) 
		{
			console.log('_lay_helper : pt is null, check!');
			
			return -1;
		}
		
		var node = thisObj.getNodeData(pt.nX, pt.nY);
		
		//공유된 공배여서 상대돌이 이미 놓여져 있으면 
		if(node)
		{
			var grp = new bs.NodeGroup(thisObj);
			
			thisObj.getLinkedStones(pt.nX, pt.nY, grp, true);
			
			//thisObj.getNodeEmpty(node, otherPts);
			
			thisObj.joinWithCheck(otherPts, grp.getEmptyPts());
			
			return _lay_helper(otherPts, nKind, myGroup);
		}
		
		//착수금지 자리인지
		else if(!thisObj.isAbleToLay(pt.nX, pt.nY, nKind, false)) 
		{
			//다음번에 다시 시도하기 위해 앞으로 추가한다. 
			otherPts.unshift(pt);
			
			//모든 자리가 착수금지이면 무한 반복하므로 체크
			if(++otherPts.layFail>3) 
			{
				otherPts.layFail = 0;
				return null;
			}
			
			return _lay_helper(otherPts, nKind, myGroup);
		}
		
		//놓으면서 단수 자리인지
		else if(!thisObj.isAbleToLay(pt.nX, pt.nY, nKind, true, emptyPt))
		{
			//이미 착수 실패가 있었으면 
			//살아 있는 돌 그룹과 연결되는 자리에 돌을 하나 더 추가해 준다.
			if(otherPts.layFail>0)
			{
				if(thisObj.isLinkedWithOther(emptyPt.nX, emptyPt.nY, nKind, myGroup))
				{
					//otherPts.layFail = 0;

					var newPt = new bs.BDK_PT();
					newPt.setBdPt(emptyPt);

					//다음 차례에 바로 두어지도록 맨 뒤에 추가한다.
					otherPts.push(pt);
					otherPts.push(newPt);
				}
				else
				{
					otherPts.unshift(pt);
					
					//빅은 경우는 layFail 이 2 만 되도 만족하지만
					//빅과 유사한 정상적인 상황은 최소한 3 번 정도 실패하므로 빅과 구별하기 위해 3보다 커야 한다.
					//빅은 layFail 이 무한 반복된다.
					if(++otherPts.layFail>3) 
					{
						otherPts.layFail = 0;
						return null;
					}
				}
			}
			
			//착수 실패가 없었으면 다른 공배부터 메우기 시작한다.
			else 
			{
				otherPts.unshift(pt);
				otherPts.layFail++;
			}
			
			return _lay_helper(otherPts, nKind, myGroup);
			
		}
		

		node = new bs.NodeData();
		node.nX = pt.nX;
		node.nY = pt.nY;
		node.chKind = nKind;
		
		//node.isShow = true;	//asoocool test
		
		thisObj.setValue(pt.nX, pt.nY, node);
		thisObj.mContent.deadStoneCheck(node, true);
		
		if(noReset) thisObj.testNodes.push(node);
		else tmpTestNodes.push(node);
		
		return node;
	}
	

};

//돌 그룹의 도메인을 구한 후, 살아 있는 돌인지 판단한다.
bs.BoardChecker.prototype._alive_check = function(nodeGroup, isUpdateDomain)
{
	if(isUpdateDomain) this.mDomChecker.updateDomain();
	
	this.getNodeGroupDomains(nodeGroup);
	
	//return ( this.isAliveDomains(nodeGroup.domains, nodeGroup.getKind()) || this.isContactAnotherGroup(nodeGroup.getSafeNode()) );
	
	return ( this.isAliveDomains(nodeGroup.domains, nodeGroup.getKind()) || this.isContactAnotherGroup(nodeGroup) );
};


//------------------------------------------------------------------
//	돌 복원
bs.BoardChecker.prototype.resetTestNodes = function(testNodes)
{
	//놓여지지 않았던 상태로 복원
	var node, i = testNodes.length - 1;
	
	for(; i>-1; i--)
	{
		node = testNodes[i];

		this.setValue(node.nX, node.nY, null);

		if(node.deadStones.length>0)
		{
			this.mContent.deadStoneShowHide(node, true, true);
		}
	}
	
	testNodes.length = 0;
};

// 도메인이 2,3,4,5 개 인 경우의 수를 모두 상정함
// □□  , □□ , □
// □□□ , □□ , □□□ ... 이러한 공배를 둘러싸고 있는 돌의 개수
// 살아 있는 유형의 공배에 필요한 돌의 개수를 조사함, 공유된 돌은 중복 카운팅 된다.
//  ● ●     ●●●     ●●●●
// ●□●□●   ●□□□●   ●□□□□●
//  ● ●  ,  ●●●  ,  ●●●●
//   8       8       10
// 단, 놓을 차례에 따라 살 수도 있고 죽을 수도 있다. 경우에 따라 돌의 개수를 +, - 해준다.
//  ●●       ●● 
// ●□□●     ●□□●
// ●□□□●    ●□□●
//  ●●●  ,   ●●
//   10      8
bs.BoardChecker.prototype.isAliveDomains = function(domains, nKind)
{
	if(domains.length>5) return true;
	if(domains.length<2) return false;
	
	var totRSC = 0, totDSC = 0, dsc;
	
	for(var i=0; i<domains.length; i++)
	{
		totRSC += this.getRSC(domains[i].nX, domains[i].nY, nKind, true);
		
		dsc = this.getDSC(domains[i].nX, domains[i].nY, nKind);
		if(dsc>2) totDSC++;
	}
	
	var curTurn = this.mContent.getCurTurnStone();
	
	if(curTurn==nKind) totRSC++;
	
	var bRet = false;
	
	if(domains.isSplit) 
	{
		//나뉘어져 있으면 나뉘어진 개수만큼만 있으면 된다.
		bRet = (totDSC >= 2);
	}
	else
	{
		//도메인 하나당 round stone 의 총 합이  
		//하나만 더 놓으면 살 수 있는 상태
		switch(domains.length)
		{
			//case 2: bRet = false; 			break;
			/*
			case 3: bRet = (totRSC>=8);		break;
			case 4: bRet = (totRSC>=9);		break;
			case 5: bRet = (totRSC>=10);	break;
			*/
			case 3: bRet = (totRSC>=9);		break;
			case 4: bRet = (totRSC>=10);	break;
			case 5: bRet = (totRSC>=11);	break;
		}
		
		//옥집이 되지 않는 조건
		//연속된 돌일 경우는 domains.length 이상 이어야 하지만
		
		bRet &= (totDSC >= domains.length);
	}

	return bRet;

};


//isSet 이 참이면 사석을 체크하고 거짓이며 사석체크를 해제한다.
bs.BoardChecker.prototype.groupToDeadCheck = function(group, isSet)
{
	if(!this.isShowDeadMark) return;
	
	var i, node;
	
	for(i=0; i<group.length; i++)
	{
		node = group[i];

		//this.mDomChecker.setDomainCount(node.nX, node.nY, node, false);
		this.mDomChecker.setDeadCheck(node.nX, node.nY, node, isSet);
	}
};

bs.BoardChecker.prototype.diagonalRotate = function()
{
	var nBoardLine = this.mContent.mBoardLine - 1;

	for(var nY=0; nY<this.mContent.mBoardLine; ++nY)
	{
		for(var nX=0; nX<this.mContent.mBoardLine; ++nX)
			this.mTrnTemps[nBoardLine - nY][nBoardLine - nX] = this.mNodes[nX][nY];
	}

	bs.cpyArray2(this.mNodes, this.mTrnTemps, this.mContent.mBoardLine);
};

bs.BoardChecker.prototype.swapStoneKind = function()
{
	var node;

	for(var nY=0; nY<this.mContent.mBoardLine; ++nY)
	{
		for(var nX=0; nX<this.mContent.mBoardLine; ++nX)
		{
			node = this.mNodes[nY][nX];
			if(node) node.chKind ^= 1;
		}
	}
};

//nodeGroup1 : 사활 체크 노드그룹
//nodeGroup2 : 상대돌 그룹
//checkStone : 사활 체크 대상 돌의 종류
bs.BoardChecker.prototype.colculNodeScore = function(nodeGroup1, nodeGroup2, newNode, checkStone)
{
	var groupEmpty1 = nodeGroup1.getEmptyCount(), groupEmpty2 = nodeGroup2.getEmptyCount(), 
		j, dX, dY, nodeEmpty = 0;
		
    var data = new bs.NodeData();
    data.chKind = checkStone;
	
	for(j=0; j<4; ++j)
	{
		dX = newNode.nX + bs.RoundLoc[j][0];
		dY = newNode.nY + bs.RoundLoc[j][1];

		if(dX<0 || dY<0 || dX>this.mContent.mBoardLine-1 || dY>this.mContent.mBoardLine-1) continue;

		if(!this.getNodeData(dX, dY)) 
		{
			nodeEmpty++;
			
			this.mNodes[newNode.nX][newNode.nY] = data;
			
			if(!this.isAbleToLay(dX, dY, checkStone^1)) nodeEmpty += 10;
			
			this.mNodes[newNode.nX][newNode.nY] = newNode;
		}
	}
	
	if(checkStone==newNode.chKind) return nodeEmpty + groupEmpty1 + newNode.deadStones.length - groupEmpty2*2;
	else return nodeEmpty + groupEmpty2*2 + newNode.deadStones.length - groupEmpty1;
};


//round stone count
//특정 공배(nX, nY)를 둘러싸고 있는 돌의 개수
bs.BoardChecker.prototype.getRSC = function(nX, nY, nKind, isOutCnt)
{
	var j, dX, dY, dnode, cnt = 0;
		
	for(j=0; j<4; ++j)
	{
		dX = nX + bs.RoundLoc[j][0];
		dY = nY + bs.RoundLoc[j][1];

		if(dX<0 || dY<0 || dX>this.mContent.mBoardLine-1 || dY>this.mContent.mBoardLine-1) 
		{
			if(isOutCnt) cnt++;
		}
		else 
		{
			dnode = this.getNodeData(dX, dY);
			
			if(dnode && dnode.chKind==nKind) cnt++;
		}
	}
	
	return cnt;
};

//Diagonal Safe Count
//특정 공배의 안전한 대각 위치의 개수, 돌이 있거나 호구인 경우 
bs.BoardChecker.prototype.getDSC = function(nX, nY, nKind)
{
	var j, dX, dY, dnode, cnt = 0, nWhich, isOut;
		
	for(j=0; j<4; ++j)
	{
		dX = nX + bs.DiagonalLoc[j][0];
		dY = nY + bs.DiagonalLoc[j][1];
		
		isOut = false;

		if(dX<0 || dX>this.mContent.mBoardLine-1) 
		{
			cnt += 0.5;
			isOut = true;
		}
		
		if(dY<0 || dY>this.mContent.mBoardLine-1) 
		{
			cnt += 0.5;
			isOut = true;
		}
		
		if(!isOut)
		{
			dnode = this.getNodeData(dX, dY);
			
			if(dnode) 
			{
				if(dnode.chKind==nKind || this.mDomChecker.isDeadCheck(dX, dY)) cnt++;
			}
			else 
			{
				nWhich = this.mDomChecker.whichDomain(dX, dY);
				
				if(nWhich!=nKind) 
				{
					//공배 이더라도 호구이면 연결된 공간으로 봄 
					//var rsc = this.getOSC(dX, dY, nKind);
					var rsc = this.getRSC(dX, dY, nKind, true);
					
					//호구가 아니면
					if(rsc<3) cnt += 0.5;
					//호구이더라도 놓을 수 있는 자리이면
					else if(rsc==3 && this.isAbleToLay(dX, dY, nKind^1, true)) cnt += 0.5;
					else cnt++;
				}
				
				//대각 공배에 같은 도메인이 있으면 안전한 것으로 우선 체크
				else cnt++;
			}
		}
	}
	
	return Math.floor(cnt);
	//return cnt;
	
};

//Our Side Count
//특정 공배(nX, nY)를 둘러싸고 있는 우리편(도메인 또는 돌)의 개수
bs.BoardChecker.prototype.getOSC = function(nX, nY, nKind)
{
	var j, dX, dY, dnode, cnt = 0, dcnt = 0, nWhich;
		
	for(j=0; j<4; ++j)
	{
		dX = nX + bs.RoundLoc[j][0];
		dY = nY + bs.RoundLoc[j][1];

		if(dX<0 || dY<0 || dX>this.mContent.mBoardLine-1 || dY>this.mContent.mBoardLine-1) dcnt++;
		else 
		{
			dnode = this.getNodeData(dX, dY);
			
			if(dnode)
			{
				if(dnode.chKind==nKind || this.mDomChecker.isDeadCheck(dX, dY)) cnt++;
			}
			else
			{
				nWhich = this.mDomChecker.whichDomain(dX, dY);
				if(nWhich==nKind) cnt++;
			}
		}
	}
	
	//실제 돌이 2개 이상이어야 추가해준다.
	//if(cnt>0) cnt += dcnt;
	if(cnt>1) cnt += dcnt;
	
	return cnt;
};



bs.BoardChecker.prototype.isLinkedWithOther = function(nX, nY, nKind, exGroup)
{
	var j, dX, dY, dnode, cnt = 0;
		
	for(j=0; j<4; ++j)
	{
		dX = nX + bs.RoundLoc[j][0];
		dY = nY + bs.RoundLoc[j][1];

		if(dX<0 || dY<0 || dX>this.mContent.mBoardLine-1 || dY>this.mContent.mBoardLine-1) continue;
		else 
		{
			dnode = this.getNodeData(dX, dY);
			
			//if(dnode && dnode.chKind==nKind && dnode.nodeGroup && dnode.nodeGroup.isAlive)
			if(dnode && dnode.chKind==nKind && dnode.nodeGroup && dnode.nodeGroup!==exGroup)
			{
				//공배가 3개이상 확보된 그룹만 유효하다.
				return (dnode.nodeGroup.getEmptyCount()>2);
				//return true;
			}
		}
	}
	
	return false;
};

/*
bs.BoardChecker.prototype.getNodeEmpty = function(node, retArr) 
{
	var i, j, dnode, dX, dY, boardLine = this.mContent.mBoardLine;
	
	for(i=0; i<4; ++i)
	{
		dX = node.nX + bs.RoundLoc[i][0];
		dY = node.nY + bs.RoundLoc[i][1];
		
		if(dX<0 || dY<0 || dX>boardLine-1 || dY>boardLine-1) continue;

		dnode = this.getNodeData(dX, dY);
			
		if(!dnode) 
		{
			var tmp = new bs.BDK_PT(dX, dY);
			
			for(j=0; j<retArr.length; j++)
			{
				if(tmp.isEqual(retArr[j])) retArr.splice(j, 1);
			}
			
			retArr.push(tmp);
		}
	}
};
*/

bs.BoardChecker.prototype.joinWithCheck = function(oldArr, newArr) 
{
	var i, j;
	
	//중복된 값이 있으면 제거
	for(i=0; i<newArr.length; i++)
	{
		for(j=0; j<oldArr.length; j++)
		{
			if( newArr[i].isEqual(oldArr[j]) ) 
			{
				oldArr.splice(j, 1);
				break;
			}
		}
	}
	
	//새로운 원소를 기존 원소에 추가
	for(i=0; i<newArr.length; i++)
		oldArr.push(newArr[i]);
	
};




