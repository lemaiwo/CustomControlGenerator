sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	return Object.extend("htmltocontrolconverterplugin.utils.PropertyGenerator", {
	    constructor: function(name) {
			this.setName(name);
			// this.setValue(value);
		},
		setName:function(name){
			this._name = name;
		},
		getName:function(){
			return this._name;
		},
		// setValue:function(value){
		// 	this._value = value;
		// },
		// getValue:function(){
		// 	return this._value;
		// },
		getPropMeta:function(){
			return "\""+this.getName()+"\":\"string\"";
		},
		getSetterFn:function(){
			//for smoother rendering
			var fnSetter = this.generateFnName("set")+": function(value) { ";
			fnSetter += "this.setProperty(\""+this.getName()+"\", value, true); ";
			fnSetter += "return this;}";
			return fnSetter;
		},
		generateFnName:function(fn){
			return fn+this.getName()[0].toUpperCase()+this.getName().substr(1);
		}
	});
});