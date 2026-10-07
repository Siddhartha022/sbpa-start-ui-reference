# SAP Build Process Automation - Custom Start UI Reference

A reusable SAPUI5 Custom Start UI reference project for
SAP Build Process Automation (SBPA).

This project demonstrates how to build a custom Start UI that collects
employee input and starts an SBPA workflow using the Workflow Runtime API.

---

## 📌 Project Overview

The application provides an Employee Leave Application form.

The employee enters:

- Employee ID
- Employee Name
- Email
- Starting Date
- Ending Date
- Number of Leave Days
- Reason for Leave

When the employee clicks **Apply Leave**, the UI5 application:

1. Validates the form
2. Creates the SBPA workflow context
3. Calls the SBPA Workflow Runtime API
4. Starts a workflow instance
5. Displays a success message

```text
Employee
   |
   | Fill Leave Form
   v
SAPUI5 Start UI
   |
   | POST /workflow-instances
   v
SAP Build Process Automation
   |
   | Start Workflow
   v
Workflow Instance
