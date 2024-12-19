
//class ARect

function ARect(l, t, w, h)
{
	if(h==undefined) this.setEmpty();
	else this.setSizeRect(l,t,w,h);
}

ARect.prototype.setPointRect = function(l, t, r, b)
{
	this.left = l;
	this.top = t;
	this.right = r;
	this.bottom = b;
	
	this.refreshSize();
};

ARect.prototype.setSizeRect = function(l, t, w, h)
{
	this.left = l;
	this.top = t;
	this.width = w;
	this.height = h;
	
	this.refreshRect();
};

ARect.prototype.offsetRect = function(offsetX, offsetY)
{
	this.left += offsetX;
	this.top += offsetY;
	this.right += offsetX;
	this.bottom += offsetY;
	
	this.refreshSize();
};


ARect.prototype.copyRect = function(src)
{
	this.left = src.left;
	this.top = src.top;
	this.right = src.right;
	this.bottom = src.bottom;
	
	this.refreshSize();
};

ARect.prototype.setEmpty = function()
{
	this.setSizeRect(0,0,0,0);
};

ARect.prototype.absRect = function()
{
	if(this.width<0) this.reverseX();
	if(this.height<0) this.reverseY();
};

ARect.prototype.reverseX = function()
{
	var tmp = this.left;
	this.left = this.right;
	this.right = tmp;
	this.refreshSize();
};

ARect.prototype.reverseY = function()
{
	var tmp = this.top;
	this.top = this.bottom;
	this.bottom = tmp;
	this.refreshSize();
};

ARect.prototype.refreshSize = function()
{
	this.width = this.right-this.left;
	this.height = this.bottom-this.top;
};

ARect.prototype.refreshRect = function()
{
	this.right = this.left+this.width;
	this.bottom = this.top+this.height;
};

ARect.prototype.isSubsetPt = function(x, y)
{
	return (x>this.left && x<this.right && y>this.top && y<this.bottom);
};

//포함하는 rect 인지
ARect.prototype.isSubsetRt = function(rt)
{
	return (rt.left>this.left && rt.right<this.right && rt.top>this.top && rt.bottom<this.bottom);
};

//교차하는 rect 인지
ARect.prototype.isIntersectRt = function(rt)
{
	return !(rt.left > this.right || rt.right < this.left || rt.top > this.bottom || rt.bottom < this.top);
};

ARect.prototype.isRectEmpty = function()
{
    return (this.width==0 && this.height==0);
};
