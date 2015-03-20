var fs = require('fs');
var process=require('process');
var sys = require('sys')
exec = require('child_process').exec;

function Ceditor(editoritem, MyConfig, FileSaver){
	// Creates a wodo editor linkjed to editoritem
	var self=this;
	
	self.editor = null;
	self.FileSaver=FileSaver;
    
	self.MyConfig=MyConfig;
	
	
	
	self.editorOptions = {
		allFeaturesEnabled: true,
		loadCallback: function(){
			self.load();
			},
		saveCallback: function() {
			self.save();
			},
		//saveAsCallback: function(blob, filename) {
		saveAsCallback: function() {
			self.saveAs();
			},
		userData: {
			fullName: "",
			color:    ""
		}
	}
	
	Ceditor.prototype.changeStatus = function changeStatus(text){
		$("#StatusMsg").empty().html(text).fadeIn();
		
		$("#statusbar").css("background", "#99e8a6");
		
		setInterval(function(){
			$("#statusbar").css("background", "#eeeeee");
			$("#StatusMsg").fadeOut();
			}, 5000);
		
		
		};
	
	Ceditor.prototype.save = function save () {
		if (self.MyConfig.current_doc === null) return -1;
		
		function saveByteArrayLocally(err, data) {
            if (err) {
                alert(err);
                return;
            }
			// Setting filename
			var filename = self.MyConfig.current_doc || "doc.odt";
			// Create a buffer from data
			var buffer = new Buffer(data.length);

			for (var i = 0; i < data.length; i++) {
				buffer.writeUInt8(data[i], i);
			}

			// Write buffer
				
			fs.writeFile(filename, buffer);
            self.editor.setDocumentModified(false);
        }
        self.editor.getDocumentAsByteArray(saveByteArrayLocally);
		self.changeStatus("Saved "+self.MyConfig.current_doc);
	  
	  return 0;
	  
	  
    }
	
	Ceditor.prototype.load = function load () {
		// Showing FIle Lialog
		var chooser = $(document.createElement("input")).attr("id","fileDialog").attr("type","file");
		 $(chooser).attr("style", "display:none");
		 
		 $("body").append(chooser);
			
		function chooseFile(name) {
			var chooser = $(name);
			chooser.change(function(evt) {
					self.openDocument($(this).val());
					self.changeStatus("Loaded "+$(this).val());
		  });

		chooser.trigger('click');  
		}
			
		chooseFile('#fileDialog');
	}
	
	
	Ceditor.prototype.saveAs = function saveAs () {
			if (self.MyConfig.current_doc === null) return -1;
			 // Showing Save As Dialog
			  var chooser = $(document.createElement("input")).attr("id","export_file").attr("type","file");
			  $(chooser).attr("nwsaveas", "").attr("style", "display:none").attr("nwworkingdir", "");
			  $("body").append(chooser);
			
			  function fileHandler (evt) {
				filename=$(this).val();
				// Set current name to filename
				self.MyConfig.current_doc = filename;
				// And save now
				self.save();
			}
			
			chooser.change(fileHandler);
			chooser.trigger('click');
			return 0;
			
    }
	
	Ceditor.prototype.onNewFile = function onNewFile(){
		
		// STEP 1. Create meta.xml for current user from template (uncompressed odt in tmpodf)
		
		var xmltext=fs.readFileSync("/usr/share/casimir-editor/templates/tmpodf/meta.xml", 'ascii');
		var xml=$.parseXML(xmltext);
		var auth=($(xml).find("initial-creator"))[0];
		
		var userName = process.env['USER'];
		console.log(userName);
		
		// Getting full username
		exec("getent passwd "+userName,
			 function (error, stdout, stderr){
				var fullusername="";
				if (!error) fullusername=(stdout.split(":")[4]).split(",")[0];
				
				$(auth).text(fullusername);
				
				// Getting current date
				var ct = new Date();
				var odfdate=ct.getFullYear()+"-"+(ct.getMonth()+1)+"-"+ct.getDate();
				odfdate=odfdate+"T"+ct.getHours()+":"+ct.getMinutes()+":"+ct.getSeconds()+"."+ct.getMilliseconds();
				
				var date=($(xml).find("creation-date"))[0];
				$(date).text(odfdate);
				
				console.log(xml);
				
				// To Do...
				// a vore si ho pose en funcions més ordenat... queda comprimir el odt,
				// i copiar-lo a tmp, per obrir-lo, posar un flag en l'editor.js que diga que el document
				// és temporal, i en la funció save, que detecte si és temporal (pel nom)
				// i si és així, que invoque a saveas en lloc de save.
			
				
			
			} );
		}
		
	Ceditor.prototype.openDocument = function openDocument(filename){
		function loadDoc(){
			self.MyConfig.current_doc=filename;		
			self.editor.openDocumentFromUrl(MyConfig.current_doc, function(err) {
				if (err) {
					// something failed unexpectedly, deal with it (here just a simple alert)
					alert("There was an error on opening the document: " + err);
				}
				console.log($("document"));
			//$("document").parent().hide();
			$("document").parent().on('keydown', function(event) {
			console.log("*****"+event.which);
			
			// Comparar a banda del 190 (.) els !, ?, ¡, ¿....
			if (event.which=='190' && self.MyConfig.SpeechPhrase ) {
					ret=self.getCurrentPhrase();
					console.log(ret);
					meSpeak.speak(ret);
				} 
			else if (event.which=='32' && self.MyConfig.SpeechWord ) {
					ret=self.getCurrentWord();
					console.log(ret);
					meSpeak.speak(ret);
				} 
			else if (self.MyConfig.SpeechChar) {
					meSpeak.speak(String.fromCharCode(event.which));
				}
					
				});
			
			});
				
		}
		
		
		if (self.MyConfig.current_doc === null) loadDoc();
		else self.editor.closeDocument(function(){ loadDoc();})
		
		
	}
	
	Ceditor.prototype.onEditorCreated = function onEditorCreated(err, editor){ // Callback function
		if (err) {
			// something failed unexpectedly, deal with it (here just a simple alert)
			alert(err);
			return;
		}
		self.editor=editor;
		divertGui(self.onNewFile);
	  }
		
	
	
	Wodo.createTextEditor(editoritem, self.editorOptions, self.onEditorCreated); // End CallBack Function
	
	
}


Ceditor.prototype.getCurrentParagraph = function getCurrentParagraph(){
	var self=this;
	
	elem=$("document").parent().find("cursor").parents("text\\:p").clone(true);
	$(elem).find("cursor").html("<|>"); // Replace cursor | for <|>.
	$(elem).find("editinfo").remove();
			
			
	item=($({data:$(elem)}));
	itemtext=$($(item)[0]["data"][0]).text();
			
	var speechtext="";
	var len=itemtext.indexOf("<|>");
    var forbidden_chars=["“", "”"];
	
	for (i=0;i<len;i++){
        if (forbidden_chars.indexOf(itemtext[i])==-1) {
                speechtext=speechtext+itemtext[i];  
        }
        else alert("found "+itemtext[i]);
		
	}
				
	return(speechtext);
}

Ceditor.prototype.getCurrentWord =function getCurrentWord() {
	var self=this;
	
	p=self.getCurrentParagraph();
	var chars=[" ", ".", "!", "?", "¿", "¡"];
	reverse_word="";
	for (i=p.length-1;i>=0; i--){
		if (!chars.indexOf(p[i])) break;
		reverse_word=reverse_word+p[i];
		//if (p[i]==" ") break;
		}
		
	word=reverse_word.split("").reverse().join("");
	return word;		
}

Ceditor.prototype.getCurrentPhrase=function getCurrentPhrase() {
	var self=this;
	
	p=self.getCurrentParagraph();
	reverse_phrase="";
	var chars=[".", "!", "?", "¿", "¡"];
	for (i=p.length-1;i>=0; i--){
		if (!chars.indexOf(p[i])) break;
		reverse_phrase=reverse_phrase+p[i];
		}
		
	phrase=reverse_phrase.split("").reverse().join("");
	return phrase;
}




