
/**
Constructor
Do not call Function in Constructor.
*/
class WebQueryData(aquery)
{
	super(aquery);

	

}
extends AQueryData;


function WebQueryData*inBlockBuffer(sendObj)
{
	sendObj.body = this.getQueryObj();
};


function WebQueryData*outBlockData(recvObj)
{
	this.setQueryObj(recvObj.body);
	
};
