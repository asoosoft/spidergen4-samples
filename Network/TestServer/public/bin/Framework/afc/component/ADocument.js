

function ADocument()
{
    this.docName = null;
    this.uri = null;		//url, path, ...
    this.docType = null;	//extention
	this.view = null;		//AView
    this.modified = false;
	
	this.isNewDoc = false;	//newDocument
	
	this.contents = '';
}

ADocument.prototype.getView = function()
{
    return this.view;
};

ADocument.prototype.setView = function(view)
{
    this.view = view;
};

ADocument.prototype.newDocument = function(uri, docName)
{
	this.uri = uri;
	this.docName = docName;
	
	this.isNewDoc = true;

	//if(this.view.onNewDocument)
	//	this.view.onNewDocument(this, docName);
};

ADocument.prototype.openDocument = function(openPath, callback)
{
	this.uri = openPath;
	this.docName = AUtil.extractFileName(openPath);
	
	this.isNewDoc = false;
	
	//if(this.view.onOpenDocument)
	//	this.view.onOpenDocument(this, openPath);
	
	return true;
};

//savePath 가 참이면 새 이름으로 저장
ADocument.prototype.saveDocument = function(savePath)
{
	if(savePath) this.uri = savePath;
	
	//파일명을 문서이름으로 셋팅한다.
	this.docName = AUtil.extractFileName(this.uri);
	
	this.isNewDoc = false;

	//if(this.view.onSaveDocument)
	//	this.view.onSaveDocument(this, savePath);
		
	return true;
};

ADocument.prototype.closeDocument = function()
{
	//if(this.view.onCloseDocument)
	//	this.view.onCloseDocument(this);
	
	this.docName = null;
	this.uri = null;
	this.contents = null;
	this.modified = false;
};

ADocument.prototype.isClosed = function()
{
	return (this.docName==null);
};

ADocument.prototype.isModified = function()
{
	return this.modified;
};

ADocument.prototype.setModifiedFlag = function(modified)
{
	this.modified = modified;
};

ADocument.prototype.reportModify = function(modified)
{
    if(this.isModified()!=modified)
	{
		this.setModifiedFlag(modified);
		
		if(theApp.mdiManager) 
			theApp.mdiManager.applyModifiedMark(this);
	}
};




