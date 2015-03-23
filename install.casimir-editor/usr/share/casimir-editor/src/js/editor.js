var fs = require('fs');
var zip = require('./node_modules/adm-zip');
var fsxtrta = require('./node_modules/fs.extra');
var process=require('process');
var sys = require('sys')
exec = require('child_process').exec;

function Ceditor(){
	// Creates a wodo editor linked to editoritem
	this.editor = null;
    
	this.MyConfig=null;
	
	// Document properties
	this.fullUsername=null;
	this.currentDate=null;
	this.TmpOdfPrepared=false; // Indicates if is prepared the structure to create a new file
	
	this.editorOptions = null;
	
	
}

Ceditor.prototype.Initialize = function Initialize (editoritem, MyConfig){
		var self=this;
	
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
	//Wodo.createTextEditor(editoritem, self.editorOptions, self.onEditorCreated);
	
	Wodo.createTextEditor(editoritem, self.editorOptions, function(err, editor){
		if (err) {
			// something failed unexpectedly, deal with it (here just a simple alert)
			alert(err);
			return;
		}
		self.editor=editor;
		self.divertGui();
		
	});
	
	
}
	
Ceditor.prototype.divertGui = function divertGui(){
	/*
	Small hack to add the new file button
	*/

	var self=this;
	
	var openButton=$("span[widgetid='dijit_form_Button_0']");
	newButton=$(openButton).clone(true);
	
	$(newButton).find(".dijitIconFolderOpen").removeClass("dijitIconFolderOpen").addClass("dijitLeaf");
	$(newButton).find("#dijit_form_Button_0").attr("title", "New");
	
	$(newButton).insertBefore(openButton);
	$(newButton).on("mouseover", function(){
		$(newButton).addClass("dijitButtonHover").addClass("dijitHover");
		})
	
	$(newButton).on("mouseout", function(){
		$(newButton).removeClass("dijitButtonHover").removeClass("dijitHover");
		})
	
	$(newButton).on("click", function(){
			self.onNewFile();
			
		})	
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
		var self=this;
		
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
		var self=this;
		
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
		var self=this;
		
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
	
Ceditor.prototype.setUserName = function setUserName(){
	// Gets username from environment, and searchs full name in passwd
	// When finish, calls createTmpDoc	
	var self=this;
	
	var userName = process.env['USER'];
	
	// Getting full username
	
	// TO DO
	
	// Cal eliminar caràcters estranys o vore en quin format guardar (ascii amb accents)
	
	exec("getent passwd "+userName,
		 function (error, stdout, stderr){
			var fullusername="";
			if (!error) fullusername=(stdout.split(":")[4]).split(",")[0];				
			self.fullUsername=fullusername;				
			self.CreateTmpDoc();	
		} );	
}
	
	Ceditor.prototype.setCurrentDate = function setCurrentDate(){
		var self=this;
		// Getting current date
		var ct = new Date();
		
		var year=ct.getFullYear();
		var month=(ct.getMonth()+1);
		if (month<10) month="0"+month;
		var day=ct.getDate();
		
		
		// TO DO
		// Ajustant mes a 2 xifres
		// Cal ajustar els milisegons per a que siguen les xifres que pille el libreoffice
		var odfdate=year+"-"+month+"-"+day;
		alert(odfdate);
		
		var hour=ct.getHours();
		var min=ct.getMinutes();
		var sec=ct.getSeconds();
		var ms=ct.getMilliseconds();
		alert(ms+" "+ms.toPrecision(8));
		alert(typeof(ms));
		
		odfdate=odfdate+"T"+hour+":"+min+":"+sec+"."+ms;
		
		self.currentDate=odfdate;
		self.CreateTmpDoc();
	}
	
	Ceditor.prototype.copyTmpDocStructure = function copyTmpDocStructure(){
		var self=this;
		self.TmpOdfPrepared=false;
		
		// Copies odf structure from
		fsxtrta.copyRecursive(self.MyConfig.templatePath , self.MyConfig.tempDocPath, function (err) {
			if (err) {
				  alert(err);
			} else
			{
				self.TmpOdfPrepared=true;
				self.CreateTmpDoc();
				
			}
			
		});
		
	}
	
	
	Ceditor.prototype.CreateTmpDoc = function CreateTmpDoc(){
		var self=this;
		
		if (self.fullUsername===null || self.currentDate===null || !self.TmpOdfPrepared ) return null;
		// self.fullUsername AND self.currentDate are stablisged here.
		// so we can create tmp file
		
 		// Stablish username
		//var xmltext=fs.readFileSync("/usr/share/casimir-editor/templates/tmpodf/meta.xml", 'ascii');
		var xmltext=fs.readFileSync(self.MyConfig.tempDocPath+"/meta.xml", 'ascii');
		var xml=$.parseXML(xmltext);
		var auth=($(xml).find("initial-creator"))[0];
		$(auth).text(self.fullUsername);
		
		// Stablish date
		var date=($(xml).find("creation-date"))[0];
		$(date).text(self.currentDate);
		
		// Convert xml to string and save it
		var xmlString = (new XMLSerializer()).serializeToString(xml);
		
		
		
		fs.writeFileSync(self.MyConfig.tempDocPath+"/meta.xml", xmlString, 'ascii');
		
		
		
				
				// To Do...
				// queda comprimir el odt,
				// i copiar-lo a tmp, per obrir-lo, posar un flag en l'editor.js que diga que el document
				// és temporal, i en la funció save, que detecte si és temporal (pel nom)
				// i si és així, que invoque a saveas en lloc de save.
			
			
		
		return 0;
		
	}
	
	Ceditor.prototype.onNewFile = function onNewFile(){
		var self=this;
		
		//alert("123");
		// Step 1. Find Full Username and Password
		// Step 2. Fins current date and time
		// Step 3. Create tmp file -> It will be done after setting username and current date,
		//         this function will be called from setUserNamd and setCurrentDate.
		
		self.fullUsername=null;
		self.currentDate=null;
		
		// Setting UserName
		self.setUserName();
		
		// Setting Date
		self.setCurrentDate();
	
		// Copying ODF structure	
		self.copyTmpDocStructure();
	}
	
	
Ceditor.prototype.loadDoc=function loadDoc(filename){
		var self=this;
	
		self.MyConfig.current_doc=filename;
		console.log(self);
		alert(self.editor);
		self.editor.openDocumentFromUrl(self.MyConfig.current_doc, function(err) {
			if (err) {
				// something failed unexpectedly, deal with it (here just a simple alert)
				alert("There was an error on opening the document: " + err);
			}
			alert("1111");
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
		
	
	
Ceditor.prototype.openDocument = function openDocument(filename){
	var self=this;
		
	if (self.MyConfig.current_doc === null) self.loadDoc(filename);
	else self.editor.closeDocument(function(){ self.loadDoc(filename);})

}
	
/*Ceditor.prototype.onEditorCreated = function onEditorCreated(err, editor){ // Callback function
	var self=this;
	
	if (err) {
	// something failed unexpectedly, deal with it (here just a simple alert)
		alert(err);
		return;
	}
	self.editor=editor;
	divertGui(self.onNewFile);
 }*/


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




