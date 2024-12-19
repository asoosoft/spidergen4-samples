

//---------------------------------------
//	Class DomainCount
//---------------------------------------

bs.DomainCount = function()
{
	this.mCount = [ 0, 0 ];
	this.nodes = [ [], [] ];
	
	this.addVal = 0;
	this.domainVal = bs.EMPTY;
	this.falseDomainType = 0;			//가짜 집 타입
};

//0이면 빈집으로,0보다 크면 흑집, 0보다 작으면 백집
bs.DomainCount.prototype.getCount = function()
{
	return (this.mCount[bs.BLACK] - this.mCount[bs.WHITE]);
};


bs.DomainCount.prototype.reset = function(nX, nY, boardLine)
{
	this.mCount[0] = 0;
	this.mCount[1] = 0; 
	
	this.nodes[0].length = 0;
	this.nodes[1].length = 0;
	
	this.addVal = 0;
	this.oldVal = bs.EMPTY;
	this.domainVal = bs.EMPTY;
	this.falseDomainType = 0;
};

//계산한 결과를 저장하거나 얻어온다.
bs.DomainCount.prototype.getDomain = function() { return this.domainVal; };
bs.DomainCount.prototype.setDomain = function(domainVal) 
{ 
	this.oldVal = this.domainVal;
	this.domainVal = domainVal; 
};

bs.DomainCount.prototype.setFalseDomainType = function(falseDomainType) { this.falseDomainType = falseDomainType; };
bs.DomainCount.prototype.getFalseDomainType = function() { return this.falseDomainType; };


bs.DomainCount.prototype.setValue = function(node, value, isAdd)
{
	var nodeArr = this.nodes[node.chKind];
	
	//asoocool test
	
	if(nodeArr==null || nodeArr==undefined)
	{
		debugger;
	}
	
	
	//현 위치의 도메인에 영향력을 행사하는 node 들을 모두 저장해 둔다.
	if(isAdd) 
	{
		nodeArr.push(node);
		this.mCount[node.chKind] += value;
	}
	else
	{
		for(var i=0; i<nodeArr.length; i++)
		{
			if(nodeArr[i]===node)
			{
				nodeArr.splice(i, 1);
				this.mCount[node.chKind] -= value;
				break;
			}
		}
	}
};

bs.DomainCount.prototype.isOnly = function(nKind)
{
	return (this.nodes[nKind^1].length==0);
};
