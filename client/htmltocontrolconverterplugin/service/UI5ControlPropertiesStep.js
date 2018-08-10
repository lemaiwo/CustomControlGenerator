define(["htmltocontrolconverterplugin/control/UI5ControlPropertiesStep"], function(UI5ControlPropertiesStep){
       "use strict"

       return{
        getContent : function() {
              var oMyStepContent = new UI5ControlPropertiesStep({
                     context : this.context
              });
  
              //var sTitle = this.context.i18n.getText("myStep_title");
              //var sDescription = this.context.i18n.getText("myStep_description");
  
              return this.context.service.wizard.createWizardStep(oMyStepContent, "Properties Configuration", "Give a name to the properties of the UI5 Control");
        }
    }
});