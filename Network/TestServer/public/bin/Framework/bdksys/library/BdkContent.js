/**
 * class BdkContent
 * 
 */  

bs.BdkContent = function()
{
	this.mLineX = 0;							//바둑판 가로,세로 줄 개수
	this.mLineY = 0;
	this.mBoardLine = -1;						//original 바둑판 줄 수
	
    //자신과 연관된 부모 컨텐츠의 정보
	this.mParentIndex = -1;
	this.mParentNodeNum = -1;
	
    this.mParentContent = null;             //자신의 부모 컨텐츠(자신을 참고도,변화도로 추가한 부모)
    this.mParentNodeData = null;            //자신의 부모 연관 바둑돌(참고도,변화도로 설정한 바둑돌)
    this.mChildContents = new Array();      // 자신과 연관된 하위 컨텐츠(참고도,변화도)
	
    this.mContentType = bs.NORMAL_TYPE; //기보항목의 유형
    
    
    //현재 포커스된 돌 정보
    this.mCurFocusData = null;
	this.mTurnState = 0;		//바둑판 회전 관련
	
	this.mDefNodeList = new bs.NodeList();			//기본노드 데이터 리스트
	this.mNoOrderList = new bs.NodeList();			//수순과 상관없는 돌
	this.mTryList = new bs.NodeList();              //놓아보기 리스트
	
	this.mCurNodeList = null;						//현재 진행중인 노드 리스트
	
	this.mMarkManage = new bs.MarkManage(this);
	this.mBrdChecker = new bs.BoardChecker(this);	//자리 체크나 돌 따내기 처리를 위한 체커
	this.mDomChecker = new bs.DomainChecker(this);	//집계산,형세 관련 체커

	
	this.mVNodeData = new bs.NodeData();			//Virtual NodeData, 보이지 않는 가상의 돌

	this.mListName = '';
	this.mComment = '';	//listName 의 comment
	this.mExplain = '';  //컨텐츠에 대한 설명

	this.mCutRt = new bs.Rect();					//자르기 영역 정보, 바둑판 내에서 잘려진 영역을 Rect로 표현
	this.mCutGapRt = new bs.Rect();					//바둑판으로 부터의 각 방향의 갭, 연산처리가 수월하도록 만들어진 변수 
	
    this.mIsTryStone = false;						//놓아보기 상태인지
/*    
    this.mTestInfo = 
    {
        pass: 0, right: 0, wrong: 0
    };
*/	
	//서로 참조 포인터를 셋팅한다.
	this.mBrdChecker.setDomainChecker(this.mDomChecker);
	this.mDomChecker.setBoardChecker(this.mBrdChecker);
	
	
	//----------------------------------------------------------------------------------------------------------
	
	this.setCurNodeList(null, bs.MOVE_LAST);	//m_pCurNodeList 가 초기화됨. SetShowPosEnd 호출됨.
	this.setLastShowTryEnd();
	this.setStartStone(bs.BLACK);
};


bs.BdkContent.prototype.setCurNodeList = function(nodeList, pos)
{
	if(!nodeList) nodeList = this.getDefNodeList();

	this.mCurNodeList = nodeList;

	if(pos==bs.MOVE_FIRST) nodeList.setShowPosBegin();
	else if(pos==bs.MOVE_LAST) nodeList.setShowPosEnd();
};

bs.BdkContent.prototype.getCurNodeList = function() { return this.mCurNodeList; };
bs.BdkContent.prototype.getDefNodeList = function() { return this.mDefNodeList; };


//try stone
bs.BdkContent.prototype.isTryNodeFirst = function() { return this.mTryList.isShowPosBegin(); };
bs.BdkContent.prototype.isTryNodeLast = function() { return this.mTryList.isShowPosEnd(); };
bs.BdkContent.prototype.setLastShowTryBegin = function() { this.mTryList.setShowPosBegin(); };
bs.BdkContent.prototype.setLastShowTryEnd = function() { this.mTryList.setShowPosEnd(); };

//보여지는 마지막 돌의 위치가 처음(아무돌도 안보이는 상태)인지, 마지막인지
bs.BdkContent.prototype.isNodeFirst = function() { return this.getCurNodeList().isShowPosBegin(); };
bs.BdkContent.prototype.isNodeLast = function() { return this.getCurNodeList().isShowPosEnd(); };

//보여지는 마지막돌의 위치를 원소 처음으로, 끝으로
bs.BdkContent.prototype.setLastShowPosBegin = function() { this.getCurNodeList().setShowPosBegin(); };
bs.BdkContent.prototype.setLastShowPosEnd = function() { this.getCurNodeList().setShowPosEnd(); };

//마지막 보여지고 있는 돌을 리턴한다.
bs.BdkContent.prototype.getLastShowNode = function() { return this.getCurNodeList().getShowPosNode(); };
bs.BdkContent.prototype.getLastShowPos = function() { return this.getCurNodeList().getShowPos(); };

//마지막 보여지고 있는 돌의 다음돌을 리턴한다.
bs.BdkContent.prototype.getLastShowNext = function() { return this.getCurNodeList().getShowNextNode(); };


bs.BdkContent.prototype.isDataEmpty = function() { return this.getCurNodeList().isEmpty(); };
bs.BdkContent.prototype.getMarkData = function(nX, nY) { return this.mMarkManage.getMark(nX, nY); };

//마크 노드데이터를 삭제한다.(삭제 성고하면 TRUE 리턴)
bs.BdkContent.prototype.removeMarkData = function(nX, nY) { return this.mMarkManage.removeMark(nX, nY); };



//연관 컨텐츠 관련
bs.BdkContent.prototype.getParentContent = function() { return this.mParentContent; };
bs.BdkContent.prototype.setParentContent = function(parentContent, bFocusDataCheck) 
{
    this.mParentContent = parentContent; 
    if(bFocusDataCheck) this.setParentNodeData(parentContent.mCurFocusData);
};
//연관 node data
bs.BdkContent.prototype.getParentNodeData = function() { return this.mParentNodeData; };
bs.BdkContent.prototype.setParentNodeData = function(parentNode) { this.mParentNodeData = parentNode; };

bs.BdkContent.prototype.addChildContent = function(addContent, bFocusDataCheck)
{
    if(bFocusDataCheck && this.mCurFocusData) this.mCurFocusData.addChildContent(addContent);
    this.mChildContents.push(addContent);
};
bs.BdkContent.prototype.getChildContents = function() { return this.mChildContents; };
bs.BdkContent.prototype.hasChildContent = function() { return (this.mChildContents.length>0); };
bs.BdkContent.prototype.removeChildContent = function(removeContent) 
{ 
    var index = this.mChildContents.indexOf(removeContent);
    this.mChildContents.splice(index,1);
};
    

bs.BdkContent.prototype.createBoardLine = function(nBoardLine)
{
	//nBoardLine값이 0보다 작으면 
	//기존에 m_nBoardLine에 설정되어져 있는 값으로 생성한다.
	if(nBoardLine>0) this.mBoardLine = nBoardLine;
	
	this.resetCutBoardInfo();
	
	this.mMarkManage.createBoardData();
	this.mBrdChecker.createBoardData();
	this.mDomChecker.createBoardLine();
};

bs.BdkContent.prototype.destroyBoardLine = function()
{
    this.mMarkManage.destoryBoardData();
	this.mBrdChecker.destroyBoardData();
	this.mDomChecker.destroyBoardLine();

	//위를 호출한 후 초기화 해야함
	this.mBoardLine = 0;
};

//정보를 로드한후 시작시 필요한 정보를 셋팅한다.
bs.BdkContent.prototype.resetStartInfo = function()
{
	//- asoo update
	this.setCurNodeList(null, bs.MOVE_LAST);
	this.setLastShowPosEnd();

	if(this.getCurNodeList().isEmpty()) this.mCurFocusData = null;
	else this.mCurFocusData = this.getLastShowNode();
	
	this.resetCurTurnStone();
};

/*
bs.BdkContent.prototype.resetTestInfo = function()
{
    this.mTestInfo.pass = 0;
    this.mTestInfo.right = 0;
    this.mTestInfo.wrong = 0;
};
*/

bs.BdkContent.prototype.setStartStone = function(nStartStone) 
{ 
	this.nStartStone = nStartStone;
	this.nCurTurnStone = this.nStartStone;
};
	
bs.BdkContent.prototype.getStartStone = function() { return this.nStartStone; };
bs.BdkContent.prototype.setCurTurnStone = function(nTurnStone) { this.nCurTurnStone = nTurnStone; };
bs.BdkContent.prototype.getCurTurnStone = function() { return this.nCurTurnStone; };

//놓여질 돌의 종류를 스위칭해준다.
bs.BdkContent.prototype.switchTurnStone = function() { this.nCurTurnStone^=1; };



//놓여질 돌의 종류를 정하는 this.nCurTurnStone 변수를 
//현재 상황에 맞게 재 셋팅해준다.
bs.BdkContent.prototype.resetCurTurnStone = function()
{
	//데이터가 없으면 
	if(this.isDataEmpty()) this.nCurTurnStone = this.nStartStone;
	else
	{
		var node = this.getLastShowNode();
		
		//마지막 보여지는 돌의 반대 돌로
		if(node) this.nCurTurnStone = (node.chKind^1);
		
		//아무것도 안 보여지고 있으면 첫번째 돌로.
		else this.nCurTurnStone = this.getCurNodeList()[0].chKind;
	}

};




/**
 * 바둑판 자르기 관련 정보 
 * @param BDK_PT
 * @param BDK_PT
 */
bs.BdkContent.prototype.setCutBoardInfo = function(bdkPt1, bdkPt2)
{
	this.mCutRt.setRect(bdkPt1.nX, bdkPt1.nY, bdkPt2.nX, bdkPt2.nY);

	this.mCutGapRt.setRect(this.mCutRt.left, this.mCutRt.top, 
			this.mBoardLine-1-this.mCutRt.right, this.mBoardLine-1-this.mCutRt.bottom);
			
	this.mLineX = this.mCutRt.right - this.mCutRt.left + 1;
	this.mLineY = this.mCutRt.bottom - this.mCutRt.top + 1;
};

bs.BdkContent.prototype.resetCutBoardInfo = function()
{
	this.mCutRt.setRect(0, 0, this.mBoardLine-1, this.mBoardLine-1);
	this.mCutGapRt.setEmpty();
	this.mLineX = this.mBoardLine;
	this.mLineY = this.mBoardLine;
};

/**
 * 바둑판이 잘려져 있는지 
 */
bs.BdkContent.prototype.isBoardCut = function() { return !this.mCutGapRt.isRectEmpty(); };


/**
 * @param {BdkContent}
 */
bs.BdkContent.prototype.copyCutBoardInfo = function(source)
{
	this.mCutRt.copyRect(source.mCutRt);
	this.mCutGapRt.copyRect(source.mCutGapRt);
	
	this.mLineX = source.mLineX;
	this.mLineY = source.mLineY;
};
	
//바둑좌표가 컷렉트 외부에 있는지
bs.BdkContent.prototype.bdPtOutCutRt = function(nX, nY)//:Boolean
{
	return (nX<this.mCutRt.left || nX>this.mCutRt.right || nY<this.mCutRt.top || nY>this.mCutRt.bottom); 
};
				
bs.BdkContent.prototype.checkValidPlaceXY = function(nX, nY)//:Boolean
{
	if(this.mBrdChecker.isValid(nX,nY))
	{
		//여기에 빈 공백일 경우 착수 금지 자리 체크 하기
				
		return true;
	}
	
	return false;
};
		
/**
 * 착수가 유효한 자리인지 체크
 * @param {BDK_PT}
 */
bs.BdkContent.prototype.checkValidPlace = function(rPt)//:Boolean
{
	return ( rPt.isValid() && this.checkValidPlaceXY(rPt.nX,rPt.nY) );
};

/**
 * 수순을 통해 특정 돌을 찾는다. 없으면 null 
 * @return {NodeData}
 */
bs.BdkContent.prototype.findStoneByOrder =  function(nOrder)
{
	var nodeList = this.getCurNodeList(), 
		len = nodeList.length;
		
	for(var i=0; i<len; i++)
	{
		if(nodeList[i].nOrder==nOrder)
			return nodeList[i];
	}

	return null;
	
};

/**
 * 위치를 통해 특정 돌을 찾는다. 그 위치에 돌이 없으면 null
 * @return {NodeData} 
 */
bs.BdkContent.prototype.findStoneByXY = function(nX, nY) 
{ 
	return this.mBrdChecker.getNodeData(nX, nY); 
};

/**
 * @param {BDK_PT} bdkPt
 * @return {NodeData} 
 */
bs.BdkContent.prototype.findStoneByPt = function(bdkPt) 
{ 
	if(bdkPt.isValid()) return this.mBrdChecker.getNodeData(bdkPt.nX, bdkPt.nY);
	else return null;
};
		
		
		
/**
 * 잡힌돌이 있으면 TRUE, 없으면 FALSE
 * 이 함수를 호출하기 전에 rNewData 데이터에 대한 setValue가 호출되어져야 한다.
 *
 * @param {NodeData}
 */
bs.BdkContent.prototype.deadStoneCheck = function(rNewData, noAddDeadCount)
{
	//잡힌돌이 있는지 체크한다.
	this.mBrdChecker.checkDeadStone(rNewData.nX, rNewData.nY, rNewData.chKind, rNewData.deadStones);
	if(rNewData.deadStones.length==0) return false;
	
	//if(rNewData.chKind==bs.BLACK) console.log('흑(' + rNewData.nOrder + ') : ' + rNewData.deadStones.length);
	//else console.log('백(' + rNewData.nOrder + ') : ' + rNewData.deadStones.length);

	this.deadStoneShowHide(rNewData, false, noAddDeadCount);

	return true;
};


// 잡은 돌을 보여주거나 숨긴다. 
// noAddDeadCount 가 true 이면 사석을 카운트 하지 않는다.
bs.BdkContent.prototype.deadStoneShowHide = function(node, isShow, noAddDeadCount)
{
    //rData.isDeadShowing==bShow : 사석을 숨겼는데 다시 숨기는 경우
    //--> 이미 숨겨져 있는 사석이지만 
    //보이지 않는 곳의 돌이 삭제(ex, RemoveNodeDataToEnd, EraseCutOutStones)되면서 다시 이 함수가 다시 호출될 수 있다.
    if(node.deadStones.length==0 || node.isMyDeadShowing==isShow) return;

    node.isMyDeadShowing = isShow;
	
	var nAdd = isShow ? -1 : 1,
		len = node.deadStones.length, dNode = null;
	
	for(var i=0; i<len; i++)
	{
		dNode = node.deadStones[i];

		dNode.isShow = isShow;
		
		//죽은 돌을 사석으로 카운트 한다.
		if(!noAddDeadCount && !this.mDomChecker.isDeadCheck(dNode.nX, dNode.nY)) 
			this.mDomChecker.addDeadStoneCount(node.chKind, nAdd);

		if(isShow) this.mBrdChecker.setValue(dNode.nX, dNode.nY, dNode);
		else this.mBrdChecker.setValue(dNode.nX, dNode.nY, null);
	}
};

/**
 * Owner 돌의 소유돌들을 보이거나 숨기거나 삭제한다. STONE_STATE (0:hide, 1:show, -1:delete)
 * @param {NodeData} owner
 * @param {Integer} state
 * @return {Boolean} 
 */
bs.BdkContent.prototype.belongedStoneManage = function(owner, state)
{
    //var bRet = false;

    var markList = this.mMarkManage.getAllMarkList();
    for(var j=0; j<bs.MARK_SIZE; ++j)
        //bRet |= this.ownerStoneCheck(markList[j], owner, true, state);
		this.ownerStoneCheck(markList[j], owner, true, state);

    //return bRet;
};

/**
 * 리스트의 nOwnerStone 번호와 실제 pOwner 수순을 비교해서 관련작업을 한다.
   BOOL bMark 는 리스트가 마크인지 기본돌인지 , STONE_STATE (0:hide, 1:show, -1:delete)
 * @param {Array} list
 * @param {NodeData} owner
 * @param {Boolean} bMark
 * @param {Integer} state 
 */
bs.BdkContent.prototype.ownerStoneCheck = function(list, owner, bMark, state)
{
    //var bRet = false;
    var bShow = state;

    //state은 owner 의 상태
    //-1이면 지우는 경우, 0 은 숨김, 1은 보여짐
    if(state==bs.STATE_DELETE) bShow = false;

    var node, j = 0;

    while(j<list.length)
    {
        node = list[j];
        
        //소유돌이 새로 추가되는 경우나 지워지는 경우
        //추가되는 경우는 이전 돌이 소유한 마크를 지우고
        //지워지는 경우는 이전 돌이 소유한 마크를 보여준다.
        if(node.nOwnerStone==owner.nOrder) node.isShow = bShow;
        else if(node.nOwnerStone==owner.nOrder-1) node.isShow = !bShow;

        //MARKON_VALUE(-2) : 특정 소유자돌이 있는 것이 아니고 항상 유지되는 마크
        else //if(node.nOwnerStone==bs.MARKON_VALUE) 
        {
            j++;
            continue;
        }

        //한글,영문 등 마크
        if(bMark)
        {
            //마크 셋팅 및 제거
            if(node.isShow) this.mMarkManage.setMarkArray(node.nX, node.nY, node);
            else this.mMarkManage.setMarkArray(node.nX, node.nY, null);
        }

        //소유돌이 삭제되므로 자신도 리스트에서 삭제한다.
        //자신의 소유돌이 삭제되는 경우만, 이전돌의 마크를 숨기고 보여주는 경우는 제외하기 위해 비교
        if(state==bs.STATE_DELETE && node.nOwnerStone==owner.nOrder) 
            list.splice(j,1);//원소가 삭제되므로 j 값을 증가시키지 않는다.
        else j++;

        //bRet = true;
    }

    //return bRet;
};

/**
 * 하나의 돌이 보여지거나 숨겨지거나 삭제될 때의 처리 STONE_STATE (0:hide, 1:show, -1:delete)
 * @param {NodeData} node
 * @param {Integer} state
 * @return {void} boolean 에서 void 로 변경
 */
bs.BdkContent.prototype.whenStoneShowHide = function(node, state)
{
    //var bRelatedExist = false;
    var bShow = state;

    //지우는 상태면 숨기는 처리를 한다.
    if(state==bs.STATE_DELETE) bShow = false;

	//돌을 다시 보여줄 경우
    if(bShow) 
	{
		this.mBrdChecker.setValue(node.nX, node.nY, node);
		
		//매번 사석 체크를 다시 한다.
		this.deadStoneCheck(node);
	}
	
	//돌이 숨겨질 경우
    else 
    {
        //자신이 그 자리에 셋팅되어져 있는 경우만...
        if(this.mBrdChecker.getNodeData(node.nX, node.nY)===node)
            this.mBrdChecker.setValue(node.nX, node.nY, null);
			
		if(node.deadStones.length>0)
		{
			this.deadStoneShowHide(node, true);
			//bRelatedExist = true;
		}
    }
	
	//삭제 액션인 경우는 턴을 변경하지 않는다.
	//특정 위치에서 호출해 준다.
	if(state!=bs.STATE_DELETE) this.switchTurnStone();
	

    //bRelatedExist |= this.belongedStoneManage(node, state);
	this.belongedStoneManage(node, state);

    //return bRelatedExist;
};

//하나의 노드가 지워질때 처리해야 할 것들
bs.BdkContent.prototype.whenNodeDataDelete = function(node)
{
    if(node===this.mCurFocusData)
        this.mCurFocusData = null;

    if(node.hasChildContent()) node.disconnectWithChild(this);

    //return this.whenStoneShowHide(node, bs.STATE_DELETE);
	this.whenStoneShowHide(node, bs.STATE_DELETE);
};

//특정위치부터 데이터의 끝까지 지우는 함수
bs.BdkContent.prototype.removeNodeDataToEnd = function(startPos)
{
    if(this.isNodeLast()) return;
	
	var nodeList = this.getCurNodeList();

    for(var i=startPos; i<nodeList.length; i++)
        this.whenNodeDataDelete(nodeList[i]);

    nodeList.splice(startPos, nodeList.length-startPos);

    this.setLastShowPosEnd();
};

	
//수순과 관계없는 기본돌 삭제
bs.BdkContent.prototype.removeNoOrderData = function(nX, nY)
{
    var node;
    for(var i=0; i<this.mNoOrderList.length; i++)
    {
        node = this.mNoOrderList[i];
        if(node.nX==nX && node.nY==nY) 
        {
            //돌따내기 등의 알고리즘을 위해 배열에 셋팅
            this.mBrdChecker.setValue(nX, nY, null);
            this.mNoOrderList.splice(i, 1);
            return true;
        }
    }

    return false;
};

//curNodeList 원소만 모두 해제함, 연관된 정보는 지우지 않음.
//즉, 전체 보드를 초기화하려는 곳에서 사용된다.
bs.BdkContent.prototype.removeAllNodeData = function()
{
	this.getCurNodeList().clear();	//clear all
};


//바둑 관련 데이터를 전부 초기화하는 함수.
bs.BdkContent.prototype.clearAllData = function()
{
	this.getDefNodeList().clear();
	this.mNoOrderList.clear();
	this.mMarkManage.clearManage();
	this.mBrdChecker.resetChecker();
	this.mDomChecker.resetChecker();
	
	this.mCurFocusData = null;

	this.mExplain = "";
	this.mVNodeData.removeAllExtLists();

	//this.curNodeList 가 초기화됨. SetShowPosEnd 호출됨.
	this.setCurNodeList(null, bs.MOVE_LAST);
};


//파람으로 넘어온 컨텐츠 항목을 복사한다. nType:기본돌로 복사할 지.
//toNode가 참이면 거기까지만 복사 거짓이면 lastStone 까지 복사
bs.BdkContent.prototype.copyContentData = function(source, toNode, nType, bContentExpCopy, bMarkCopy, bStoneExpCopy)
{
    if(this.mBoardLine!=source.mBoardLine) return;

    //정보 초기화
	this.clearAllData();
	
    //복사 시작
	this.setStartStone(source.getStartStone());
	
    var i, length, srcNode, copyNode;

    //수순과 관계없는 기본돌 복사
    length = source.mNoOrderList.length;
    for(i=0; i<length; i++)
    {
    	srcNode = source.mNoOrderList[i];
    	
        //참고도는 수순데이터를 기본돌들로 변경하여 복사하기 때문에
        //보이지 않는 돌들은 복사하지 않는다.
        if(nType==bs.REFER_CON && !srcNode.isShow) continue;

		copyNode = new bs.NodeData();
		copyNode.copy(srcNode);
        
        copyNode.isShow = true;

        this.mNoOrderList.push(copyNode);
        this.mBrdChecker.setValue(copyNode.nX, copyNode.nY, copyNode );
    }

    if(bMarkCopy)
    {
        //마크 복사.
        this.mMarkManage.copy(source.mMarkManage);
    }

    //데이터리스트 복사
    switch(nType)
    {
        //변화도
        case bs.CHANGE_CON:
        {
			this.copyNodeListByChange(source.getDefNodeList(), toNode, bMarkCopy, bStoneExpCopy);

            if(bContentExpCopy) this.mExplain = source.mExplain;

            this.resetStartInfo();
        }
        break;

        //참고도
        case bs.REFER_CON:
        {
			//데이터가 없을 경우 다음 SetStartStone() 줄에서 기본 시작돌이 바뀌므로
			this.switchTurnStone();

			this.copyNodeListByRefer(source.getDefNodeList(), toNode);

			this.setStartStone(this.nCurTurnStone^1);
        }
        break;
    }
	
};


bs.BdkContent.prototype.copyNodeListByChange = function(nodeList, toNode, bMarkCopy, bStoneExpCopy)
{
	var defNodeList = this.getDefNodeList(), len = nodeList.getShowPos() + 1, srcNode, copyNode, i;

	for(i=0; i<len; i++)
	{
		srcNode = nodeList[i];

		copyNode = new bs.NodeData();
		copyNode.chKind = srcNode.chKind;
		copyNode.nX = srcNode.nX;
		copyNode.nY = srcNode.nY;
		copyNode.nOrder = srcNode.nOrder;

		if(bStoneExpCopy) copyNode.mExplain = srcNode.mExplain;

		//자신의 소유돌 보이거나 숨기기
		if(bMarkCopy)
			this.belongedStoneManage(copyNode, bs.STATE_SHOW);

		defNodeList.push(copyNode);
		
		this.mBrdChecker.setValue(copyNode.nX, copyNode.nY, copyNode);
		
		this.deadStoneCheck(copyNode);

		if(toNode===srcNode) break;
		
		//확장기보 관련
		if(!srcNode.isExtListEmpty())
		{
			var selList = srcNode.getSelExtList();
			if(selList) 
			{
				this.copyNodeListByChange(selList, toNode, bMarkCopy, bStoneExpCopy);
				break;
			}
		}
	}
	
};

bs.BdkContent.prototype.copyNodeListByRefer = function(nodeList, toNode)
{
	var len = nodeList.getShowPos() + 1, srcNode, copyNode, i,
		noList = this.mNoOrderList;
        	
	for(i=0; i<len; i++)
	{
		srcNode = nodeList[i];

		//참고도는 수순데이터를 기본돌들로 변경하여 복사하기 때문에
		//보이지 않는 돌들은 복사하지 않는다.
		if(!srcNode.isShow) continue;

		copyNode = new bs.NodeData();
		copyNode.chKind = srcNode.chKind;
		copyNode.nX = srcNode.nX;
		copyNode.nY = srcNode.nY;
		
		//오류 코드, 이렇게 하면 안됨 -> copyNode.nOrder = bs.NO_ORDER + this.mNoOrderList.length;
		if(noList.isEmpty()) copyNode.nOrder = bs.NO_ORDER;
		else copyNode.nOrder = noList.getLastNode().nOrder + 1;

		noList.push(copyNode);
		
		this.mBrdChecker.setValue(copyNode.nX, copyNode.nY, copyNode);
		
		this.nCurTurnStone = srcNode.chKind;

		if(toNode===srcNode) break;
		
		if(!srcNode.isExtListEmpty())
		{
			var selList = srcNode.getSelExtList();
			if(selList) 
			{
				this.copyNodeListByRefer(selList, toNode);
				break;
			}
		}
	}

};

bs.BdkContent.prototype.disconnectWithChild = function()
{
    var child;
    for(var i=0; i<this.mChildContents.length; i++)
    {
        child = this.mChildContents[i];
        child.setParentContent(null, false);
        child.setParentNodeData(null);
    }

    this.mChildContents.length = 0;
};

bs.BdkContent.prototype.disconnectWithParent = function()
{
    //연관된 부모에서 자신을 제거한다.
    var parent = this.getParentContent();
    if(parent) 
    {
        parent.removeChildContent(this);

        //연관된 부모돌에서 자신을 제거한다.
        var parentNode = this.getParentNodeData();
        if(parentNode) parentNode.removeChildContent(this);

        this.setParentContent(null, false);
    }

    return parent;
};

//자신과 연관되어 있는 부모와 자식과의 관계를 모두 끊는다.
bs.BdkContent.prototype.clearAllRelated = function()
{
	this.disconnectWithParent();
	this.disconnectWithChild();
};


bs.BdkContent.prototype.returnOri = function()
{
	switch(this.mTurnState)
	{
		case 0: return;

		case 1:
		case -3: this.turnManage(bs.LEFT); break;

		case -1:
		case 3: this.turnManage(bs.RIGHT); break;

		case -2:
		case 2:
			this.turnManage(bs.LEFT);
			this.turnManage(bs.LEFT);
		break;
	}

	this.mTurnState = 0;
};

bs.BdkContent.prototype.turnManage = function(nType)
{
	var turnFunc = null;

	switch(nType)
	{
		case bs.LEFT:
		{
			turnFunc = bs.turnLeft;
			
			this.mBrdChecker.turnLeft();
			this.mDomChecker.turnLeft();
			this.mTurnState = (this.mTurnState-1) % 4;
		}
		break;

		case bs.RIGHT: 
		{
			turnFunc = bs.turnRight;
			
			this.mBrdChecker.turnRight();
			this.mDomChecker.turnRight();
			this.mTurnState = (this.mTurnState+1) % 4;
		}
		break;

		default: return;
	}
	
	var thisObj = this;

	
	_turnHelp(this.mNoOrderList);					//수순과 상관없는 기본돌
	_turnHelp(this.getCurNodeList());				//수순관련 데이터
	if(this.mIsTryStone) _turnHelp(this.mTryList);	//놓아보기 돌


	//////////////////////////////////////////////////////////
	//	마크 
	var markList = this.mMarkManage.getAllMarkList();
    for(var i=0; i<markList.length; ++i)
		_turnHelp(markList[i]);
	
	
	function _turnHelp(list)
	{
		for(var j=0; j<list.length; ++j)
			turnFunc(list[j], thisObj.mBoardLine);
	}
	
};

bs.BdkContent.prototype.rotateManage = function()
{
	var thisObj = this;

	this.mBrdChecker.diagonalRotate();

	_rotateHelp(this.mNoOrderList);					//수순과 상관없는 기본돌
	_rotateHelp(this.getCurNodeList());				//수순관련 데이터
	if(this.mIsTryStone) _rotateHelp(this.mTryList);	//놓아보기 돌
		
	function _rotateHelp(list)
	{
		for(var i=0; i<list.length; ++i)
			bs.diagonalRotate(list[i], thisObj.mBoardLine);
	}

};

bs.BdkContent.prototype.swapStoneKind = function()
{
	this.mBrdChecker.swapStoneKind();
	//this.mDomChecker.swapStoneKind();

	_swapHelp(this.mNoOrderList);					//수순과 상관없는 기본돌
	_swapHelp(this.getCurNodeList());				//수순관련 데이터
	if(this.mIsTryStone) _swapHelp(this.mTryList);	//놓아보기 돌
	
	function _swapHelp(list)
	{
		for(var i=0; i<list.length; ++i)
			list[i].chKind ^= 1;
	}

};
