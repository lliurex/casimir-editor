
$(document).ready(function() {   

// Dojo theming...
// http://dojotoolkit.org/reference-guide/1.10/dijit/themes.html

// PEr a les fonts (i més coses)
// https://github.com/kogmbh/WebODF/blob/master/programs/editor/HOWTO-wodotexteditor.md

// Loading Config
var MyConfig=new Config(MyConfig);

//var FileSaver=new saveAs();
var FileSaver=null;

// Loading GUI
mygui=new GUI();
// Binding GUI Events
mygui.bindGUIEvents(MyConfig);



var MyEditor=new Ceditor('editorContainer', MyConfig, FileSaver);


   
});  // End Document Ready





