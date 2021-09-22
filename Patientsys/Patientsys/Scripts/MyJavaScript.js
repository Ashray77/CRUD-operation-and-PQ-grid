const pqOptions = {
    width: "auto",
    height: 250,
    showTitle: false,
    showHeader: true,
    showTop: true,
    showToolbar: false,
    showBottom: false,
    wrap: true,
    hwrap: false,
    sortable: false,
    editable: false,
    resizable: false,
    collapsible: false,
    draggable: true, dragColumns: { enabled: true },
    scrollModel: { autoFit: true },
    numberCell: { show: true, resizable: true, title: "S.N.", minWidth: 30 },
    pageModel: { curPage: 1, rPP: 10, type: "local" },
    columnTemplate: { wrap: true, editable: false, dataType: "string", halign: "center", hvalign: "center", resizable: true, styleHead: { 'font-weight': "bold" } },
};

function PersonalVM() {
    const self = this;

    var isNullOrEmpty = function (str) {
        if (str === undefined || str === null) {
            return true;
        } else if (typeof str === "string") {
            return (str.trim() === "");
        } else {
            return false;
        }
    };

    var isNumeric = function (str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail

    };

    const models = {
        MyPatient: function (item) {
            item = item || {};
            this.FullName = ko.observable(item.FullName || "");
            this.Email = ko.observable(item.Email || "");
            this.PhoneNumber = ko.observable(item.PhoneNumber || "");
            this.Age = ko.observable(item.Age || "");
            this.SelectedGender = ko.observable();
            this.Male = ko.computed({
                read: function () {
                    return this.SelectedGender() == "Male";
                },
                write: function (value) {
                    if (value)
                        this.SelectedGender("Male");
                }

            }, this);
            this.Address = ko.observable(item.Address || "");
        },

        Appointment: function (item1) {
            item1 = item1 || {};
            this.AppCause = ko.observable(item1.AppCause || "");
            this.AppTreatment = ko.observable(item1.AppTreatment || "");
            this.AppDate = ko.observable(item1.AppDate || "");
            this.AppTime = ko.observable(item1.AppTime || "");
            this.AppRoomNum = ko.observable(item1.AppRoomNum || "");
        },

        Treatment: function (item2) {
            item2 = item2 || {};
            this.TreatmentName = ko.observable(item2.TreatmentName || "");
            this.TreatmentDate = ko.observable(item2.TreatmentDate || "");
            this.TreatmentTime = ko.observable(item2.TreatmentTime || "");
            this.DoctorName = ko.observable(item2.DoctorName || "");
            this.Medicines = ko.observableArray([]);
        },

        Medicine: function (item3) {
            item3 = item3 || {};
            this.MedName = ko.observable(item3.MedName || "");
            this.MedCompany = ko.observable(item3.MedCompany || "");
            this.MedPrice = ko.observable(item3.MedPrice || "");
            this.MedExpDate = ko.observable(item3.MedExpDate || "");
        },

        UiElements: function () {
            self.MyPatient = ko.observable(new models.MyPatient());
            self.Appointment = ko.observable(new models.Appointment());
            self.Treatment = ko.observable(new models.Treatment());
            self.Medicine = ko.observable(new models.Medicine());
            self.PatientId = ko.observable('');
            self.Search = ko.observable('');

            self.PatientList = ko.observableArray([]);
            self.AppointmentList = ko.observableArray([]);
            self.TreatmentList = ko.observableArray([]);
            self.MedicineList = ko.observableArray([]);

            self.enableDisableNew = ko.observable(true);
            self.enableDisableSave = ko.observable(false);
            self.enableDisableClear = ko.observable(false);
            self.enableDisableAllUpd = ko.observable(false);
            self.enableDisable = ko.observable(false);
            self.enableDisableGender = ko.observable(false);

            self.EDTreatAdd = ko.observable(false);
            self.EDTreatUpdate = ko.observable(false);
            self.EDAppAdd = ko.observable(false);
            self.EDAppUpd = ko.observable(false);
            self.EDMedAdd = ko.observable(false);
            self.EDMedUpd = ko.observable(false);

        },
    };
    const UiEvents = {
        validate: {
            SaveValidation: function () {
                if (isNullOrEmpty(self.MyPatient().FullName())) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputFullName").focus();
                    $("#errorMessage").html('Full Name is Required');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.MyPatient().Email())) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputEmail").focus();
                    $("#errorMessage").html('Email is Required');
                    $("#dialogbox").dialog("open");
                }
                else if (!(/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i).test(self.MyPatient().Email())) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputEmail").focus();
                    $("#errorMessage").html('Invalid Email');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.MyPatient().PhoneNumber())) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputPhone").focus();
                    $("#errorMessage").html('Phone Number is Required');
                    $("#dialogbox").dialog("open");
                }
                else if (!(isNumeric(self.MyPatient().PhoneNumber()))) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputPhone").focus();
                    $("#errorMessage").html('Phone Number Should be Number');
                    $("#dialogbox").dialog("open");
                }
                else if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/).test(self.MyPatient().PhoneNumber())) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputPhone").focus();
                    $("#errorMessage").html('Phone Number is Invalid');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.MyPatient().Age())) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputAge").focus();
                    $("#errorMessage").html('Age is Required');
                    $("#dialogbox").dialog("open");
                }
                else if (!(isNumeric(self.MyPatient().Age()))) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputAge").focus();
                    $("#errorMessage").html('Age must be in Number');
                    $("#dialogbox").dialog("open");
                }
                else if (!(self.MyPatient().Age() > 0)) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputAge").focus();
                    $("#errorMessage").html('Age must be Above 0.');
                    $("#dialogbox").dialog("open");
                }
                else if (!(self.MyPatient().SelectedGender() == "Male" || self.MyPatient().SelectedGender() == "Female")) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inlineRadio1").focus();
                    $("#errorMessage").html('Choose the Gender');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.MyPatient().Address())) {
                    $("#tabs1").tabs({ active: 0 });
                    $("#inputAddress").focus();
                    $("#errorMessage").html('Address must be entered');
                    $("#dialogbox").dialog("open");
                }
                else if (self.AppointmentList() == "") {
                    $("#tabs2").tabs({ active: 0 });
                    $("#appCause").focus();
                    $("#errorMessage").html('Appointment Must be added!!!!');
                    $("#dialogbox").dialog("open");
                }
                else if (self.TreatmentList() == "") {
                    $("#tabs2").tabs({ active: 1 });
                    $("#treatmentName").focus();
                    $("#errorMessage").html('Treatment Must be added!!!!');
                    $("#dialogbox").dialog("open");
                }
                else {
                    UiEvents.AjaxFunction.SaveAjax();
                    return true;
                }
            },

            AppointmentValidation: function () {
                if (isNullOrEmpty(self.Appointment().AppCause())) {
                    $("#tabs2").tabs({ active: 0 });
                    $("#appCause").focus();
                    $("#errorMessage").html('Cause of Appointment should must be entered');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.Appointment().AppTreatment())) {
                    $("#tabs2").tabs({ active: 0 });
                    $("#appTreatment").focus();
                    $("#errorMessage").html('Treatment Name should must be entered');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.Appointment().AppDate())) {
                    $("#tabs2").tabs({ active: 0 });
                    $("#appDate").focus();
                    $("#errorMessage").html('Date of Appointment should must be entered');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.Appointment().AppTime())) {
                    $("#tabs2").tabs({ active: 0 });
                    $("#appTime").focus();
                    $("#errorMessage").html('Time of Appointment should must be entered');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.Appointment().AppRoomNum())) {
                    $("#tabs2").tabs({ active: 0 });
                    $("#appRoomNum").focus();
                    $("#errorMessage").html('Room number should must be entered');
                    $("#dialogbox").dialog("open");
                }
                else if (!(isNumeric(self.Appointment().AppRoomNum()))) {
                    $("#tabs2").tabs({ active: 0 });
                    $("#appRoomNum").focus();
                    $("#errorMessage").html('Room number should must be number');
                    $("#dialogbox").dialog("open");
                }
                else {
                    if (ko.toJS(self.AppointmentList().find(x => (x.AppCause == self.Appointment().AppCause()) && (x.AppTreatment == self.Appointment().AppTreatment()) && (x.AppDate == self.Appointment().AppDate()) && (x.AppTime == self.Appointment().AppTime()) && (x.AppRoomNum == self.Appointment().AppRoomNum())))) {
                        $("#errorMessage").html('Same Appointment cannot be Entered!!!');
                        $("#dialogbox").dialog("open");
                    }
                    else {
                        self.AppointmentList.push(ko.toJS(self.Appointment()));
                        UiEvents.clearfunctions.Appclearfield();
                        return true;
                    }
                    return true;
                }
            },

            TreatmentValidation: function () {
                if (isNullOrEmpty(self.Treatment().TreatmentName())) {
                    $("#tabs2").tabs({ active: 1 });
                    $("#treatmentName").focus();
                    $("#errorMessage").html('Treatment Name must be Entered.');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.Treatment().TreatmentDate())) {
                    $("#tabs2").tabs({ active: 1 });
                    $("#treatmentDate").focus();
                    $("#errorMessage").html('Treatment Date must be Choosed.');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.Treatment().TreatmentTime())) {
                    $("#tabs2").tabs({ active: 1 });
                    $("#treatmentTime").focus();
                    $("#errorMessage").html('Treatment Date must be Choosed.');
                    $("#dialogbox").dialog("open");
                }
                else if (isNullOrEmpty(self.Treatment().DoctorName())) {
                    $("#tabs2").tabs({ active: 1 });
                    $("#doctorName").focus();
                    $("#errorMessage").html('Doctor Name must be Entered.');
                    $("#dialogbox").dialog("open");
                }
                else if (self.MedicineList() == "") {
                    $("#tabs2").tabs({ active: 1 });
                    $("#inputMedName").focus();
                    $("#errorMessage").html('Medicines should be Entered.');
                    $("#dialogbox").dialog("open");
                }
                else {
                    (self.Treatment().Medicines(self.MedicineList()));
                    self.TreatmentList().push(ko.toJS(self.Treatment()));
                    UiEvents.clearfunctions.Treatclearfield();
                    self.MedicineList([]);
                    return true;
                }
            },

            MedicineValidation: function () {
                if (isNullOrEmpty(self.Medicine().MedName())) {
                    $("#tabs2").tabs({ active: 1 });
                    $("#inputMedName").focus();
                    alert("Medicine Name must be entered");
                }
                else if (isNullOrEmpty(self.Medicine().MedCompany())) {
                    $("#tabs2").tabs({ active: 1 });
                    $("#medCompany").focus();
                    alert("Company must be entered");
                }
                else if (isNullOrEmpty(self.Medicine().MedPrice())) {
                    $("#tabs2").tabs({ active: 1 });
                    $("#medPrice").focus();
                    alert("Med Price must be entered");
                }
                else if (isNullOrEmpty(self.Medicine().MedExpDate())) {
                    $("#tabs2").tabs({ active: 1 });
                    $("#medExpDate").focus();
                    alert("Expire Date Should must be entered");
                }
                else {
                    if (ko.toJS(self.MedicineList().find(x => (x.MedName == self.Medicine().MedName()) && (x.MedCompany == self.Medicine().MedCompany()) && (x.MedPrice == self.Medicine().MedPrice()) && (x.MedExpDate == self.Medicine().MedExpDate())))) {
                        $("#errorMessage").html('Same Medicines cannot be Entered!!');
                        $("#dialogbox").dialog("open");
                        $("#tabs2").tabs({ active: 1 });
                        $("#inputMedName").focus();
                    }
                    else {
                        self.MedicineList.push(ko.toJS(self.Medicine()));
                        UiEvents.clearfunctions.Medclearfield();
                        return true;
                    }

                }
            },
        },

        GridFunctions: {
            PatientDataGrid: function (control) {
                if ($("#" + control).pqGrid("instance")) {
                    // $("#" + control).pqGrid("destroy");
                    $("#" + control).pqGrid('option', 'dataModel.data', ko.toJS(self.PatientList()));
                    $("#" + control).pqGrid('refreshDataAndView');
                } else {
                    const options = Object.assign({}, pqOptions);
                    options.colModel = [
                        { title: "Full Name", align: "center", dataIndx: "FullName", width: "10%" },
                        { title: "Email", align: "center", dataIndx: "Email", width: "15%" },
                        { title: "Phone Number", align: "center", dataIndx: "PhoneNumber", width: "15%" },
                        { title: "Age", align: "center", dataIndx: "Age", width: "15%" },
                        { title: "Gender", align: "center", dataIndx: "SelectedGender", width: "10%" },
                        { title: "Address", align: "center", dataIndx: "Address", width: "15%" },
                        {
                            title: "Action", align: "center", width: "20%", render: function (ui) {

                                return `<button class="btn btn-danger" onclick="obj.Pat_delete(${ui.rowData.Id});" type="button"><i class="fas fa-trash fa-lg">  Delete</i></button>  <button class="btn" style="background-color: #66CD00" onclick="obj.Pat_edit(${ui.rowData.Id});" type="button"><i class="fas fa-edit fa-lg">Edit</i></button>`;
                            }
                        },

                    ];

                    options.dataModel = { data: ko.toJS(self.PatientList()) };
                    options.showBottom = false;
                    $("#" + control).pqGrid(options);
                }
            },

            AppointmentDataGrid: function (control) {
                if ($("#" + control).pqGrid("instance")) {
                    // $("#" + control).pqGrid("destroy");
                    $("#" + control).pqGrid('option', 'dataModel.data', ko.toJS(self.AppointmentList()));
                    $("#" + control).pqGrid('refreshDataAndView');
                } else {
                    const options = Object.assign({}, pqOptions);
                    options.colModel = [
                        { title: "Cause", align: "center", dataIndx: "AppCause", width: "20%" },
                        { title: "Treatment", align: "center", dataIndx: "AppTreatment", width: "20%" },
                        { title: "Date", align: "center", dataIndx: "AppDate", width: "10%" },
                        { title: "Time", align: "center", dataIndx: "AppTime", width: "10%" },
                        { title: "Room Number", align: "center", dataIndx: "AppRoomNum", width: "20%" },
                        {
                            title: "Action", align: "center", width: "20%", render: function (ui) {

                                return `<button class="btn btn-danger" onclick="obj.AppDelete(${ui.rowIndx});" type="button"><i class="fas fa-trash fa-lg">  Delete</i></button>  <button class="btn" style="background-color: #66CD00" onclick="obj.AppEdit(${ui.rowIndx});" type="button"><i class="fas fa-edit fa-lg">Edit</i></button>`;
                            }
                        },

                    ];

                    options.dataModel = { data: ko.toJS(self.AppointmentList()) };
                    options.showBottom = false;
                    $("#" + control).pqGrid(options);
                }
            },

            MedicineDataGrid: function (control) {
                if ($("#" + control).pqGrid("instance")) {
                    // $("#" + control).pqGrid("destroy");
                    $("#" + control).pqGrid('option', 'dataModel.data', ko.toJS(self.MedicineList()));
                    $("#" + control).pqGrid('refreshDataAndView');
                } else {
                    const options = Object.assign({}, pqOptions);
                    options.colModel = [
                        { title: "Name", align: "center", dataIndx: "MedName", width: "20%" },
                        { title: "Company", align: "center", dataIndx: "MedCompany", width: "20%" },
                        { title: "Price", align: "center", dataIndx: "MedPrice", width: "20%" },
                        { title: "Expire Date", align: "center", dataIndx: "MedExpDate", width: "20%" },
                        {
                            title: "Action", align: "center", width: "20%", render: function (ui) {

                                return `<button class="btn btn-danger" onclick="obj.MedDelete(${ui.rowIndx});" type="button"><i class="fas fa-trash fa-lg">  Delete</i></button>  <button class="btn" style="background-color: #66CD00" onclick="obj.MedEdit(${ui.rowIndx});" type="button"><i class="fas fa-edit fa-lg">Edit</i></button>`;
                            }
                        },

                    ];

                    options.dataModel = { data: ko.toJS(self.MedicineList()) };
                    options.showBottom = false;
                    $("#" + control).pqGrid(options);
                }
            },

            TreatmentDataGrid: function (control) {
                if ($("#" + control).pqGrid("instance")) {
                    // $("#" + control).pqGrid("destroy");
                    $("#" + control).pqGrid('option', 'dataModel.data', ko.toJS(self.TreatmentList()));
                    $("#" + control).pqGrid('refreshDataAndView');
                } else {
                    const options = Object.assign({}, pqOptions);
                    options.colModel = [
                        { title: "Name", align: "center", dataIndx: "TreatmentName", width: "20%" },
                        { title: "Date", align: "center", dataIndx: "TreatmentDate", width: "20%" },
                        { title: "Time", align: "center", dataIndx: "TreatmentTime", width: "20%" },
                        { title: "Doctor Name", align: "center", dataIndx: "DoctorName", width: "20%" },
                        {
                            title: "Action", align: "center", width: "20%", render: function (ui) {

                                return `<button class="btn btn-danger" onclick="obj.TreatDelete(${ui.rowIndx});" type="button"><i class="fas fa-trash fa-lg">  Delete</i></button>  <button class="btn" style="background-color: #66CD00" onclick="obj.TreatEdit(${ui.rowIndx});" type="button"><i class="fas fa-edit fa-lg">Edit</i></button>`;
                            }
                        },

                    ];

                    options.dataModel = { data: ko.toJS(self.TreatmentList()) };
                    options.showBottom = false;
                    $("#" + control).pqGrid(options);
                }
            },
        },

        clearfunctions: {
            ResetAll: function () {
                self.MyPatient(new models.MyPatient());
                self.Appointment(new models.Appointment());
                self.Treatment(new models.Treatment());
                self.Medicine(new models.Medicine());
                $("#tabs1").tabs();
                $("#tabs2").tabs();
                self.AppointmentList([]);
                UiEvents.GridFunctions.AppointmentDataGrid("AppGrid");
                self.TreatmentList([]);
                UiEvents.GridFunctions.TreatmentDataGrid("TreatmentGrid");
                self.MedicineList([]);
                UiEvents.GridFunctions.MedicineDataGrid("MedGrid");
                self.enableDisableNew(true);
                self.enableDisableSave(false);
                self.enableDisableClear(false);
                self.enableDisableAllUpd(false);
                self.enableDisable(false);
                self.enableDisableGender(false);

                self.EDTreatAdd(false);
                self.EDTreatUpdate(false);
                self.EDAppAdd(false);
                self.EDAppUpd(false);
                self.EDMedAdd(false);
                self.EDMedUpd(false);
            },

            Appclearfield: function () {
                self.Appointment(new models.Appointment());
            },

            Treatclearfield: function () {
                self.Treatment(new models.Treatment());
            },

            Medclearfield: function () {
                self.Medicine(new models.Medicine());
            },            
        },

        AjaxFunction: {
            SaveAjax: function () {
                let PatientInfo = {
                    Id: self.PatientId(),
                    FullName: self.MyPatient().FullName(),
                    Email: self.MyPatient().Email(),
                    PhoneNumber: self.MyPatient().PhoneNumber(),
                    Age: self.MyPatient().Age(),
                    SelectedGender: self.MyPatient().SelectedGender(),
                    Address: self.MyPatient().Address(),
                    Appointments: ko.toJS(self.AppointmentList()),
                    Treatments: ko.toJS(self.TreatmentList())
                }
                debugger
                $.ajax({

                    type: "POST",
                    url: '/Home/InsertData',
                    dataType: "json",
                    data: JSON.stringify({ "data": PatientInfo }),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        //debugger
                        if (PatientInfo.Id == 0) {
                            $("#tabs1").tabs({ active: 1 });
                            //UiEvents.GridFunctions.PatientDataGrid("PatientGrid");
                            UiEvents.AjaxFunction.AjaxForAllDetail();
                            alert("Successfully submited");
                        }
                        else {
                            $("#tabs1").tabs({ active: 1 });
                            //UiEvents.GridFunctions.PatientDataGrid("PatientGrid");
                            UiEvents.AjaxFunction.AjaxForAllDetail();
                            alert("Successfully Updated");
                        }
                    }

                });
            },

            AjaxForAllDetail: function () {
                $.ajax({
                    type: "POST",
                    url: '/Home/GetAllData',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        //debugger
                        self.PatientList([]);
                        self.PatientList(result.Data);
                        UiEvents.GridFunctions.PatientDataGrid("PatientGrid");
                    }
                });
            },

            AjaxForDelete: function (PatientId) {
                $.ajax({
                    type: "POST",
                    url: '/Home/DeleteData',
                    dataType: "json",
                    data: JSON.stringify({ Id: PatientId }),
                    contentType: "application/json; charset=utf-8",
                    success: function () {
                        UiEvents.AjaxFunction.AjaxForAllDetail();
                    }
                });
            },

            AjaxForEdit: function (PatientId) {
                self.TreatmentList([]);
                self.MedicineList([]);
                self.AppointmentList([]);
                $.ajax({
                    type: "POST",
                    url: '/Home/FetchDetails',
                    dataType: "json",
                    data: JSON.stringify({ Id: PatientId }),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        //debugger    
                        UiEvents.GridFunctions.PatientDataGrid("PatientGrid");
                        $("#tabs1").tabs({ active: 0 });

                        self.enableDisableClear(true);
                        self.enableDisableNew(false);
                        self.enableDisable(true);
                        self.EDAppAdd(true);
                        self.EDAppUpd(false);
                        self.EDMedAdd(true);
                        self.EDMedUpd(false);
                        self.EDTreatAdd(true);
                        self.EDTreatUpdate(false);
                        self.enableDisableGender(true);

                        self.AppointmentList([]);
                        self.AppointmentList(data.Data.Appointments);
                        UiEvents.GridFunctions.AppointmentDataGrid("AppGrid");

                        self.TreatmentList([]);
                        self.TreatmentList(data.Data.Treatments);
                        UiEvents.GridFunctions.TreatmentDataGrid("TreatmentGrid");

                        self.PatientId(data.Data.Id);
                        self.MyPatient().FullName(data.Data.FullName);
                        self.MyPatient().Age(data.Data.Age);
                        self.MyPatient().PhoneNumber(data.Data.PhoneNumber);
                        self.MyPatient().Email(data.Data.Email);
                        self.MyPatient().SelectedGender(data.Data.SelectedGender);
                        self.MyPatient().Address(data.Data.Address);
                    }
                })
            },

            AjaxForSearch: function (searchname) {
                $.ajax({
                    type: "POST",
                    url: '/Home/GetSearchData',
                    dataType: "json",
                    data: JSON.stringify({ 'searchname' : searchname }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        //debugger
                        self.PatientList([]);
                        self.PatientList(result.Data);
                        UiEvents.GridFunctions.PatientDataGrid("PatientGrid");
                    }
                });
            },

            GetAllData: function (control) {
                var tempData = {
                    location: "remote",
                    method: "GET",
                    dataType: "JSON",
                    url: '/Home/AllDataList',
                    contentType: "application/json; charset=UTF-8",
                    recIndx: "PatientId",
                    beforeSend: function (jqXHR, settings) {
                        return true;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(errorThrown);
                    },
                    getData: function (result) {
                        if (result && result.Success) {
                            const data = result.Data;
                            return { curPage: result.CurrentPage, totalRecords: result.TotalRecords, data: data.AllData };
                        }
                        else {
                            Empower.message("Warning", result.Message || "Warning ! - Error Occured...!!!");
                            return { curPage: 0, totalRecords: 0, data: [] };
                        }
                    }
                };

                var options1 = Object.assign({}, pqOptions);
                options1.pageModel = { curPage: 1, rPP: 10, type: "remote" };
                options1.height = 380;
                options1.colModel = [
                    { title: "Full Name", align: "center", dataIndx: "FullName", width: "10%" },
                    { title: "Email", align: "center", dataIndx: "Email", width: "15%" },
                    { title: "Phone Number", align: "center", dataIndx: "PhoneNumber", width: "15%" },
                    { title: "Age", align: "center", dataIndx: "Age", width: "15%" },
                    { title: "Gender", align: "center", dataIndx: "SelectedGender", width: "10%" },
                    { title: "Address", align: "center", dataIndx: "Address", width: "15%" },
                    {
                        title: "Action", align: "center", width: "20%", render: function (ui) {

                            return `<button class="btn btn-danger" onclick="obj.Pat_delete(${ui.rowData.Id});" type="button"><i class="fas fa-trash fa-lg">  Delete</i></button>  <button class="btn" style="background-color: #66CD00" onclick="obj.Pat_edit(${ui.rowData.Id});" type="button"><i class="fas fa-edit fa-lg">Edit</i></button>`;
                        }
                    },
                ];
                options1.dataModel = tempData;
                if ($("#" + control).pqGrid("instance")) {
                    $("#" + control).pqGrid('refreshDataAndView');
                } else {
                    $("#" + control).pqGrid(options1);
                }

            },
        },
    }

    self.New = function () {
        self.enableDisableNew(false);
        self.enableDisableSave(true);
        self.enableDisableClear(true);
        self.enableDisable(true);
        self.enableDisableGender(true);
        self.EDTreatAdd(true);
        self.EDTreatUpdate(false);
        self.EDAppAdd(true);
        self.EDAppUpd(false);
        self.EDMedAdd(true);
        self.EDMedUpd(false);
    };

    self.Clear = function () {
        UiEvents.clearfunctions.ResetAll();
        self.enableDisableNew(true);
        self.enableDisableSave(false);
        self.enableDisableClear(false);
        self.enableDisable(false);
        self.enableDisableGender(false);
        self.EDTreatAdd(false);
        self.EDTreatUpdate(false);
        self.EDAppAdd(false);
        self.EDAppUpd(false);
        self.EDMedAdd(false);
        self.EDMedUpd(false);
    };

    self.AppAdd = function () {
        if (UiEvents.validate.AppointmentValidation()) {
            UiEvents.GridFunctions.AppointmentDataGrid("AppGrid");
        }
    };

    self.AppDelete = function (Index) {
        self.AppointmentList.splice(Index, 1);
        UiEvents.GridFunctions.AppointmentDataGrid("AppGrid");
    };

    self.AppEdit = function (Index) {
        if (isNullOrEmpty((self.Appointment().AppCause()) && (self.Appointment().AppTreatment()) && (self.Appointment().AppDate()) && (self.Appointment().AppTime()) && (self.Appointment().AppRoomNum()))) {
            var a = $('#AppGrid').pqGrid("getRowData", { rowIndx: Index });
            self.Appointment().AppCause(a.AppCause);
            self.Appointment().AppTreatment(a.AppTreatment);
            self.Appointment().AppDate(a.AppDate);
            self.Appointment().AppTime(a.AppTime);
            self.Appointment().AppRoomNum(a.AppRoomNum);

            self.AppointmentList.splice(Index, 1);
            UiEvents.GridFunctions.AppointmentDataGrid("AppGrid");

            self.EDAppAdd(false);
            self.EDAppUpd(true);
            self.enableDisableSave(false);

        }
        else {
            $("#errorMessage").html('Cannot Edit this data');
            $("#dialogbox").dialog("open");
        }
    };

    self.AppUpdate = function () {
        self.enableDisableAllUpd(false);
        self.enableDisableClear(false);
        self.EDAppAdd(true);
        self.EDAppUpd(false);
        self.enableDisableSave(true);
        self.AppAdd();
    };

    self.MedAdd = function () {
        if (UiEvents.validate.MedicineValidation()) {
            UiEvents.GridFunctions.MedicineDataGrid("MedGrid");
        }
    };

    self.MedEdit = function (Index) {
        if (isNullOrEmpty((self.Medicine().MedName()) && (self.Medicine().MedCompany()) && (self.Medicine().MedPrice()) && (self.Medicine().MedExpDate()))) {
            var a = $('#MedGrid').pqGrid("getRowData", { rowIndx: Index });
            self.Medicine().MedName(a.MedName);
            self.Medicine().MedCompany(a.MedCompany);
            self.Medicine().MedPrice(a.MedPrice);
            self.Medicine().MedExpDate(a.MedExpDate);

            self.MedicineList.splice(Index, 1);
            UiEvents.GridFunctions.MedicineDataGrid("MedGrid");

            self.EDMedAdd(false);
            self.EDMedUpd(true);
            self.enableDisableSave(false);
        }
        else {
            $("#errorMessage").html('Cannot Edit this data');
            $("#dialogbox").dialog("open");
        }
    };

    self.MedDelete = function (Index) {
        self.MedicineList.splice(Index, 1);
        UiEvents.GridFunctions.MedicineDataGrid("MedGrid");
    };

    self.MedUpd = function () {
        self.enableDisableAllUpd(false);
        self.enableDisableClear(false);
        self.EDMedAdd(true);
        self.EDMedUpd(false);
        self.enableDisableSave(true);
        self.MedAdd();
    };

    self.TreatAdd = function () {
        if (UiEvents.validate.TreatmentValidation()) {
            UiEvents.GridFunctions.TreatmentDataGrid("TreatmentGrid");
        }
    };

    self.TreatDelete = function (Index) {
        self.TreatmentList.splice(Index, 1);
        UiEvents.GridFunctions.TreatmentDataGrid("TreatmentGrid");
    };

    self.TreatEdit = function (Index) {
        if (isNullOrEmpty((self.Treatment().TreatmentName()) && (self.Treatment().TreatmentDate()) && (self.Treatment().TreatmentTime()) && (self.Treatment().DoctorName()))) {
            var a = $('#TreatmentGrid').pqGrid("getRowData", { rowIndx: Index });
            //debugger
            self.Treatment().TreatmentName(a.TreatmentName);
            self.Treatment().TreatmentDate(a.TreatmentDate);
            self.Treatment().TreatmentTime(a.TreatmentTime);
            self.Treatment().DoctorName(a.DoctorName);
            self.MedicineList(a.Medicines);
            UiEvents.GridFunctions.MedicineDataGrid("MedGrid");

            self.TreatmentList.splice(Index, 1);
            UiEvents.GridFunctions.TreatmentDataGrid("TreatmentGrid");

            self.EDTreatAdd(false);
            self.EDTreatUpdate(true);
            self.enableDisableSave(false);
        }
        else {
            $("#errorMessage").html('Cannot Edit this data');
            $("#dialogbox").dialog("open");
        }
    };

    self.TreatUpdate = function () {
        self.enableDisableAllUpd(false);
        self.enableDisableClear(false);
        self.EDTreatAdd(true);
        self.EDTreatUpdate(false);
        self.enableDisableSave(true);
        self.TreatAdd();
    };

    self.Save = function () {
        if (UiEvents.validate.SaveValidation()) {
            UiEvents.clearfunctions.ResetAll();
            $("#tabs1").tabs({ active: 1 });
        }
    };

    self.Pat_delete = function (PatientId) {
        UiEvents.AjaxFunction.AjaxForDelete(PatientId);
    };

    self.Pat_edit = function (PatientId) {
        UiEvents.AjaxFunction.AjaxForEdit(PatientId);
        self.enableDisableAllUpd(true);
        self.enableDisableSave(false);
    };

    self.AllUpdate = function () {
        if (UiEvents.validate.SaveValidation()) {
            UiEvents.clearfunctions.ResetAll();
            $("#tabs1").tabs({ active: 1 });
        }
    };

    self.btnSearch = function () {
        //debugger
        var searchname = self.Search()
        UiEvents.AjaxFunction.AjaxForSearch(searchname);
    };

    function Init() {
        models.UiElements();
        $("#tabs1").tabs();
        $("#tabs2").tabs();
        UiEvents.GridFunctions.AppointmentDataGrid("AppGrid");
        
        $("#tabs1, #tabs-2").click(function () {
            //debugger
            UiEvents.AjaxFunction.AjaxForAllDetail();
        }); 
        $("#tabs1, #tabs-5").click(function () {
            UiEvents.AjaxFunction.GetAllData("PatientRemoteGrid");
        }); 

        $("#tabs2, #tabs-4").click(function () {
            UiEvents.GridFunctions.TreatmentDataGrid("TreatmentGrid");
            UiEvents.GridFunctions.MedicineDataGrid("MedGrid");
        });

        $("#dialogbox").dialog({
            autoOpen: false,
        });


    }

    Init();
}

var obj;

$(document).ready(function () {
    obj = new PersonalVM();
    ko.applyBindings(obj);


});