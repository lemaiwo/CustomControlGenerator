sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	return Object.extend("htmltocontrolconverterplugin.utils.JSONGenerator", {
		constructor: function(html) {
			this.setHTML(html);
		},
		setHTML: function(html) {
			// if (html) {
			// 	html.replace(" ", "");
			// }
			this._html = html;
		},
		getHTML: function() {
			return this._html;
		},
		generateJSON: function(html) {
			if (html) {
				this.setHTML(html);
			}
			return this.FormatJSON(this.toTransform(this.getHTML()));
		},
		//Convert obj or array to transform
		toTransform: function(obj) {
			var json;
			obj = $(obj);
			if (obj.length > 1) {
				json = [];
				for (var i = 0; i < obj.length; i++) {
					if(obj[i].nodeName !== "#text"){
						json[json.length++] = this.ObjToTransform(obj[i]);
					}
				}
			} else {
				json = this.ObjToTransform(obj);
			}
			return json;
		},
		//Convert obj to transform
		ObjToTransform: function(obj) {
			//Get the DOM element
			var el = $(obj).get(0);
			//Add the tag element
			var json = {
				'tag': el.nodeName.toLowerCase()
			};
			if (el.attributes) {
				for (var attr, i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
					attr = attrs[i];
					json[attr.nodeName] = attr.value;
				}
			}
			var children = $(obj).children();

			if (children.length > 0) {
				json["children"] = [];
			} else {
				json["html"] = $(obj).text();
			}

			//Add the children
			for (var c = 0; c < children.length; c++) {
				json["children"][json["children"].length++] = this.toTransform(children[c]);
			}
			return (json);
		},
		//Format JSON (with indents)
		FormatJSON: function(oData, sIndent) {
			if (arguments.length < 2) {
				var sIndent = "";
			}
			var sIndentStyle = "  ";
			var sDataType = this.RealTypeOf(oData);
			var me = this;
			// open object
			if (sDataType == "array") {
				if (oData.length == 0) {
					return "[]";
				}
				var sHTML = "[";
			} else {
				var iCount = 0;
				$.each(oData, function() {
					iCount++;
					return;
				});
				if (iCount == 0) { // object is empty
					return "{}";
				}
				var sHTML = "{";
			}

			// loop through items
			var iCount = 0;
			$.each(oData, function(sKey, vValue) {
				if (iCount > 0) {
					sHTML += ",";
				}
				if (sDataType == "array") {
					sHTML += ("\n" + sIndent + sIndentStyle);
				} else {
					sHTML += ("\"" + sKey + "\"" + ":");
				}

				// display relevant data type
				switch (me.RealTypeOf(vValue)) {
					case "array":
					case "object":
						sHTML += me.FormatJSON(vValue, (sIndent + sIndentStyle));
						break;
					case "boolean":
					case "number":
						sHTML += vValue.toString();
						break;
					case "null":
						sHTML += "null";
						break;
					case "string":
						sHTML += ("\"" + vValue + "\"");
						break;
					default:
						sHTML += ("TYPEOF: " + typeof(vValue));
				}

				// loop
				iCount++;
			});

			// close object
			if (sDataType == "array") {
				sHTML += ("\n" + sIndent + "]");
			} else {
				sHTML += ("}");
			}

			// return
			return sHTML;
		},
		//Get the type of the obj (can replace by jquery type)
		RealTypeOf: function(v) {
			if (typeof(v) == "object") {
				if (v === null) {
					return "null";
				}
				if (v.constructor == (new Array).constructor) {
					return "array";
				}
				if (v.constructor == (new Date).constructor) {
					return "date";
				}
				if (v.constructor == (new RegExp).constructor) {
					return "regex";
				}
				return "object";
			}
			return typeof(v);
		}
	});
});