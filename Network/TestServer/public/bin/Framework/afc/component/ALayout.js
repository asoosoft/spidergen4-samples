/**
 * @author asoocool
 */

function ALayout()
{
    AComponent.call(this);

}
afc.extendsClass(ALayout, AComponent);

ALayout.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	
};


ALayout.prototype.setParent = function(parent)
{
	AComponent.prototype.setParent.call(this, parent);
	
	var children = this.getAllLayoutComps();
	
	for(var i=0; i<children.length; i++)
		children[i].setParent(parent);
};


ALayout.prototype.getAllLayoutComps = function()
{
	return [];
};

ALayout.prototype.eachChild = function(callback, isReverse)
{

};

ALayout.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	this.eachChild(function(acomp, inx)
	{
		acomp.updatePosition();
	});
};


ALayout.prototype.removeFromView = function(onlyRelease)
{
	this.eachChild(function(acomp, inx)
	{
		acomp.removeFromView(onlyRelease);
	});

	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

ALayout.prototype.changeCompIdPrefix = function() 
{
	var compId;
	
	this.eachChild(function(acomp, inx)
	{
		compId = acomp.getComponentId();
		
		//componentId 가 존재하면 새로운 compIdPrefix 가 적용되도록 다시 호출해 준다.
		if(compId) acomp.setComponentId(compId);
		
		//자신이 포함하고 있는 하위의 컴포넌트들도 바꿔주기 위해, AView, ALayout
		if(acomp.changeCompIdPrefix) acomp.changeCompIdPrefix();
	});
};

ALayout.prototype.getMappingCount = function()
{
	return this.getAllLayoutComps().length;
};

ALayout.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	var keyVal, children = this.getAllLayoutComps(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		keyVal = keyArr[i];
		if(keyVal) child.getQueryData(dataArr, [keyVal], queryData);
	}
};

ALayout.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var keyVal, children = this.getAllLayoutComps(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		if(child.mappingType==3) child.updateChildMappingComp(dataArr, queryData);
		else 
		{
			if(!keyArr) continue;
			keyVal = keyArr[i];
			if(keyVal) child.setQueryData(dataArr, [keyVal], queryData);
		}
	}
	
};

// 컴포넌트 내부에 드랍 가능여부 리턴
ALayout.prototype.getDroppable = function()
{
	return true;
};

ALayout.prototype.callSubActiveEvent = function(funcName, isFirst) 
{
	this.eachChild(function(acomp, inx)
	{
		if(acomp.callSubActiveEvent) acomp.callSubActiveEvent(funcName, isFirst);
	});

};
