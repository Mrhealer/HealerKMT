/*----------------------------------------------
--Author: nnthuong
--Phone: 0169 260 2793
--Date of created: 09/03/2019
----------------------------------------------*/
function CatDevice() { };
CatDevice.prototype = {
    arrValid:[],
    strId:'',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: [Common]
        -------------------------------------------*/
        $('#btnCallModal').click(function () {
            me.resetPopup();
            me.popup();
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới loại thiết bị');
        });
        /*------------------------------------------
        --Action: [cat_device] Action
        -------------------------------------------*/
        $("#btnSave_CatDevice").click(function () {
            var valid = core.util.validInputForm(me.arrValid);
            if (valid) {
                if(core.util.checkValue(me.strId)){
                    me.update_CatDevice();
                }
                else{
                    me.save_CatDevice();
                }
                
            }
        });
        $("#tblCatDevice").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strId = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            core.util.setOne_BgRow(strId, "tblCatDevice");
            me.getDetail_CatDevice(strId);
            return false;
        });
        $("#tblCatDevice").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            core.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            core.util.setOne_BgRow(strId, "tblCatDevice");
            $("#btnYes").click(function (e) {
                me.delete_CatDevice(strId);
            });
            return false;
        });
    },
    /*------------------------------------------
    --Discription: [Common] 
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        core.system.page_load();
        me.getList_CatDevice();
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtCatDevice_Code", "THONGTIN1": "EM" },
            { "MA": "txtCatDevice_Name", "THONGTIN1": "EM" },
            { "MA": "txtCatDevice_Discript", "THONGTIN1": "EM" }
        ];
        
    },
    popup: function (value) {
        //show
        $("#myModal_CatDevice").modal("show");
        //event
        $('#myModal_CatDevice').on('shown.bs.modal', function () {
            $('#txtCatDevice_Code').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = this;
        me.strId = "";
        core.util.resetValById("txtCatDevice_Code");
        core.util.resetValById("txtCatDevice_Name");
        core.util.resetValById("txtCatDevice_Discript");
    },
    /*------------------------------------------
    --Discription: [cat_device] Save
    -------------------------------------------*/
    save_CatDevice: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'code': core.util.getValById("txtCatDevice_Code"),
            'name': core.util.getValById("txtCatDevice_Name"),
            'discript': core.util.getValById("txtCatDevice_Discript")
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
                    if (core.util.checkValue(data.Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        core.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        core.system.alertOnModal(obj_notify);
                    }
                    me.getList_CatDevice();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    core.system.alertOnModal(obj_notify);
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.endLoading();
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                core.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: 'cat_device',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [cat_device] Update
    -------------------------------------------*/
    update_CatDevice: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            '_id': me.strId,
            'code': core.util.getValById("txtCatDevice_Code"),
            'name': core.util.getValById("txtCatDevice_Name"),
            'discript': core.util.getValById("txtCatDevice_Discript")
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
                    me.getList_CatDevice();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    core.system.alertOnModal(obj_notify);
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.endLoading();
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                core.system.alertOnModal(obj_notify);
            },
            type: "PUT",
            action: 'cat_device',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [cat_device] GetList
    -------------------------------------------*/
    getList_CatDevice: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'cat_device'
        };

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
                    me.genTable_CatDevice(dtResult, iPager);
                }
                else {
                    core.system.alert("cat_device: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("cat_device (er): " + JSON.stringify(er), "w");
                core.system.endLoading();
            },
            type: "GET",
            action: 'cat_device',
            contentType: true,
            authen: false,
            data: {},
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_CatDevice: function (data, iPager) {
        var me = this;
        core.util.viewHTMLById("lblTotal_CatDevice", iPager);
        var jsonForm = {
            strTable_Id: "tblCatDevice",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CatDevice.getList_CatDevice()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 4, 5],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "code",
                }
                , {
                    "mDataProp": "name",
                }
                , {
                    "mDataProp": "discript",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData._id + '"><i class="fa fa-edit color-active"></i></a></span>';
                    }
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
    --Discription: [cat_device] GetDetail
    -------------------------------------------*/
    getDetail_CatDevice: function (strId) {
        var me = this;

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
                    if (core.util.checkValue(data.data)) {
                        me.viewForm_CatDevice(data.data);
                    }
                }
                else {
                    core.system.alert(obj_detail.action + ": " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.endLoading();
                core.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: 'cat_device/' + strId,
            contentType: true,
            authen: true,
            data: {},
            fakedb: [
            ]
        }, false, false, false, null);
    },
    viewForm_CatDevice: function (data) {
        var me = this;
        //call popup --Edit
        me.popup(data.code);
        //view data --Edit
        core.util.viewValById("txtCatDevice_Code", data.code);
        core.util.viewValById("txtCatDevice_Name", data.name);
        core.util.viewValById("txtCatDevice_Discript", data.discript);
    },
    /*------------------------------------------
    --Discription: [cat_device] Delete
    -------------------------------------------*/
    delete_CatDevice: function (strId) {
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
                    me.getList_CatDevice();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + JSON.stringify(data.message),
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
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                core.system.afterComfirm(obj);
            },
            type: "DELETE",
            action: 'cat_device',
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}