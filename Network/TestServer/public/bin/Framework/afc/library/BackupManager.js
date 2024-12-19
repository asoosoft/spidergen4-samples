

function BackupManager()
{
	this.headStack = null;
	this.tailStack = null;
	this.maxRow = 50;
	this.restoreCount = 20;
	
	this.itemHeight = 0;
	this.itemContentCnt = 0;
	this.$contentEle = null;
	this.scrollEle = null;
	
	//백업되면서 변경된 스크롤 위치 복원
	this.backupScroll = 0;
	this.delegator = null;
}

/*
BackupManager.managerStack = [];

BackupManager.clearManagerStack = function()
{
	var len = BackupManager.managerStack.length;
	
	for(var i=0; i<len; i++)
		BackupManager.managerStack[i].destroy();
	
	BackupManager.managerStack = [];
};
*/

BackupManager.prototype.create = function(delegator, maxRow, restoreCount)
{
	this.delegator = delegator;
	
	//BackupManager.managerStack.push(this);
	
	if(maxRow!=undefined) this.maxRow = maxRow;
	if(restoreCount!=undefined) this.restoreCount = restoreCount;
	
	if(this.maxRow/this.restoreCount < 3) 
	{
		var mod = this.maxRow % this.restoreCount;
		if(mod<10) mod = 10;
		this.maxRow = this.restoreCount * 2 + mod;
	}
	
	this.headStack = $('<div style="display:none;"></div>');
	$('body').append(this.headStack);
	
	this.tailStack = $('<div style="display:none;"></div>');
	$('body').append(this.tailStack);
};

BackupManager.prototype.destroy = function()
{
	this.headStack.remove();
	this.headStack = null;

	this.tailStack.remove();
	this.tailStack = null;
};

BackupManager.prototype.clearAll = function()
{
	this.clearHead();
	this.clearTail();
};

BackupManager.prototype.setItemHeight = function(itemHeight)
{

	this.itemHeight = itemHeight;
//alert(this.itemHeight);	
};

BackupManager.prototype.setBackupInfo = function(itemHeight, itemContentCnt, scrollEle, $contentEle)
{
	this.itemHeight = itemHeight;
	this.itemContentCnt = itemContentCnt;
	this.scrollEle = scrollEle;
	this.$contentEle = $contentEle;
};

BackupManager.prototype.minusBackupScroll = function(count)
{
	//5.1 이후 버전에서는 scroll bottom 시점에 
	//backup scroll 을 실행하면 오작동 한다.
	//그래서 작동하지 않도록 this.backupScroll 값을 변경시키지 않는다. 
	
	if(!afc.isIos && afc.andVer>5.1) return;
	
	this.backupScroll -= this.itemHeight*count;
};

BackupManager.prototype.plusBackupScroll = function(count)
{
	this.backupScroll += this.itemHeight*count;
};

//about head
BackupManager.prototype.clearHead = function() { this.headStack.children().remove(); };
BackupManager.prototype.backupHeadPre = function(row) { this.headStack.prepend(row); };
BackupManager.prototype.backupHead = function(row) { this.headStack.append(row); };
BackupManager.prototype.restoreHead = function() { return this.headStack.children().last(); };
BackupManager.prototype.getHeadCount = function() { return this.headStack.children().length; };
BackupManager.prototype.getHRestoreCount = function() { return Math.min(this.headStack.children().length, this.restoreCount); };


//about tail
BackupManager.prototype.clearTail = function() { this.tailStack.children().remove(); };
BackupManager.prototype.backupTailPre = function(row) { this.tailStack.prepend(row); };
BackupManager.prototype.backupTail = function(row) { this.tailStack.append(row); };
BackupManager.prototype.restoreTail = function() { return this.tailStack.children().last(); };
BackupManager.prototype.getTailCount = function() { return this.tailStack.children().length; };
BackupManager.prototype.getTRestoreCount = function() { return Math.min(this.tailStack.children().length, this.restoreCount); };


BackupManager.prototype.applyBackupScroll = function()
{
	if(this.backupScroll!=0)
	{
		var retVal = this.backupScroll;
		
		this.backupScroll = 0;
		this.scrollEle.scrollTop += retVal;
		
		return retVal;
		
		//release overflow hidden for backup add
		//if(this.scrollArea) this.scrollArea.css('overflow', 'auto');
	}

	return 0;
};

BackupManager.prototype.checkHeadBackup = function()
{
	var resCount = this.getHRestoreCount();
	if(resCount>0)
	{
		for(var i=0; i<resCount; i++)
		{
			//head stack 에 백업되어 있던 항목 복원
			this.$contentEle.prepend(this.restoreHead());

			//tail stack 에 정보 백업
			this.backupTail(this.delegator.getBottomItem());
		}

		this.plusBackupScroll(resCount/this.itemContentCnt);
		
		//iphone web
		//if(afc.isIos) this.backupScroll += this.itemHeight*5;
		
		this.applyBackupScroll();

		return true;
	}
		
	return false;
};

BackupManager.prototype.checkTailBackup = function()
{
	var resCount = this.getTRestoreCount();
	if(resCount>0)
	{
		for(var i=0; i<resCount; i++)
		{
			//tail stack 에 백업되어 있던 항목 복원
			this.$contentEle.append(this.restoreTail());

			//head stack 에 정보 백업
			this.backupHead(this.delegator.getTopItem());
		}

		this.minusBackupScroll(resCount/this.itemContentCnt);
		
		//iphone web
		//if(afc.isIos) this.backupScroll -= this.itemHeight*5;

		this.applyBackupScroll();

		return true;
	}
	
	return false;
};

//	skipApplyBackupScroll
//	바로 백업스크롤을 적용하지 않고 모든 items 를 추가한 후 별도로 적용할 경우, true
//	일반적으로 생략
BackupManager.prototype.appendItemManage = function(items)//, skipApplyBackupScroll)
{
	if(this.delegator.getTotalCount()>=this.maxRow)
	{
		//백업중이면 백업스택에 추가
		if(this.getTRestoreCount()>0)
		{
			for(var i=0; i<items.length; i++)
				this.backupTailPre(items[i]);
		}
		else
		{
			//release overflow hidden for backup add
			//if(this.scrollArea) this.scrollArea.css('overflow', 'hidden');
	
			//이 순서를 유지할 것.
			this.$contentEle.append(items);

			//상단 항목을 헤드스택에 백업
			for(var i=0; i<items.length; i++)
				this.backupHead(this.delegator.getTopItem());

			this.minusBackupScroll(1);
			
			//if(!skipApplyBackupScroll) 
			
			this.applyBackupScroll();
		}
		
		return true;
	}
	
	return false;
};

BackupManager.prototype.prependItemManage = function(items)
{
	if(this.delegator.getTotalCount()>=this.maxRow)
	{
		//백업중이면 백업스택에 추가
		if(this.getHRestoreCount()>0)
		{
			for(var i=0; i<items.length; i++)
				this.backupHeadPre(items[i]);
		}
		else
		{
			//이 순서를 유지할 것.
			this.$contentEle.prepend(items);
			
			//하단 항목을 테일 스택에 백업
			for(var i=0; i<items.length; i++)
				this.backupTail(this.delegator.getBottomItem());
		}
		
		return true;
	}
	
	return false;
};






