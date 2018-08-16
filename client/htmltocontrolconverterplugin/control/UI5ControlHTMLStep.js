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
				// this.getModel().setProperty("/htmltemplate","<test/>");

			},

			_createPageLayoutConfigurationContent: function () {
				var me = this;
				//core step which creates all UI elements and its logic.
				var oSelPageLayoutHeader = new sap.m.TextArea({
					growing: true,
					rows: 10,
					growingMaxLines: 50,
					width: "100%",
					value: "{/htmltemplate}",
					liveChange: function (oEvent) {
						var xml = oEvent.getParameter("value");
						var oXMLValidator = new htmltocontrolconverterplugin.utils.XMLValidator(xml);
						if (oXMLValidator.isValid()) {
							try {
								var JSONG = new htmltocontrolconverterplugin.utils.JSONGenerator();
								xml = xml.replace(/\n/g, "")
									.replace(/[\t ]+\</g, "<")
									.replace(/\>[\t ]+\</g, "><")
									.replace(/\>[\t ]+$/g, ">");
								var jsonhtml = JSONG.generateJSON(xml);
								var cg = new htmltocontrolconverterplugin.utils.ControlGenerator(JSON.parse(jsonhtml));
								var aProps = cg.getAllProperties();
								me.getModel().setProperty("/Properties", aProps);
								me.fireValidation({
									isValid: oXMLValidator.isValid()
								});
							} catch (ex) {
								me.fireValidation({
									isValid: false,
									message: me.getContext().i18n.getText("i18n", "error_xml"),
									severity: "error"
								});
							}
						}
					}
				});
				return oSelPageLayoutHeader;

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