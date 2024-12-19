/**
 * @author asoo
 */

function JFGParser()
{
	XParser.call(this);
    
    this.mDoc = null;
    this.mContent = null;
	this.mType = 'JFG';
}
afc.extendsClass(JFGParser, XParser);


JFGParser.VERSION_1002 = 1002;
JFGParser.VERSION_1003 = 1003;
JFGParser.VERSION_LAST = JFGParser.VERSION_1003;

JFGParser.makeContent = function(doc)
{
	return new bs.BdkContent();
};

JFGParser.prototype.loadData = function(doc, strData)
{
    this.mDoc = doc;
	
    this.parseData(strData);
};

JFGParser.prototype.preStoreData = function(obj)
{
    //저장 시작
    
    obj.info = { ver:JFGParser.VERSION_LAST, type:this.mType };
};

JFGParser.prototype.postStoreData = function(obj)
{
    //저장 종료

};

//jfg 전용이므로 효율을 위해 역순으로 검색한다.
JFGParser.prototype.indexOfContent = function(contents, content, start)
{
    for(var i=start; i>=0; --i)
        if(contents[i]===content) return i;

    return -1;    
};


//json 객체를 최종적으로 JSON.stringify(obj, null); 호출로 직렬화 한다.
//그 결과는 IljimaeStudio 의 JFGParser 의 store 함수 결과와 같다.

JFGParser.prototype.storeData = function(doc, transContents)
{
    if(!transContents) transContents = doc.getBdkContents();

    //임시로 정보를 저장하기 위해 사용한다.
    var nTemp, sTemp = [];
    
    var obj = { gnm: doc ? doc.docName : '' };
    var content, parent, data, length, j, k;

//--------------------------------
//  저장 시작
    this.preStoreData(obj);

    
    obj.data = new Array();

    for(var i=0; i<transContents.length; i++)
    {
        content = transContents[i];

        content.mParentIndex = -1;
        content.mParentNodeNum = -1;

        parent = content.getParentContent();
        //자신의 부모 연관도
        if(parent) 
        {
            content.mParentIndex = this.indexOfContent(transContents, parent, i-1);

            //부모 연관도의 연관돌
            if(content.getParentNodeData()) 
                content.mParentNodeNum = content.getParentNodeData().nOrder;
        }
        
        //하나의 컨텐츠 데이터 셋팅 
        var jcon = {};
        obj.data.push(jcon);

        jcon.pinx = content.mParentIndex;   //부모 컨텐츠의 인덱스 저장, 맨 처음에 저장해야 함.
        jcon.pnn = content.mParentNodeNum;  //부모 연관돌의 수순, parent node number
        jcon.ctyp = content.mContentType;   //기보항목의 유형
        jcon.bdln = content.mBoardLine;     //바둑판 줄 수

        //잘려진 바둑판 정보
        if(content.isBoardCut())
        {
            jcon.cutf = String.fromCharCode(bs.ASCII_a+content.mCutRt.left) + 
                    String.fromCharCode(bs.ASCII_a+content.mCutRt.top) + 
                    String.fromCharCode(bs.ASCII_a+content.mCutRt.right) + 
                    String.fromCharCode(bs.ASCII_a+content.mCutRt.bottom);
        }
        
        //컨텐츠 서브 제목
        if(content.mComment)
        {
            //content.mComment.Replace(L"\"",L"\\\"");
            jcon.stit = content.mComment;
        }

        /////////////////////////////////////////
        //  mNoOrderList
        //  수순과 상관없는 기본 바둑돌
		//
        //  "def" : "Babqr|Wcdkgefgf"

        sTemp[0] = "B";
        sTemp[1] = "W";

        length = content.mNoOrderList.length;
        for(j=0; j<length; j++)
        {
            data = content.mNoOrderList[j];
            
            if(data.chKind==bs.BLACK) 
            {
                sTemp[0] += String.fromCharCode(bs.ASCII_a + data.nX);
                sTemp[0] += String.fromCharCode(bs.ASCII_a + data.nY);
            }
            else 
            {
                sTemp[1] += String.fromCharCode(bs.ASCII_a + data.nX);
                sTemp[1] += String.fromCharCode(bs.ASCII_a + data.nY);
            }
        }        

        //정보를 취합한다.
        sTemp[2] = "";
        for(j=0; j<2; j++)
        {
            //정보가 있으면 
            if(sTemp[j].length>1)
                sTemp[2] += (sTemp[j]+"|");
        }
        //정보가 있는 경우만 저장
        if(sTemp[2].length>0) jcon.def = sTemp[2];


        //////////////////////////////////////////
        //  mark list
        //  마크 정보 저장
		//
        //  "mark" : "Tab|Cddee|Rfg|Earqr|Kedgs|Nkjjkgd"

        sTemp[0] = "E"; //English
        sTemp[1] = "K"; //Korean
        sTemp[2] = "N"; //Number
        sTemp[3] = "T"; //Triangle
        sTemp[4] = "R"; //Rectangle
        sTemp[5] = "C"; //Circle
        sTemp[6] = "";

        var markList = content.mMarkManage.getAllMarkList();

        for(j=0; j<bs.MARK_SIZE; j++)
        {
            //Node 저장
            length = markList[j].length;

            //ENG_MARK = 3, KOR_MARK = 4, NUM_MARK = 5, TRIANGLE_MARK = 6, RECTANGLE_MARK = 7, CIRCLE_MARK = 8 
            for(k=0; k<length; k++)
            {
                data = markList[j][k];
                nTemp = data.chKind - 3;

                //3자리를 확보한 후 숫자를 셋팅해야 하므로
                if(data.nOwnerStone<0) sTemp[6] = " " + data.nOwnerStone;   //" -1"
                else if(data.nOwnerStone<10) sTemp[6] = "  " + data.nOwnerStone;    //"  9"
                else if(data.nOwnerStone<100) sTemp[6] = " " + data.nOwnerStone;    //" 99"
                else sTemp[6] = "" + data.nOwnerStone;    //"999"
                
                sTemp[nTemp] += (String.fromCharCode(bs.ASCII_a + data.nX) + 
                        String.fromCharCode(bs.ASCII_a + data.nY) + sTemp[6]);

            }
        }

        //정보를 취합한다.
        sTemp[6] = "";
        for(j=0; j<6; j++)
        {
            //정보가 있으면
            if(sTemp[j].length>1)
                sTemp[6] += (sTemp[j]+"|");
        }
        //정보가 있는 경우만 저장
        if(sTemp[6].length>0) jcon.mark = sTemp[6];



		//////////////////////////////////////////
		//	mVNodeData 
		//	최초 확장 노드를 가지고 있을 가상의 돌, 형식은 하나의 node 와 같음.
		//
		//	"vnod": {inf: "Waa", num: 0 }
		
		jcon.vnod = this.getNodeDataInfo(content.mVNodeData);


		//////////////////////////////////////////
		//	mDefNodeList 
		//	수순관련 바둑돌
		//	"odr":
		//	[
		//		{
		//			inf: "Baq", num:21, exp:"하이", 
		//			ext: 
		//			[
		//				[ {inf: "Wdd", num:22, exp: "aaa" }, ... ], ...
		//			]
		//		}, ...
		//	]
		
		jcon.odr = this.getNodeListInfo( content.getDefNodeList() );
		

        ////////////////////////////////////////////////////////
        //  컨텐츠 설명 저장
        //  "cexp" : "하이 컨텐츠 설명"

        if(content.mExplain)
        {
            jcon.cexp = content.mExplain; 
        }

        //컨텐츠 메인 제목

        jcon.mtit = content.mListName;
    }


//--------------------------------
//  저장 종료
    this.postStoreData(obj);

    return JSON.stringify(obj, null);
};


JFGParser.prototype.parseData = function(strData)
{
    //다음 코드가 필요없어짐... 저장할 때 바꿔줌.
    //기존 파일을 열 때 오류가 나면 주석 풀고 열어봄.
    //strData = strData.replace(/\r/gi,"\\r");
    //strData = strData.replace(/\n/gi,"\\n");
    
    
    var json = JSON.parse(strData);
    var array = json.data;
    var content, sTemp = "", obj;
    
    this.mDoc.docName = json.gnm;
	this.mVersion = json.info.ver;
    
    for(var i=0; i<array.length; i++)
    {
        content = this.mContent = JFGParser.makeContent(this.mDoc);
        obj = array[i];
    
        //부모 컨텐츠의 인덱스 
        content.mParentIndex = obj.pinx;
        
        //BdkDoc에 추가
        this.mDoc.addBdkContent(content);
        
        //부모 연관돌의 수순, parent node number
        content.mParentNodeNum = obj.pnn;
		
        //기보항목의 유형, 버전에 따라 값이 없을 수도 있음.
        if(obj.ctyp) 
            content.mContentType = obj.ctyp;
			
        //바둑판 줄 수, 보드라인 메모리 생성
        content.createBoardLine(obj.bdln);
    
        //바둑판이 잘려진 정보, 정보가 있다면
        sTemp = obj.cutf;
        if(sTemp)
        {
            var pt1 = new bs.BDK_PT();
            var pt2 = new bs.BDK_PT();
        
            pt1.setPt(sTemp.charCodeAt(0)-bs.ASCII_a, sTemp.charCodeAt(1)-bs.ASCII_a);
            pt2.setPt(sTemp.charCodeAt(2)-bs.ASCII_a, sTemp.charCodeAt(3)-bs.ASCII_a);
        
            content.setCutBoardInfo(pt1, pt2);
        }
    
        //컨텐츠 제목
        content.mListName = obj.mtit;
        //컨텐츠 서브 제목
        if(obj.stit) content.mComment = obj.stit;
        
        //수순과 상관없는 바둑돌, def
        this.setDefaultData(obj.def);

        //마크 데이터, mark
        this.setMarkData(obj.mark);
		
		if(this.mVersion<=JFGParser.VERSION_1002) 
		{
			this.setOrderData_1002(obj.odr);
			
			if(obj.sexp)
			{
				var ja = obj.sexp, nodeData;

				for(var j=0; j<ja.length; j+=2)
				{
					nodeData = content.findStoneByOrder(ja[j]);
					nodeData.mExplain = ja[j+1];
				}
			}
		}
		else
		{
			//최초 확장 노드를 가지고 있을 가상의 돌 데이터 , vnod
			this.setNodeDataInfo(obj.vnod, this.mContent.mVNodeData);

			//수순이 매겨지는 바둑돌, "odr" : []
			this.setOrderData(obj.odr);
		}
    
        //------------------------------------------------------
        //  cexp : 하이 설명    
        //  현재 컨테츠에 대한 설명
        if(obj.cexp) content.mExplain = obj.cexp;
    }
    
};

// "def" : "Babqrdf|Wcdkgef", 수순과 상관없는 바둑돌
//
JFGParser.prototype.setDefaultData = function(strData)
{
    if(!strData) return;
    
    var node, token, chKind;
    var tokenArray = strData.split(bs.STR_SEPARATOR);
    
    for(var i=0; i<tokenArray.length; i++)
    {
        token = tokenArray[i];
        
        if(!token) continue;
        
        if(token.charCodeAt(0)==bs.ASCII_B) chKind = bs.BLACK;
        else chKind = bs.WHITE;
        
        for(var j=1; j<token.length; j+=2)
        {
            node = new bs.NodeData();
            
            node.nOrder = bs.NO_ORDER + this.mContent.mNoOrderList.length;
            node.chKind = chKind;
            node.nX = token.charCodeAt(j) - bs.ASCII_a;
            node.nY = token.charCodeAt(j+1) - bs.ASCII_a;
            
            this.mContent.mNoOrderList.push(node);
            this.mContent.mBrdChecker.setValue(node.nX, node.nY, node);
        }
    }
    
};
    
// "mark" : "Tabcd|Cddee|Rfgki|Earqr|Kedgs|Nkjjk",    마크
JFGParser.prototype.setMarkData = function(strData)
{
    if(!strData) return;
    
    var node, token, chKind, len;
    var tokenArray = strData.split(bs.STR_SEPARATOR);
    
    for(var i=0; i<tokenArray.length; i++)
    {
        token = tokenArray[i];
		
        if(!token) continue;
        
        chKind = this.getMarkKind(token.charCodeAt(0));
        
        len = token.length - 1;     //종류마크를 제외하기위해 -1
        for(var j=1; j<len; j+=5)   //하나의 마크는 무조건 5 자리이다.
        {
            node = new bs.NodeData();
            
            node.nOrder = Math.floor(j/5);//정수로 만든다.
            node.chKind = chKind;
            node.nX = token.charCodeAt(j) - bs.ASCII_a;
            node.nY = token.charCodeAt(j+1) - bs.ASCII_a;
            node.nOwnerStone = Number(token.substr(j+2,3));
            
            if(chKind==bs.ENG_MARK) node.nOrder += bs.ASCII_A;
            
            this.mContent.mMarkManage.addMark(node);
        }
    }
};

//////////////////////////////////////////
//	m_DefNodeList 
//	수순관련 바둑돌
//	"odr":
//	[
//		{
//			inf: "Baq", num:21, exp:"하이", 
//			ext: 
//			[
//				[ {inf: "Wdd", num:22, exp: "aaa" }, ... ],
//			]
//		}, ...
//	]

JFGParser.prototype.setOrderData = function(infoArr)
{
	if(infoArr.length==0) return;

	var defList = this.mContent.getDefNodeList(),
		node, nInfo, i;

	for(i=0; i<infoArr.length; ++i)
	{
		nInfo = infoArr[i];

		node = new bs.NodeData();
		defList.push(node);

		this.setNodeDataInfo(nInfo, node);

		this.mContent.belongedStoneManage(node, bs.STATE_SHOW);
		this.mContent.mBrdChecker.setValue(node.nX, node.nY, node);
		//착점시 잡은 돌이 있으면 잡은돌리스트에 추가한다.
		this.mContent.deadStoneCheck(node);
	}

	this.mContent.resetStartInfo();
};

JFGParser.prototype.setOrderData_1002 = function(strData)
{
    if(!strData) return;
    
    var node, token,
    	tokenArray = strData.split(bs.STR_SEPARATOR),
		defList = this.mContent.getDefNodeList();
    
    for(var i=0; i<tokenArray.length; i++)
    {
        token = tokenArray[i];
        if(token=="") continue;
        
        node = new bs.NodeData();
        
        node.nOrder = defList.length;
        
        if(token.charCodeAt(0)==bs.ASCII_B) node.chKind = bs.BLACK;
        else node.chKind = bs.WHITE;
        
        node.nX = token.charCodeAt(1) - bs.ASCII_a;
        node.nY = token.charCodeAt(2) - bs.ASCII_a;
        
        
        if(node.nX<19 && node.nY<19)
        {
            this.mContent.belongedStoneManage(node, bs.STATE_SHOW);

            defList.push(node);
            this.mContent.mBrdChecker.setValue(node.nX, node.nY, node);
            //착점시 잡은 돌이 있으면 잡은돌리스트에 추가한다.
            this.mContent.deadStoneCheck(node);
        }
    }
    
    this.mContent.resetStartInfo();

};

JFGParser.prototype.setNodeDataInfo = function(nInfo, node)
{
	//바둑돌 종류와 위치, ex) Bae, Wdq

	if(nInfo.inf.charCodeAt(0)==bs.ASCII_B) node.chKind = bs.BLACK;
	else node.chKind = bs.WHITE;

	node.nX = nInfo.inf.charCodeAt(1) - bs.ASCII_a;
	node.nY = nInfo.inf.charCodeAt(2) - bs.ASCII_a;

	node.nOrder = nInfo.num;

	//바둑돌 설명
	if(nInfo.exp)
	{
		node.mExplain = nInfo.exp;
		
		//기보 설명글을 rtf 형식으로 변경하여 버퍼에 셋팅한다.
		//m_pFrame->m_StoneExpBar.SetTextExpEdit(m_sTemp);
		//m_pFrame->m_StoneExpBar.EditToExpbuf(node);
	}

	//확장 노드 리스트
	if(nInfo.ext)
	{
		for(var i=0; i<nInfo.ext.length; i++)
		{
			this.setNodeListInfo(nInfo.ext[i], node.addExtList(null));
		}
	}
};

JFGParser.prototype.setNodeListInfo = function(listInfo, nodeList)
{
	var nInfo, node, i;

	for(i=0; i<listInfo.length; ++i)
	{
		nInfo = listInfo[i];

		node = new bs.NodeData();
		nodeList.push(node);

		this.setNodeDataInfo(nInfo, node);
	}
};

//-----------------------------------------------------------------------------------------


//	NodeData
//	{"inf":"Wpd","num":1,"exp":"2번돌 설명"}
JFGParser.prototype.getNodeDataInfo = function(node)
{
	var retObj = { inf:'', num:'' };

	if(node.chKind==bs.BLACK) retObj.inf = "B";
	else retObj.inf = "W";

	retObj.inf += String.fromCharCode(bs.ASCII_a + node.nX);
	retObj.inf += String.fromCharCode(bs.ASCII_a + node.nY);
	
	//수순 
	retObj.num = node.nOrder;

	//돌 하나에 대한 설명이 있는 경우
	if(node.mExplain) retObj.exp = node.mExplain; 
	
	//확장 리스트가 존재하는 경우
	if(!node.isExtListEmpty())
	{
		retObj.ext = [];
		
		var extList = node.getExtLists();

		for(var i=0; i<extList.length; i++)
		{
			//확장 노드를 가지고 있는 노드리스트 정보 저장
			retObj.ext.push( this.getNodeListInfo(extList[i]) );
		}
	}
	
	return retObj;
};

//	NodeList
//	[
//		{"inf":"Wpd","num":1,"exp":"2번돌 설명"}, 
//		{"inf":"Wpd","num":1,"exp":"2번돌 설명"},
//		...
//	]
JFGParser.prototype.getNodeListInfo = function(nodeList)
{
	var retArr = [];
	
	for(var i=0; i<nodeList.length; i++)
	{
		retArr.push( this.getNodeDataInfo(nodeList[i]) );
	}
	
	return retArr;
};

JFGParser.prototype.getMarkKind = function(kind)
{
    switch(kind)
    {
        case 69: return bs.ENG_MARK;            //'E'
        case 75: return bs.KOR_MARK;            //'K'
        case 78: return bs.NUM_MARK;            //'N'
        case 84: return bs.TRIANGLE_MARK;       //'T'
        case 82: return bs.RECTANGLE_MARK;      //'R'
        case 67: return bs.CIRCLE_MARK;         //'C'
    }
        
    return bs.ENG_MARK;
};
