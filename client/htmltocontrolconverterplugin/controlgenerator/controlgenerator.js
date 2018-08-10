define(["sap/watt/lib/jszip/jszip-shim", "sap/watt/lib/lodash/lodash",
	"htmltocontrolconverterplugin/utils/JSONGenerator",
	"htmltocontrolconverterplugin/utils/ControlGenerator"
], function (JSZip, _, JSONGenerator, ControlGenerator) {
	return {

		WEBAPP_FOLDER_NAME: "webapp",

		configWizardSteps: function (oTemplateCustomizationStep) {
			// return [oTemplateCustomizationStep];
		},
		onBeforeTemplateGenerate: function (templateZip, model) {
			var sControlNamespace = model.UI5Control.parameters.namespace.value;
			var controlName = model.UI5Control.parameters.name.value;

			if (!controlName) {
				controlName = "Control1";
				model.UI5Control.parameters.name.value = controlName;
			}

			// builds the full path of the view location
			var sPathInsideProject = this._getFolderPathInProject(model);
			sPathInsideProject = this._removeWebAppFromPath(sPathInsideProject);

			if (!sControlNamespace) {
				//model.basicSAPUI5ApplicationComponent.parameters.namespace.value = sPathInsideProject;
				sControlNamespace = "";
			} else {
				// if user defined namespace then add . to the namespace value
				sControlNamespace += ".";
			}

			var newZip = new JSZip();

			var JSONG = new htmltocontrolconverterplugin.utils.JSONGenerator();
			var html = model.htmltemplate.replace(/\n/g, "")
				.replace(/[\t ]+\</g, "<")
				.replace(/\>[\t ]+\</g, "><")
				.replace(/\>[\t ]+$/g, ">");
			var jsonhtml = JSONG.generateJSON(html);
			var cg = new htmltocontrolconverterplugin.utils.ControlGenerator();
			cg.setMappingTable(model.Properties);

			return model.selectedDocument.getProject().then(function (oProject) {
				var _isMtaModule = false;
				if (oProject) {
					var _oProjectMetadata = oProject.getProjectMetadata();
					if (_oProjectMetadata && _oProjectMetadata.type === "com.sap.hcp.html5") {
						// this is a MTA module scenario 
						_isMtaModule = true;
					}
				}
				var isPathIncluded = (sControlNamespace.search(sPathInsideProject) > -1);
				if (sPathInsideProject.trim().length > 0) {
					if (isPathIncluded) {
						model.controlNamespace = sControlNamespace + "control." + controlName;
					} else {
						if (_isMtaModule) {
							model.controlNamespace = sControlNamespace + "control." + controlName;
						} else {
							if (sPathInsideProject.endsWith(".")) {
								sPathInsideProject = sPathInsideProject.substring(0, sPathInsideProject.length - 1);
							}
							model.controlNamespace = sControlNamespace + sPathInsideProject + ".control." + controlName;
						}
					}
				} else {
					model.controlNamespace = sControlNamespace + "control." + controlName;
				}
				var sContent = cg.generateControl(JSON.parse(jsonhtml), model.controlNamespace);
				newZip.file("control/" + controlName + ".js", sContent);
				return [newZip, model];
			});

		},

		_getFolderPathInProject: function (model) {
			var path = model.componentPath;
			var idx = path.indexOf("/", 1) + 1;
			var sPathInProject = "";
			if (idx > 0) {
				sPathInProject = path.substring(idx).replace(new RegExp("/", "g"), ".");
			}
			return sPathInProject;
		},

		_removeWebAppFromPath: function (sPathInsideProject) {
			if (!_.isEmpty(sPathInsideProject)) {
				sPathInsideProject = sPathInsideProject.replace(this.WEBAPP_FOLDER_NAME, "");
				// Removes irrelevant "." from path (e.g ".localService.abc)
				if (_.startsWith(sPathInsideProject, ".")) {
					sPathInsideProject = sPathInsideProject.substring(1);
				}
			}
			return sPathInsideProject;
		},

		_addFilesToNewZip: function (aFiles, oNewZip, oOldZip) {
			for (var i = 0; i < aFiles.length; i++) {
				var sFileName = aFiles[i];
				oNewZip.file(sFileName, oOldZip.file(sFileName).asText());
			}
		},

		onAfterGenerate: function (projectZip, model) {
			return [projectZip, model];
		},

		onBeforeTemplateCustomizationLoaded: function (oWizardModel, oTemplateModel) {
			var oSelectedDocument = oWizardModel.oData.selectedDocument;
			if (oSelectedDocument) {
				var that = this;
				return this.context.service.ui5projecthandler.getAppNamespace(oSelectedDocument).then(function (sNamespace) {
					oTemplateModel.oData.UI5Control.parameters.namespace.value = sNamespace;
					return that._getPathToGenerateFiles(oWizardModel, oSelectedDocument).then(function (sPathToGenerateFilesIn) {
						oWizardModel.oData.componentPath = sPathToGenerateFilesIn;
						return [oWizardModel, oTemplateModel];
					});
				}).fail(function (oError) {
					that.context.service.log.info(oError.message).done();
				});
			}
		}
	};
});