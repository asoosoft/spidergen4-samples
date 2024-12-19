

WebQueryManager = class WebQueryManager extends QueryManager
{
    constructor()
    {
        super()
		
	
		
	
	

    }
}



WebQueryManager.prototype.onReceived = function(data, size)
{
	var recvObj = JSON.parse(data);
	
	this.packetInfo.packetId = recvObj.header.packet_id;

	this.queryProcess(recvObj);

	//console.log(data);
};

//사용할 AQueryData(또는 상속받은 클래스) 객체를 생성하여 리턴한다.
WebQueryManager.prototype.makeQueryData = function(aquery, isSend)
{
	return new WebQueryData(aquery);
};

WebQueryManager.prototype.makeHeader = function(queryData, sendObj, menuNo)
{
	var packetId = this.makePacketId();
	var qryName = queryData.getQueryName();

	sendObj.header = 
	{
		'packet_id' : packetId,
		'query_name' : qryName
	};
	
	return packetId;
};

//에러세팅
WebQueryManager.prototype.setErrorData = function(recvObj)
{
	this.errorData.errCode = recvObj.header.error_code;
	this.errorData.errMsg = recvObj.header.error_msg;
};
