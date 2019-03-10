/*----------------------------------------------
--Author: nnthuong
--Phone: 039 260 2793
--Date of created: 10/03/2019
----------------------------------------------*/
function Action_Device() { };
Action_Device.prototype = {
    arrValid: [],
    strActionId:'',
    strActionDevice_Id:'',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: [Common]
        -------------------------------------------*/
        $('#btnCallModal').click(function () {
            me.resetPopup();
            me.popup();
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới thiết bị vào hoạt cảnh');
        });
        $('#dropAC_User').on('select2:select', function () {
            var strUser_Id = $(this).find('option:selected').val();
            me.getList_ActionByUser(strUser_Id);
            me.getList_DeviceByUser(strUser_Id);
        });
        /*------------------------------------------
        --Action: [Action] 
        -------------------------------------------*/
        $("#tblAC_Action").delegate(".btnView", "click", function () {
            var strId = this.id;
            me.strActionId = strId;
            core.util.setOne_BgRow(strId, "tblAC_Action");
            me.getList_DeviceByAction(strId);
            return false;
        });
        /*------------------------------------------
        --Action: [Action_Device] 
        -------------------------------------------*/
        $("#btnSave_AC").click(function () {
            var valid = core.util.validInputForm(me.arrValid);
            if (valid) {
                me.save_Action_Device();
            }
        });
        $("#tblAC_Action_Device").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            core.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            core.util.setOne_BgRow(strId, "tblAC_Action_Device");
            $("#btnYes").click(function (e) {
                me.delete_Action_Device(strId);
            });
            return false;
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        core.system.page_load();
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropAC_Action", "THONGTIN1": "EM" },
            { "MA": "dropAC_Device", "THONGTIN1": "EM" },
            { "MA": "dropAC_Status", "THONGTIN1": "EM" }
        ];

        me.getList_Action();
        me.getList_User();
    },
    popup: function (value) {
        //show
        $("#myModalAC").modal("show");
        //event
        $('#myModalAC').on('shown.bs.modal', function () {
            $('#dropAC_User').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = this;
        me.strId = "";
        core.util.resetValById("dropAC_Action");
        core.util.resetValById("dropAC_Device");
        core.util.resetValById("dropAC_Status");
    },
    /*------------------------------------------
    --Discription: [User]  GetList
    -------------------------------------------*/
    getList_User: function(){
        var me = this;
        
        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (data.success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (core.util.checkValue(data.data)) {
                        dtResult = data.data;
                        iPager = data.data.length;
                    }
                    me.genCombo_User(dtResult, iPager);
                }
                else {
                    core.system.alert("user: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("user (er): " + JSON.stringify(er), "w");
                core.system.endLoading();
            },
            type: "GET",
            action: 'user',
            contentType: true,
            authen: false,
            data: {},
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_User:function(data){
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "_id",
                parentId: "",
                name: "name",
                code: ""
            },
            renderPlace: ["dropAC_User"],
            title: "Chọn người dùng"
        };
        core.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [Action]  GetList
    -------------------------------------------*/
    getList_Action: function(){
        var me = this;
        
        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (data.success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (core.util.checkValue(data.data)) {
                        dtResult = data.data;
                        iPager = data.data.length;
                    }
                    me.genTable_Action(dtResult, iPager);
                }
                else {
                    core.system.alert("device: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("device (er): " + JSON.stringify(er), "w");
                core.system.endLoading();
            },
            type: "GET",
            action: 'action',
            contentType: true,
            authen: false,
            data: {},
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ActionByUser: function(strUserId){
        var me = this;
        
        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (data.success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (core.util.checkValue(data.data)) {
                        dtResult = data.data;
                        iPager = data.data.length;
                    }
                    me.genCombo_Action(dtResult);
                }
                else {
                    core.system.alert("device: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("device (er): " + JSON.stringify(er), "w");
                core.system.endLoading();
            },
            type: "GET",
            action: 'user_action/' + strUserId,
            contentType: true,
            authen: false,
            data: {},
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_Action: function (data, iPager) {
        var me = this;
        core.util.viewHTMLById("lblTotalAC_Action", iPager);
        var html='';
        var jsonForm = {
            strTable_Id: "tblAC_Action",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Action.getList_User()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            colPos: {
                center: [3],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<img src="./images/action.png" class="table-img">';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html +='<span>' + aData.name + '</span><br />';
                        html +='<span class="italic">' + aData.code + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btn-circle btnView" id="' + aData._id + '" title="view"><i class="fa fa-eye color-active"></i></a></span>';
                    }
                }
            ]
        };
        core.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genCombo_Action:function(data){
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "_id",
                parentId: "",
                name: "name",
                code: ""
            },
            renderPlace: ["dropAC_Action"],
            title: "Chọn hoạt cảnh"
        };
        core.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [Device]  GetList
    -------------------------------------------*/
    getList_DeviceByUser: function (strUserId) {
        var me = this;

        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (data.success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (core.util.checkValue(data.data)) {
                        dtResult = data.data;
                        iPager = data.data.length;
                    }
                    me.genCombo_Device(dtResult, iPager);
                }
                else {
                    core.system.alert("device: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("device (er): " + JSON.stringify(er), "w");
                core.system.endLoading();
            },
            type: "GET",
            action: 'user_device/' + strUserId,
            contentType: true,
            authen: false,
            data: {},
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_Device:function(data){
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "_id",
                parentId: "",
                name: "name",
                code: ""
            },
            renderPlace: ["dropAC_Device"],
            title: "Chọn thiết bị"
        };
        core.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [Action_Device]  Save
    -------------------------------------------*/
    save_Action_Device: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'actionId': core.util.getValById("dropAC_Action"),
            'deviceId': core.util.getValById("dropAC_Device"),
            'statusId': core.util.getValById("dropAC_Status")
        };
        //default
        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (core.util.checkValue(data.message)) {
                    obj_notify = {
                        type: "w",
                        content: data.message,
                    }
                    core.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    core.system.alertOnModal(obj_notify);
                    me.getList_Action_Device();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: "action_device (er): " + data.Message,
                    }
                    core.system.alertOnModal(obj_notify);
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.endLoading();
                obj_notify = {
                    type: "s",
                    content: "action_device (er): " + er,
                }
                core.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: 'action_device',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [Action_Device]  Update
    -------------------------------------------*/
    update_Action_Device: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            '_id': me.strActionDevice_Id,
            'actionId': core.util.getValById("dropAC_Action"),
            'deviceId': core.util.getValById("dropAC_Device"),
            'statusId': core.util.getValById("dropAC_Status")
        };
        //default
        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (core.util.checkValue(data.message)) {
                    obj_notify = {
                        type: "w",
                        content: data.message,
                    }
                    core.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.success) {
                    obj_notify = {
                        type: "i",
                        content: "Cập nhật thành công!",
                    }
                    core.system.alertOnModal(obj_notify);
                    me.getList_Action();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: "action_device (er): " + data.Message,
                    }
                    core.system.alertOnModal(obj_notify);
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.endLoading();
                obj_notify = {
                    type: "s",
                    content: "action_device (er): " + er,
                }
                core.system.alertOnModal(obj_notify);
            },
            type: "PUT",
            action: 'action_device',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [Action_Device]  Update
    -------------------------------------------*/
    getList_Action_Device: function () {
        var me = this;

        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (data.success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (core.util.checkValue(data.data)) {
                        dtResult = data.data;
                        iPager = data.data.length;
                    }
                    //me.genTable_Action_Device(dtResult, iPager);
                }
                else {
                    core.system.alert("action_device: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("action_device (er): " + JSON.stringify(er), "w");
                core.system.endLoading();
            },
            type: "GET",
            action: 'action_device',
            contentType: true,
            authen: false,
            data: {},
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DeviceByAction: function (strActionId) {
        var me = this;

        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (data.success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (core.util.checkValue(data.data)) {
                        dtResult = data.data;
                        iPager = data.data.length;
                    }
                    me.genTable_DeviceByAction(dtResult, iPager);
                }
                else {
                    core.system.alert("action_devices: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("action_devices (er): " + JSON.stringify(er), "w");
                core.system.endLoading();
            },
            type: "GET",
            action: 'action_devices/' + strActionId,
            contentType: true,
            authen: false,
            data: {},
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DeviceByAction: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblAC_Action_Device",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Action_Device.getList_Action_Device()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 4],
                left: [1],
                right: [3],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "actionId",
                }
                , {
                    "mDataProp": "deviceId",
                }
                , {
                    "mDataProp": "statusId",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="' + aData._id + '"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        core.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [Action_Device] Delete
    -------------------------------------------*/
    delete_Action_Device: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            '_id': strId
        };
        //default
        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (core.util.checkValue(data.message)) {
                    core.system.alert(data.message);
                    return;
                }
                if (data.success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    core.system.afterComfirm(obj);
                    me.getList_DeviceByAction(me.strActionId);
                }
                else {
                    obj = {
                        title: "",
                        content: "action_device: " + JSON.stringify(data.message),
                        code: "w"
                    };
                    core.system.afterComfirm(obj);
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.endLoading();
                obj = {
                    title: "",
                    content: "action_device (er): " + JSON.stringify(er),
                    code: "w"
                };
                core.system.afterComfirm(obj);
            },
            type: "DELETE",
            action: 'action_device',
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}