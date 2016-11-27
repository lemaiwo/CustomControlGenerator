sap.ui.define([
	"sap/ui/base/Object",
	"htmltocontrolconverterplugin/utils/PropertyGenerator"
], function(Object, Property) {
	"use strict";
	return Object.extend("htmltocontrolconverterplugin.utils.ControlGenerator", {
		constructor: function(json) {
			this.setJSON(json);
		},
		setJSON: function(json) {
			this._json = json;
		},
		getJSON: function() {
			return this._json;
		},
		generateControl: function(json) {
			if (json) {
				this.setJSON(json);
			}
			if (!this.getJSON()) {
				console.log("No JSON available!");
				return;
			}
			// must be first --> will search for properties
			var renderer = this.generateRendererFn();

			var controlStr = [];
			controlStr.push(this.generateBeginControl());
			controlStr.push(this.generateMetadata());
			controlStr.push(",");
			controlStr.push(this.generateInitFn());
			controlStr.push(",");
			controlStr.push(renderer);
			controlStr.push(",");
			controlStr.push(this.generateAfterRenderingFn());
			if (this.props && this.props.length > 0) {
				controlStr.push(",");
				controlStr.push(this.generateSettersFn());
			}
			controlStr.push(this.generateEndControl());
			return controlStr.join(" ");
		},
		generateBeginControl: function() {
			var begin = "sap.ui.define([";
			begin += "\"sap/ui/core/Control\"";
			begin += "], function(Control) {";
			begin += "\"use strict\";";
			begin += "return Control.extend(\"namespace.ControlName\", {";
			return begin;
		},
		generateEndControl: function() {
			var end = "});});";
			return end;
		},
		generateMetadata: function() {
			var meta = "\"metadata\":{ \"properties\":{";
			var allprops = [];
			$.each(this.props, function(key, value) {
				allprops.push(value.getPropMeta());
			});
			meta += allprops.join(",");
			meta += "},\"events\":{}}";
			return meta;
		},
		generateInitFn: function() {
			var InitFn = "init: function() { ";
			InitFn += "}";
			return InitFn;
		},
		generateRendererFn: function() {
			this._firstTime = true;
			var RendererFn = "renderer: function(oRm, oControl) { ";
			RendererFn += this.renderControl(this.getJSON());
			RendererFn += "}";
			return RendererFn;
		},
		generateAfterRenderingFn: function() {
			var AfterRenderingFn = "onAfterRendering: function(evt) { ";
			AfterRenderingFn += "}";
			return AfterRenderingFn;
		},
		generateSettersFn: function() {
			var propsSetters = [];
			$.each(this.props, function(key, value) {
				propsSetters.push(value.getSetterFn());
			});
			return propsSetters.join(",");
		},
		renderControl: function(controljson) {
			var me = this;
			var control = "oRm.write(\"<" + controljson.tag + "\");";
			if (this._firstTime) {
				this.props = [];
				control += "oRm.writeControlData(oControl);";
				this._firstTime = false;
			}
			if (controljson.style) {
				var styles = controljson.style.split(";");
				$.each(styles, function(key, value) {
					if (value) {
						var style = value.split(":");
						control += "oRm.addStyle(\"" + style[0] + "\", \"" + style[1] + "\");";
					}
				});
				control += "oRm.writeStyles();";
			}
			if (controljson.class) {
				var classes = controljson.class.split(" ");
				$.each(classes, function(key, value) {
					if (value) {
						control += "oRm.addClass(\"" + value + "\");";
					}
				});
				control += "oRm.writeClasses();";
			}
			if(controljson.src){
				control += this.addAttribute("src");
			}
			if(controljson.href){
				control += this.addAttribute("href");
			}
			control += "oRm.write(\">\");";
			if (controljson.html) {
				control += this.addProperty();
			}
			if (controljson.children) {
				$.each(controljson.children, function(key, value) {
					control += me.renderControl(value);
				});
			}
			control += "oRm.write(\"</" + controljson.tag + ">\");";
			return control;
		},
		addProperty: function() {
			if (!this.props) {
				return;
			}
			var l = this.getParamCount("prop");
			var p = new Property("prop" + (++l));
			this.props.push(p);
			return "oRm.writeEscaped(oControl." + p.generateFnName("get") + "());";
		},
		addAttribute: function(attr) {
			if (!this.props) {
				return;
			}
			var l = this.getParamCount(attr);
			var p = new Property(attr + (++l));
			this.props.push(p);
			return "oRm.writeAttributeEscaped(\""+attr+"\",oControl." + p.generateFnName("get") + "());";
		},
		getParamCount:function(param){
			// var l = _.countBy(this.props,function(prop){
			// 	return prop.getName().substr(0,param.length) === param?param:"Others";
			// });
			var l = 0;
			$.each(this.prop,function(key,value){
				if(value.getName().substr(0,param.length) === param){
					l++;
				}
			});
			return l?l:0;
		}
	});
});