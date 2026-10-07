/*global QUnit*/

sap.ui.define([
	"employeeleave/leave-ui-module/controller/applyleaveform.controller"
], function (Controller) {
	"use strict";

	QUnit.module("applyleaveform Controller");

	QUnit.test("I should test the applyleaveform controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
