/*----------------------------------------------
--Author: nnthuong
--Phone: 039 260 2793
--Date of created: 10/03/2019
----------------------------------------------*/
function Action() { };
Action.prototype = {
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
        --Action: [action] Action
        -------------------------------------------*/
        $("#btnSave_Action").click(function () {
            var valid = core.util.validInputForm(me.arrValid);
            if (valid) {
                if(core.util.checkValue(me.strId)){
                    me.update_Action();
                }
                else{
                    me.save_Action();
                }
                
            }
        });
        $("#tblAction").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strId = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            core.util.setOne_BgRow(strId, "tblAction");
            me.getDetail_Action(strId);
            return false;
        });
        $("#tblAction").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            core.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            core.util.setOne_BgRow(strId, "tblAction");
            $("#btnYes").click(function (e) {
                me.delete_Action(strId);
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
        me.getList_Action();
        setTimeout(function(){
            me.getList_User();
        },200);
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropAction_User", "THONGTIN1": "EM" },
            { "MA": "txtAction_Name", "THONGTIN1": "EM" },
            { "MA": "txtAction_Code", "THONGTIN1": "EM" }
        ];
        
    },
    popup: function (value) {
        //show
        $("#myModal_Action").modal("show");
        //event
        $('#myModal_Action').on('shown.bs.modal', function () {
            $('#txtAction_Name').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = this;
        me.strId = "";
        core.util.resetValById("dropAction_User");
        core.util.resetValById("txtAction_Name");
        core.util.resetValById("txtAction_Code");
        core.util.resetValById("txtAction_Image");//image
        core.util.resetValById("txtAction_Content");
    },
    /*------------------------------------------
    --Discription: [action] Save
    -------------------------------------------*/
    save_Action: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'userId': core.util.getValById("dropAction_User"),
            'name': core.util.getValById("txtAction_Name"),
            'code': core.util.getValById("txtAction_Code"),
            'image': core.util.getValById("txtAction_Image"),
            'content': core.util.getValById("txtAction_Content")
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
                    me.getList_Action();
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
            action: 'action',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [action] Update
    -------------------------------------------*/
    update_Action: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            '_id': me.strId,
            'userId': core.util.getValById("dropAction_User"),
            'name': core.util.getValById("txtAction_Name"),
            'code': core.util.getValById("txtAction_Code"),
            'image': core.util.getValById("txtAction_Image"),
            'content': core.util.getValById("txtAction_Content")
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
            action: 'action',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [action] GetList
    -------------------------------------------*/
    getList_Action: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'action'
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
                    me.genTable_Action(dtResult, iPager);
                }
                else {
                    core.system.alert("action: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("action (er): " + JSON.stringify(er), "w");
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
    genTable_Action: function (data, iPager) {
        var me = this;
        core.util.viewHTMLById("lblTotal_Action", iPager);
        var jsonForm = {
            strTable_Id: "tblAction",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Action.getList_Action()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 6, 7],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "image",
                }
                , {
                    "mDataProp": "code",
                }
                , {
                    "mDataProp": "name",
                }
                , {
                    "mDataProp": "userId",
                }
                ,  {
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
    --Discription: [action] GetDetail
    -------------------------------------------*/
    getDetail_Action: function (strId) {
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
                        me.viewForm_Action(data.data);
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
            action: 'action/' + strId,
            contentType: true,
            authen: true,
            data: {},
            fakedb: [
            ]
        }, false, false, false, null);
    },
    viewForm_Action: function (data) {
        var me = this;
        //call popup --Edit
        me.popup(data.name);
        //view data --Edit
        core.util.viewValById("dropAction_User", data.userId);
        core.util.viewValById("txtAction_Name", data.name);
        core.util.viewValById("txtAction_Code", data.code);
        core.util.viewValById("txtAction_Image", data.image);
        core.util.viewValById("txtAction_Content", data.content);
    },
    /*------------------------------------------
    --Discription: [action] Delete
    -------------------------------------------*/
    delete_Action: function (strId) {
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
                    me.getList_Action();
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
            action: 'action',
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
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
            renderPlace: ["dropAction_User"],
            title: "Chọn người dùng"
        };
        core.system.loadToCombo_data(obj);
    }
}