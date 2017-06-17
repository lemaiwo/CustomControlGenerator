# Custom UI5 Control Generator

I've created a plugin for the SAPWebIDE to generate custom SAPUI5/OpenUI5 controls based on HTML. The goal of this plugin is to:
1. Improve development of custom controls
2. Speed up the development of custom controls
3. Save time! 
4. Less typing :)
5. Make everything a control

See how it works in this video:
<p align="center">
<a href="https://youtu.be/9FdPw-26fSg" target="_blank">
<img src="http://img.youtube.com/vi/9FdPw-26fSg/0.jpg" 
alt="How to use the SAPWebIDE Plugin" width="640" height="360" /></a>
</p>

# Getting started

## Create destination

Create a file without extension and past the following lines in the file:
```
Description=My Feature
Type=HTTP
Authentication=NoAuthentication
WebIDEUsage=feature
Name=FeatureUI5ControlGenerator
WebIDEEnabled=true
CloudConnectorVersion=2
URL=https\://htmltocontrolconverter-a6ac3f497.dispatcher.hana.ondemand.com
ProxyType=Internet
```

## Import destination

1. Open your HANA Cloud Platform Cockpit
2. Go to Connectivity
3. Open Destinations
4. Import the created destination
5. Save
 
<img src="https://github.com/lemaiwo/CustomControlGenerator/blob/master/resources/import.png"/>

## SAPWebIDE Settings

1. Start by restarting the SAPWebIDE
2. Open settings
3. Select Plugins
4. Change repository to "Features"
5. Enable the UI5 Control Generator
6. Restart the SAPWebIDE

<img src="https://github.com/lemaiwo/CustomControlGenerator/blob/master/resources/settings.png"/>

## Result

<img src="https://github.com/lemaiwo/CustomControlGenerator/blob/master/resources/result.png"/>

# Contribute

This is a plugin from me as a developer to help you as a developer. If you have a great idea or just want to help your welcome to help me improving this plugin!

# Contact

You're always welcome to update me about bugs at wouterlemaire120@hotmail.com