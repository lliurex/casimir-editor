fs=require("fs");

function I18n(locales){
  this.locale = navigator.language || navigator.userLanguage;
  this.locales=null;
}

I18n.prototype.getLocalesFrom=function getLocalesFrom(str){    
        this.locales=new Jed({locale_data: str});
        console.log(this.locales);
}

I18n.prototype.getLocale=function getLocale(){
  return this.locale;
}


I18n.prototype.translateHtml=function translateHtml(element){
  var self=this;
  element.innerHTML=self.gettext(element.innerHTML);
};

I18n.prototype.gettext=function gettext(text) {
	var self=this;
    return self.locales.gettext(text);
};


i18n=new I18n();
