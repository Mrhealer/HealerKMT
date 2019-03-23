/*----------------------------------------------
--Author: nnthuong
--Phone: 039 260 2793
--Date of created: 
----------------------------------------------*/
function User() { };
User.prototype = {
    strId: '',

    init: function () {
        var me = this;
        me.page_load();
         /*------------------------------------------
        --Action: [Common]
        -------------------------------------------*/
        $('#btnCallModal').click(function () {
            me.resetPopup();
            me.popup();
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm người dùng');
        });
        /*------------------------------------------
        --Action: [User] Action
        -------------------------------------------*/
        $("#btnSave_User").click(function () {
            var valid = core.util.validInputForm(me.arrValid);
            if (valid) {
                if(core.util.checkValue(me.strId)){
                    me.update_User();
                }
                else{
                    me.save_User();
                }
            }
        });
        $("#tblUser").delegate(".btnView", "click", function () {
            var strId = this.id;
            me.strId = strId;
            core.util.setOne_BgRow(strId, "tblUser");
            me.getDetail_User(strId, "VIEW");
            return false;
        });
        $("#tblUser").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strId = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            core.util.setOne_BgRow(strId, "tblUser");
            me.getDetail_User(strId, "EDIT");
            return false;
        });
        /*------------------------------------------
        --Action: [Authen] Action //
        -------------------------------------------*/
        $("#zoneAction_User").delegate("#btnUser_Block", "click", function () {
            if(core.util.checkValue(me.strId)){
                core.system.confirm("Bạn có chắc chắn muốn <i class='cl-danger'>Block</i> tài khoản không?", "w");
                $("#btnYes").click(function (e) {
                    me.block_User(me.strId);
                });
            }
            else{
                core.system.alert("Vui lòng chọn dữ liệu");
            }
        });
        $("#zoneAction_User").delegate("#btnUser_Reset", "click", function () {
            if(core.util.checkValue(me.strId)){
                core.system.confirm("Bạn có muốn khôi phục lại mật khẩu không?");
                $("#btnYes").click(function (e) {
                    me.reserPass_User(me.strId);
                });
            }
            else{
                core.system.alert("Vui lòng chọn dữ liệu");
            }
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
            { "MA": "txtUser_Name", "THONGTIN1": "EM" },
            { "MA": "txtUser_Email", "THONGTIN1": "EM" },
            { "MA": "txtUser_Username", "THONGTIN1": "EM" },
            { "MA": "txtUser_Password", "THONGTIN1": "EM" },
            { "MA": "txtUser_Phone", "THONGTIN1": "EM" }
        ];
        me.getList_User();
    },
    popup: function (value) {
        //show
        $("#myModal_User").modal("show");
        //event
        $('#myModal_User').on('shown.bs.modal', function () {
            $('#txtUser_Name').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = this;
        me.strId = "";
        core.util.resetValById("txtUser_Name");
        core.util.resetValById("txtUser_Email");
        core.util.resetValById("txtUser_Username");
        core.util.resetValById("txtUser_Password");
        core.util.resetValById("txtUser_Phone");
        core.util.resetValById("txtUser_Address");
        core.util.resetValById("txtUser_Avatar");
    },
    /*------------------------------------------
    --Discription: [User]  Addnew User
    -------------------------------------------*/
    save_User: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'name': core.util.getValById("txtUser_Name"),
            'email': core.util.getValById("txtUser_Email"),
            'username': core.util.getValById("txtUser_Username"),
            'password': core.util.getValById("txtUser_Password"),
            'phone': core.util.getValById("txtUser_Phone"),
            'address': core.util.getValById("txtUser_Address"),
            'avatar': core.util.getValById("txtUser_Avatar"),
            'status': 1
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
                    if (core.util.checkValue(data.id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        core.system.alertOnModal(obj_notify);
                    }
                    me.getList_User();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + ": " + JSON.stringify(data.message),
                    }
                    core.system.alertOnModal(obj_notify);
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.endLoading();
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + JSON.stringify(er),
                }
                core.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: 'user',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [User]  Update
    -------------------------------------------*/
    update_User: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            '_id': me.strId,
            'name': core.util.getValById("txtUser_Name"),
            'email': core.util.getValById("txtUser_Email"),
            'username': core.util.getValById("txtUser_Username"),
            'password': core.util.getValById("txtUser_Password"),
            'phone': core.util.getValById("txtUser_Phone"),
            'address': core.util.getValById("txtUser_Address"),
            'avatar': core.util.getValById("txtUser_Avatar"),
            'status': 1
        };
        //default
        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (core.util.checkValue(data.message)) {
                    obj_notify = {
                        type: "w",
                        content: JSON.stringify(data.message),
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
                    me.getList_User();
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
                    content: obj_save.action + " (er): " + JSON.stringify(er),
                }
                core.system.alertOnModal(obj_notify);
            },
            type: "PUT",
            action: 'user',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
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
                    me.genTable_User(dtResult, iPager);
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
    genTable_User: function (data, iPager) {
        var me = this;
        var html='';
        core.util.viewHTMLById("lblTotal_User", iPager);
        var jsonForm = {
            strTable_Id: "tblUser",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Device.getList_User()",
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
                        return '<img src="./images/user.png" class="table-img">';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<span>' + aData.username + '</span><br />';
                        html += '<span class="italic">' + aData.name + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<span><a class="btn btn-default btn-circle btnEdit" id="' + aData._id + '" title="edit"><i class="fa fa-edit color-active"></i></a></span>';
                        html += '<span><a class="btn btn-default btn-circle btnView" id="' + aData._id + '" title="view" href="#zoneViewUser"><i class="fa fa-eye color-active"></i></a></span>';
                        return html;
                    }
                }
            ]
        };
        core.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [User]  GetDetail
    -------------------------------------------*/
    getDetail_User: function (strId, action) {
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
                        if(action == "EDIT"){
                            me.viewEdit_User(data.data);
                        }
                        else{
                            me.viewForm_User(data.data);
                        }
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
            action: 'user/' + strId,
            contentType: true,
            authen: true,
            data: {},
            fakedb: [
            ]
        }, false, false, false, null);
    },
    viewForm_User: function (data) {
        var me = this;
        //view data --Edit
        var iStatus = '';
        core.util.viewHTMLById("lblUser_Name", data.name);
        core.util.viewHTMLById("lblUser_Address", data.address);
        core.util.viewHTMLById("lblUser_Email", data.email);
        core.util.viewHTMLById("lblUser_Phone", data.phone);
        //
        iStatus = data.status;
        if(iStatus=="-1"){
            core.util.viewHTMLById("lblUser_Status", "<i class='cl-danger'>Block</i>");
        }
        else{
            core.util.viewHTMLById("lblUser_Status", "<i class='cl-active'>Enable</i>");
        }
        me.getAction(data);
    },
    getAction: function(data){
        var me=this;
        var html='';
        if(data.status=="-1"){//block
            html+='<a class="btn poiter cl-warning pull-left" id="btnUser_Enable">';
            html+='<i class="fa fa-toggle-on"></i> Enable';
            html+='</a>';
        }else{//active
            html+='<a class="btn poiter cl-danger pull-left" id="btnUser_Block">';
            html+='<i class="fa fa-lock"></i> Block';
            html+='</a>';   
        }
       
        html+='<a class="btn poiter pull-right" id="btnUser_Reset">';
        html+='<i class="fa fa-key"></i> Reset password';
        html+='</a>';
        html+='<div class="clear"></div>';
        $("#zoneAction_User").html(html);
    },
    viewEdit_User: function (data) {
        var me = this;
        me.popup(data.name);
        //view data --Edit
        core.util.viewValById("txtUser_Name", data.name);
        core.util.viewValById("txtUser_Email", data.email);
        core.util.viewValById("txtUser_Username", data.username);
        core.util.viewValById("txtUser_Password", data.password);
        core.util.viewValById("txtUser_Phone", data.phone);
        core.util.viewValById("txtUser_Address", data.address);
        core.util.viewValById("txtUser_Avatar", data.avatar);
    },
    /*------------------------------------------
    --Discription: [User]  Block
    -------------------------------------------*/
    block_User:function(){
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            '_id': me.strId,
            'status': -1
        };
        //default
        core.system.beginLoading();
        core.system.makeRequest({
            success: function (data) {
                if (core.util.checkValue(data.message)) {
                    obj = {
                        title: "",
                        content: JSON.stringify(data.message),
                        code: ""
                    };
                    core.system.afterComfirm(obj);
                    return;
                }
                if (data.success) {
                    obj = {
                        title: "",
                        content: "Block tài khoản thành công!",
                        code: ""
                    };
                    core.system.afterComfirm(obj);
                    me.getList_User();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_save.action + " (er): " + JSON.stringify(data.Message),
                        code: ""
                    };
                    core.system.afterComfirm(obj);
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.endLoading();
                obj = {
                    title: "",
                    content: obj_save.action + " (er): " + JSON.stringify(er),
                    code: ""
                };
                core.system.afterComfirm(obj);
            },
            type: "PUT",
            action: 'block',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [User]  Reset_password
    -------------------------------------------*/
    reserPass_User:function(){
        
    },
    
}