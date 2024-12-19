




//----------------------------
//about domain (per)

//가장 가까운 거리에서의 완전한 에너지는 _1(100) 이다.
//거리가 두배로 멀어지면 에너지는 절반이 감소한다. -> _2(100)
//_1 에 대한 대각 길이 공식에 의한 대각선 길이. 그 길이 만큼 멀어져 감소된 값, R2(71)
//나머지 모든 값들 역시 이와 같은 공식에 기반하여 계산된 값들임.
	
bs._1 	= 100;
bs._2 	= 50;
bs._3 	= 33;

//거리에 반비례 , R2 는 루트2, R5 루트5 라는 의미, 삼각함수로 대각선 길이를 구함

bs.R2 	= 71; 	// (1/1.414 * 100) = 70.72		
bs._2R2	= 35;	// (1/2.828 * 100) = 35.36 
bs._3R2	= 24;	// (1/4.242 * 100) = 23.57
	
bs.R5	= 45;	// (1/2.236 * 100) = 44.72
bs.R10	= 32;	// (1/3.162 * 100) = 31.62
bs.R13	= 28;	// (1/3.605 * 100) = 27.73




// 7 x 7
bs.EnergyData = 
[
	[ bs._3R2,	bs.R13,		bs.R10,	bs._3,	bs.R10,	bs.R13,		bs._3R2 ],
	[ bs.R13,	bs._2R2,	bs.R5,	bs._2,	bs.R5,	bs._2R2,	bs.R13  ],
	[ bs.R10,	bs.R5,		bs.R2,	bs._1,	bs.R2,	bs.R5,		bs.R10  ],
	[ bs._3,	bs._2,		bs._1,	0,		bs._1,	bs._2,		bs._3   ],
	[ bs.R10,	bs.R5,		bs.R2,	bs._1,	bs.R2,	bs.R5,		bs.R10  ],
	[ bs.R13,	bs._2R2,	bs.R5,	bs._2,	bs.R5,	bs._2R2,	bs.R13  ],
	[ bs._3R2,	bs.R13,		bs.R10,	bs._3,	bs.R10,	bs.R13,		bs._3R2 ]
];



// 7 x 7 x 2
/*
bs.EnergyLoc = 
[
	[ [-3,-3], [-2,-3], [-1,-3], [0,-3], [1,-3], [2,-3], [3,-3] ],
	[ [-3,-2], [-2,-2], [-1,-2], [0,-2], [1,-2], [2,-2], [3,-2] ],
	[ [-3,-1], [-2,-1], [-1,-1], [0,-1], [1,-1], [2,-1], [3,-1] ],
	[ [-3,0],  [-2,0],  [-1,0],  [0,0],  [1,0],  [2,0],  [3,0] ],
	[ [-3,1],  [-2,1],  [-1,1],  [0,1],  [1,1],  [2,1],  [3,1] ],
	[ [-3,2],  [-2,2],  [-1,2],  [0,2],  [1,2],  [2,2],  [3,2] ],
	[ [-3,3],  [-2,3],  [-1,3],  [0,3],  [1,3],  [2,3],  [3,3] ]
];
*/
/*
bs.EnergyLoc = 
[
	[ null,    null, 	[-1,-3], [0,-3], [1,-3], null,   null ],
	[ null,    [-2,-2], [-1,-2], [0,-2], [1,-2], [2,-2], null ],
	[ [-3,-1], [-2,-1], [-1,-1], [0,-1], [1,-1], [2,-1], [3,-1] ],
	[ [-3,0],  [-2,0],  [-1,0],  [0,0],  [1,0],  [2,0],  [3,0] ],
	[ [-3,1],  [-2,1],  [-1,1],  [0,1],  [1,1],  [2,1],  [3,1] ],
	[ null,    [-2,2],  [-1,2],  [0,2],  [1,2],  [2,2],  null ],
	[ null,    null,  	[-1,3],  [0,3],  [1,3],  null,   null ]
];
*/

bs.EnergyLoc = 
[
	[ null,    null, 	null,    [0,-3], null,   null,   null ],
	[ null,    [-2,-2], [-1,-2], [0,-2], [1,-2], [2,-2], null ],
	[ null,    [-2,-1], [-1,-1], [0,-1], [1,-1], [2,-1], null ],
	[ [-3,0],  [-2,0],  [-1,0],  [0,0],  [1,0],  [2,0],  [3,0] ],
	[ null,    [-2,1],  [-1,1],  [0,1],  [1,1],  [2,1],  null ],
	[ null,    [-2,2],  [-1,2],  [0,2],  [1,2],  [2,2],  null ],
	[ null,    null,  	null,    [0,3],  null,   null,   null ]
];


//--------------------------------------------------------------------
//	class DomainChecker


//asoo test
//여기에 CDomainChangeListener 인터페이스 만들어서 수신하도록 하기



bs.DomainChecker = function(content)
{
	//자리 체크나 돌 따내기 처리를 위한 체커
	this.mBrdChecker = null;
	//자신의 컨텐트
	this.mContent = content;

	//사석 체크 정보 저장
	this.mDeadChecks = null;
	//차지한 영역정보
	this.mDomains = null;

	//턴작업을 위한 템프 배열
	this.mDeadTemp = null;
	this.mDomainTemp = null;
	
	this.mCheck = null;	//체크가 이미 되었는지를 구별하기 위한 배열


	//영역의 토탈 합(흑,백 포함)
	this.mTotalCount = new bs.StoneCount();
	//사석의 합(흑,백 포함)
	this.mDeadCheckCount = new bs.StoneCount();
	this.mDeadStoneCount = new bs.StoneCount();
	
	this.lastCountInfo = 
	[
		{ showCount:0, deadCount:0, totalCount:0, gapCount:0 },
		{ showCount:0, deadCount:0, totalCount:0, gapCount:0 }
	];
};

//바둑판 줄 수 관련 메모리를 생성한다.
bs.DomainChecker.prototype.createBoardLine = function()
{
	this.mDeadChecks = bs.allocArray2(this.mContent.mBoardLine);
	this.mDomains = bs.allocArray2(this.mContent.mBoardLine, function() { return new bs.DomainCount(); });
	this.mDeadTemp = bs.allocArray2(this.mContent.mBoardLine);
	this.mDomainTemp = bs.allocArray2(this.mContent.mBoardLine, function() { return new bs.DomainCount(); });
	this.mCheck = bs.allocArray2(this.mContent.mBoardLine);

	this.resetChecker();
};

bs.DomainChecker.prototype.destroyBoardLine = function()
{
	bs.freeArray2(this.mDeadChecks, this.mContent.mBoardLine);
	bs.freeArray2(this.mDomains, this.mContent.mBoardLine);
	bs.freeArray2(this.mDeadTemp, this.mContent.mBoardLine);
	bs.freeArray2(this.mDomainTemp, this.mContent.mBoardLine);
	bs.freeArray2(this.mCheck, this.mContent.mBoardLine);

	this.mDeadChecks = null;
	this.mDomains = null;
	this.mDeadTemp = null;
	this.mDomainTemp = null;
	this.mCheck = null;
};

bs.DomainChecker.prototype.setBoardChecker = function(brdChecker) { this.mBrdChecker = brdChecker; };
bs.DomainChecker.prototype.getTotalCount = function() { return this.mTotalCount; };
bs.DomainChecker.prototype.getDeadCheckCount = function() { return this.mDeadCheckCount; };	//사석체크한 개수
bs.DomainChecker.prototype.getDeadStoneCount = function() { return this.mDeadStoneCount; };	//실제로 따먹힌 돌 개수


bs.DomainChecker.prototype.resetChecker = function()
{
	this.mTotalCount.setCount(0, 0);
	this.mDeadCheckCount.setCount(0, 0);
	this.mDeadStoneCount.setCount(0, 0);
	
	var boardLine = this.mContent.mBoardLine;

	bs.setArray2(this.mDeadChecks, this.mContent.mBoardLine, null);
	bs.setArray2(this.mDomains, this.mContent.mBoardLine, function(obj, nX, nY) 
	{
		obj.reset(nX, nY, boardLine);
	});
	
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);
};

//체크한 사석들을 원상복귀한다.

bs.DomainChecker.prototype.initDeadChecks = function()
{
	var node, nX, nY;
	for(nY=0; nY<this.mContent.mBoardLine; ++nY)
	{
		for(nX=0; nX<this.mContent.mBoardLine; ++nX)
		{
			node = this.mDeadChecks[nX][nY];
			if(node!=null)
			{
				this.setDeadCheck(nX, nY, node, false);
			}
		}
	}

};

//현 위치의 집영역을 리턴한다.
bs.DomainChecker.prototype.whichDomain = function(nX, nY)
{
	return this.mDomains[nX][nY].getDomain();
};


//돌이 바둑판의 어느 방면에 놓여져 있는지
/*
DWORD CDomainChecker::StoneIsWhere(BYTE byX,BYTE byY)
{
	DWORD dwDir = CENTER;

	if(byX<4) dwDir |= LEFT;
	if(byY<4) dwDir |= TOP;
	if(byX>m_pContent->m_nBoardLine-5) dwDir |= RIGHT;
	if(byY>m_pContent->m_nBoardLine-5) dwDir |= BOTTOM;

	return dwDir;
}
*/


bs.DomainChecker.prototype.getDomainCountObj = function(nX, nY)
{
	return this.mDomains[nX][nY];
};


//특정 위치의 node 에 관련된 도메인 영역을 셋팅한다.
bs.DomainChecker.prototype.setDomainCount = function(nX, nY, node, isAdd)
{
	var dx, dy, i, j;//, nAdd = isAdd ? 1 : -1;
	var locVal = null;

	for(i=0; i<7; ++i)
	{
		for(j=0; j<7; ++j)
		{
			locVal = bs.EnergyLoc[i][j];
			
			if(!locVal) continue;
			
			dx = nX + locVal[0];
			dy = nY + locVal[1];
			
			if(dx<0 || dy<0 || dx>this.mContent.mBoardLine-1 || dy>this.mContent.mBoardLine-1) continue;

			//this.mDomains[dx][dy].mCount[nValue] += (bs.EnergyData[i][j]*nAdd);
			this.mDomains[dx][dy].setValue(node, bs.EnergyData[i][j], isAdd);
		}
	}
};

/*	asoocool test
bs.DomainChecker.prototype.getNodeDomains = function(node)
{
	var dx, dy, i, j, locVal = null, nWhich, retArr = [];

	for(i=0; i<7; ++i)
	{
		for(j=0; j<7; ++j)
		{
			locVal = bs.EnergyLoc[i][j];
			
			if(!locVal) continue;
			
			dx = node.nX + locVal[0];
			dy = node.nY + locVal[1];
			
			if(dx<0 || dy<0 || dx>this.mContent.mBoardLine-1 || dy>this.mContent.mBoardLine-1) continue;
			
			nWhich = this.whichDomain(dx, dy);
			
			if(nWhich==node.chKind) retArr.push(new bs.BDK_PT(dx, dy));
		}
	}
	
	return retArr;
};
*/

bs.DomainChecker.prototype.addDeadStoneCount = function(nOwnerKind, nAdd) 
{
	if(nOwnerKind==bs.BLACK) this.mDeadStoneCount.nWhite += nAdd;
	else if(nOwnerKind==bs.WHITE) this.mDeadStoneCount.nBlack += nAdd;
};

//nAdd값이 음수면 값을 뺀다. 내부적으로만 쓰임
bs.DomainChecker.prototype._addDeadTotal = function(nOwnerKind, nAdd) 
{
	if(nOwnerKind==bs.BLACK) this.mDeadCheckCount.nWhite += nAdd;
	else if(nOwnerKind==bs.WHITE) this.mDeadCheckCount.nBlack += nAdd;
};

//사석 체크 정보를 셋팅하거나 제거한다.
bs.DomainChecker.prototype.setDeadCheck = function(nX, nY, node, isAdd)
{
	if(isAdd) 
	{
		this.mDeadChecks[nX][nY] = node;
		this._addDeadTotal(node.chKind^1, 1);
	}
	else 
	{
		this.mDeadChecks[nX][nY] = null;
		this._addDeadTotal(node.chKind^1, -1);
	}

	this.setDomainCount(nX, nY, node, !isAdd);
};

bs.DomainChecker.prototype.isDeadCheck = function(nX, nY) { return (this.mDeadChecks[nX][nY]!=null); };
bs.DomainChecker.prototype.getDeadKind = function(nX, nY) { return this.mDeadChecks[nX][nY].chKind; };
bs.DomainChecker.prototype.getDeadNode = function(nX, nY) { return this.mDeadChecks[nX][nY]; };


bs.DomainChecker.prototype.turnLeft = function()
{
	var nX, nY;
	
	for(nY=0; nY<this.mContent.mBoardLine; ++nY)
	{
		for(nX=0; nX<this.mContent.mBoardLine; ++nX)
		{
			this.mDeadTemp[nY][(this.mContent.mBoardLine-1) - nX] = this.mDeadChecks[nX][nY];
			this.mDomainTemp[nY][(this.mContent.mBoardLine-1) - nX] = this.mDomains[nX][nY];
		}
	}
	
	bs.cpyArray2(this.mDeadChecks, this.mDeadTemp, this.mContent.mBoardLine);
	bs.cpyArray2(this.mDomains, this.mDomainTemp, this.mContent.mBoardLine);
};

bs.DomainChecker.prototype.turnRight = function()
{
	var nX, nY;
	for(nY=0; nY<this.mContent.mBoardLine; ++nY)
	{
		for(nX=0; nX<this.mContent.mBoardLine; ++nX)
		{
			this.mDeadTemp[(this.mContent.mBoardLine-1) - nY][nX] = this.mDeadChecks[nX][nY];
			this.mDomainTemp[(this.mContent.mBoardLine-1) - nY][nX] = this.mDomains[nX][nY];
		}
	}

	bs.cpyArray2(this.mDeadChecks, this.mDeadTemp, this.mContent.mBoardLine);
	bs.cpyArray2(this.mDomains, this.mDomainTemp, this.mContent.mBoardLine);
};


//---------------------------------------------------------------------------------------------------------------

//집영역을 갱신한다.
bs.DomainChecker.prototype.updateDomain = function()
{
	this.applyCountToDomain();

	//
	//다음과 같은 순서를 유지해야 한다.
	//옥집 체크를 한 후 checkLeakDomain 을 호출하면 다시 채워지기 때문
	
	//asoocool test
	
	//집 영역으로 셋팅되어져야 하는데 누락된 경우 추가
	this.checkLeakDomain();

	//진짜집이 아닌데 집으로 셋팅된 경우 제거
	this.clearFalseDomain();
};

bs.DomainChecker.prototype.countTotalDomain = function()
{
	this.mTotalCount.nBlack = 0;
	this.mTotalCount.nWhite = 0;
	
	var nY, nX, nWhich;
	for(nY=0; nY<this.mContent.mBoardLine; nY++)
	{
		for(nX=0; nX<this.mContent.mBoardLine; nX++)
		{
			nWhich = this.mDomains[nX][nY].getDomain();
			
			if(nWhich==bs.BLACK) this.mTotalCount.nBlack++;
			else if(nWhich==bs.WHITE) this.mTotalCount.nWhite++;
		}
	}
	
};

bs.DomainChecker.prototype.getLastCountInfo = function()
{
	return this.lastCountInfo;
};

/*
bs.DomainChecker.prototype.setLastCountInfo = function(info)
{
	this.lastCountInfo = info;
};
*/

bs.DomainChecker.prototype.updateCountInfo = function()
{
	this.countTotalDomain();
	
	var retVal = [ {}, {} ];
	
	retVal[0].showCount = this.mTotalCount.nBlack;										//사석을 제외한 반상에 보여지고 있는 집의 개수
	retVal[0].deadCount = this.mDeadCheckCount.nBlack + this.mDeadStoneCount.nBlack;	//흑돌의 사석 개수
	retVal[0].totalCount = retVal[0].showCount - retVal[0].deadCount;					//전체 흑집의 개수
	
	retVal[1].showCount = this.mTotalCount.nWhite;
	retVal[1].deadCount = this.mDeadCheckCount.nWhite + this.mDeadStoneCount.nWhite;
	retVal[1].totalCount = retVal[1].showCount - retVal[1].deadCount;

	retVal[0].gapCount = retVal[0].totalCount - retVal[1].totalCount;			//흑집에서 백집을 뺀 집 차이
	retVal[1].gapCount = retVal[1].totalCount - retVal[0].totalCount;
	
	this.lastCountInfo = retVal;
	
	return retVal;
};

//도메인 카운트의 임계점을 기준으로 집이 될지 말지 결정한다.
bs.DomainChecker.prototype.applyCountToDomain = function()
{
	var nX, nY, nWhich;
	for(nY=0; nY<this.mContent.mBoardLine; nY++)
	{
		for(nX=0; nX<this.mContent.mBoardLine; nX++)
			this._selectDomainCount(nX, nY);
	}
};

bs.DomainChecker.prototype._selectDomainCount = function(nX, nY)
{
	var nRet = bs.EMPTY, domain = this.mDomains[nX][nY],
		nCount = domain.getCount();
	
	//옥집 정보 초기화
	domain.setFalseDomainType(0);


	//놓여져 있는 돌이 사석이 아니고 살아 있는 돌이면 도메인으로 체크하지 않는다.
	//단순히 EMPTY와 구분하기 위해 SWITCH로 리턴
	if(!this.mBrdChecker.isValid(nX, nY) && !this.isDeadCheck(nX, nY)) 		// -->> isDeadCheck 가 이 시점에 의미있는지 확인해 보기
	{
		domain.setDomain(bs.SWITCH);
		return;
	}

/*		
bs._1 	= 100;
bs._2 	= 50;
bs._3 	= 33;

bs.R2 	= 71; 	// (1/1.414 * 100) = 70.72		
bs._2R2 = 35;	// (1/2.828 * 100) = 35.36 
bs._3R2	= 24;	// (1/4.242 * 100) = 23.57
	
bs.R5	= 45;	// (1/2.236 * 100) = 44.72
bs.R10	= 32;	// (1/3.162 * 100) = 31.62
bs.R13	= 28;	// (1/3.605 * 100) = 27.73
*/		
	
	//var oneVal = 40, twoVal = 60, threeVal = 80;
	//var oneVal = 33, twoVal = 45, threeVal = 71;
	var oneVal = 35, twoVal = 45, threeVal = 71;
	//var oneVal = bs._3, twoVal = bs.R5, threeVal = bs.R2;

	//1선 체크
	if(nX==0 || nY==0 || nX==this.mContent.mBoardLine-1 || nY==this.mContent.mBoardLine-1) 
	{
		//백영역
		if(nCount<=-oneVal) nRet = bs.WHITE;
		//흑영역
		else if(nCount>=oneVal) nRet = bs.BLACK;
	}
	
	//2선 체크
	else if(nX==1 || nY==1 || nX==this.mContent.mBoardLine-2 || nY==this.mContent.mBoardLine-2) 
	{
		if(nCount<=-twoVal) nRet = bs.WHITE;
		else if(nCount>=twoVal) nRet = bs.BLACK;
	}

	//3선 체크
	else if(nX==2 || nY==2 || nX==this.mContent.mBoardLine-3 || nY==this.mContent.mBoardLine-3) 
	{
		if(nCount<=-threeVal) nRet = bs.WHITE;
		else if(nCount>=threeVal) nRet = bs.BLACK;
	}

	else
	{
		if(nCount<=-bs._1) nRet = bs.WHITE;
		else if(nCount>=bs._1) nRet = bs.BLACK;
	}

	

//	if(nCount<=-bs._2) nRet = bs.WHITE;
//	else if(nCount>=bs._2) nRet = bs.BLACK;

/*
   	//백영역
	if(nCount<0) nRet = bs.WHITE;
	//흑영역
	else if(nCount>0) nRet = bs.BLACK;
*/

	//서로 집이 될 수 없는 공배의 자리에 도메인이 있으면 제거
	
	//asoocool test
	//if(nRet!=bs.EMPTY && this.isNoDomainPlace(nX, nY, nRet)) nRet = bs.EMPTY;
	
	domain.setDomain(nRet);
	
	//return nRet;
};

//서로 집이 될 수 없는 공배인지 체크한다. 공배면 TRUE
bs.DomainChecker.prototype.isNoDomainPlace = function(nX, nY, nValue)
{
	var dX, dY, node, i;

	for(i=0; i<4; ++i)
	{
		dX = nX + bs.RoundLoc[i][0];
		dY = nY + bs.RoundLoc[i][1];
		
		if(dX<0 || dY<0 || dX>this.mContent.mBoardLine-1 || dY>this.mContent.mBoardLine-1) continue;

		node = this.mBrdChecker.getNodeData(dX, dY);
		if(node && node.chKind!=nValue && !this.isDeadCheck(dX, dY)) return true;
	}

	return false;
};


//놓여진 위치의 주변에 다른 편의 사석이 있는지
/*
bs.DomainChecker.prototype.isAroundEmpty = function(nX, nY, nKind)
{
	var dX, dY, nWhich, i;

	for(i=0; i<4; ++i)
	{
		dX = nX + bs.RoundLoc[i][0];
		dY = nY + bs.RoundLoc[i][1];
		
		if(dX<0 || dY<0 || dX>this.mContent.mBoardLine-1 || dY>this.mContent.mBoardLine-1) continue;
		
		nWhich = this.mDomains[dX][dY].getDomain();
		
		if(nWhich!=bs.EMPTY && nWhich!=nKind) return false;
	}

	return true;
};
*/

//옥집 제거
bs.DomainChecker.prototype.clearFalseDomain = function()
{
	var nX, nY, nWhich, i, dX, dY, node, count, domain;
	
	for(nY=0; nY<this.mContent.mBoardLine; nY++)
	{
		for(nX=0; nX<this.mContent.mBoardLine; nX++)
		{
			domain = this.mDomains[nX][nY];
			
			nWhich = domain.getDomain();
			
			if(nWhich==bs.BLACK || nWhich==bs.WHITE) 
			{
				if(domain.isOnly(nWhich)) continue;
				
				if(this.mBrdChecker.getOSC(nX, nY, nWhich)<4) domain.setFalseDomainType(1);
				else if(this.mBrdChecker.getDSC(nX, nY, nWhich)<3) domain.setFalseDomainType(2);
			}
		}
	}
	
	//일단 false domain 으로 셋팅된 모든 도메인을 제거한다.
	for(nY=0; nY<this.mContent.mBoardLine; nY++)
	{
		for(nX=0; nX<this.mContent.mBoardLine; nX++)
		{
			domain = this.mDomains[nX][nY];
			
			if(domain.getFalseDomainType()!=0) domain.setDomain(bs.EMPTY);
		}
	}
	
	//false domain 이지만 살아 있는 돌과 연결되어 있으면 복원한다.
	for(nY=0; nY<this.mContent.mBoardLine; nY++)
	{
		for(nX=0; nX<this.mContent.mBoardLine; nX++)
		{
			domain = this.mDomains[nX][nY];
			
			if(domain.getFalseDomainType()==2)
			{
				//옥집인 경우는 모든 방향으로 살아있는 돌과 연결되어 있어야만 집이된다.
				if(!this.mBrdChecker.hasUnderSiegeStone(nX, nY, domain.oldVal)) 
					domain.setDomain(domain.oldVal);
			}
		}
	}
	
};


bs.DomainChecker.prototype.getLinkedDomain = function(nX, nY, ptArr, isStoneCross)
{
	var nWhich = this.whichDomain(nX, nY);
	
	if(nWhich==bs.SWITCH) 
	{
		var node = this.mBrdChecker.getNodeData(nX, nY);
		nWhich = node.chKind;
	}
	
	
	//체크 변수 초기화
	bs.setArray2(this.mCheck, this.mContent.mBoardLine, 0);

	this._searchSameDomain(nX, nY, nWhich, ptArr, isStoneCross);
};



//연결되어 있는 같은 종류의 도메인 좌표를 얻어온다. 사석체크된 자리는 공배가 아니다.
bs.DomainChecker.prototype._searchSameDomain = function(nX, nY, chKind, ptArr, isStoneCross)
{
	var nWhich = this.whichDomain(nX, nY);

	if(!isStoneCross)
	{
		if(this.mCheck[nX][nY] || nWhich!=chKind) return;
	}
	else
	{
		if(this.mCheck[nX][nY]) return;
		
		if(nWhich==bs.SWITCH)
		{
			var node = this.mBrdChecker.getNodeData(nX, nY);
			if(node.chKind!=chKind) return;
		}
		else //if(nWhich==bs.EMPTY)
		{
			//자신과 같은 도메인이 아니더라도(공배포함) 호구이면 연결된 공간으로 봄 
			
			//두개만 있어도 연결된 것으로 본다.
			//if(this.mBrdChecker.getRSC(nX, nY, chKind, false)<2 && nWhich!=chKind) return;
			
			//asoocool test
			if(nWhich!=chKind && this.mBrdChecker.getRSC(nX, nY, chKind, true)<2) return;
			
		}
		//else if(nWhich!=chKind) return;
	}
	
	this.mCheck[nX][nY] = 1;
	
	if(nWhich==chKind) ptArr.push(new bs.BDK_PT(nX, nY));

	if(nX>0) this._searchSameDomain(nX-1, nY, chKind, ptArr, isStoneCross);
	if(nX<this.mContent.mBoardLine-1) this._searchSameDomain(nX+1, nY, chKind, ptArr, isStoneCross);
	if(nY>0) this._searchSameDomain(nX, nY-1, chKind, ptArr, isStoneCross);
	if(nY<this.mContent.mBoardLine-1) this._searchSameDomain(nX, nY+1, chKind, ptArr, isStoneCross);
	
	/*
	if(nWhich==bs.SWITCH)
	{
		var nodes = this.mBrdChecker.mNodes;
		
		if(nX>0 && nY>0 && !nodes[nX-1][nY] && !nodes[nX][nY-1]) //좌상
			this._searchSameDomain(nX-1, nY-1, chKind, ptArr, isStoneCross);

		if(nX<this.mContent.mBoardLine-1 && nY>0 && !nodes[nX+1][nY] && !nodes[nX][nY-1]) //우상
			this._searchSameDomain(nX+1, nY-1, chKind, ptArr, isStoneCross);

		if(nX>0 && nY<this.mContent.mBoardLine-1 && !nodes[nX-1][nY] && !nodes[nX][nY+1]) //좌하
			this._searchSameDomain(nX-1, nY+1, chKind, ptArr, isStoneCross);

		if(nX<this.mContent.mBoardLine-1 && nY<this.mContent.mBoardLine-1 && !nodes[nX+1][nY] && !nodes[nX][nY+1]) //우하
			this._searchSameDomain(nX+1, nY+1, chKind, ptArr, isStoneCross);
	
	}
	*/
};

//누락된 집인지 체크, 도메인이 활성화 안되어 있지만, 자신의 주변이 모두 활성화 되어 있는 도메인을 누락된 도메인으로 본다.
bs.DomainChecker.prototype.checkLeakDomain = function()
{
	var nX, nY, nWhich;
	
	for(nY=0; nY<this.mContent.mBoardLine; nY++)
	{
		for(nX=0; nX<this.mContent.mBoardLine; nX++)
		{
			nWhich = this.mDomains[nX][nY].getDomain();
			
			if(nWhich==bs.EMPTY) 
			{
				nWhich = this._searchLeakStart(nX, nY);
				
				if(nWhich!=bs.EMPTY)
				{
					var emptyPtArr = [];
					if(this.mBrdChecker.isSameDomainAround(nX, nY, (nWhich^1), emptyPtArr) && emptyPtArr.length<10)
					{
						for(var i=0; i<emptyPtArr.length; i++)
							this.mDomains[emptyPtArr[i].nX][emptyPtArr[i].nY].setDomain(nWhich);
					}
				}

			}
		}
	}
};

//---------------------------------------------------------------------

//비어있는 공간이 모두 empty 가 리턴되어 체크가 안되는 버그가 있음.


//checkLeakDomain 에서 호출
//현재 공배에서 릭 체크를 해야할 지 여부 판단 
bs.DomainChecker.prototype._searchLeakStart = function(nX, nY)
{
	var dX, dY, nEmptyNum = 0, node, nStone, nFirstKind = bs.EMPTY, i;

	for(i=0; i<4; ++i)
	{
		dX = nX + bs.RoundLoc[i][0];
		dY = nY + bs.RoundLoc[i][1];
		
		if(dX<0 || dY<0 || dX>this.mContent.mBoardLine-1 || dY>this.mContent.mBoardLine-1) continue;

		node = this.mBrdChecker.getNodeData(dX, dY);
		
		if(!node || this.isDeadCheck(dX, dY))
		{
			nStone = this.mDomains[dX][dY].getDomain();
			
			if(nStone==bs.EMPTY) 
			{
				if(++nEmptyNum==2) return bs.EMPTY;
				else nStone = nFirstKind;
			}
		}
		else nStone = node.chKind;

		if(nFirstKind==bs.EMPTY) nFirstKind = nStone;
		else if(nFirstKind!=nStone) return bs.EMPTY;
	}

	return nFirstKind;
};
