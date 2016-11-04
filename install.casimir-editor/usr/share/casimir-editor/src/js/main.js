fs=require("fs");

$(document).ready(function() {   
	// Dojo theming...
	// http://dojotoolkit.org/reference-guide/1.10/dijit/themes.html
	
	// PEr a les fonts (i més coses)
	// https://github.com/kogmbh/WebODF/blob/master/programs/editor/HOWTO-wodotexteditor.md

	// Loading locales
	var locale=i18n.getLocale();
	//alert("i18n/"+locale+"/messages.json");
	var jsonmsgs=null;
	var stringmsgs=null;
	
	if(fs.existsSync("i18n/"+locale+"/messages.json"))
        stringmsgs = fs.readFileSync("i18n/"+locale+"/messages.json");
    else 
		stringmsgs = fs.readFileSync("i18n/en/messages.json");
		
    jsonmsgs = JSON.parse(stringmsgs);
	console.log(jsonmsgs);
	i18n.getLocalesFrom(jsonmsgs);
	
	// Translating html ui
	[].forEach.call( document.querySelectorAll("*[i18n]"), function(element) {
          i18n.translateHtml(element);
        });
	
	// Loading Config
	var MyConfig=new Config();
	MyConfig.Init();
	
	// Loading GUI
	mygui=new GUI();
	// Binding GUI Events
	
	var MyEditor=new Ceditor();
	
	
	mygui.drawMenuElements(MyConfig);
	mygui.bindGUIEvents(MyConfig, MyEditor);
	MyEditor.Initialize('CasimirEditorContainer', MyConfig);
	
	
	$.material.init();

   
});  // End Document Ready



