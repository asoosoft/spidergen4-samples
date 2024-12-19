/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	config.language = 'ko';
	// config.uiColor = '#AADC6E';
	
	config.toolbarGroups = [
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'paragraph', groups: [ 'blocks', 'list', 'align', 'indent', 'bidi', 'paragraph' ] },
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'undo', 'clipboard' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		/*{ name: 'insert', groups: [ 'insert' ] },*/
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'about', groups: [ 'about' ] }
	];

	config.removeButtons = 'Styles,Format,Font,JustifyBlock,Outdent,Indent,CreateDiv,BidiRtl,BidiLtr,Language,Unlink,Anchor,CopyFormatting,RemoveFormat,Subscript,Superscript,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Save,NewPage,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Replace,Find,SelectAll,Scayt,About,Maximize,ShowBlocks,Image,Flash,Table,HorizontalRule,SpecialChar,PageBreak,Iframe,Smiley';
	
	
	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	
	config.enterMode = CKEDITOR.ENTER_BR // pressing the ENTER KEY input <br/>
    config.shiftEnterMode = CKEDITOR.ENTER_BR; //pressing the SHIFT + ENTER KEYS input <p>
    config.autoParagraph = false; // stops automatic insertion of <p> on focus
		
	config.uiColor = '#ffffff';
	config.resize_enabled = false;
};
