var fs = require('fs');

function Config(){
	// mespeach config
	this.mespeach_dir="js/lib_external/mespeak/";
	// User settings
	this.user_dir=process.env['HOME'];
	this.current_doc=null;
	
	
	
	// Setting Voices
	meSpeak.loadConfig(this.mespeach_dir+"mespeak_config.json");
	
	this.current_lang="es"; // es by default
	this.checkUserSettings();
	//this.setLang("es"); ->  moved into checkUserSettings
	
	this.SpeechChar=true;
	this.SpeechWord=true;
	this.SpeechPhrase=true;
	
	// Temporal paths
	this.templatePath='/usr/share/casimir-editor/templates/tmpodf';
	this.tempDocPath='/tmp/tmpodf';
}


Config.prototype.setLang = function setLang(lang){
	var self=this;
	
	self.current_lang=lang;
	meSpeak.loadVoice(self.mespeach_dir+"voices/"+lang+".json");
	
	// Set GUI selector
	$("div#langSelector select").val(lang);
}

Config.prototype.savePreferences = function savePreferences(){
	// Saves selected language to json config file
	
	var self=this;
	
	initial_config='{"lang": "'+self.current_lang+'"}';
	fs.writeFileSync(self.user_dir+'/.casimir-editor/lang.conf', initial_config);
}


Config.prototype.checkUserSettings = function checkUserSettings(){
		// Check if config dir exists
		var self=this;
	fs.exists(self.user_dir+'/.casimir-editor', function (exists) {
	  if (exists) {
		  // Reading user language
		  try{
			conf_text=fs.readFileSync(self.user_dir+'/.casimir-editor/lang.conf');
			//alert(conf_text);
			conf=JSON.parse(conf_text);
			self.setLang(conf["lang"]);
			
		  } catch (err){
			//alert(err);
			self.setLang("es");
		  }
	  } else {
			fs.mkdirSync(self.user_dir+'/.casimir-editor');
			initial_config='{"lang":"es"}';
			fs.writeFileSync(self.user_dir+'/.casimir-editor/lang.conf', initial_config);
			self.setLang("es");
			};
	});
}

//Config.prototype.func = function func() {}
	