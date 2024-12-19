

bs.MarkManage = function(content)
{
    this.mContent = content;
    this.mMarks = null;
	this.mMarkList = new Array();
	
	for(var i=0; i<bs.MARK_SIZE; ++i)
		this.mMarkList.push(new bs.NodeList());
};

//체크를 위한 2차원 배열 생성
bs.MarkManage.prototype.createBoardData = function()
{
    this.mMarks = bs.allocArray2(this.mContent.mBoardLine);
    this.clearManage();
};
        
//생성한 배열 및 기타 해제
bs.MarkManage.prototype.destroyBoardData = function()
{
    bs.freeArray2(this.mMarks, this.mContent.mBoardLine);
    this.mMarks = null;
};

bs.MarkManage.prototype.clearManage = function()
{
    for(var i=0; i<bs.MARK_SIZE; ++i)
        this.mMarkList[i].length = 0; //clear all

    bs.setArray2(this.mMarks, this.mContent.mBoardLine, 0);
};

bs.MarkManage.prototype.getMark = function(nX, nY) { return this.mMarks[nX][nY]; }; 
bs.MarkManage.prototype.setMarkArray = function(nX, nY, node) { this.mMarks[nX][nY] = node; };
bs.MarkManage.prototype.getAllMarkList = function() { return this.mMarkList; };

bs.MarkManage.prototype.isEmpty = function()
{
	for(var i=0; i<bs.MARK_SIZE; i++)
		if(this.mMarkList[i].length>0) return false;
			
	return true;
};

/**
 * 
 * @param {NodeData} node
 * @param {Boolean} bAutoInc
 */
bs.MarkManage.prototype.addMark = function(node, bAutoInc)
{
    var list = this.getMarkListByKind(node.chKind);

    if(bAutoInc)
    {
        if(list.length==0) 
        {
            if(node.chKind==bs.ENG_MARK) node.nOrder = bs.ASCII_A;
            else node.nOrder = 0;
        }
        else
        {
            var end = list.getLastNode();
            node.nOrder = end.nOrder + 1;
        }
    }

    list.push(node);

    this.mMarks[node.nX][node.nY] = node;
};

bs.MarkManage.prototype.removeMark = function(nX, nY)
{
    var node = this.mMarks[nX][nY];

    if(node==null) return null;

    var list = this.getMarkListByKind(node.chKind);

    //현재 자리에서 보이고 있는 것을 지운다.
    //즉, 가장 마지막 마크를 지운다.
    //마크유지 모드와 소유모드가 있으므로
    //같은 자리에 다른 마크가 있을 수 있으므로
    
    var tmp;
    for(var i=list.length-1; i>=0; i--)
    {
        tmp = list[i];
        if(tmp.nX==node.nX && tmp.nY==node.nY) 
        {
            this.mMarks[node.nX][node.nY] = null;
            list.splice(i, 1);

            return node;
        }
    }

    return null;
};

bs.MarkManage.prototype.copy = function(source)
{
    for(var i=0; i<bs.MARK_SIZE; ++i)
    {
        this.mMarkList[i].length = 0; //clear all
        
    	var length = source.mMarkList[i].length;
    	for(var j=0; j<length; j++)
    	{
			copyNode = new bs.NodeData();
			copyNode.copy(source.mMarkList[i][j]);
			
			this.mMarkList[i].push(copyNode);
    	}
    }

    bs.cpyArray2(this.mMarks, source.mMarks, this.mContent.mBoardLine);
};

bs.MarkManage.prototype.getMarkListByKind = function(kind)
{
	switch(kind)
	{
		case bs.ENG_MARK: return this.mMarkList[0];
		case bs.KOR_MARK: return this.mMarkList[1];
		case bs.NUM_MARK: return this.mMarkList[2];
	}
			
	return this.mMarkList[3];
};


