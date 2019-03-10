/*----------------------------------------------
--Author: nxduong
--Phone: 0983029603
--Description:
--Date of created: 13/09/2016
--Input:
--Output:
--Note: 
--Updated by:
--Date of updated: 
----------------------------------------------*/
function systemextend() { };
systemextend.prototype = {
    nodeMenuVertical: '',
    jsonValid: '',

    init_sys_extend: function(){
        var me = this;
        //me.getlist_ChucNang();
        $("#btnChageMyPass").click(function (e) {
            $("#notif-pass").hide();
            $("#txt_oldpass").val('');
            $("#txt_newpass1").val('');
            $("#txt_newpass2").val('');
            $('#myModal_change_pass').modal('show');
            document.getElementById('txt_oldpass').focus();
        });
    },
    /*
    Xử lý danh mục chức năng hệ thống
    */
    getlist_ChucNang: function (){
        var me = this;
        $("#menu_vertical").html("");
        var strTuKhoa = eduroot.systemroot.funcSearKey;
        var strUngDung_Id = eduroot.systemroot.strApp_Id;

        eduroot.systemroot.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var jsonResult = $.parseJSON(mystring);
                    var node = '';
                        for (var j = 0; j < jsonResult.length; j++) {
                            if (jsonResult[j].CHUCNANGCHA_ID == null || jsonResult[j].CHUCNANGCHA_ID == "") {//get parents
                                node += '<li id=' + jsonResult[j].ID + ' class="treeview btnMenuVertical">';
                                var strDuongDanHienThi = jsonResult[j].DUONGDANHIENTHI;
                                if (strDuongDanHienThi == null || strDuongDanHienThi == undefined || strDuongDanHienThi == "null" || strDuongDanHienThi == "")
                                {
                                    node += '<a href="javascript:void(0)">';
                                }
                                else
                                {
                                    node += '<a onclick="eduroot.systemroot.initMain(' + "\'" + jsonResult[j].DUONGDANHIENTHI + "\'" + ',' + "\'" + jsonResult[j].DUONGDANFILE + "\'" + ')" href="' + jsonResult[j].DUONGDANHIENTHI + '">';
                                }
                                node += '<i class="' + jsonResult[j].TENANH + '""></i> <span>' + jsonResult[j].TENCHUCNANG + '</span>';
                                node += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
                                node += ' </a>';
                                me.nodeMenuVertical = "";
                                node += me.menuVertical_DeQuy(jsonResult, jsonResult[j].ID, node);
                                node += '</li>';
                            }
                        }

                    $("#menu_vertical").append(node);//Append to left_content_tree
                    node = "";
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: 'GET',
            action: 'sysChucNang/LayDanhSach',
            data: {
                'strTuKhoa': strTuKhoa,
                'strUngDung_Id': strUngDung_Id
            },
            fakedb: [
            ]
        }, false, false, false, null, eduroot.systemroot.apiUrlCommom);
    },
    menuVertical_DeQuy: function (data, parent_id, nodeMenuVertical) {
        var me = this;
        me.nodeMenuVertical += '<ul class="treeview-menu">';
        for (var i = 0; i < data.length; i++) {
            if (data[i].CHUCNANGCHA_ID == parent_id) {
                me.nodeMenuVertical += '<li id=' + data[i].ID + ' class="treeview btnMenuVertical">';
                var strDuongDanHienThi = data[i].DUONGDANHIENTHI;
                if (strDuongDanHienThi == null || strDuongDanHienThi == undefined || strDuongDanHienThi == "null" || strDuongDanHienThi == "") {
                    me.nodeMenuVertical += '<a href="javascript:void(0)">';
                }
                else {
                    me.nodeMenuVertical += '<a onclick="eduroot.systemroot.initMain(' + "\'" + data[i].DUONGDANHIENTHI + "\'" + ',' + "\'" + data[i].DUONGDANFILE + "\'" + ')" href="' + data[i].DUONGDANHIENTHI + '">';
                }
                me.nodeMenuVertical += '<i class="' + data[i].TENANH + '""></i> <span>' + data[i].TENCHUCNANG + '</span>';
                //me.nodeMenuVertical += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
                me.nodeMenuVertical += ' </a>';
                me.menuVertical_DeQuy(data, data[i].ID, nodeMenuVertical);
                me.nodeMenuVertical += '</li>';
            }
        }
        me.nodeMenuVertical += '</ul>';
        return me.nodeMenuVertical;
    },
    /*
    ##########################################
    Các hàm chung cho toàn bộ các ứng dụng
    ##########################################
    */
    changePassword: function () {
        var me = this;
        var OldPass = $('#txt_oldpass').val();
        var NewPass1 = $('#txt_newpass1').val();
        var NewPass2 = $('#txt_newpass2').val();

        if (OldPass.length <= 0) {
            $("#txt_oldpass").attr("data-toggle", "tooltip");
            $("#notif-pass").show();
            $("#notif-pass").html("<div class='alert alert-info' style='height:10px !important;'><p style='margin-top:-10px'><strong>Thông báo: </strong>Bạn phải nhập vào mật khẩu cũ!</p></div>");
            document.getElementById('txt_oldpass').focus();
            return false;
        }
        else {
            $("#txt_oldpass").removeAttr("data-toggle");
            $("#txt_oldpass").removeAttr("data-original-title");
            $("#txt_oldpass").removeAttr("title");
        }

        if (NewPass1.length <= 0) {
            $("#txt_newpass1").attr("data-toggle", "tooltip");
            $("#notif-pass").show();
            $("#notif-pass").html("<div class='alert alert-warning' style='height:10px !important;'><p style='margin-top:-10px'><strong>Thông báo: </strong>Bạn phải nhập lại mật khẩu mới!</p></div>");
            document.getElementById('txt_newpass1').focus();
            return false;
        }
        else {
            $("#txt_newpass1").removeAttr("data-toggle");
            $("#txt_newpass1").removeAttr("data-original-title");
            $("#txt_newpass1").removeAttr("title");
        }

        if (NewPass2.length <= 0) {
            $("#txt_newpass2").attr("data-toggle", "tooltip");
            $("#notif-pass").show();
            $("#notif-pass").html("<div class='alert alert-warning' style='height:10px !important;'><p style='margin-top:-10px'><strong>Thông báo: </strong>Bạn phải nhập lại mật khẩu mới!</p></div>");
            document.getElementById('txt_newpass2').focus();
            return false;
        }
        else {
            $("#txt_newpass2").removeAttr("data-toggle");
            $("#txt_newpass2").removeAttr("data-original-title");
            $("#txt_newpass2").removeAttr("title");
        }
        if (NewPass1 != NewPass2) {
            $("#txt_newpass2").removeAttr("data-original-title");
            $("#txt_newpass2").attr("data-toggle", "tooltip");
            $("#txt_newpass2").attr("data-original-title", "");
            $("#notif-pass").show();
            $("#notif-pass").html("<div class='alert alert-info' style='height:10px !important;'><p style='margin-top:-10px'><strong>Thông báo: </strong>Mật khẩu mới không trùng nhau!</p></div>");
            document.getElementById('txt_newpass2').focus();
            return false;
        }
        else {
            $("#txt_newpass2").removeAttr("data-toggle");
            $("#txt_newpass2").removeAttr("data-original-title");
            $("#txt_newpass2").removeAttr("title");
        }
        eduroot.systemroot.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#notif-pass").show();
                    $("#notif-pass").html("<div class='alert alert-success' style='height:10px !important;'><p style='margin-top:-10px'><strong>Thông báo: </strong>Thay đổi mật khẩu thành công!</p></div>");
                    $("#txt_oldpass").attr("title", data.Message);
                    document.getElementById('txt_oldpass').focus();
                }
                else {
                    $("#notif-pass").show();
                    $("#notif-pass").html("<div class='alert alert-danger' style='height:10px !important;'><p style='margin-top:-10px'><strong>Thông báo: </strong>Mật khẩu cũ không đúng, vui lòng nhập lại!</p></div>");
                    $("#txt_oldpass").attr("title", data.Message);
                    document.getElementById('txt_oldpass').focus();
                }
            },
            error: function (er) { },
            type: 'GET',
            action: 'HeThong/chageMyPassword',
            data: {
                'old': OldPass,
                'pass1': NewPass1,
                'pass2': NewPass2,
                'userId': me.userId
            },
            fakedb: [
            ]
        }, false, false, false, null, eduroot.systemroot.apiUrlCommom);

    },
    loadToCombo_DanhMuc: function (strCode, zone_id, strTitle) {
        var me = this;
        eduroot.systemroot.beginLoading();
        eduroot.systemroot.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    //zone_id 
                    var zoneId = zone_id.split(",");
                    //call
                    var obj = {
                        data: json,
                        renderPlace: zoneId,
                        type: "order",
                        title: strTitle,
                    }
                    eduroot.systemroot.loadToCombo_data(obj);
                }
                else {
                    console.log(data.Message);
                }
                eduroot.systemroot.endLoading();
            },
            error: function (er) { eduroot.systemroot.endLoading(); },
            type: 'GET',
            action: 'DuLieuDanhMuc/LoadDataToComboBox',
            data: {
                'strMaBangDanhMuc': strCode
            },
            fakedb: [

            ]
        }, false, false, false, null, eduroot.systemroot.apiUrlCommom);
    },
    XetMacDinhTheoMaDanhMuc: function (strMaBangDanhMuc, zone_id, strMaDuLieu) {
        var me = this;
        eduroot.systemroot.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    var tbCombo = $('[id$=' + zone_id + ']');
                    var id = json[0].ID;
                    tbCombo.val(id).trigger("chosen:updated");
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: 'GET',
            action: 'DuLieuDanhMuc/XetMacDinhTheoMaDanhMuc',
            data: {
                'strMaBangDanhMuc': strMaBangDanhMuc,
                'strMaDuLieu': strMaDuLieu
            },
            fakedb: [

            ]
        }, false, false, false, null, eduroot.systemroot.apiUrlCommom);
    },
    functionSearch: function (value) {
        var me = this;
        var strTuKhoa = "";
        strTuKhoa = $("#navbar-search-input").val();
        /*Display a Div search*/
        if (strTuKhoa == "" || strTuKhoa == null || strTuKhoa == undefined) {
            $("#search-result").hide();
            return false;
        }
        else {
            $("#search-result").show();
        }
        /*Display result, response data to Div search from database*/

        eduroot.systemroot.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    $('#tblSearch').dataTable({
                        "aaData": json,
                        "destroy": true,
                        "bPaginate": false,
                        "bLengthChange": false,
                        "bFilter": false,
                        "processing": false,
                        "bSort": false,
                        "bInfo": false,
                        "bAutoWidth": false,
                        "lengthMenu": [[25, 50, 100, -1], [25, 50, 100, "Tất cả"]],
                        "language": {
                            "search": "Tìm kiếm theo từ khóa:",
                            "lengthMenu": "Hiển thị _MENU_ dữ liệu",
                            "zeroRecords": "Không có dữ liệu nào được tìm thấy!",
                            "info": "Hiển thị _START_ đến _END_ trong _TOTAL_ dữ liệu",
                            "infoEmpty": "Hiển thị 0 đến 0 của 0 dữ liệu ",
                            "infoFiltered": "(Dữ liệu tìm kiếm trong _MAX_ dữ liệu)",
                            "processing": "Đang tải dữ liệu...",
                            "emptyTable": "Không có dữ liệu nào được tìm thấy!",
                            "paginate": {
                                "first": "Đầu",
                                "last": "Cuối",
                                "next": "Tiếp theo",
                                "previous": "Quay lại"
                            }
                        },
                        "aoColumnDefs": [
                        ],
                        "order": [[1, "asc"]],
                        "aoColumns": [{
                            "mDataProp": "ID",
                            "bVisible": false
                        }
                        , {
                            "mDataProp": "TENCHUCNANG"
                        }
                        ],
                        "fnRowCallback": function (nRow, aData) {
                            var $nRow = $(nRow); // cache the row wrapped up in jQuery
                            if (aData.TENANH == "" || aData.TENANH == null || aData.TENANH == undefined) {
                                $('td:eq(0)', nRow).html('<a href="' + me.root + "/Index.aspx" + '">' + '<i class="fa fa-bullseye"></i> ' + aData.TENCHUCNANG + '</a>');
                            }
                            else {
                                $('td:eq(0)', nRow).html('<a href="' + me.root + "/" + aData.DUONGDANHIENTHI + '">' + '<i class="' + aData.TENANH + '"></i> ' + aData.TENCHUCNANG + '</a>');
                            }
                            return nRow
                        },
                    });
                }
                else {
                    console.log(data.Message);
                }
                eduroot.systemroot.endLoading();
            },
            error: function (er) { eduroot.systemroot.endLoading(); },
            type: 'GET',
            action: 'ChucNangUngDung/LayDanhSachChucNang',
            data: {
                'strTuKhoa': strTuKhoa,
                'strUngDung_Id': me.strungdung_id
            },
            fakedb: [

            ]
        }, false, false, false, null, eduroot.systemroot.apiUrlCommom);
    },
    hideSeachBox: function () {
        var me = this;
        $("#navbar-search-input").val("");
        me.functionSearch("");
    },
    langInit: function () {
        var me = this;
        eduroot.systemroot.beginLoading();
        eduroot.systemroot.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var jsonLang = $.parseJSON(mystring);
                    if (jsonLang != null && jsonLang != "")
                    {
                        $('.lang').each(function (index, element) {
                            var key = $(this).attr('key');
                            for (var i = 0; i < jsonLang.length; i++) {
                                var strKey = jsonLang[i].DINHDANH;
                                if (strKey == key) {
                                    $(this).text(jsonLang[i].DULIEU);
                                    break;
                                }
                            }
                        });
                    }
                }
                else {
                    console.log(data.Message);
                }
                eduroot.systemroot.endLoading();
            },
            error: function (er) { eduroot.systemroot.endLoading(); },
            type: 'GET',
            action: 'NgonNgu/ThietLapNgonNgu',
            data: {
                'strNgonNgu_Id': eduroot.systemroot.langId
            },
            fakedb: [

            ]
        }, false, false, false, null, eduroot.systemroot.apiUrlCommom);
    },
    getDataTo_Valid: function (strMaBangDanhMuc) {
        var me = this;
        var strMaBangDanhMuc = strMaBangDanhMuc;
        eduroot.systemroot.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var jsonResult = $.parseJSON(mystring);
                    if (typeof (Storage) !== "undefined") {
                        localStorage.setItem("jsonValidClient", JSON.stringify(jsonResult));
                    }
                    else {
                        me.jsonValid = jsonResult;
                    }
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: 'GET',
            async: false,
            action: 'DuLieuDanhMuc/LoadDataToComboBox',
            data: {
                'strMaBangDanhMuc': strMaBangDanhMuc
            },
            fakedb: [

            ]
        }, false, false, false, null, eduroot.systemroot.apiUrlCommom);
    },
    //Load dữ liệu bất kỳ vào combobox
    loadToCombo: function (obj) {
        var strTitle = obj.title;
        var zone_Id = obj.zone_Id;
        eduroot.systemroot.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    if (mlen > 0) {
                        var i;
                        var getList = "";
                        if (strTitle == "" || strTitle == null || strTitle == undefined) {
                            strTitle = "-- Chọn dữ liệu --";
                        }
                        else {
                            strTitle = "-- " + strTitle + " --";
                        }
                        if (strTitle != false) getList += "<option value=''>" + strTitle + "</option>";
                        if (obj.custom_Value == undefined || obj.custom_Value.length == 0) {
                            for (i = 0; i < mlen; i++) {
                                getList += "<option value='" + json[i].ID + "'>" + eval("json[i]." + obj.value) + "</option>";
                            }
                        } else {
                            for (i = 0; i < mlen; i++) {
                                getList += obj.custom_Value(i, json[i]);
                            }
                        }
                        for (var j = 0; j < zone_Id.length; j++) {
                            var tbCombo = $('[id$=' + zone_Id[j] + ']');
                            tbCombo.html('');
                            tbCombo.html(getList);
                            tbCombo.val('').trigger("change");
                        }
                    }
                }
                else {
                    console.log(data.Message);
                }
            },
            type: 'GET',
            async: (obj.async != undefined && obj.async == false) ? false: true,
            action: obj.action,
            data: obj.data
        }, false, false, false, null, obj.apiUrl);
    }
    /*
    ##########################################
    Các hàm riêng cho từng ứng dụng nếu có
    ##########################################
    */
};