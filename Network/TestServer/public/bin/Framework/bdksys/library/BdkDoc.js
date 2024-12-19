

function BdkDoc()
{
	ADocument.call(this);
	
	
    this.mGiboId = null;
	
	this.mBdkContents = new Array();
	
    //현재 활성화된 CBdkContent index
    this.mActiveIndex = -1;
    //바로 이전 활성화 됐던 index
    this.mOldActiveIndex = -1;
    
}
afc.extendsClass(BdkDoc, ADocument);


//현재 활성화된 CBdkContent 를 반환
BdkDoc.prototype.getActiveContent = function()
{
    if(this.mActiveIndex<0 || this.mBdkContents.length==0) return null;
    else return this.mBdkContents[this.mActiveIndex];
};

//현재 활성화된 CBdkContent 의 리스트를 반환
BdkDoc.prototype.getActiveList = function()
{
    if(this.mActiveIndex<0 || this.mBdkContents.length==0) return null;
    else return this.mBdkContents[this.mActiveIndex].mDataList;
};

//활성화된 콘텐츠 index를 리턴
BdkDoc.prototype.getActiveIndex = function() { return this.mActiveIndex; };
BdkDoc.prototype.getOldActiveIndex = function() { return this.mOldActiveIndex; };
BdkDoc.prototype.getContentSize = function() { return this.mBdkContents.length; };

BdkDoc.prototype.getBdkContents = function() { return this.mBdkContents; };
BdkDoc.prototype.addBdkContent = function(content) { this.mBdkContents.push(content); };
BdkDoc.prototype.getContent = function(index)//:BdkContent
{
    if(index<0 || index>=this.mBdkContents.length) return null;
    else return this.mBdkContents[index];
};

//모든 컨텐츠를 삭제
BdkDoc.prototype.destroyBdkContents = function()
{
    //clear all
    this.mBdkContents.length = 0;// .splice(0, this.mBdkContents.length);
};

//파라미터의 인덱스를 리턴한다. 시작인덱스 부터 오름차순 또는 내림차순으로 검색
BdkDoc.prototype.indexOf = function(content, start, isInc)
{
    if(isInc)
    {
        var size = this.mBdkContents.length;
        for(var i=start; i<size; i++)
            if(this.mBdkContents[i]===content) return i;
    }
    else
    {
        for(var i=start; i>=0; i--)
            if(this.mBdkContents[i]===content) return i;
    }

    return -1;
};



//활성화되는 항목이 바뀔때마다 처리해줘야 하는 내용들
BdkDoc.prototype.activeContentChange = function(nActiveIndex, nAct)
{
    if(this.mActiveIndex==nActiveIndex) return;

    this.mOldActiveIndex = this.mActiveIndex;

    this.mActiveIndex = nActiveIndex;

    //컨텐츠 변경을 뷰에 적용한다.
    this.view.bdkCanvas.changeContentManage(this.getActiveContent(), nAct);
};


BdkDoc.prototype.activePrevContent = function()
{
	var nIndex = this.getActiveIndex() - 1;
	if(nIndex<0) nIndex = this.getContentSize() - 1;

	this.activeContentChange(nIndex);
};

BdkDoc.prototype.activeNextContent = function()
{
	var nIndex = (this.getActiveIndex()+1) % this.getContentSize();
	this.activeContentChange(nIndex);
};


//새로운 CBdkContent 를 추가한다.
BdkDoc.prototype.addNewBdkContent = function(strListName, strExp, nType, nLineType, bRelated, bCutCopy, bInsert)
{
    //콘텐츠 변수에 추가
    var content = new bs.BdkContent();
    var active = this.getActiveContent();

    if(nType==bs.EMPTY_CON)
    {
        if(bCutCopy) content.createBoardLine(active.mBoardLine);
        else content.createBoardLine(bs.BOARD_LINES[nLineType]);
    }

    //변화도,참고도인 경우 복사
    else 
    {
        content.createBoardLine(active.mBoardLine);
        content.copyContentData(active, active.mCurFocusData, nType, false, false, false);

        if(bRelated)
        {
            //연관된 기보로 추가
            content.setParentContent(active, true);
            active.addChildContent(content, true);
        }
    }

    if(bCutCopy) content.copyCutBoardInfo(active);

    content.mListName = strListName;
    content.mComment = strExp;

    var nIndex = 0;
    if(bInsert) 
    {
        nIndex = this.getActiveIndex() + 1;
        this.mBdkContents.splice(nIndex, 0, content);
    }
    else 
    {
        this.mBdkContents.push(content);
        nIndex = this.mBdkContents.length - 1;
    }

    //새로추가된 콘텐츠를 활성화
    this.activeContentChange(nIndex);
};

//하나의 컨텐츠를 삭제
BdkDoc.prototype.deleteContent = function(nIndex)
{
    var content = this.getContent(nIndex);
    if(!content) return false;

    if(this.mActiveIndex==nIndex) this.mActiveIndex = -1;

	//자신이 지워지면서 자신과 연관되어 있던 정보를 지운다.
	content.clearAllRelated();
	
	//필요없어 보임. 차후 mfc 확인후 지우기
    //content.removeAllNodeData();

    this.mBdkContents.splice(nIndex, 1);

    return true;
};








