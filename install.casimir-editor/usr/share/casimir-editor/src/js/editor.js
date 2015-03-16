function Ceditor(editoritem, MyConfig){
	// Creates a wodo editor linkjed to editoritem

	this.MyConfig=MyConfig;
	var self=this;
	
	Wodo.createTextEditor(editoritem, {
		allFeaturesEnabled: true,
		saveCallback: function() {
			var self=this;
			//alert("Saving "+self.MyConfig.current_doc);
			//odfCanvas
			console.log(window.Wodo.odfCanvas);
			console.log(window.Wodo);

			//self.odfCanvas.save();
			},
		saveAsCallback: function() {
			alert("SAVE as");
			},
		userData: {
			fullName: "",
			color:    ""
		}
	}, function (err, editor) { // Start Callback Function
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
		
		
	  }); // End CallBack Function
	
	
	
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




