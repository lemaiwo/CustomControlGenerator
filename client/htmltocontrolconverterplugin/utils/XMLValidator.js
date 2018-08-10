sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";
	return Object.extend("htmltocontrolconverterplugin.utils.XMLValidator", {
		constructor: function (xml) {
			this.setXML(xml);
			// this.setValue(value);
		},
		setXML: function (xml) {
			this._xml = xml;
		},
		getXML: function () {
			return this._xml;
		},
		isValid: function () {
			// code for IE
			if (window.ActiveXObject) {
				var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(this._xml);

				if (xmlDoc.parseError.errorCode != 0) {
					return false;
				} else {
					return true;
				}
			}
			// code for Mozilla, Firefox, Opera, etc.
			else if (document.implementation.createDocument) {
				var parser = new DOMParser();
				xmlDoc = parser.parseFromString(this._xml, "text/xml");

				if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
					return false
				} else {
					return true;
				}
			} else {
				return false
			}
		}
	});
});