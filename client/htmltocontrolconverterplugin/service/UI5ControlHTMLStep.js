define(["htmltocontrolconverterplugin/control/UI5ControlHTMLStep"], function(UI5ControlHTMLStep){
       "use strict"

       return{
        getContent : function() {
              var oMyStepContent = new UI5ControlHTMLStep({
                     context : this.context
              });
  
              //var sTitle = this.context.i18n.getText("myStep_title");
              //var sDescription = this.context.i18n.getText("myStep_description");
  
              return this.context.service.wizard.createWizardStep(oMyStepContent, "HTML Template", "Provide HTML that you want to convert into a UI5 control");
        }
    }
});