$(document).ready(function(){
	var keys 	= [];
	var konami  = '38,38,40,40,37,39,37,39,66,65';
	var refresh = '37,39,37,39,37,39,37,39';
	$(document)
		.keydown(
			function(e) {
				keys.push( e.keyCode );
				if ( keys.toString().indexOf( konami ) >= 0 ){
					require('nw.gui').Window.get().showDevTools();
					keys = [];
				}
				if( keys.toString().indexOf(refresh) >= 0){
					location.reload();
					keys = [];
				}
			}
		);
});