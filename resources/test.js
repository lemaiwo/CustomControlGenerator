sap.ui.define(["sap/ui/core/Control"], function(Control) {
	"use strict";
	return Control.extend("ToControlConverter.resources.test", {
		"metadata": {
			"properties": {},
			"events": {}
		},
		init: function() {},
		renderer: function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", "100px");
			oRm.addStyle("height", "250px");
			oRm.writeStyles();
			oRm.addClass("example");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");
		},
		onAfterRendering: function(evt) {}
	});
});