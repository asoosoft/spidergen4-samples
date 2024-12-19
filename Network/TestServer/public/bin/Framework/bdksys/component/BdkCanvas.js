/**
 * class BdkCanvas
 * 
 */  



function BdkCanvas()
{
	ACanvas.call(this);
	
	
	this.frwName = 'bdksys';
	

}
afc.extendsClass(BdkCanvas, ACanvas);



//------------------------------------------
//	static area
//------------------------------------------

BdkCanvas.CONTEXT = 
{
    tag: '<canvas data-base="BdkCanvas" data-class="BdkCanvas" class="BdkCanvas-Style"></canvas>',

    defStyle: 
    {
        width:'200px', height:'200px'
    },

    events: ['select', 'change', 'move']
};

BdkCanvas.NAME = "BdkCanvas";

BdkCanvas.sBStoneImg = new Image();
BdkCanvas.sWStoneImg = new Image();
BdkCanvas.sTileImg = new Image();
BdkCanvas.sFocusImg = new Image();
BdkCanvas.sDeadCheck = new Image();
BdkCanvas.sReferImg = new Image();
BdkCanvas.sExtMark = new Image();
BdkCanvas.sLastMarkImg1 = new Image();
BdkCanvas.sLastMarkImg2 = new Image();

BdkCanvas.sAddSnd = null;
BdkCanvas.sDeadSmallSnd = null;
BdkCanvas.sDeadManySnd = null;
BdkCanvas.sNotifySnd = null;

BdkCanvas.sImgLoadManage = function(callback)
{
	var loadCnt = 7;
	var loadFunc = function() 
	{
		loadCnt--;
		//모든 이미지 로드가 완료
		if(loadCnt==0 && callback) callback();
	};
	
	function setImgInfo(img, src)
	{
		img.onload = loadFunc;
		img.src = src;
	}
	
	setImgInfo(BdkCanvas.sBStoneImg, "Framework/bdksys/asset/images/black.png");
	setImgInfo(BdkCanvas.sWStoneImg, "Framework/bdksys/asset/images/white.png");
	setImgInfo(BdkCanvas.sTileImg, "Framework/bdksys/asset/images/board.png");
	setImgInfo(BdkCanvas.sFocusImg, "Framework/bdksys/asset/images/focus.png");
	setImgInfo(BdkCanvas.sDeadCheck, "Framework/bdksys/asset/images/deadcheck.png");
	setImgInfo(BdkCanvas.sReferImg, "Framework/bdksys/asset/images/refermark.png");
	setImgInfo(BdkCanvas.sExtMark, "Framework/bdksys/asset/images/extmark.png");
	setImgInfo(BdkCanvas.sLastMarkImg1, "Framework/bdksys/asset/images/lastmark1.png");
	setImgInfo(BdkCanvas.sLastMarkImg2, "Framework/bdksys/asset/images/lastmark2.png");
};

BdkCanvas.setSoundRes = function()
{
	/*
	BdkCanvas.sAddSnd = new Audio("Framework/bdksys/asset/sounds/addstone.mp3");
	BdkCanvas.sDeadSmallSnd = new Audio("Framework/bdksys/asset/sounds/deadstoneless.mp3");
	BdkCanvas.sDeadManySnd = new Audio("Framework/bdksys/asset/sounds/deadstonemore.mp3");
	BdkCanvas.sNotifySnd = new Audio("Framework/bdksys/asset/sounds/notify.mp3");
	*/
	
	BdkCanvas.sAddSnd = new Audio();
	BdkCanvas.sDeadSmallSnd = new Audio();
	BdkCanvas.sDeadManySnd = new Audio();
	BdkCanvas.sNotifySnd = new Audio();
	
	
	setSndInfo(BdkCanvas.sAddSnd, './Framework/bdksys/asset/sounds/addstone.mp3');


	function setSndInfo(snd, src)
	{
		snd.src = src;
	}
	
};


//------------------------------------------
//end
//------------------------------------------

//if(window._afc)
{
	BdkCanvas.sImgLoadManage();
	BdkCanvas.setSoundRes();
}



BdkCanvas.prototype.init = function(context, evtListener)
{
	ACanvas.prototype.init.call(this, context, evtListener);
	
	
	
	this.mTouchUp = 0;         //모바일에서 손가락위에 포인터가 보이도록
	
	//this.canvas = canvas;
	//this.ctx = this.canvas.getContext("2d");
	
	this.mBoardWidth = 0;					//보드의 사이즈
	this.mBoardHeight = 0;		
	this.mLineGap = 0;						//바둑 줄 간격
	this.mViewGapX = 0;
	this.mViewGapY = 0;
	//this.mCurSwitchStone = bs.BLACK;	    //스위치 모드에서 현재 놓여질 돌(흑돌,백돌)의 종류
	this.mSelectedStone = bs.SWITCH;        //선택되어진 돌의 종류(기본돌(흑돌,백돌), 스위치, 영문, 한글, 세모, 네모... )
	this.mDefaultGap = bs.DEFAULT_GAP;     //보드와 뷰와의 최소 기본 갭
	
    this.mIsValidPlace = false;
    this.mIsShowOrder = true;             //수순을 보여줄지
    this.mIsMarkOn = true;                //마크표시를 계속해서 유지할지.
	this.mIsStoneMove = false;             //바둑돌 이동 모드인지
	this.mIsEnableLButton = true;          //마우스 왼쪽 버튼의 활성화 여부

	this.mBoardRect = new bs.Rect();	//실제 바둑판이 그려진 영역
	this.mMsPtRect = new bs.Rect();     //마우스 포인트 크기 Rect
	this.mCurBdPt = new bs.BDK_PT();	//현재 위치
	this.mTempPt = new bs.BDK_PT();     //객체를 매번 생성하지 않기위한 변수
	
	this.mGuideNode = null;				//착수 확인 전 바둑 돌, bs.NodeData

	this.mContent = null;				     //현재 활성화된 BdkContent
	this.mStones = new Array(bs.STONE_NUM);  //바둑돌 이미지가 들어간다.
	this.mStones[0] = BdkCanvas.sBStoneImg;
	this.mStones[1] = BdkCanvas.sWStoneImg;
	
	this.mFontInfo = "";
	
	//스치며 터치를 놓았을 때 돌이 움직임 방지
	this.mOldTime = 0;
	this.mOldBdPt = new bs.BDK_PT();
	//---------------------------------
	
	var thisObj = this, $canvas = this.$ele;
	
	if(afc.isMobile)
	{
	    $canvas.bind('touchstart', function(e)
	    {
	    	thisObj.mOldTime = 0;
	    	
			e.preventDefault();
			e.stopPropagation();
	    	
	        var oe = e.originalEvent.changedTouches[0];
	        thisObj.mouseMoveManage(oe.clientX, oe.clientY-thisObj.mTouchUp-thisObj.getBoundRect().top);
	        
	        return false;
	    });
	    
        $canvas.bind('touchmove', function(e)
        {
			e.preventDefault();
			e.stopPropagation();
			
            var oe = e.originalEvent.changedTouches[0];
            thisObj.mouseMoveManage(oe.clientX, oe.clientY-thisObj.mTouchUp-thisObj.getBoundRect().top);
            
            thisObj.mOldTime = new Date().getTime();
            
            return false;
        });
        
        $canvas.bind('touchend', function(e)
        {
			e.preventDefault();
			e.stopPropagation();
			
			var oe = e.originalEvent.changedTouches[0];
			
			var interval = new Date().getTime() - thisObj.mOldTime;
			//바로 전 touchmove 타임과 touchend 타임이 너무 짧으면
			//이전 바둑돌 정보로 이벤트를 날려준다.
			if(interval<200) 
			{
				oe.clientX = thisObj.BDXtoX(thisObj.mOldBdPt.nX);
				oe.clientY = thisObj.BDYtoY(thisObj.mOldBdPt.nY);
				
				//bs.drawDebug(thisObj.ctx, 120, 20, "in = "+oe.clientX + ","+oe.clientY);				
			}
            
            thisObj.lButtonDownManage(oe.clientX, oe.clientY-thisObj.mTouchUp-thisObj.getBoundRect().top, e);
            
            return false;
        });
	}
	else
	{
		$canvas.mousemove(function(e) { thisObj.mouseMoveManage(e.offsetX, e.offsetY); });
	   	$canvas.mouseout(function(e) { thisObj.mouseOutManage(e.offsetX, e.offsetY); });
	   	$canvas.dblclick(function(e) { thisObj.lButtonDblClkManage(e.offsetX, e.offsetY, e); });

	   	$canvas.mouseup(function(e)
	   	{
	   		if(e.which==1) thisObj.lButtonUpManage(e.offsetX, e.offsetY, e);
           	else if(e.which==3) thisObj.rButtonUpManage(e.offsetX, e.offsetY, e);
	   	});
	   	
	   	$canvas.mousedown(function(e)
	   	{
			e.preventDefault();
			e.stopPropagation();
	   		
	   		if(e.which==1) thisObj.lButtonDownManage(e.offsetX, e.offsetY, e);
	       	else if(e.which==3) thisObj.rButtonDownManage(e.offsetX, e.offsetY, e);
	       	
	       	return false;
	   	});
	   	
	   	$canvas.bind("contextmenu",function(e)
	   	{
			e.preventDefault();
			e.stopPropagation();
	   		return false; 
	   	});
	} 	
	
	this.resetDefaultContext();
	
	
	
	if(this.getAttr('data-bdk'))
	{
		this.setDefaultContent();   
		var parser = new JFGParser();
		parser.parseData(this.getAttr('data-bdk'), this.mContent);
	}
	else
	{
		if(window._afc) this.setDefaultContent();
	}
	
};




//--------------------------------------------------------------------
//  이 함수들을 오버라이딩 하여 특정 변수로 컨트롤 한다.

BdkCanvas.prototype.isDrawPlaceMark = function() { return true; };
BdkCanvas.prototype.isSoundPlay = function() { return true; };
BdkCanvas.prototype.isDomainMode = function() { return false; };
BdkCanvas.prototype.isViewDomainMark = function() { return false; };
BdkCanvas.prototype.isReferShow = function() { return true; };
BdkCanvas.prototype.getBGColor = function() { return 'rgba(0,0,0,0)'; };


//------------------------------------------------------------------------


//BdkCanvas.prototype.showOrder = function(bShow) { this.mIsShowOrder = bShow; };
//BdkCanvas.prototype.markOn = function(bOn) { this.mIsMarkOn = bOn; };



BdkCanvas.prototype.playSound = function(audio)
{
	/*
	if(this.isSoundPlay())
	{
		if(!audio.paused)
		{
			audio.pause();
	    	if(audio.currentTime) audio.currentTime = 0;
    	}
    	
		audio.play();    	
    }
    */
   
	if(this.isSoundPlay())
	{
    	if(audio.currentTime) audio.currentTime = 0;
		audio.play();
    }
};

BdkCanvas.prototype.resetDefaultContext = function()
{
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
};

/*
//놓여질 돌의 종류를 정하는 m_nCurSwitchStone 변수를 
//현재 상황에 맞게 재 셋팅해준다.
BdkCanvas.prototype.resetCurSwitchStone = function()
{
    //데이터가 없으면 
    if(this.mContent.isDataEmpty()) this.mCurSwitchStone = bs.BLACK;
    else
    {
        var node = this.mContent.getLastShowNode();
        //마지막 보여지는 돌의 반대 돌로
        if(node) this.mCurSwitchStone = (node.chKind^1);
        //아무것도 안 보여지고 있으면 첫번째 돌로.
        else this.mCurSwitchStone = this.mContent.mDataList[0].chKind;
    }
};
*/

//화면에 놓아보기 임시돌들을 제거한다.
BdkCanvas.prototype.clearTryAddStone = function()
{
    var list = this.mContent.mTryList;
    if(list.isEmpty()) return;

    if(!this.mContent.isTryNodeFirst())
    {
        while(true) 
        {
            this.mContent.whenStoneShowHide(list[list.showPos--], bs.STATE_DELETE);

            if(this.mContent.isTryNodeFirst()) break;
        }
    }

    list.length = 0;//clear all
    this.mContent.setLastShowTryEnd();
};

BdkCanvas.prototype.drawBoard = function()
{
	if(this.mContent==null) return;
	
	this.drawTiles();
	this.drawLines();
	this.drawStones();
	
	if(this.isDomainMode()) this.drawDomain();

	//lay confirm option
	if(this.mGuideNode) this.drawOneStone(this.mGuideNode, true, 0.4);
	
    this.drawFocus();
    this.drawLastStoneMark();
};

BdkCanvas.prototype.drawTiles = function()
{
	this.ctx.fillStyle = this.ctx.createPattern(BdkCanvas.sTileImg, 'repeat');
	this.ctx.fillRect(this.mViewGapX, this.mViewGapY, this.mBoardWidth, this.mBoardHeight);
};

BdkCanvas.prototype.drawLines = function()
{
	var nStartX, nEndX, nStartY, nEndY;
	var i, temp;
	var nHalfLineGap = parseInt(this.mLineGap/2,10);
	
    this.ctx.fillStyle = '#000';
    this.ctx.strokeStyle = '#000';	
	this.ctx.lineWidth = 1; 
	
	this.ctx.beginPath();
	
	//------------------------------------------------------------------
	//	가로줄을 그린다. 
	//------------------------------------------------------------------
	if(this.mContent.mCutGapRt.left>0) nStartX = this.mViewGapX;
	else nStartX = this.mViewGapX + nHalfLineGap;
	
	if(this.mContent.mCutGapRt.right>0) nEndX = this.mViewGapX + this.mBoardWidth;
	else nEndX = this.mViewGapX + this.mBoardWidth - nHalfLineGap;
	
	nStartY = this.mViewGapY + nHalfLineGap + 0.5;
	
	for(i=0; i<this.mContent.mLineY; ++i)
	{
		temp = this.mLineGap*i + nStartY;
		this.ctx.moveTo(nStartX, temp);
		this.ctx.lineTo(nEndX, temp);
	}
	
	//------------------------------------------------------------------
	//	세로줄을 그린다.
	//------------------------------------------------------------------
	if(this.mContent.mCutGapRt.top>0) nStartY = this.mViewGapY;
	else nStartY = this.mViewGapY + nHalfLineGap;
	
	if(this.mContent.mCutGapRt.bottom>0) nEndY = this.mViewGapY + this.mBoardHeight;
	else nEndY = this.mViewGapY + this.mBoardHeight - nHalfLineGap;
	
	nStartX = this.mViewGapX + nHalfLineGap + 0.5;
	
	for(i=0; i<this.mContent.mLineX; ++i)
	{
		temp = this.mLineGap*i + nStartX;
		this.ctx.moveTo(temp, nStartY);
		this.ctx.lineTo(temp, nEndY);
	}
	
	this.ctx.stroke();
	
	////////////////////////////////////////////////////////////
	//	바둑판 위의 점을 그린다.
	
	var nX, nY;
	var nRadius = Math.round(this.mLineGap/14);
	var nDia = nRadius*2;
	
	nDia = Math.max(nDia, 4);
	nRadius = Math.max(nRadius, 2);
	
	nStartX = this.mViewGapX + nHalfLineGap + 0.5;
	nStartY = this.mViewGapY + nHalfLineGap + 0.5;
	
	var nStart, nEnd, nGap;
	switch(this.mContent.mBoardLine)
	{
		case 9: nStart = 2, nEnd = 6, nGap = 4; break;
		case 11: nStart = 3, nEnd = 7, nGap = 4; break;
		case 13: nStart = 3, nEnd = 9, nGap = 6; break;
		case 15: nStart = 3, nEnd = 11, nGap = 4; break;
		case 17: nStart = 3, nEnd = 13, nGap = 5; break;
		case 19: nStart = 3, nEnd = 15, nGap = 6; break;
		default: nStart = 3, nEnd = 15, nGap = 6; break;
	}
		
	//this.ctx.fillStyle = 'black';
	
	for(var y=nStart; y<=nEnd; y+=nGap)
	{
		for(var x=nStart; x<=nEnd; x+=nGap)
		{
			if(this.mContent.bdPtOutCutRt(x,y)) continue;
			
			nX = nStartX + (x-this.mContent.mCutGapRt.left)*this.mLineGap;
			nY = nStartY + (y-this.mContent.mCutGapRt.top)*this.mLineGap;
	
			this.ctx.beginPath();
			this.ctx.arc(nX,nY,nRadius,0,Math.PI*2,false);
			this.ctx.fill();
		}
	}
	
};


BdkCanvas.prototype.drawDomain = function()
{
	if(!this.mContent) return;

	var rt = new bs.Rect(), dX, dY, nX, nY,
		nAdd = this.mLineGap/2, nWidth = this.mLineGap/4;

	for(nY=0; nY<this.mContent.mBoardLine; ++nY)
	{
		for(nX=0; nX<this.mContent.mBoardLine; ++nX)
		{
			if(this.mContent.bdPtOutCutRt(nX, nY)) continue;

			dX = this.BDXtoX(nX) + this.mMsPtRect.left + 4;
			dY = this.BDYtoY(nY) + this.mMsPtRect.left + 4;

			rt.setRect(dX, dY, dX+this.mMsPtRect.width()-4, dY+this.mMsPtRect.height()-4);

			//사석 표시
			if(this.mContent.mDomChecker.isDeadCheck(nX, nY))
			{
				this.ctx.drawImage(BdkCanvas.sDeadCheck, dX, dY, rt.width(), rt.height());
				
				continue;
			}

			if(this.isViewDomainMark())
			{
				//도메인 마크
				
				var nWhich = this.mContent.mDomChecker.whichDomain(nX, nY);
				
				var obj = this.mContent.mDomChecker.getDomainCountObj(nX, nY);
				var cnt = Math.abs(obj.getCount());
				
				
				this.ctx.font = "8px arial";
				

    			if(nWhich==bs.WHITE) 
				{
					this.ctx.fillStyle = bs.COLOR_WHITE;
					this.ctx.fillRect(rt.left, rt.top, rt.width(), rt.height());
					
					if(this.option.isShowDomCount) this.drawOneChar(cnt+'', bs.COLOR_BLACK, nX, nY, false );
				}
    			else if(nWhich==bs.BLACK) 
				{
					this.ctx.fillStyle = bs.COLOR_BLACK;
					this.ctx.fillRect(rt.left, rt.top, rt.width(), rt.height());
					
					if(this.option.isShowDomCount) this.drawOneChar(cnt+'', bs.COLOR_WHITE, nX, nY, false );
				}
				else
				{
					if(this.option.isShowDomCount)
					{
						this.ctx.font = "12px arial";
						this.drawOneChar(obj.getCount()+'', bs.COLOR_RED, nX, nY, false );
					}
				}
				
				/*
				dX = this.BDXtoX(nX) + 5;
				dY = this.BDYtoY(nY) + 5;
				rt.setRect(dX, dY, dX+this.mLineGap-10, dY+this.mLineGap-10);

				var obj = this.mContent.mDomChecker.getDomainCountObj(nX, nY);
				var cnt = obj.getCount();
				
				if(cnt>0)
				{
					if(cnt>=95)
					{
						this.ctx.fillStyle = bs.COLOR_BLACK;
						this.ctx.fillRect(rt.left, rt.top, rt.width(), rt.height());
						this.drawOneChar(cnt+'', bs.COLOR_WHITE, nX, nY, false );
					}
					else this.drawOneChar(cnt+'', bs.COLOR_RED, nX, nY, false );
				}
				else if(cnt<0)
				{
					cnt *= -1;
					
					if(cnt>=95)
					{
						this.ctx.fillStyle = bs.COLOR_WHITE;
						this.ctx.fillRect(rt.left, rt.top, rt.width(), rt.height());
						this.drawOneChar(cnt+'', bs.COLOR_BLACK, nX, nY, false );
					}
					
					else this.drawOneChar(cnt+'', bs.COLOR_BLUE, nX, nY, false );
				}				
				
				*/
				
				
			}
		}
	}
};

//-------------------------------------------------
//	기본돌 그리기
BdkCanvas.prototype.drawNoOrderStones = function()
{
	var nodeList = this.mContent.mNoOrderList, data, i;
	
	for(i=0; i<nodeList.length; i++)
	{
		data = nodeList[i];
		
		if(data.isShow)
		{
			//돌 그리기
			this.ctx.drawImage(this.mStones[data.chKind],
					this.BDXtoX(data.nX), this.BDYtoY(data.nY), this.mLineGap, this.mLineGap);
		}
	}
};

		
//---------------------------------------------------
//	수순 관련 돌 그리기			
BdkCanvas.prototype.drawOrderStones = function(nodeList)
{
	var len = nodeList.getShowPos() + 1, i, data,
		markData, bChkShowOrder = (this.mIsShowOrder && !this.mContent.mIsTryStone),
		curShowNode = this.mContent.getCurNodeList().getShowPosNode();
	
	for(i=0; i<len; i++)
	{
		data = nodeList[i];
		
		if(data.isShow)
		{
		    //돌 그리기
		    //여기서 오류나는 부분 수정하기
			this.ctx.drawImage(this.mStones[data.chKind],
					this.BDXtoX(data.nX), this.BDYtoY(data.nY), this.mLineGap, this.mLineGap);
			
            markData = this.mContent.getMarkData(data.nX, data.nY);
			
            //수순 번호 그리기
            if(bChkShowOrder && !markData && (!this.isDomainMode() || !this.mContent.mDomChecker.isDeadCheck(data.nX, data.nY)) )
                this.drawOrder(data);

            if(data.hasChildContent() && this.isReferShow()) this.drawReferMark(data);
			
			//확장노드가 선택되어 진행된 경우만 마크를 보여준다.
			if(data.getSelExtList()) this.drawExtMark(data);
		}
		
		if(!data.isExtListEmpty())
		{
			var selList = data.getSelExtList();
			
			if(selList) 
			{
				this.drawOrderStones(selList);
				break;
			}
			else if(data===curShowNode)
			{
				this.drawNodeSelStone(data);
				break;
			}
		}
	}
	
};

BdkCanvas.prototype.drawVNodeData = function()
{
	if(!this.mContent.mVNodeData.isExtListEmpty() && this.mContent.getDefNodeList().isShowPosBegin())
	{
		var selList = this.mContent.mVNodeData.getSelExtList();
		
		if(selList) this.drawOrderStones(selList);
		else this.drawNodeSelStone(this.mContent.mVNodeData);
	}
};


//------------------------------------------------------
//  놓아보기 돌 그리기
BdkCanvas.prototype.drawTryStones = function()
{
	var nodeList = this.mContent.mTryList, data, i;
	
	for(i=0; i<nodeList.length; i++)
	{
		data = nodeList[i];

		if(data.isShow)
		{
			//돌 그리기
			this.ctx.drawImage(this.mStones[data.chKind],
							   this.BDXtoX(data.nX), this.BDYtoY(data.nY), this.mLineGap, this.mLineGap);

			//수순 번호 그리기
			if(this.mIsShowOrder) this.drawOrder(data);
		}
	}
};
	
		
BdkCanvas.prototype.drawStones = function()
{
	var data = null, length = 0, i = 0;
	
	this.ctx.font = this.mFontInfo;
	
	//-------------------------------------------------
	//	기본돌 그리기
	this.drawNoOrderStones();

	//---------------------------------------------------
	//	수순 관련 돌 그리기
	this.drawVNodeData();
	this.drawOrderStones(this.mContent.getDefNodeList());
	
    //------------------------------------------------------
    //  놓아보기 돌 그리기
    if(this.mContent.mIsTryStone) this.drawTryStones();
		
	//-------------------------------------------------------
	//	마크 그리기
	this.drawAllMark(this.mContent);

};

//모든 문자, 모양 마크를 일괄적으로 그린다.
BdkCanvas.prototype.drawAllMark = function(content)
{
    var markList = content.mMarkManage.getAllMarkList();

    var i, j, data, nodeList;

    for(i=0; i<bs.MARK_SIZE; ++i)
    {
        nodeList = markList[i];
		
        for(j=0; j<nodeList.length; j++) 
        {
            data = nodeList[j];
            
            if(data.isShow)
            {
                if(i==bs.MARK_SIZE-1) this.drawShapeMark(data);
                else this.drawCharMark(data);
            }
        }
    }
};


/**
 * 영문이나 한글마크를 그린다.
 * @param {NodeData}
 */
BdkCanvas.prototype.drawCharMark = function(data)
{
	var node = this.mContent.findStoneByXY(data.nX, data.nY);
	var color = bs.COLOR_BLACK;
	
	//돌이 존재하고 검은색이면 마크는 흰색
	if(node && node.chKind==bs.BLACK) color = bs.COLOR_WHITE;
	
	var strMark = "";
	switch(data.chKind)
	{
		case bs.ENG_MARK: strMark = String.fromCharCode(data.nOrder); break;
		case bs.KOR_MARK: strMark = bs.KOR_MARK_DATA.charAt(data.nOrder); break;
		case bs.NUM_MARK: strMark = (data.nOrder+1).toString(); break;
	}
	
	//문자를 그린다.
	this.drawOneChar(strMark, color, data.nX, data.nY, (node==null) );
};

//모양 마크를 그린다.
BdkCanvas.prototype.drawShapeMark = function(data)
{
	var node = this.mContent.findStoneByXY(data.nX, data.nY);

	var nX = this.BDXtoX(data.nX) + this.mMsPtRect.left;
	var nY = this.BDYtoY(data.nY) + this.mMsPtRect.top;
	var nWidth = this.mMsPtRect.width();
	var nHeight = this.mMsPtRect.height();
    var nGap = this.mLineGap/8;
    var nSize = nWidth + nGap*2;
	
	this.ctx.strokeStyle = bs.COLOR_BLACK;
	
    //빈 자리이면(착수유효자리) 배경타일을 그리고 마크를 그린다.
    if(node==null) this.ctx.drawImage(BdkCanvas.sTileImg, 0, 0, nSize, nSize, nX-nGap, nY-nGap, nSize, nSize);
    else if(node.chKind==bs.BLACK) this.ctx.strokeStyle = bs.COLOR_WHITE;
	
	switch(data.chKind)
	{
		case bs.TRIANGLE_MARK:
		{
			this.ctx.beginPath();
			this.ctx.moveTo(nX+nWidth/2, nY);
			this.ctx.lineTo(nX, nY+nHeight);
			this.ctx.lineTo(nX+nWidth, nY+nHeight);
			this.ctx.closePath();
			this.ctx.stroke();
		}
		break;
		
		case bs.RECTANGLE_MARK:
		{
			this.ctx.strokeRect(nX, nY, nWidth, nHeight);
		}
		break;
		
		case bs.CIRCLE_MARK:
		{
			var radius = nWidth/2;
			
			this.ctx.beginPath();
			this.ctx.arc(nX+radius, nY+radius, radius, 0, Math.PI*2, false);
			this.ctx.stroke();
		}
		break;
	}
};

//하나의 돌 수순번호를 그린다.
BdkCanvas.prototype.drawOrder = function(node, bLast)
{
    //수순관련 옵션 적용하는 코드 차후에 추가하기

    var color = bs.COLOR_BLACK, nOrder;
//afc.log(node);
//console.log(node.nOrder);

    if(node.nOrder>=bs.TRYSTONE_ORDER) nOrder = node.nOrder - bs.TRYSTONE_ORDER + 1;
    else nOrder = node.nOrder + 1;
	
//console.log(nOrder);
    
    if(bLast) color = bs.COLOR_RED;
    else if(node.chKind==bs.BLACK) color = bs.COLOR_WHITE;

    this.drawOneChar(nOrder+"", color, node.nX, node.nY);	
};

//nX, nY 는 바둑판 좌표이다.
//isBgEmpty는 배경에 돌이 없고 빈 바둑판 위에 문자를 그리는 경우이다.
BdkCanvas.prototype.drawOneChar = function(oneChar, color, nX, nY, isBgEmpty)
{
	var nHalf = this.mLineGap/2;
	var nQuarter = this.mLineGap/4;

	//파라미터로 넘어오는 값은 바둑판 좌표이므로 
	//실제로 그려질 중심 값을 구한다.
	nX = this.BDXtoX(nX) + nQuarter;
	nY = this.BDYtoY(nY) + nQuarter;
		
	//빈 자리이면(착수유효자리) 배경타일을 그리고 마크를 그린다.
	if(isBgEmpty) 
		this.ctx.drawImage(BdkCanvas.sTileImg, 0, 0, nHalf, nHalf, nX, nY, nHalf, nHalf);
	
	//this.ctx.globalAlpha = 0.5;
	this.ctx.fillStyle = color;
	//this.ctx.strokeStyle = color;
	this.ctx.fillText(oneChar, nX+nQuarter, nY+nQuarter);
};

//하나의 돌만 그린다.
BdkCanvas.prototype.drawOneStone = function(node, isHideOrder, alpha)
{
    var nX = this.BDXtoX(node.nX);
    var nY = this.BDYtoY(node.nY);

    //돌을 그린다.
    if(alpha)
    {
        var old = this.ctx.globalAlpha;
        this.ctx.globalAlpha = alpha;
        this.ctx.drawImage(this.mStones[node.chKind], nX, nY, this.mLineGap, this.mLineGap);
        this.ctx.globalAlpha = old;
    }
    else this.ctx.drawImage(this.mStones[node.chKind], nX, nY, this.mLineGap, this.mLineGap);
          
   
    var markData = this.mContent.getMarkData(node.nX, node.nY);
    //마크가 있는 자리이면
    if(markData) 
    {
        if(markData.chKind>=bs.TRIANGLE_MARK) this.drawShapeMark(markData);
        else this.drawCharMark(markData);
    }

    //수순 번호 그리기
    else if(!isHideOrder && this.mIsShowOrder && node.nOrder<bs.NO_ORDER) this.drawOrder(node);

    if(node.hasChildContent() && this.isReferShow()) this.drawReferMark(node);
    
    //포커스가 있는 돌이면 포커스를 그려준다.
    if(node===this.mContent.mCurFocusData) this.drawFocus();
    //마지막 돌이면 마지막돌 마크를 그려준다.
    if(node===this.mContent.getLastShowNode()) this.drawLastStoneMark();
};

BdkCanvas.prototype.drawNodeSelStone = function(node)
{
	var data, i, extLists = node.getExtLists(), chTemp, nTemp;
	
	for(i=0; i<extLists.length; i++)
	{
		data = extLists[i][0];
		
		//this.ctx.drawImage(this.mStones[data.chKind], BDXtoX(data.nX), BDYtoY(data.nY), this.mLineGap, this.mLineGap);

		chTemp = data.chKind;
		nTemp = data.nOrder;

		data.chKind = bs.ENG_MARK;
		data.nOrder = bs.ASCII_A + i;

		this.drawCharMark(data);

		data.chKind = chTemp;
		data.nOrder = nTemp;
	}
};


//연관도가 있음을 표시 
BdkCanvas.prototype.drawReferMark = function(node)
{
    var nLeft = this.BDXtoX(node.nX);
    var nTop = this.BDYtoY(node.nY);

    var nTemp = this.mLineGap/4;
    this.ctx.drawImage(BdkCanvas.sReferImg, nLeft+this.mLineGap-nTemp, nTop, nTemp, nTemp);
};

BdkCanvas.prototype.drawExtMark = function(node)
{
	var nLeft = this.BDXtoX(node.nX);
	var nTop = this.BDYtoY(node.nY);

	var nTemp = this.mLineGap/4;
	this.ctx.drawImage(BdkCanvas.sExtMark, nLeft, nTop, nTemp, nTemp);
};

//포커스 표시 마크를 그린다.
BdkCanvas.prototype.drawFocus = function()
{
    if(this.mContent && this.mContent.mCurFocusData && !this.mContent.mIsTryStone)
    {
        var lastNode = this.mContent.getLastShowNode();
        
        //포커스가 마지막 돌에 있을 경우는 보여주지 않음.
        if(lastNode && this.mContent.mCurFocusData!==lastNode)
        {
            var nLeft = this.BDXtoX(this.mContent.mCurFocusData.nX),
            	nTop = this.BDYtoY(this.mContent.mCurFocusData.nY),
				nTemp = this.mLineGap/4;

            this.ctx.drawImage(BdkCanvas.sFocusImg, nLeft, nTop+this.mLineGap-nTemp, nTemp, nTemp);
        }
    }
};

//마지막돌을 표시하는 마크를 그린다.
BdkCanvas.prototype.drawLastStoneMark = function()
{
    if(this.mContent==null || this.mContent.isNodeFirst() || this.mContent.mIsTryStone) return;

    var lastNode = this.mContent.getLastShowNode();
    var markData = this.mContent.getMarkData(lastNode.nX, lastNode.nY);
	
	//죽은돌 체크가 되어 있으면 마지막돌 마크를 그리지 않는다.
	if(this.mContent.mDomChecker.isDeadCheck(lastNode.nX, lastNode.nY)) return;

    //if(this.mIsShowOrder && !markData && (!this.isDomainMode() || !this.mContent.mDomChecker.isDeadCheck(lastNode.nX, lastNode.nY)) )
	if(this.mIsShowOrder && !markData)
    {
        this.drawOrder(lastNode, true);
    }
    else 
    {
        var nLeft = this.BDXtoX(lastNode.nX);
        var nTop = this.BDYtoY(lastNode.nY);

        var nHalf = this.mLineGap/2;
        var nQuarter = this.mLineGap/4;

        //마크 중앙에 놓는 버전
        this.ctx.drawImage(BdkCanvas.sLastMarkImg1, nLeft+nHalf-nQuarter, nTop+this.mLineGap/3, nQuarter, nQuarter);
        this.ctx.drawImage(BdkCanvas.sLastMarkImg2, nLeft+nHalf, nTop+this.mLineGap/3, nQuarter, nQuarter);
    }
};

//돌이 놓아질 위치 표시를 그린다.
BdkCanvas.prototype.drawPlaceMark = function()
{
    var chKind;

    //놓아보기 모드이면 
    if(this.mContent.mIsTryStone) chKind = this.mContent.getCurTurnStone();

    //일반 편집모드
    else 
    {
        if(this.mSelectedStone==bs.SWITCH) chKind = this.mContent.getCurTurnStone();
        else chKind = this.mSelectedStone;
    }

    if(chKind==bs.WHITE) this.ctx.fillStyle = bs.COLOR_WHITE;
    else this.ctx.fillStyle = bs.COLOR_BLACK;
    
    //차후 옵션 적용하기
    this.ctx.fillRect(this.mMsPtRect.left+this.BDXtoX(this.mCurBdPt.nX), this.mMsPtRect.top+this.BDYtoY(this.mCurBdPt.nY), 
        this.mMsPtRect.width(), this.mMsPtRect.height());
        
    //if(GetPlaceMarkKind()==0) graphics.FillEllipse(pBrush, rt);
    //else graphics.FillRectangle(pBrush, rt);
};

//돌그림을 지운다.
BdkCanvas.prototype.eraseOneStone = function(node)
{
    this.invalidateStoneRect(node.nX, node.nY);
};

//바로전의 마지막 돌 표시 마크를 지운다.
BdkCanvas.prototype.eraseOldLastStoneMark = function()
{
    //새로추가된 돌에 마지막돌 표시마크를 그리기 위해
    //현재 마지막돌의 표시 마크를 지운다.
	
	var list = this.mContent.getCurNodeList(),
		oldLast = list.getShowPos() - 1;
    
    //처음 돌인 경우는 이전돌이 없다.
    if(oldLast>-1)
    {
        var node = list[oldLast];
        this.invalidateStoneRect(node.nX, node.nY);
    }
};

/**
 * 돌 하나의 영역만 다시 갱신한다. 
 */
BdkCanvas.prototype.invalidateStoneRect = function(nX, nY)
{
    this.ctx.save();
    
    this.ctx.beginPath();
    this.ctx.rect(this.BDXtoX(nX), this.BDYtoY(nY), this.mLineGap, this.mLineGap);
    this.ctx.clip();
    
    this.updateBoard();
    
    this.ctx.restore();
};


/**
 * 바둑판 전체를 다시 그린다. 
 */
BdkCanvas.prototype.updateBoard = function()
{
	this.ctx.fillStyle = this.getBGColor();
	this.ctx.fillRect(0,0,this.element.width, this.element.height);
	this.drawBoard();
};

//창 사이즈가 변할 때 바둑판에 대한 각종 정보를 다시 계산해준다.
BdkCanvas.prototype.colculBoardSize = function(cx, cy)
{
	if(this.mContent==null) return;
	
    //m_nDefaultGap은 CBdkView 영역 끝에서부터의 기본갭이다.
	var nGap = this.mDefaultGap;
	
    //m_nDefaultGap 이 0인 경우는 좌표를 안 그리는 경우이다.
    //if(nGap>0 && IsShowCrd()) nGap += 40;//20+20
	
	//최적의 LineGap 을 구한다.
	//this.mLineGap = parseInt(Math.min( (cx-nGap)/this.mContent.mLineX, (cy-nGap)/this.mContent.mLineY ), 10);
	this.mLineGap = parseInt(Math.min( (cx-nGap)/this.mContent.mLineX, (cy-nGap)/this.mContent.mLineY ), 10);
	
	//다시 라인수를 곱해 바둑판의 사이즈를 구한다.
	this.mBoardWidth = this.mLineGap*this.mContent.mLineX;
	this.mBoardHeight = this.mLineGap*this.mContent.mLineY;
	
	//뷰 시작점과 바둑판과의 갭
	this.mViewGapX = parseInt((cx - this.mBoardWidth)/2, 10);
	this.mViewGapY = parseInt((cy - this.mBoardHeight)/2, 10);
	
	this.mBoardRect.setRect(this.mViewGapX, this.mViewGapY, 
			this.mViewGapX+this.mBoardWidth, this.mViewGapY+this.mBoardHeight);
	
	//바둑돌 위에 표시될 마크들의 영역, 또는 마우스 포인터(적용할 경우)
	var nStart = Math.floor(this.mLineGap/4);
	this.mMsPtRect.setRect(nStart, nStart, nStart + nStart*2 , nStart + nStart*2);
	
	//-------------------------------------
	//	text size
	//-------------------------------------
	
	this.mFontInfo = parseInt((this.mLineGap/2), 10)+"px arial";
	//this.mFontInfo = parseInt((this.mLineGap/2), 10)+"px helvetica";
	//this.mFontInfo = "normal 9px helvetica";
	
	this.mTouchUp = this.mLineGap*2;
};
		
BdkCanvas.prototype.BDXtoX = function(nX) 
{ 
	return (this.mViewGapX + this.mLineGap*(nX-this.mContent.mCutGapRt.left)); 
};
		
BdkCanvas.prototype.BDYtoY = function(nY) 
{ 
	return (this.mViewGapY + this.mLineGap*(nY-this.mContent.mCutGapRt.top)); 
};
		
BdkCanvas.prototype.PtToBdPt = function(nX, nY, rBdPt)
{
	rBdPt.nX = parseInt((nX-this.mViewGapX) / this.mLineGap, 10) + this.mContent.mCutGapRt.left;
	rBdPt.nY = parseInt((nY-this.mViewGapY) / this.mLineGap, 10) + this.mContent.mCutGapRt.top;
};

//놓아보기 돌 추가
BdkCanvas.prototype.tryAddStoneManage = function(bdPt)
{
    var list = this.mContent.mTryList;

    if(!bdPt) bdPt = this.mCurBdPt;
	
	var curKind = this.mContent.getCurTurnStone();
	
	if(!bdPt.isValid() || !this.mContent.mBrdChecker.isAbleToLay(bdPt.nX, bdPt.nY, curKind)) return null;
	
    
    //특정위치로 이동후 돌을 추가한 경우 특정위치 이후의 돌은 삭제된다.
    if(!this.mContent.isTryNodeLast()) 
    {
        //놓아보기는 바로 지워도 됨.
        var startPos = list.getShowPos() + 1;
        list.splice(startPos, list.length-startPos);
        this.mContent.setLastShowTryEnd();
    }
    
    var data = new bs.NodeData();
    data.nX = bdPt.nX;
    data.nY = bdPt.nY;
    data.chKind = curKind;
    
    //임시 놓아보기 구별을 위해
    if(list.isEmpty()) data.nOrder = bs.TRYSTONE_ORDER;
    else data.nOrder = list.getLastNode().nOrder + 1;

    //정보를 셋팅한 후 노드리스트에 추가한다.
    list.push(data);
    //돌따내기 등의 알고리즘을 위해 배열에 셋팅
    this.mContent.mBrdChecker.setValue(data.nX, data.nY, data);

    //SetValue 가 호출된 다음에 호출되어져야 한다.
    //착점시 잡은 돌이 있는지 체크하여 관련 작업을 한다.
    this.deadStoneManage(data);

    this.mContent.setLastShowTryEnd();

    this.updateBoard();

    //돌의 종류를 반대로 바꾼다.
    this.mContent.switchTurnStone();

    this.playSound(this.sAddSnd);
	
	return data;
};

//영문,검은돌이나 흰돌만 놓는 경우(수순과 관계없는 돌로 기본셋팅된다.)
BdkCanvas.prototype.addNoOrderManage = function(bdPt, isReport)
{
    if(!bdPt) bdPt = this.mCurBdPt;

    var data = new bs.NodeData();
    data.nX = bdPt.nX;
    data.nY = bdPt.nY;
    data.chKind = this.mSelectedStone;
	
	var action = 0, remData = null;

    //마크
    if(data.chKind>=bs.ENG_MARK)
    {
        //마크 유지 관련 처리
        if(!this.mIsMarkOn)
        {
            //현재 마지막 보여지고 있는 돌을 owner 로 한다.(ownerStone 은 NodeData.js 파일 참조)
            var lastNode = this.mContent.getLastShowNode();
			
            if(lastNode) data.nOwnerStone = lastNode.nOrder;
            //소유돌이 아무것도 없는 경우, 즉 최초로 놓여지는 경우. -2는 항상유지 되는 MARKON_VALUE 를 의미
            //최초로 놓여져서 소유돌이 없지만 항상유지되면 안 되므로 어떤 값과도 같지 않은 -1을 셋팅
            else data.nOwnerStone = -1;
        }
		
		remData = this.mContent.removeMarkData(data.nX, data.nY);

        //기존 마크가 있으면 화면에서 지운다.
        //있으면 함수내부에서 기존 마크를 지운다. TRUE 리턴
        if(remData) this.eraseOneStone(data);
        
        //기존 마크가 없는 경우만 추가
        else 
        {
			action = 1;	//add
		
            //마크추가
            this.mContent.mMarkManage.addMark(data, true);
            //현재 마크가 추가된 자리의 돌을 얻어온다.
            var stone = this.mContent.findStoneByXY(data.nX, data.nY);

            //아무 돌도 없는 빈자리
            if(stone==null)
            {
                if(data.chKind>=bs.TRIANGLE_MARK) this.drawShapeMark(data);
                else this.drawCharMark(data);
            }

            //기존에 돌이 놓여져 있는 자리
            //마크를 그릴 때 수순이 있는 자리는 수순을 지워야 하므로 돌을 다시 그린다.
            else 
            {
                //마크가 추가되어져 있기때문에 수순을 그리지 않는다.
                this.drawOneStone(stone);
            }
        }

        this.mIsValidPlace = true;
    }

    //수순과 관계없는, (검은돌 또는 흰돌)
    else
    {
        var list = this.mContent.mNoOrderList;
        
        //특정위치로 이동후 돌을 추가한 경우 특정위치 이후의 돌은 삭제된다.
        this.mContent.removeNodeDataToEnd(this.mContent.getCurNodeList().getShowPos()+1);
        
        remData = this.mContent.findStoneByXY(data.nX, data.nY);
        //빈자리면
        if(remData==null)
        {
			action = 1;	//add
		
            //오류 코드, 이렇게 하면 안됨, -> data.nOrder = NO_ORDER + list.length;
            if(list.isEmpty()) data.nOrder = bs.NO_ORDER;
            else data.nOrder = list.getLastNode().nOrder + 1;

            //노드리스트에 추가한다.
            list.push(data);
            //돌따내기 등의 알고리즘을 위해 배열에 셋팅
            this.mContent.mBrdChecker.setValue(data.nX, data.nY, data);

            //화면에 바로 돌을 그려준다.
            this.drawOneStone(data);
            this.mIsValidPlace = true;

            this.playSound(BdkCanvas.sAddSnd);
        }

        //수순과 관계없는 기존 돌이 있으면 화면에서 지운다.
        else if(this.mContent.removeNoOrderData(data.nX, data.nY))
        {
            this.eraseOneStone(data);
            this.mIsValidPlace = true;
        }
    }
	
	if(isReport) 
	{
		if(action==0) data = remData;
		
		this.reportEvent('change', {'action':action, 'data': data }, null);
	}
	
	return data;
};

//수순이 적용되는 스위치 모드(검은돌,흰돌 반복해서 놓아지는 경우)
//bdPt가 지정되면 그 위치에 추가한다.
BdkCanvas.prototype.addStoneManage = function(nOrder, bdPt, isReport)
{
    var list = this.mContent.getCurNodeList();
	
	if(!nOrder) nOrder = 0;
    if(!bdPt) bdPt = this.mCurBdPt;
	
	var curKind = this.mContent.getCurTurnStone();
	
	if(!bdPt.isValid() || !this.mContent.mBrdChecker.isAbleToLay(bdPt.nX, bdPt.nY, curKind)) return null;

    //특정위치로 이동후 돌을 추가한 경우 특정위치 이후의 돌은 삭제된다.
    this.mContent.removeNodeDataToEnd(list.getShowPos()+1);

    var data = new bs.NodeData();
    data.nX = bdPt.nX;
    data.nY = bdPt.nY;
    data.chKind = curKind;

    //수순이 적용되는 스위치 모드(검은돌,흰돌 반복해서 놓아지는 경우)
    //자르기가 있기 때문에 다음과 같이 수순을 주면 안됨. --> data.nOrder = list.length;
    if(list.isEmpty()) data.nOrder = nOrder;
    else data.nOrder = list.getLastNode().nOrder + 1;

    //정보를 셋팅한 후 노드리스트에 추가한다.
    list.push(data);
    this.mContent.mBrdChecker.setValue(data.nX, data.nY, data);

    //setValue 가 호출된 다음에 호출되어져야 한다.
    //착점시 잡은 돌이 있는지 체크하여 관련 작업을 한다.
    this.deadStoneManage(data);
    //새로 추가되면서 이전 소유돌 들을 없앤다.
    this.mContent.belongedStoneManage(data, bs.STATE_SHOW);

    this.mContent.setLastShowPosEnd();

    //돌의 종류를 반대로 바꾼다.
	this.mContent.switchTurnStone();

	this.playSound(BdkCanvas.sAddSnd);
	
	this.updateBoard();
	
	if(isReport) this.reportEvent('change', {'action':1, 'data': data }, null);
	
    return data;
};

//삭제가 실패하면 0, 삭제가 성공하면 1, 포커스까지 지워졌으면 2
BdkCanvas.prototype.removeStoneManage = function(isReport)
{
	var list = this.mContent.getCurNodeList();
	
	if(list.isEmpty()) return 0;

	//특정위치로 이동후 삭제를 한 경우 특정위치 이후의 돌은 삭제한다.
	this.mContent.removeNodeDataToEnd(list.getShowPos()+1);

	//마지막 원소를 구한다.
	var node = list.getLastNode();

	//지우기 전에 위치를 얻어둔다.
	//var nX = node.nX;
	//var nY = node.nY;

	//돌이 하나 지워질 때마다 처리해줘야 할 것.
	this.mContent.whenNodeDataDelete(node);

	//포커스가 지워졌으면 
	//this.mCurFocusData 값은 WhenNodeDataDelete 이 함수 내부에서 NULL 로 셋팅된다.
	var isFocusRemove = (this.mContent.mCurFocusData==null);

	//마지막 돌을 지운다.
	list.pop();
	this.mContent.setLastShowPosEnd();

	//돌의 종류를 반대로 바꾼다.
	this.mContent.switchTurnStone();

	this.updateBoard();
	
	if(isReport) this.reportEvent('change', {'action':0, 'data': node }, null);

	//삭제가 성공하면 1, 포커스까지 지워졌으면 2
	return (1 + isFocusRemove);
};


//착점시 잡은돌이 있는지 체크하고 관련된 작업을 한다. 잡은 돌이 있으면 TRUE 리턴
BdkCanvas.prototype.deadStoneManage = function(addData)
{
    //착점시 잡은 돌이 있으면 잡은돌리스트에 추가하고 화면에 나타나지 않도록 셋팅한다.
    if(!this.mContent.deadStoneCheck(addData)) return false;

	//잡힌돌 사운드    
    if(addData.deadStones.length>3) _delaySndPlay(BdkCanvas.sDeadManySnd);
    else _delaySndPlay(BdkCanvas.sDeadSmallSnd);
    
    var thisObj = this;
    function _delaySndPlay(audio) {
    	setTimeout(function() { thisObj.playSound(audio); }, 500);
    }
    
    return true;
};

BdkCanvas.prototype.mouseMoveManage = function(eX, eY)
{
    if(this.mBoardRect.contains(eX, eY))
    {
        this.PtToBdPt(eX, eY, this.mTempPt);
        
		//bs.drawDebug(this.ctx, 120, 20, "in = "+this.mTempPt.nX + ","+this.mTempPt.nY);        
        
        //바둑 좌표가 바뀔 경우
        if(!this.mCurBdPt.isEqual(this.mTempPt))
        {
            //바둑돌 이동모드인 경우
            if(this.mIsStoneMove)
            {
                if(this.mContent.checkValidPlace(this.mTempPt))
                {
                    //새로운 좌표로 돌 이동
                    this.mContent.mCurFocusData.nX = this.mTempPt.nX;
                    this.mContent.mCurFocusData.nY = this.mTempPt.nY;

                    //현재 돌을 지우고
                    this.mContent.mBrdChecker.setValue(this.mCurBdPt.nX, this.mCurBdPt.nY, null);
                    this.invalidateStoneRect(this.mCurBdPt.nX, this.mCurBdPt.nY);

                    //새로운 위치에 돌을 그린다.
                    this.mContent.mBrdChecker.setValue(this.mTempPt.nX, this.mTempPt.nY, this.mContent.mCurFocusData);
                    this.drawOneStone(this.mContent.mCurFocusData);

                    //새로운 좌표를 현재 좌표롤 셋팅한다.
                    this.mCurBdPt.setBdPt(this.mTempPt);
                }
            }

            //그 외의 경우
            else
            {
        		//현재 좌표 백업
        		this.mOldBdPt.setBdPt(this.mCurBdPt);
            	
                if(this.isDrawPlaceMark())
                {
                    //이전 마크를 지운다.
                    this.invalidateStoneRect(this.mCurBdPt.nX, this.mCurBdPt.nY);
                }

                //새로운 좌표를 현재 좌표롤 셋팅한다.
                this.mCurBdPt.setBdPt(this.mTempPt);

                //놓아보기나 일반 모드일 때
                if(this.mSelectedStone==bs.SWITCH || this.mContent.mIsTryStone)
                { 
                    this.mIsValidPlace = this.mContent.checkValidPlace(this.mCurBdPt);
                }

                //돌 선택 종류가 마크 셋팅일 경우
                else 
                {
                    if(this.mSelectedStone<bs.ENG_MARK)
                    {
                        var node = this.mContent.findStoneByPt(this.mCurBdPt);
                        if(node==null || node.nOrder>=bs.NO_ORDER) this.mIsValidPlace = true;
                        else this.mIsValidPlace = false;
                    }
                    else this.mIsValidPlace = true;
                }

                if(this.mIsValidPlace && this.isDrawPlaceMark()) this.drawPlaceMark();
            }
            
        }
    }

    //바둑판 영역 밖으로 나간 경우
    else 
    {
		//bs.drawDebug(this.ctx, 120, 20, "out = "+eX + ","+eY);

        //바둑돌 이동 모드가 아닌 경우만 체크
        if(!this.mIsStoneMove)
        {
            this.mIsValidPlace = false;

            //영역 밖으로 나가기 전에 보드 영역 안에 있었는지
            if(this.mCurBdPt.isValid())
            {
                if(this.isDrawPlaceMark()) 
                    this.invalidateStoneRect(this.mCurBdPt.nX, this.mCurBdPt.nY);
                    
                this.mCurBdPt.invalidPt();
            }
        }
    }

    return true;	
};

BdkCanvas.prototype.applyTryAddStone = function()
{
	var bdPt = null;
	
	if(this.mGuideNode) 
	{
		bdPt = new bs.BDK_PT(this.mGuideNode.nX, this.mGuideNode.nY);
		
		this.mGuideNode = null;	//reset guide node, for not drawing
	}

	this.tryAddStoneManage(bdPt);
};

BdkCanvas.prototype.applyAddStone = function()
{
	//마지막 표시 마크를 지워준다.
	this.eraseOldLastStoneMark();
	
	var bdPt = null;
	
	if(this.mGuideNode) 
	{
		bdPt = new bs.BDK_PT(this.mGuideNode.nX, this.mGuideNode.nY);
		
		this.mGuideNode = null;	//reset guide node, for not drawing
	}

	var node = this.addStoneManage(null, bdPt, true);

	if(node) this.focusChangeManage(node);
};

BdkCanvas.prototype.guideStoneManage = function()
{
	var bdPt = this.mCurBdPt, curKind = this.mContent.getCurTurnStone(), data;

	if(!this.mContent.mBrdChecker.isAbleToLay(bdPt.nX, bdPt.nY, curKind)) return;

	data = new bs.NodeData();
	data.nX = bdPt.nX;
	data.nY = bdPt.nY;
	data.chKind = curKind;

	this.mGuideNode = data;
	
	this.updateBoard();
};

BdkCanvas.prototype.lButtonDownManage = function(eX, eY, event)
{
    //마우스 클릭이 비활성화 된 경우
    if(!this.mIsEnableLButton) return true;

    //바둑판위의 착점 유효한 자리인지(바둑돌이 놓이지 않은 자리)
    //mouseMoveManage 에서 체크한다.
    if(this.mIsValidPlace)
    {
		if(event.ctrlKey) 
		{
			this.moveNextManage(true);
		}
		else
		{
			this.mIsValidPlace = false;
			
			if(this.mContent.mIsTryStone) 
			{
				if(this.option.isLayConfirm) this.guideStoneManage();
				else this.applyTryAddStone();
			}

			//스위치 입력을 선택한 경우
			else if(this.mSelectedStone==bs.SWITCH) 
			{
				if(this.option.isLayConfirm) this.guideStoneManage();
				else this.applyAddStone();
			}

			else this.addNoOrderManage(null, true);
		}
    }

    //유효하지 않은 자리
    //이미 바둑돌이 있거나 착수금지 자리 
    else if(this.mBoardRect.contains(eX, eY))
    {
        //놓아보기 시 처리하지 않는다.
        if(this.mContent.mIsTryStone) return true;

        var node = this.mContent.findStoneByPt(this.mCurBdPt);

        //바둑돌을 클릭했을 경우
        //기본돌은 이동이 안 되며 포커스도 주지 않는다.
        if(node && node.nOrder<bs.NO_ORDER)
        {
            var curFocus = this.mContent.mCurFocusData;
            //새로 셋팅할 포커스가 현재 포커스와 다른 경우만
            if(curFocus && (curFocus.nX!=this.mCurBdPt.nX || curFocus.nY!=this.mCurBdPt.nY))
            {
                this.focusChangeManage(node);
				
				this.reportEvent('select', node, event);
            }

            //돌 이동 모드를 활성화 한다. 모바일이 아닌 경우만
            if(!afc.isMobile) this.mIsStoneMove = true;
        }
    }
	
	else return false;
	
	
	return true;
};

BdkCanvas.prototype.lButtonUpManage = function(eX, eY, event)
{
    if(this.mIsStoneMove)
    {
        //돌 이동 모드를 비활성화 한다.
        this.mIsStoneMove = false;

		//차후에 정확히 구현해 보기....

		//돌이 이동하면서 잡은 돌이 살아나는 경우라면
		//그 돌을 잡게된 마지막 돌에서 제거하고
		//이동한 후 돌을 잡게 되는 경우라면
		//그 돌을 잡게된 마지막 돌에 잡은 돌을 추가해야 한다.
		//사석중 하나를 골라 연결된 모든 돌을 얻은 후
		//그 돌의 외곽 돌 중 가장 수순이 높은 돌...

        return true;
    }

    //아무 처리도 하지 않은 경우
    return false;

};


BdkCanvas.prototype.rButtonDownManage = function(eX, eY, event)
{
    return false;
};

BdkCanvas.prototype.rButtonUpManage = function(eX, eY, event)
{
    if(this.mIsValidPlace) this.movePrevManage(true);
    else return false;

    return true;
};	

BdkCanvas.prototype.mouseOutManage = function(eX, eY)
{
	//차후 만약 처리해야 한다면...
	//보드 영역 안에 있는 경우는 리턴시킨다.
	//window 같은 팝업이 뜰 때... 영역안에 있어도 mouseOut 이 호출된다.
	/*
    //바둑돌 이동 모드가 아닌 경우만 체크
    if (!this.mIsStoneMove)
    {
        this.mIsValidPlace = false;

        //영역 밖으로 나가기 전에 보드 영역 안에 있었는지
        if (this.mCurBdPt.isValid())
        {
            if(this.isDrawPlaceMark())
                this.invalidateStoneRect(this.mCurBdPt.nX, this.mCurBdPt.nY);
            this.mCurBdPt.invalidPt();
        }
    }
    */
};

BdkCanvas.prototype.lButtonDblClkManage = function(eX, eY, event)
{
    //바둑돌을 더블클릭한 경우
    if(!this.mIsValidPlace && this.mBoardRect.contains(eX, eY))
    {
        var node = this.mContent.mCurFocusData;
        if(node)
        {
            if(node.hasChildContent()) this.showLinkedContent(node);
            else this.showMoveToOrder(node.nOrder+1);

            return true;
        }
    }
    
    return false;
};

BdkCanvas.prototype.mButtonUpManage = function(nFlags, point)
{
	return false;
};

BdkCanvas.prototype.mButtonDownManage = function(nFlags, point)
{
	return false;
};

BdkCanvas.prototype.mouseWheelManage = function(nFlags, zDelta, pt)
{
	/*
	int nMove = zDelta/120;

	//move prev
	if(nMove>0) MovePrevManage(FALSE);

	//move next
	else MoveNextManage(FALSE);

	return TRUE;
	*/
};

BdkCanvas.prototype.keyUpManage = function(nChar, nRepCnt, nFlags)
{
	/*
	switch(nChar)
	{
	case VK_DELETE:
		RemoveBackStone();
		break;

	default:
		return FALSE;
	}

	return TRUE;
	*/
};

BdkCanvas.prototype.keyDownManage = function(nChar, nRepCnt, nFlags)
{
	/*
	switch(nChar)
	{
		case VK_HOME: moveFirstManage(); break;
		case VK_END: moveLastManage(); break;

		case VK_UP: 
			if(GetKeyState(VK_CONTROL)<0) moveFirstManage();
			else moveFPrevManage(); 
		break;

		case VK_DOWN: 
			if(GetKeyState(VK_CONTROL)<0) moveLastManage();
			else moveFNextManage(); 
		break;

		case VK_LEFT:
			if(GetKeyState(VK_CONTROL)<0) moveFPrevManage();
			else movePrevManage();
		break;

		case VK_RIGHT:
		case VK_SPACE:
			if(mGetKeyState(VK_CONTROL)<0) moveFNextManage();
			else moveNextManage();
		break;

		case VK_BACK:
			showBeforeContent();
		break;

		case VK_ESCAPE:
			showParentContent();
		break;

		default:
		return FALSE;
	}

	return TRUE;
	*/
};




//------------------------------------------------------
//  돌 이동 관련 함수
//------------------------------------------------------
BdkCanvas.prototype.moveFirstManage = function()
{
    if(this.mContent.mIsTryStone) this.tryShowMoveFirst();
    else this.showMoveFirst();
};

BdkCanvas.prototype.moveFPrevManage = function()
{
    if(this.mContent.mIsTryStone) this.tryShowFMovePrev(bs.FASTMOVE_NUM);
    else this.showFMovePrev(bs.FASTMOVE_NUM, true);
};

BdkCanvas.prototype.movePrevManage = function()
{
    if(this.mContent.mIsTryStone) this.tryShowMovePrev();
    else this.showMovePrev(true);
};

BdkCanvas.prototype.moveNextManage = function()
{
    if(this.mContent.mIsTryStone) this.tryShowMoveNext();
    else this.showMoveNext(true);
};

BdkCanvas.prototype.moveFNextManage = function()
{
    if(this.mContent.mIsTryStone) this.tryShowFMoveNext(bs.FASTMOVE_NUM);
    else this.showFMoveNext(bs.FASTMOVE_NUM, true);
};

BdkCanvas.prototype.moveLastManage = function()
{
    if(this.mContent.mIsTryStone) this.tryShowMoveLast();
    else this.showMoveLast();
};

BdkCanvas.prototype.tryShowMovePrev = function()
{
    if(this.mContent.isTryNodeFirst()) return false;

	var list = this.mContent.mTryList;
	
    this.mContent.whenStoneShowHide(list[list.showPos--], bs.STATE_HIDE);

    this.updateBoard();

    return true;
};

BdkCanvas.prototype.tryShowMoveNext = function()
{
    if(this.mContent.isTryNodeLast()) return false;

	var list = this.mContent.mTryList;
    
    this.mContent.whenStoneShowHide(list[++list.showPos], bs.STATE_SHOW);

    this.playSound(BdkCanvas.sAddSnd);
	
    this.updateBoard();

    return true;
};

BdkCanvas.prototype.tryShowFMovePrev = function(nMove)
{
    if(this.mContent.isTryNodeFirst()) return false;

    var list = this.mContent.mTryList;
    
    for(var i=0; i<nMove; ++i)
    {
        this.mContent.whenStoneShowHide(list[list.showPos--], bs.STATE_HIDE);

        if(this.mContent.isTryNodeFirst()) break;
    }

    this.updateBoard();

    return true;
};

BdkCanvas.prototype.tryShowFMoveNext = function(nMove)
{
    if(this.mContent.isTryNodeLast()) return false;

    var list = this.mContent.mTryList;

    for(var i=0; i<nMove; ++i)
    {
        this.mContent.whenStoneShowHide(list[++list.showPos], bs.STATE_SHOW);
        
        if(this.mContent.isTryNodeLast()) break;
    }

    this.playSound(BdkCanvas.sAddSnd);
	
	this.updateBoard();

    return true;
};

//놓아보기 처음, 마지막 이동
BdkCanvas.prototype.tryShowMoveFirst = function() { return this.tryShowFMovePrev(bs.MOVE_FIRST); };
BdkCanvas.prototype.tryShowMoveLast = function() { return this.tryShowFMoveNext(bs.MOVE_LAST); };


//수순이동 관련(이전)
BdkCanvas.prototype.showMovePrev = function(isReport)
{
    if(this.mContent.isNodeFirst()) return false;
	
	var list = this.mContent.getCurNodeList(), node = null;

    this.mContent.whenStoneShowHide(list[list.showPos--], bs.STATE_HIDE);
	
	
	//노드의 처음까지 이동한 경우 확장 노드인지를 체크하여 부모 노드리스트로 이동
	if(this.mContent.isNodeFirst()) 
	{
		//확장노드인지 체크
		var parentList = list.getParentNodeList();
		if(parentList) 
		{
			//부모 노드리스트로 변경
			this.mContent.setCurNodeList(parentList, 0); //포지션 변경 없음.

			node = parentList.getShowPosNode();
			if(node)
			{
				node.selectExtList(null);		//확장노드 선택값 초기화
				this.focusChangeManage(node);	//마지막 돌로 포커스 변경
			}
		}
		else 
		{
			if(!this.mContent.mVNodeData.isExtListEmpty()) 
			{
				this.mContent.setCurNodeList(this.mContent.getDefNodeList(), 0); //포지션 변경 없음.
				this.mContent.mVNodeData.selectExtList(null);
			}

			this.focusChangeManage(null);
		}
	}
	else
	{
		node = this.mContent.getLastShowNode();
		//포커스를 마지막 보여지는 돌로 이동하기 위해
		this.focusChangeManage(node);
	}

	this.updateBoard();
	
	if(isReport) this.reportEvent('move', node, null);
	
	return true;
};

//수순이동 관련(다음)
BdkCanvas.prototype.showMoveNext = function(isReport)
{
	if(this.mContent.isNodeLast()) return false;
	
	var list = this.mContent.getCurNodeList(),
		node = list[++list.showPos],
		bNotifyRef = node.hasChildContent();
		
    this.mContent.whenStoneShowHide(node, bs.STATE_SHOW);
	
	//포커스를 마지막으로 이동
	this.focusChangeManage(node);

	if(bNotifyRef && this.isReferShow()) this.playSound(BdkCanvas.sNotifySnd);
	else this.playSound(BdkCanvas.sAddSnd);
	
	this.updateBoard();
	
	if(isReport) this.reportEvent('move', node, null);

	return true;
};

//한번에 여러개씩 이동, nMove 가 MOVE_FIRST 면 첨으로 간다.
BdkCanvas.prototype.showFMovePrev = function(nMove, isReport)
{
    if(this.mContent.isNodeFirst()) return false;

    var list = this.mContent.getCurNodeList(), i, node = null;

    for(i=0; i<nMove; ++i)
    {
        this.mContent.whenStoneShowHide(list[list.showPos--], bs.STATE_HIDE);

        if(this.mContent.isNodeFirst()) 
		{
			i++;
			break;
		}
    }

	//포커스를 마지막으로 이동
	//처음인 경우는 포커스를 제거한다.
	//asoo update
	//노드의 처음까지 이동한 경우 확장 노드인지를 체크하여 부모 노드리스트로 이동

	if(this.mContent.isNodeFirst()) 
	{
		//확장노드인지 체크
		var parentList = list.getParentNodeList();
		if(parentList) 
		{
			//부모 노드리스트로 변경
			this.mContent.setCurNodeList(parentList, 0); //포지션 변경 없음.
			
			
			
			node = parentList.getShowPosNode();
			if(node)
			{
				node.selectExtList(null);		//확장노드 선택값 초기화
				
				//asoo test
				if(i<nMove)
				{
					return this.showFMovePrev(nMove-i);
				}
				//----
				
				this.focusChangeManage(node);	//마지막 돌로 포커스 변경
			}
		}
		else 
		{
			//asoo update
			if(!this.mContent.mVNodeData.isExtListEmpty()) 
			{
				this.mContent.setCurNodeList(this.mContent.getDefNodeList(), 0); //포지션 변경 없음.
				this.mContent.mVNodeData.selectExtList(null);
			}

			this.focusChangeManage(null);
		}
	}
	else
	{
		node = this.mContent.getLastShowNode();
		
		//포커스를 마지막 보여지는 돌로 이동하기 위해
		this.focusChangeManage(node);
	}

	this.updateBoard();
	
	if(isReport) this.reportEvent('move', node, null);

	return true;
};

//한번에 여러개씩 이동, nMove 가 MOVE_LAST 면 마지막으로 간다.
BdkCanvas.prototype.showFMoveNext = function(nMove, isReport)
{
    if(this.mContent.isNodeLast()) return false;

    var list = this.mContent.getCurNodeList(), node = null;

    for(var i=0; i<nMove; ++i)
    {
        this.mContent.whenStoneShowHide(list[++list.showPos], bs.STATE_SHOW);

        if(this.mContent.isNodeLast()) break;
    }

    //포커스를 이동한 마지막 돌에 줌
	node = this.mContent.getLastShowNode();
    this.focusChangeManage(node);

    this.playSound(BdkCanvas.sAddSnd);
	
	this.updateBoard();
	
	if(isReport) this.reportEvent('move', node, null);

    return true;
};

//처음, 마지막 이동
BdkCanvas.prototype.showMoveFirst = function() { return this.showFMovePrev(bs.MOVE_FIRST); };
BdkCanvas.prototype.showMoveLast = function() { return this.showFMoveNext(bs.MOVE_LAST); };


/**
 * 특정 수순까지 이동하게 하는 함수 
 * @param {Integer} nOrder
 */
BdkCanvas.prototype.showMoveToOrder = function(nOrder)
{
    //놓여진 돌이 없으면 바로 리턴
    if(this.mContent.isDataEmpty()) return;
    
    var lastNode = this.mContent.getLastShowNode(),
    	nMove = 0;

	if(lastNode) nMove = nOrder - lastNode.nOrder;
	else nMove = nOrder + 1;
    
    if(nMove<0) this.showFMovePrev(nMove*-1);
    else if(nMove>0) this.showFMoveNext(nMove);
};

//bdk 컨텐츠가 변경된 경우 호출
BdkCanvas.prototype.changeContentManage = function(content, nAct)
{
    this.mContent = content;

    //this.resetCurSwitchStone();

    switch(nAct)
    {
        case bs.MOVE_FIRST:
            this.showMoveFirst();
        break;

        case bs.MOVE_LAST:
            this.showMoveLast();
        break;
    }

    this.resizeBoardManage();
};

BdkCanvas.prototype.setDefaultContent = function(className)
{
	var content;
	
	if(className) content = new window[className]();
	else content = new bs.BdkContent();
	
    content.createBoardLine(bs.BOARD_LINES[bs.TYPE_19]);
	
	this.changeContentManage(content);
	
	return content;
};

BdkCanvas.prototype.getContent = function()
{
	return this.mContent;
};

BdkCanvas.prototype.resizeBoardManage = function()
{
    this.colculBoardSize(this.element.width, this.element.height);
    this.updateBoard();
};


BdkCanvas.prototype.resizeCanvas = function()
{
	ACanvas.prototype.resizeCanvas.call(this);
	
	
    //사이즈가 바뀌면 context 정보가 초기화되므로 다시 셋팅한다.
    this.resetDefaultContext();
    
    if(this.mContent) this.resizeBoardManage();
};

/*
BdkCanvas.prototype.resizeBdkView = function(width, height)
{
    this.element.width = width;
    this.element.height = height;

    //사이즈가 바뀌면 context 정보가 초기화되므로 다시 셋팅한다.
    this.resetDefaultContext();
    
    if(this.mContent) this.resizeBoardManage();
};
*/

BdkCanvas.prototype.setSelectedStone = function(selStone)
{
    this.mSelectedStone = selStone;
};

//바둑돌 포커스가 변경될 경우 처리
BdkCanvas.prototype.focusChangeManage = function(newFocus)
{
    var oldFocus = this.mContent.mCurFocusData;
    
    this.mContent.mCurFocusData = newFocus;
    
    if(oldFocus) 
    {
        //이전 포커스를 화면에서 지워준다.
        this.invalidateStoneRect(oldFocus.nX, oldFocus.nY);
    }
    
    //현재 돌에 포커스를 준다.
    if(newFocus) this.drawFocus();
};

BdkCanvas.prototype.showLinkedContent = function(node)
{
};

BdkCanvas.prototype.showParentContent = function()
{
};

BdkCanvas.prototype.showBeforeContent = function()
{
};

BdkCanvas.prototype.turnBoard = function(dir)
{
	this.mContent.turnManage(dir);
	
	this.updateBoard();
};

