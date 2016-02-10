
$(document).ready(function() {   
	// Dojo theming...
	// http://dojotoolkit.org/reference-guide/1.10/dijit/themes.html
	
	// PEr a les fonts (i més coses)
	// https://github.com/kogmbh/WebODF/blob/master/programs/editor/HOWTO-wodotexteditor.md
	
	// Loading Config
	var MyConfig=new Config(MyConfig);
	
	// Loading GUI
	mygui=new GUI();
	// Binding GUI Events
	
	var MyEditor=new Ceditor();
	
	console.log(MyConfig);
	
	mygui.drawMenuElements(MyConfig);
	mygui.bindGUIEvents(MyConfig, MyEditor);
	MyEditor.Initialize('editorContainer', MyConfig);
	
	//$("#statusbar").slider();
	
	
	$.material.init();

   
});  // End Document Ready



