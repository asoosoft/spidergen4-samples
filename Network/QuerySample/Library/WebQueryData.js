

class WebQueryData extends AQueryData
{
    constructor(aquery)
    {
        super(aquery)
		
	
		
	
	

    }

	inBlockBuffer(sendObj)
	{
		sendObj.body = this.getQueryObj();
	}

	outBlockData(recvObj)
	{
		this.setQueryObj(recvObj.body);

	}
}


