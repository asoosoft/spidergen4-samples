
//the full name of framework 
var bdksys = 
{
	//stone kind
	EMPTY: -1, BLACK: 0, WHITE: 1, SWITCH: 2, ENG_MARK: 3, KOR_MARK: 4,
	NUM_MARK: 5, TRIANGLE_MARK: 6, RECTANGLE_MARK: 7, CIRCLE_MARK: 8,
				
	//CONTENT_TYPE 기보항목의 유형 (일반, 문제, 정답, 오답)
	NORMAL_TYPE: 0, QUESTION_TYPE: 1, CORRECT_TYPE: 2, WRONG_TYPE: 3,
	
	//BOARD_DIRECT
	CENTER: 0, TOP: 1, RIGHT: 2, BOTTOM: 4, LEFT: 8,
        
	//LINE_TYPE
	TYPE_9: 0, TYPE_11: 1, TYPE_13: 2, TYPE_15: 3, TYPE_17: 4, TYPE_19: 5, TYPE_SIZE: 6,
        
	//ADD_TYPE
	EMPTY_CON: 0, CHANGE_CON: 1, REFER_CON: 2, CORRECT_CON: 3, WRONG_CON: 4,
        
	//STONE_STATE, 돌의 처리를 어떻게 할지에 대한 상태, 함수 상황에 따라 다르게 사용된다. 
	STATE_DELETE: -1, STATE_HIDE: 0, STATE_SHOW: 1,
	//
		
	STONE_NUM: 2,
	MARK_SIZE: 4,
	TRYSTONE_ORDER: 1000,
	NO_ORDER: 2000,
	MOVE_FIRST: 10000,
	MOVE_LAST: 10001,
	FASTMOVE_NUM: 5,
	MARKON_VALUE: -2,
	DEFAULT_GAP: 10,          //뷰와 바둑판이 놓여질 사이의 기본 거리

	STR_SEPARATOR: "|",
	ASCII_A: 65, ASCII_B: 66, ASCII_a: 97, ASCII_b: 98,

	COLOR_BLACK: "#000000", COLOR_WHITE: "#FFFFFF", COLOR_RED: "#FF0000", COLOR_GREEN: "#00FF00", COLOR_BLUE: "#0000FF", 

	KOR_MARK_DATA: "가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허",


	BOARD_LINES: [9, 11, 13, 15, 17, 19],
	
};


bdksys.compLabel = 
{
	"BdkCanvas" : "BdkCanvas"
};


bdksys.defaultLib = 
{
	"library":
	[
		"bdksys.js",
		"NodeData.js",
		"NodeList.js",
		"NodeGroup.js",
		//"DomainCount.js",
		"BoardChecker.js",
		"MarkManage.js",
		//"DomainChecker.js", 
		"BdkContent.js"
	],
	
	"component":
	[
	],
	
	"event":
	[
	],
	
	"style":
	[
		"comp.css",
	]
};



//the short name of framework
var bs = bdksys;



// 4 x 2
bs.RoundLoc = 
[
	[-1,0], [0,-1], [1,0], [0,1]
];

bs.DiagonalLoc = 
[
	[-1,-1], [1,-1], [1,1], [-1,1]
];




//---------------------------------------
//	Class BDK_PT
//---------------------------------------
bs.BDK_PT = function(nX, nY)
{
	this.nX = (nX==undefined) ? -1 : nX;
	this.nY = (nY==undefined) ? -1 : nY;
};

bs.BDK_PT.prototype.setBdPt = function(other)
{ 
	this.nX = other.nX; 
	this.nY = other.nY; 
};

bs.BDK_PT.prototype.setPt = function(x, y)
{ 
	this.nX = x; 
	this.nY = y; 
};

bs.BDK_PT.prototype.invalidPt = function()
{ 
	this.nX = -1; 
	this.nY = -1; 
};

bs.BDK_PT.prototype.isValid = function() 
{ 
	return (this.nX!=-1); 
};

bs.BDK_PT.prototype.isEqual = function(other)
{
	return (this.nX==other.nX && this.nY==other.nY);
};



//---------------------------------------
//	Class Rect
//---------------------------------------
bs.Rect = function()
{
	this.left = 0;
	this.top = 0;
	this.right = 0;
	this.bottom = 0;
};

bs.Rect.prototype.setRect = function(l, t, r, b)
{
	this.left = l;
	this.top = t;
	this.right = r;
	this.bottom = b;
};

bs.Rect.prototype.copyRect = function(src)
{
	this.left = src.left;
	this.top = src.top;
	this.right = src.right;
	this.bottom = src.bottom;
};

bs.Rect.prototype.setEmpty = function()
{
	this.setRect(0,0,0,0);
};

bs.Rect.prototype.width = function()
{
	return (this.right - this.left);
};

bs.Rect.prototype.height = function()
{
	return (this.bottom - this.top);
};

bs.Rect.prototype.contains = function(x, y)
{
	//return (x>=this.left && x<=this.right && y>=this.top && y<=this.bottom);
	return (x>this.left && x<this.right && y>this.top && y<this.bottom);
};

bs.Rect.prototype.isRectEmpty = function()
{
    return (this.width()==0 && this.height()==0);
};


//---------------------------------------
//	Class StoneCount
//---------------------------------------

bs.StoneCount = function()
{
	this.nBlack = 0;
	this.nWhite = 0;
};

bs.StoneCount.prototype.setCount = function(nBlack, nWhite)
{ 
	this.nBlack = nBlack;
	this.nWhite = nWhite;
};


//---------------------------------------------------------------------
// Util Area
//---------------------------------------------------------------------

//2차원 배열 생성
bs.allocArray2 = function(nLine, nValue)
{
	var arr = new Array(nLine), i, j, tmpArr;
	
	for(i=0; i<nLine; ++i)
	{
		arr[i] = new Array(nLine);
		
		if(nValue!=undefined)
		{
			tmpArr = arr[i];
			
			for(j=0; j<nLine; j++)
			{
				if(typeof(nValue) == 'function') tmpArr[j] = nValue(i, j);
				else tmpArr[j] = nValue;
			}
		}
	}
	
	return arr;
};

//2차원 배열 해제
bs.freeArray2 = function(arr, nLine)
{
	for(var i=0; i<nLine; ++i) 
		arr[i] = undefined;
	arr = undefined;
};

//2차원 배열에 기본값 셋팅
bs.setArray2 = function(arr, nLine, nValue)
{
	var i, j, tmpArr, retVal;
	for(i=0; i<nLine; ++i) 
	{
		tmpArr = arr[i];
		
		for(j=0; j<nLine; ++j)
		{
			if(typeof(nValue) == 'function') 
			{
				//원소가 오브젝트일 경우 넘겨주면 함수내부에서 멤버값을 변경할 수도 있다.
				retVal = nValue(tmpArr[j], i, j);
				//리턴값이 있으면 그 값으로 덮어 쓴다.
				if(retVal!=undefined) tmpArr[j] = retVal;
			}
			else tmpArr[j] = nValue;
		}
	}
};

//2차원 배열 복사
bs.cpyArray2 = function(dstArray, srcArray, nLine)
{
	for(var i=0; i<nLine; ++i) 
	{
		for(var j=0; j<nLine; ++j)
			dstArray[i][j] = srcArray[i][j];
	}
};

bs.turnLeft = function(node, nBoardLine)
{
	var temp = node.nX;
	node.nX = node.nY;
	node.nY = (nBoardLine-1) - temp;
};

bs.turnRight = function(node, nBoardLine)
{
	var temp = node.nY;
	node.nY = node.nX;
	node.nX = (nBoardLine-1) - temp;
};

//대각 축 회전
bs.diagonalRotate = function(node, nBoardLine)
{
	var temp = node.nY;
	node.nY = nBoardLine - node.nX - 1;
	node.nX = nBoardLine - temp - 1;
};

bs.drawDebug = function(context, x, y, message)
{
    context.textAlign = "left";
    context.textBaseline = "top";

	context.fillStyle = '#ffffff';
	context.fillRect(x, y, 500, 25);
	
    context.strokeStyle = '#000';
    context.fillStyle = '#000';	
	context.fillText(message, x, y);
	
    context.textAlign = "center";
    context.textBaseline = "middle";
};
