var fs = require('fs');

function Config(){
	// mespeak config
	this.mespeak_dir="js/lib_external/mespeak/";
	// User settings
	this.user_dir=process.env['HOME'];
	this.current_doc=null;
	
	// Default settings
	this.current_lang="es"; // es by default
	// espeak default config
	this.amplitude=100;
	this.pitch=50;
	this.speed=175;
	this.word_gap=0;
	this.variant="f2";
	this.speakoptions=null;
	
	this.SpeechChar=true;
	this.SpeechWord=true;
	this.SpeechPhrase=true;
	
	// Temporal paths
	this.templatePath='/usr/share/casimir-editor/templates/tmpodf';
	this.tempDocPath='/tmp/tmpodf';	
}

Config.prototype.Init=function Init(){
	var self=this;
	
	// Setting Voices
	meSpeak.loadConfig(self.mespeak_dir+"mespeak_config.json");
	
	self.checkUserSettings();
	self.speakoptions={amplitude: self.amplitude, pitch: self.pitch, speed: self.speed, wordgap: self.word_gap, variant: self.variant};
	
}


Config.prototype.setLang = function setLang(lang){
	var self=this;
	
	self.current_lang=lang;
	meSpeak.loadVoice(self.mespeak_dir+"voices/"+lang+".json");
	
	// Set GUI selector
	$("div#langSelector select").val(lang);
}

Config.prototype.savePreferences = function savePreferences(){
	// Saves selected preferences to json config file
	
	var self=this;
	
	initial_config='{'+
					'"lang": "'+self.current_lang+'", '+
					'"amplitude": '+self.amplitude+' , '+
					'"pitch": '+self.pitch+' , '+
					'"speed": '+self.speed+' , '+
					'"word_gap": '+self.word_gap+' , '+
					'"variant": "'+self.variant+'"}';
	
	fs.writeFileSync(self.user_dir+'/.casimir-editor/lang.conf', initial_config);
}


Config.prototype.checkUserSettings = function checkUserSettings(){
		// Check if config dir exists
	var self=this;
	//fs.exists(self.user_dir+'/.casimir-editor', function (exists) {
	try{
		if (fs.statSync(self.user_dir+'/.casimir-editor').isDirectory()) {
		  // Reading user language
		  
			conf_text=fs.readFileSync(self.user_dir+'/.casimir-editor/lang.conf');
			//alert(conf_text);
			conf=JSON.parse(conf_text);
			self.setLang(conf["lang"]);
			
			self.amplitude=conf["amplitude"];
			self.pitch=conf["pitch"];
			self.speed=conf["speed"];
			self.word_gap=conf["word_gap"];
			self.variant=conf["variant"];
			
			self.speakoptions={amplitude: conf["amplitude"],
								pitch: conf["pitch"],
								speed: conf["speed"],
								wordgap: conf["word_gap"],
								variant: conf["variant"]};
								
			//console.log(self.speakoptions);
	  } else {
			fs.mkdirSync(self.user_dir+'/.casimir-editor');
			initial_config='{"lang":"es"}';
			fs.writeFileSync(self.user_dir+'/.casimir-editor/lang.conf', initial_config);
			self.setLang("es");
			};
		} catch (err){
			console.log(err);
			fs.mkdirSync(self.user_dir+'/.casimir-editor');
			initial_config='{"lang":"es"}';
			fs.writeFileSync(self.user_dir+'/.casimir-editor/lang.conf', initial_config);
			self.setLang("es");
		}
		  
			
	}


//Config.prototype.func = function func() {}
	