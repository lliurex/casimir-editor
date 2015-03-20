

function divertGui(cb){
	/*
	Small hack to add the new file button
	*/

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
			cb();
			
		})
	
	/*closeButton = new Button({
                    label: tr('Close'),
                    showLabel: false,
                    iconClass: 'dijitEditorIcon dijitEditorIconCancel',
                    style: {
                        float: 'right'
                    },
                    onClick: function () {
                        close();
                    }
                });*/
	
	
	}


