define(["sap.watt.ideplatform.template/ui/wizard/WizardStepContent",
		"htmltocontrolconverterplugin/utils/XMLValidator",
		"htmltocontrolconverterplugin/utils/JSONGenerator",
		"htmltocontrolconverterplugin/utils/ControlGenerator"
	],
	// define(["sap/watt/ideplatform/plugin/template/ui/wizard/WizardStepContent"],
	function (WizardStepContent, XMLValidator, JSONGen, ControlGenerator) {
		"use strict";

		jQuery.sap.declare("htmltocontrolconverterplugin.control.UI5ControlPropertiesStep");
		return WizardStepContent.extend("htmltocontrolconverterplugin.control.UI5ControlPropertiesStep", {

			init: function () {
				var oPageLayoutConfigurationStepContent = this._createPageLayoutConfigurationContent();
				this.addContent(oPageLayoutConfigurationStepContent);
				
			},

			renderer: {},

			onBeforeRendering: function () {
				this.fireValidation({
					isValid: true
				});
				var html = this.getModel().getProperty("/htmltemplate");

				var JSONG = new htmltocontrolconverterplugin.utils.JSONGenerator();
				html = html.replace(/\n/g, "")
					.replace(/[\t ]+\</g, "<")
					.replace(/\>[\t ]+\</g, "><")
					.replace(/\>[\t ]+$/g, ">");
				var jsonhtml = JSONG.generateJSON(html);
				var cg = new htmltocontrolconverterplugin.utils.ControlGenerator(JSON.parse(jsonhtml));
				var aProps = cg.getAllProperties();
				this.getModel().setProperty("/Properties", aProps);
			},

			_createPageLayoutConfigurationContent: function () {
				var me = this;
				//core step which creates all UI elements and its logic.
				var oItemTemplate = new sap.m.InputListItem({
					label: "{_name}",
					content: [new sap.m.Input({
						value: "{value}"
					})]
				});
				var oList = new sap.m.List({
					items: {
						path: "/Properties",
						template: oItemTemplate
					}
				});

				return oList;

			},
			validateStepContent: function () {

				// Return a Q-promise which is resolved if the step content 
				// is currently in valid state, and is rejected if not.
			},

			cleanStep: function () {

				// 1. Clean properties that were added to this.getModel().getData().
				// 2. Clean the control's private members.
				// 3. Clean the UI controls created by this control
				//    that are not currently displayed.
				//    Currently displayed content is destroyed by the wizard before
				//    this step is displayed again.
			}
		});
	});