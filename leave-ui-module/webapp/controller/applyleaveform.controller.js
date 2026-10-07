sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ],
    function (Controller, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend(
            "employeeleave.leaveuimodule.controller.applyleaveform",
            {

                onInit: function () {
                    
                },


                /**
                 * Calculate leave days when ending date changes
                 */
                onEndDateChange: function () {

                    var oView = this.getView();

                    var sStartDate = oView.byId("startingDate").getValue();
                    var sEndDate = oView.byId("endingDate").getValue();

                    if (!sStartDate || !sEndDate) {
                        oView.byId("noOfDate").setValue("");
                        return;
                    }

                    var oStartDate = new Date(sStartDate);
                    var oEndDate = new Date(sEndDate);

                    if (oEndDate < oStartDate) {

                        MessageBox.error(
                            "Ending date cannot be before starting date."
                        );

                        oView.byId("endingDate").setValue("");
                        oView.byId("noOfDate").setValue("");

                        return;
                    }

                    var iDifference =
                        oEndDate.getTime() - oStartDate.getTime();

                    var iDays =
                        Math.floor(
                            iDifference / (1000 * 60 * 60 * 24)
                        ) + 1;

                    oView.byId("noOfDate").setValue(iDays);
                },
                /**
                 * Start SBPA workflow
                 */
                startWorkflowInstance: function () {

                    var oView = this.getView();

                    // Get form values
                    var sEmployeeId =
                        oView.byId("employeeId").getValue();

                    var sEmployeeName =
                        oView.byId("employeeName").getValue();

                    var sEmail =
                        oView.byId("email").getValue();

                    var sStartingDate =
                        oView.byId("startingDate").getValue();

                    var sEndingDate =
                        oView.byId("endingDate").getValue();

                    var sNoOfDate =
                        oView.byId("noOfDate").getValue();

                    var sReason =
                        oView.byId("reason").getValue();


                    // Validate mandatory fields
                    if (
                        !sEmployeeId ||
                        !sEmployeeName ||
                        !sEmail ||
                        !sStartingDate ||
                        !sEndingDate ||
                        !sReason
                    ) {

                        MessageBox.warning(
                            "Please fill all required fields."
                        );

                        return;
                    }


                    // Workflow definition ID
                    var sDefinitionId =
                        "us10.3aa116b5trial.demotest2.main";


                    // Workflow context
                    var oData = {

                        definitionId: sDefinitionId,

                        context: {

                            id: Number(sEmployeeId),

                            _name: sEmployeeName,

                            email: sEmail,

                            startingDate: sStartingDate,

                            endingDate: sEndingDate,

                            noOfDate: Number(sNoOfDate),

                            reason: sReason
                        }
                    };


                    console.log(
                        "Starting workflow with payload:",
                        oData
                    );
                    // Start workflow
                    $.ajax({

                        url:
                            this._getWorkflowRuntimeBaseURL() +
                            "/workflow-instances",

                        method: "POST",

                        contentType: "application/json",

                        headers: {
                            "X-CSRF-Token":
                                this._fetchToken()
                        },

                        data: JSON.stringify(oData),


                        success: function (result) {

                            console.log(
                                "Workflow started successfully:",
                                result
                            );


                            MessageBox.success(
                                "Leave applied successfully!",
                                {
                                    title: "Leave Application",
                                    onClose: function () {

                                        // Clear form
                                        oView.byId(
                                            "employeeId"
                                        ).setValue("");

                                        oView.byId(
                                            "employeeName"
                                        ).setValue("");

                                        oView.byId(
                                            "email"
                                        ).setValue("");

                                        oView.byId(
                                            "startingDate"
                                        ).setValue("");

                                        oView.byId(
                                            "endingDate"
                                        ).setValue("");

                                        oView.byId(
                                            "noOfDate"
                                        ).setValue("");

                                        oView.byId(
                                            "reason"
                                        ).setValue("");
                                    }
                                }
                            );
                        },


                        error: function (
                            request,
                            status,
                            error
                        ) {

                            console.error(
                                "Workflow start failed"
                            );

                            console.error(
                                "HTTP Status:",
                                request.status
                            );

                            console.error(
                                "Response:",
                                request.responseText
                            );


                            var sMessage =
                                "Unable to apply leave.";


                            // Safely parse JSON only when possible
                            try {

                                if (
                                    request.responseText
                                ) {

                                    var oError =
                                        JSON.parse(
                                            request.responseText
                                        );

                                    sMessage =
                                        oError.message ||
                                        sMessage;
                                }

                            } catch (e) {

                                console.warn(
                                    "Response is not JSON:",
                                    request.responseText
                                );
                            }


                            MessageBox.error(
                                sMessage,
                                {
                                    title:
                                        "Leave Application Failed"
                                }
                            );
                        }

                    });
                },


                /**
                 * Fetch XSRF token
                 */
                _fetchToken: function () {

                    var fetchedToken;

                    jQuery.ajax({

                        url:
                            this._getWorkflowRuntimeBaseURL() +
                            "/xsrf-token",

                        method: "GET",

                        async: false,

                        headers: {
                            "X-CSRF-Token": "Fetch"
                        },

                        success: function (
                            result,
                            xhr,
                            data
                        ) {

                            fetchedToken =
                                data.getResponseHeader(
                                    "X-CSRF-Token"
                                );
                        },

                        error: function (
                            request
                        ) {

                            console.warn(
                                "XSRF token request failed:",
                                request.status
                            );

                        }

                    });

                    return fetchedToken;
                },


                /**
                 * Get Workflow Runtime URL
                 */
                _getWorkflowRuntimeBaseURL: function () {

                    var appId =
                        this.getOwnerComponent()
                            .getManifestEntry(
                                "/sap.app/id"
                            );

                    var appPath =
                        appId.replaceAll(".", "/");

                    var appModulePath =
                        jQuery.sap.getModulePath(
                            appPath
                        );

                    return (
                        appModulePath +
                        "/bpmworkflowruntime/v1"
                    );
                }

            }
        );
    }
);
