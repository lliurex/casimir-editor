
$(document).ready(function() {   

// Dojo theming...
// http://dojotoolkit.org/reference-guide/1.10/dijit/themes.html

// Loading Config
var MyConfig=new Config(MyConfig);

// Loading GUI
mygui=new GUI();
// Binding GUI Events
mygui.bindGUIEvents(MyConfig);



var MyEditor=new Ceditor('editorContainer', MyConfig);


   
});  // End Document Ready





