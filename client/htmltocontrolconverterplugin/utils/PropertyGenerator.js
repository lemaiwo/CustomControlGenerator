sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	return Object.extend("htmltocontrolconverterplugin.utils.PropertyGenerator", {
	    constructor: function(key,name,type,typeIsFixed,generateSetter) {
			this.setName(name);
			this.setKey(key);
			this.setType(type);
			this.setTypeIsFixed(typeIsFixed);
			this.setGenerateSetter(generateSetter);
			// this.setValue(value);
		},
		setName:function(name){
			this._name = name;
		},
		setKey:function(key){
			this._key = key;
		},
		setType:function(type){
			this._type = type;
		},
		setTypeIsFixed:function(typeIsFixed){
			this._typeIsFixed = typeIsFixed;
		},
		setGenerateSetter:function(generateSetter){
			this._generateSetter = generateSetter;
		},
		getName:function(){
			return this._name;
		},
		getKey:function(){
			return this._key;
		},
		getType:function(){
			return this._type;
		},
		getTypeIsFixed:function(){
			return this._typeIsFixed;
		},
		getGenerateSetter:function(){
			return this._generateSetter;
		},
		// setValue:function(value){
		// 	this._value = value;
		// },
		// getValue:function(){
		// 	return this._value;
		// },
		getPropMeta:function(){
			return "\""+this.getName()+"\":\""+this.getType()+"\"";
		},
		getSetterFn:function(){
			//for smoother rendering
			var fnSetter = this.generateFnName("set")+": function(value) { ";
			fnSetter += "this.setProperty(\""+this.getName()+"\", value, true); ";
			fnSetter += "return this;}";
			return this.getGenerateSetter()?fnSetter:false;
		},
		generateFnName:function(fn){
			return fn+this.getName()[0].toUpperCase()+this.getName().substr(1);
		}
	});
});