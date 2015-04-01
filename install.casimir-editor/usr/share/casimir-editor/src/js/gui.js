function GUI(){ }

GUI.prototype.bindGUIEvents = function bindGUIEvents(MyConfig, MyEditor) {
	// Binging GUI Events
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
		MyConfig.savePreferences();
		$("div.tick").addClass("saved");
		});



}





GUI.prototype.drawMenuElements = function drawMenuElements() {
// Menu Options

// NO VA!!

		$('#volume_slider').slider({
          	formatter: function(value) {
            	return 'Current value: ' + value;
          	}
        });

}