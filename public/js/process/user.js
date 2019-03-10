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
        --Action: [Device] Action
        -------------------------------------------*/
        $("#tblUser").delegate(".btnView", "click", function () {
            var strId = this.id;
            me.strId = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            core.util.setOne_BgRow(strId, "tblUser");
            me.getDetail_User(strId);
            setTimeout(function(){
                me.getList_User_Device(strId);
                setTimeout(function(){
                    me.getList_ActionByUser(strId);
                }, 200);
            }, 200);
            return false;
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        core.system.page_load();
        me.getList_User();
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
                    "mDataProp": "name",
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
    /*------------------------------------------
    --Discription: [User]  GetDetail
    -------------------------------------------*/
    getDetail_User: function (strId) {
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
                        me.viewForm_User(data.data);
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
        core.util.viewHTMLById("lblUser_Name", data.name);
        core.util.viewHTMLById("lblUser_Address", data.address);
        core.util.viewHTMLById("lblUser_Email", data.email);
        core.util.viewHTMLById("lblUser_Phone", data.phone);
    },
    /*------------------------------------------
    --Discription: [Device]  GetList
    -------------------------------------------*/
    getList_User_Device: function (strUser_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'user_device'
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
                    me.genTable_User_Device(dtResult, iPager);
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
            action: 'user_device/' + strUser_Id,
            contentType: true,
            authen: false,
            data: {},
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_User_Device: function (data, iPager) {
        var me = this;
        core.util.viewHTMLById("lblTotal_User_Device", iPager);
        var jsonForm = {
            strTable_Id: "tblUser_Device",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.User.getList_User_Device()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 4],
                left: [2],
                right: [3],
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
                    "mRender": function (nRow, aData) {
                        return '<small class="label label-danger">Off</small>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btn-circle color-active"><i class="fa fa-toggle-off"></i></a>';
                    }
                }
            ]
        };
        core.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
     /*------------------------------------------
    --Discription: [Action]  GetList
    -------------------------------------------*/
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
                    me.genBox_ActionByUser(dtResult);
                }
                else {
                    core.system.alert("user_action: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) {
                core.system.alert("user_action (er): " + JSON.stringify(er), "w");
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
    genBox_ActionByUser: function (data, iPager) {
        var me = this;
        var html = '';
        var strAction_Id = "";
        var strAction_Code = "";
        var strAction = "";

        $("#zoneAction").html(html);
        //
        for (var i = 0; i < data.length; i++) {
            strAction_Id = data[i]._id;
            strAction_Code = data[i].code;
            strAction_Name = data[i].name;

            html += '<div class="col-sm-2 col-xs-4">';
            html += '<div class="small-box">';

            html += '<div class="inner">';
            html += '<h4>' + strAction_Name + '</h4>';
            html += '<p class="italic">' + strAction_Code + '</p>';
            html += '</div>';
            
            html += '<div class="small-box-footer">';
            html += '<a id="view_' + strAction_Id + '" class="cl-active poiter">Xem</a>';
            html += '</div>';
            html += '</div>';
            html += '</div >';
        }
        //
        $("#zoneAction").html(html);
    }
}