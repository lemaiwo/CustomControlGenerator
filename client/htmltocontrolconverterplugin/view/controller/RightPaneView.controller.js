sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"htmltocontrolconverterplugin/utils/JSONGenerator",
	"htmltocontrolconverterplugin/utils/ControlGenerator"
], function(Controller, JSONModel, JSONGenerator, ControlGenerator) {
	"use strict";

	return Controller.extend("htmltocontrolconverterplugin.view.controller.RightPaneView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf htmltocontrolconverterplugin.client.htmltocontrolconverterplugin.view.view.RightPaneView
		 */
		onInit: function() {
			this.getView().setModel(new JSONModel({
				html: "<div class=\"example\" style=\"width:100px;height:250px;\"></div>"
			}));
			String.prototype.replaceAll = function(find, replace) {
				var str = this;
				return str.replace(new RegExp(find, 'g'), replace);
			};
		},
		onConvert: function() {
			var v = this.getView();
			this.c = v.getViewData().context;
			var data = this.getView().getModel().getData();
			var me = this;

			var JSONG = new JSONGenerator();
			var html = data.html.replace(/\n/g, "")
				.replace(/[\t ]+\</g, "<")
				.replace(/\>[\t ]+\</g, "><")
				.replace(/\>[\t ]+$/g, ">");
			var jsonhtml = JSONG.generateJSON(html);
			me.c.service.content.getCurrentDocument().then(function(document) {
				me.c.service.ui5projecthandler.getAppNamespace(document).then(function(namespace) {
					//console.log(namespace+pathAndName);
					me.generateContent(namespace, jsonhtml, document);
				}, function(error) {
					me.generateContent("", jsonhtml, document);
				});

			});
		},
		generateContent: function(namespace, jsonhtml, document) {
				var cg = new ControlGenerator();

				var e = document.getEntity();
				var pathAndName = e.getFullPath().substr(0, e.getFullPath().indexOf(".")).substr(e.getFullPath().indexOf("webapp") + 6).replaceAll(
					"/", ".");
				var sContent = cg.generateControl(JSON.parse(jsonhtml), namespace + pathAndName);

				this.c.service.beautifierProcessor.beautify(sContent, "js").then(function(sFormattedChange) {
					return document.setContent(sFormattedChange).then(function() {
						return document.save();
					});
				});
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf htmltocontrolconverterplugin.client.htmltocontrolconverterplugin.view.view.RightPaneView
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf htmltocontrolconverterplugin.client.htmltocontrolconverterplugin.view.view.RightPaneView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf htmltocontrolconverterplugin.client.htmltocontrolconverterplugin.view.view.RightPaneView
		 */
		//	onExit: function() {
		//
		//	}

	});

});