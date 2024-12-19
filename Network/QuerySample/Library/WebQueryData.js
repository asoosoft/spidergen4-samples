

WebQueryData = class WebQueryData extends AQueryData
{
    constructor(aquery)
    {
        super(aquery)
		
	
		
	
	

    }
}



WebQueryData.prototype.inBlockBuffer = function(sendObj)
{
	sendObj.body = this.getQueryObj();
};


WebQueryData.prototype.outBlockData = function(recvObj)
{
	this.setQueryObj(recvObj.body);
	
};
