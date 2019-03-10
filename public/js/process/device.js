/*----------------------------------------------
--Author: nnthuong
--Phone: 0169 260 2793
--Date of created: 09/03/2019
----------------------------------------------*/
function Device() { };
Device.prototype = {
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
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới thiết bị');
        });
        /*------------------------------------------
        --Action: [Device] Action
        -------------------------------------------*/
        $("#btnSave").click(function () {
            var valid = core.util.validInputForm(me.arrValid);
            if (valid) {
                if(core.util.checkValue(me.strId)){
                    me.update_Device();
                }
                else{
                    me.save_Device();
                }
                
            }
        });
        $("#tblDevice").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strId = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            core.util.setOne_BgRow(strId, "tblDevice");
            me.getDetail_Device(strId);
            return false;
        });
        $("#tblDevice").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            core.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            core.util.setOne_BgRow(strId, "tblDevice");
            $("#btnYes").click(function (e) {
                me.delete_Device(strId);
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
        me.getList_Device();
        setTimeout(function(){
            me.getList_CatDevice();
            setTimeout(function(){
                me.getList_User();
            }, 250);
        }, 250);
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtThietBi_Id", "THONGTIN1": "EM" },
            { "MA": "txtThietBi_Ma", "THONGTIN1": "EM" },
            { "MA": "txtThietBi_Ten", "THONGTIN1": "EM" },
            { "MA": "txtThietBi_NoiDung", "THONGTIN1": "EM" },
            { "MA": "dropThietBi_Loai", "THONGTIN1": "EM" },
            { "MA": "dropThietBi_NguoiDung", "THONGTIN1": "EM" }
        ];
        
    },
    popup: function (value) {
        //show
        $("#myModal").modal("show");
        //event
        $('#myModal').on('shown.bs.modal', function () {
            $('#txtThietBi_Id').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = this;
        me.strId = "";
        core.util.resetValById("txtThietBi_Id");
        core.util.resetValById("txtThietBi_Ma");
        core.util.resetValById("txtThietBi_Ten");
        core.util.resetValById("txtThietBi_NoiDung");
        core.util.resetValById("dropThietBi_Loai");
        core.util.resetValById("dropThietBi_NguoiDung");
    },
    /*------------------------------------------
    --Discription: [Device] Save
    -------------------------------------------*/
    save_Device: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'id': core.util.getValById("txtThietBi_Id"),
            'code': core.util.getValById("txtThietBi_Ma"),
            'name': core.util.getValById("txtThietBi_Ten"),
            'content': core.util.getValById("txtThietBi_NoiDung"),
            'category': core.util.getValById("dropThietBi_Loai"),
            'userId': core.util.getValById("dropThietBi_NguoiDung")
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
                    me.getList_Device();
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
            action: 'device',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [Device] Update
    -------------------------------------------*/
    update_Device: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            '_id': me.strId,
            'id': core.util.getValById("txtThietBi_Id"),
            'code': core.util.getValById("txtThietBi_Ma"),
            'name': core.util.getValById("txtThietBi_Ten"),
            'content': core.util.getValById("txtThietBi_NoiDung"),
            'category': core.util.getValById("dropThietBi_Loai"),
            'userId': core.util.getValById("dropThietBi_NguoiDung")
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
                    me.getList_Device();
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
            action: 'device',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [Device] GetList
    -------------------------------------------*/
    getList_Device: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'device'
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
                    me.genTable_Device(dtResult, iPager);
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
            action: 'device',
            contentType: true,
            authen: false,
            data: {},
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_Device: function (data, iPager) {
        var me = this;
        core.util.viewHTMLById("lblTotal_Device", iPager);
        var jsonForm = {
            strTable_Id: "tblDevice",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Device.getList_Device()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 7, 8],
                left: [2],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        //switch type of lightbulb here
                        return '<img src="./images/lightbulb.jpg" class="table-img">';
                    }
                }
                , {
                    "mDataProp": "name",
                }
                , {
                    "mDataProp": "code",
                }
                , {
                    "mDataProp": "category",
                }
                , {
                    "mDataProp": "userId",
                }
                , {
                    "mDataProp": "content",
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
    --Discription: [Device] GetDetail
    -------------------------------------------*/
    getDetail_Device: function (strId) {
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
                        me.viewForm(data.data);
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
            action: 'device/' + strId,
            contentType: true,
            authen: true,
            data: {},
            fakedb: [
            ]
        }, false, false, false, null);
    },
    viewForm: function (data) {
        var me = this;
        //call popup --Edit
        me.popup(data.id);
        //view data --Edit
        core.util.viewValById("txtThietBi_Id", data.id);
        core.util.viewValById("txtThietBi_Ma", data.code);
        core.util.viewValById("txtThietBi_Ten", data.name);
        core.util.viewValById("txtThietBi_NoiDung", data.content);
        core.util.viewValById("dropThietBi_Loai", data.category);
        core.util.viewValById("dropThietBi_NguoiDung", data.userId);
    },
    /*------------------------------------------
    --Discription: [Device] Delete
    -------------------------------------------*/
    delete_Device: function (strId) {
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
                    me.getList_Device();
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
            action: 'device',
            contentType: true,
            authen: true,
            data: obj_delete,
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
                    me.genComBo_CatDevice(dtResult, iPager);
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
    genComBo_CatDevice:function(data){
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "_id",
                parentId: "",
                name: "name",
                code: ""
            },
            renderPlace: ["dropThietBi_Loai"],
            title: "Chọn phân loại"
        };
        core.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [user] GetList
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
                    core.system.alert("device: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("device (er): " + JSON.stringify(er), "w");
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
            renderPlace: ["dropThietBi_NguoiDung"],
            title: "Chọn người dùng"
        };
        core.system.loadToCombo_data(obj);
    }
}