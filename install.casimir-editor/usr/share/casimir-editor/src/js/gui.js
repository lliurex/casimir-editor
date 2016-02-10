function GUI(){ }

GUI.prototype.bindGUIEvents = function bindGUIEvents(MyConfig, MyEditor) {
	// Binging GUI Events
    var self=this;
    
$("#speechChar").bind("click", function(event){
		button=event.currentTarget;
		if ($(button).attr("status")=="on"){
			$(button).attr("status", "off");
			$(button).removeClass("btn_on");
			$(button).addClass("btn_off");
			MyConfig.SpeechChar=false;
		} else {
			$(button).attr("status", "on");
			$(button).removeClass("btn_off");
			$(button).addClass("btn_on");
			MyConfig.SpeechChar=true;
		}
	});

$("#speechWord").bind("click", function(event){
		button=event.currentTarget;
		if ($(button).attr("status")=="on"){
			$(button).attr("status", "off");
			$(button).removeClass("btn_on");
			$(button).addClass("btn_off");
			MyConfig.SpeechWord=false;
		} else {
			$(button).attr("status", "on");
			$(button).removeClass("btn_off");
			$(button).addClass("btn_on");
			MyConfig.SpeechWord=true;
		}
	});

$("#speechSelected").bind("click", function(event){
		MyEditor.speechSelected();
	});

$("#speechPhrase").bind("click", function(event){
		button=event.currentTarget;
		if ($(button).attr("status")=="on"){
			$(button).attr("status", "off");
			$(button).removeClass("btn_on");
			$(button).addClass("btn_off");
			MyConfig.SpeechPhrase=false;
		} else {
			$(button).attr("status", "on");
			$(button).removeClass("btn_off");
			$(button).addClass("btn_on");
			MyConfig.SpeechPhrase=true;
		}
	});

	
$("#menuBt").bind("click", function(event){
		$("#panelMenu").show();
		$("#panelMenu").animate({width: '300px'}, 300, function(){
				$("#menuBt").hide();
		});
		
		
		})
				  
$("#closeMenu").bind("click", function(event){
		$("div.tick").removeClass("saved");
		$("#panelMenu").animate({width: '0px'}, 300, function(){
			$("#panelMenu").hide();
			$("#menuBt").show();
		});
		
		})

$("#languageSelector").change(function(){
		$( "select#languageSelector option:selected" ).each(function() {
		 selected = $( this ).val();
		 //alert(selected);
		 MyConfig.setLang(selected);
		 })
		
		});

$("#savePreferences").bind("click", function(){
	
	MyConfig.amplitude=Math.round($("#vol_slider_value").val());
	MyConfig.pitch=Math.round($("#pitch_slider_value").val());
	MyConfig.speed=Math.round($("#speed_slider_value").val());
	MyConfig.word_gap=Math.round($("#wordgap_slider_value").val());
					
	
		MyConfig.savePreferences();
		$("div.tick").addClass("saved");
		});

        //self.drawMenuElements();


}





GUI.prototype.drawMenuElements = function drawMenuElements(Conf) {
// Menu Options


	var vol_slider = document.getElementById('vol_slider');	
	noUiSlider.create(vol_slider, {
		start: Conf.amplitude,
		//tooltips: [ true, wNumb({ decimals: 0 }) ],
		connect: 'lower',
		range: { 'min': 0, 'max': 200 }
	});
	vol_slider.noUiSlider.on('update', function( values, handle ) {
		$("#vol_slider_value").val(values[handle]); 	});

	
	
	
	
	var pitch_slider = document.getElementById('pitch_slider');	
	noUiSlider.create(pitch_slider, {
		start: Conf["pitch"],
		//tooltips: [ true, wNumb({ decimals: 0 }) ],
		connect: 'lower',
		range: { 'min': 0, 'max': 100 }
	});
	pitch_slider.noUiSlider.on('update', function( values, handle ) {
		$("#pitch_slider_value").val(values[handle]); 	});
	
	
	var speed_slider = document.getElementById('speed_slider');
	noUiSlider.create(speed_slider, {
		start: Conf["speed"],
		//tooltips: [ true, wNumb({ decimals: 0 }) ],
		connect: 'lower',
		range: { 'min': 0, 'max': 350 }
	});
	speed_slider.noUiSlider.on('update', function( values, handle ) {
		$("#speed_slider_value").val(values[handle]); 	});
	
	var wordgap_slider = document.getElementById('wordgap_slider');	
	noUiSlider.create(wordgap_slider, {
		start: Conf["word_gap"],
		//tooltips: [ true, wNumb({ decimals: 0 }) ],
		connect: 'lower',
		range: { 'min': 0, 'max': 10 }
	});
	wordgap_slider.noUiSlider.on('update', function( values, handle ) {
		$("#wordgap_slider_value").val(values[handle]); 	});
	
}

