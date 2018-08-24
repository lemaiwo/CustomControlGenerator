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
			},

			_createPageLayoutConfigurationContent: function () {
				var me = this;
				//core step which creates all UI elements and its logic.
				var oColTemplate1 = new sap.ui.table.Column({
					width:"30%",
					label:  new sap.m.Label({text:"Generated name"}),
					template: [new sap.m.Text({
						text: "{_name}"
					})]
				});
				var oColTemplateSetter = new sap.ui.table.Column({
					width:"10%",
					label:  new sap.m.Label({text:"Setter"}),
					template: [new sap.m.Switch({
						state:"{_generateSetter}"
					})]
				});
				var oColTemplateType = new sap.ui.table.Column({
					width:"20%",
					label:  new sap.m.Label({text:"Type"}),
					template: [new sap.m.Select({
						width:"100%",
						enabled:"{= !${_typeIsFixed} }",
						selectedKey:"{_type}",
						items:{
							path:"/UI5Control/TypesCollection",
							template: new sap.ui.core.Item({key:"{name}",text:"{value}"})
						}
					})]
				});
				var oColTemplate2 = new sap.ui.table.Column({
					width:"40%",
					label:  new sap.m.Label({text:"Custom name"}),
					template: [new sap.m.Input({
						value: "{value}"
					})]
				});
				var oTable = new sap.ui.table.Table({
					rows: {
						path: "/Properties",
					},
					selectionMode:"None",
					columns:[oColTemplate1,oColTemplateSetter,oColTemplateType,oColTemplate2]
				});
				return oTable;

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