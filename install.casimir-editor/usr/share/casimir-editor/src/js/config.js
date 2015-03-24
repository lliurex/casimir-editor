var fs = require('fs');

function Config(){
	// mespeach config
	this.mespeach_dir="js/lib_external/mespeak/";
	// User settings
	this.user_dir=process.env['HOME'];
	this.current_doc=null;
	
	//this.checkUserSettings();
	
	// Setting Voices
	meSpeak.loadConfig(this.mespeach_dir+"mespeak_config.json");
	// meSpeak.loadVoice('lib/mespeak/voices/en/en-us.json');
	meSpeak.loadVoice(this.mespeach_dir+"voices/es.json");
	
	this.SpeechChar=true;
	this.SpeechWord=true;
	this.SpeechPhrase=true;
	
	// Temporal paths
	this.templatePath='/usr/share/casimir-editor/templates/tmpodf';
	this.tempDocPath='/tmp/tmpodf';
}


Config.prototype.setLang = function setLang(lang){
	var self=this;
	// TO DO
	// Canviar idioma...  lang
	// --> meSpeak.loadConfig(this.mespeach_dir+"mespeak_config.json");
	// --> meSpeak.loadVoice(this.mespeach_dir+"voices/es.json");
	
}


Config.prototype.checkUserSettings = function checkUserSettings(){
		// Check if config dir exists
		var self=this;
	fs.exists(self.user_dir+'.casimir-editor', function (exists) {
	  if (exists) {
		  alert("exists");
	  } else {
			alert("creating");
			};
	});
}

//Config.prototype.func = function func() {}
	