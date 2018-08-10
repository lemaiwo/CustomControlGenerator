sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	return Object.extend("htmltocontrolconverterplugin.utils.PropertyGenerator", {
	    constructor: function(key,name) {
			this.setName(name);
			this.setKey(key);
			// this.setValue(value);
		},
		setName:function(name){
			this._name = name;
		},
		setKey:function(key){
			this._key = key;
		},
		getName:function(){
			return this._name;
		},
		getKey:function(){
			return this._key;
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