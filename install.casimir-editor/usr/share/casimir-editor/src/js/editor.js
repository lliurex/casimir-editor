var fs = require('fs');

function Ceditor(editoritem, MyConfig, FileSaver){
	// Creates a wodo editor linkjed to editoritem
	var self=this;
	
	self.editor = null;
	self.FileSaver=FileSaver;
    
	self.MyConfig=MyConfig;
	
	
	
	self.editorOptions = {
		allFeaturesEnabled: true,
		saveCallback: function() {
			self.save();
			}/*,
		saveAsCallback: function(blob, filename) {
			alert("SAVE as");
			}*/,
		userData: {
			fullName: "",
			color:    ""
		}
	}
	
	Ceditor.prototype.save = function save () {
	  function saveByteArrayLocally(err, data) {
            if (err) {
                alert(err);
                return;
            }
			// TODO: odfcontainer should have a property mimetype
            var mimetype = "application/vnd.oasis.opendocument.text",
                //filename = loadedFilename || "doc.odt",
				filename = self.MyConfig.current_doc || "doc.odt",
                blob = new Blob([data.buffer], {type: mimetype});
			console.log(blob);
				//self.FileSaver.saveAs(blob, filename);
				//ret=saveAs(blob, filename);
				
				// CASCA
                //fs.writeFile("/tmp/test.odt", blob, function(err) {alert(err);});
			var reader = new window.FileReader();
			//reader.readAsDataURL(blob);
			 //reader.readAsBinaryString(blob);
			 //  https://developer.mozilla.org/en-US/docs/Web/API/FileReader#readAsDataURL%28%29
			 reader.onloadend = function() {
                base64data = reader.result;
                //console.log(base64data );
				fs.writeFile("/tmp/test.odt", base64data, function(err) {alert(err);});
				
			}
			
			//var odfContainer = odfCanvas.odfContainer();
			//self.saveAs (odfContainer, "/tmp/", "tralari.odt", callback);
			
			
			/* var odfelement = document.getElementById("odf");
    var textns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
    var odfCanvas = new odf.OdfCanvas(odfelement);
    odfCanvas.load("invoice.odt");*/
			 //self.saveAs (odfContainer, folder, filename, callback);
			
            //saveAsCallback(blob, filename);
            // TODO: hm, saveAs could fail or be cancelled
			
			
            self.editor.setDocumentModified(false);
        }
        self.editor.getDocumentAsByteArray(saveByteArrayLocally);
	  
	  
	  
	  
    }
	
	
	//Ceditor.prototype.saveAs = function(folder, filename, type, data, callback) {}
	Ceditor.prototype.saveAs = function saveAs (odfContainer, folder, filename, callback) {
      odfContainer.createByteArray(function(data) {
        writeFile(folder, filename, odfContainer.getDocumentType(), data, callback)
      }, callback);
    }
	
	
	
	Ceditor.prototype.writeFile = function writeFile (folder, filename, type, data, callback) {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        var path = folder+"/"+filename;
        var blob = new Blob([data.buffer], {type : 'application/vnd.oasis.opendocument.'+type});
        var formData = new FormData();
        formData.append("WebODF", blob, filename);

        var request = new XMLHttpRequest();
        request.open("PUT", path);
        request.send(formData);
      } else {
        callback('The File APIs are not fully supported in this browser.');
      }
    }
	
	Ceditor.prototype.writeFile = function(folder, filename, type, data, callback) {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        var path = folder+"/"+filename;
        var blob = new Blob([data.buffer], {type : 'application/vnd.oasis.opendocument.'+type});
        var formData = new FormData();
        formData.append("WebODF", blob, filename);

        var request = new XMLHttpRequest();
        request.open("PUT", path);
        request.send(formData);
      } else {
        callback('The File APIs are not fully supported in this browser.');
      }
    }
	
	Ceditor.prototype.onEditorCreated = function onEditorCreated(err, editor){ // Callback function
		if (err) {
			// something failed unexpectedly, deal with it (here just a simple alert)
			alert(err);
			return;
		}
		editor.openDocumentFromUrl(MyConfig.current_doc, function(err) {
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
		
		self.editor=editor; // This is the result of createTextEditor
		
		
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




