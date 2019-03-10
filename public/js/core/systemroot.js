/*----------------------------------------------
--Author: nxduong
--Phone: 0983029603
--Description:
--Date of created: 13/09/2016
--Updated by: nnthuong & tvhiep
--Date of updated: 06/06/2018 
----------------------------------------------*/
function systemroot() { }
systemroot.prototype = {
    userId: null,
    langId: null,
    rootPath: '',
    rootPathUpload: '',
    rootPathDepend: '',
    rootPathCDN: '',
    rootPathReport: '',
    rootPathHelp: '',
    shareWebName: '',
    folderAvatar: '',
    folderDoc: '',
    folderNew: '',
    folderTemp: '',
    appId: '',
    apiUrlCommom: null,
    apiUrl: null,
    apiUrlTemp: null,
    urlService: '',
    ctPlacehoder: '',
    pageIndex_default: 1,
    pageSize_default: 10,
    isDebug: false,
    button_adress: null,
    urllocal: '',
    combonode: '',
    treenode: '',
    icolumn: 0,
    arrId: [],
    arrMulFileUp: [],
    node_submenu: '',
    arrMenu_HasChild: [],
    dataCache: [],
    dtChucNang: [],
    pathChucNang: '',
    tokenJWT: '',
    flag_alert: false,

    startApp: function () {
        var me = this;
        var oConfig         = Init_Prammater();

        me.rootPath         = oConfig.rootPath;
        me.rootPathUpload   = oConfig.rootPathUpload;
        me.rootPathDepend   = oConfig.rootPathDepend;
        me.rootPathCDN      = oConfig.rootPathCDN;
        me.rootPathReport   = oConfig.rootPathReport;
        me.rootPathHelp     = oConfig.rootPathHelp;

        me.apiUrl           = oConfig.rootPathAPI;
        me.apiUrlTemp       = oConfig.rootPathAPI;
        me.apiUrlCommom     = "";

        me.shareWebName     = oConfig.shareWebName;
        me.folderAvatar     = oConfig.folderAvatar;
        me.folderDoc        = oConfig.folderDoc;
        me.folderNew        = oConfig.folderNew;
        me.folderTemp       = oConfig.folderTemp;

        me.appId            = oConfig.appId;
        me.userId           = oConfig.userId;
        me.langId           = oConfig.langId;
        
        me.tokenJWT         = oConfig.tokenJWT;
        me.ctPlacehoder     = constant.setting.initsystem.content_placehoder;
        me.pageIndex        = constant.setting.initsystem.page_index;
        me.pageSize         = constant.setting.initsystem.page_size;
        me.pagInfoRender_specialedition();
        //widow event
        window.addEventListener('offline', function (e) { me.alert(core.constant.getting("LABLE", "OFFLINE")); });
        window.addEventListener('online', function (e) { me.alert(core.constant.getting("LABLE", "ONLINE")); });
        //search html for functions 
        //me.getlistByUser_ChucNang();
        $("#txtSearch_Fun").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#menu_vertical .treeview").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        $("#menu_vertical").delegate(".btnMenuVertical", "click", function (event) {
            event.stopImmediatePropagation();
            var strChucNang_Id = this.id;
            console.log(this.id);
            me.pathChucNang = '';
            if (core.util.checkValue(strChucNang_Id)) {
                strChucNang_Id = core.util.cutPrefixId(/chucnang/g, strChucNang_Id);
                me.getDetail_ChucNang(strChucNang_Id);
            }
            else {
                core.system.alert(core.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        //search html for Apps(modules) 
        $("#txtSearch_App").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tblApp tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        //get dtcache
        if (typeof Storage !== "undefined") {
            me.dataCache = me.getCache_LocalStore("dataCache");
        }
    },
    page_load: function () {
        var me = this;
        core.util.resetchkSelect();
        me.pagInfoRender_specialedition();
        me.common_setup_page();
        //me.getList_HangDoi({}, "", "", "");
        //me.getList_NgonNgu();
        //reset all alert
        $("#alert").html('');
        $(".modal-backdrop").remove();
        /*Start Cấu hình curency*/
        //$('[data-ax5formatter]').ax5formatter();
        $(document).delegate('input', 'keypress', function (e) {
            if (e.which == 13) {
                e.preventDefault();
            }
        });
    },
    common_setup_page: function () {
        var me = this;
        //plugin select2
        $(".select-opt").select2();
        $(".select-opt-img").select2({
            templateResult: me.formatState
        });
        me.pickerdate();
    },
    /*
     *************************************************************************
     ********* orde: [1] *****************************************************
     ********* name: KHOI HAM XU LY CHUNG ************************************
     ********* disc: *********************************************************
     *************************************************************************
    */
    makeRequest: function (params, inc_user, inc_code, inc_lang, container, urlService) {
        var op = params;
        var me = this;
        //1. checking...
        var onSuccess = function () { };
        if (op.hasOwnProperty('success')) {
            if (typeof op.success === 'function') {
                onSuccess = op.success;
            }
        }
        //2. checking...
        var onError = function () { };
        if (op.hasOwnProperty('error')) {
            if (typeof op.error === 'function') {
                onError = op.error;
            }
        }
        //3. checking...
        var is_inc_code = false;
        var is_inc_lang = false;
        var is_inc_user = false;
        if (core.util.checkValue(inc_code)) is_inc_code = inc_code;
        if (core.util.checkValue(is_inc_lang)) is_inc_lang = inc_lang;
        if (core.util.checkValue(is_inc_user)) is_inc_user = inc_user;
        //4. check using authen API or not
        var is_authen = true;
        if (core.util.checkValue(op.authen)) {
            if (op.authen) {
                is_authen = true;
            }
            else {
                is_authen = false;
            }
        }
        else {
            is_authen = false;
        }
        //5. checking
        if (core.util.checkValue(container)) {
            $('[id$=' + container + ']').html('<div class="IMSLoadingWrapper"><img src="' + me.rootPath + constant.setting.imgLoading + '" alt="loading..." /></div>');
        }
        //6. check using local API or internet API 
        if (core.util.checkValue(urlService)) {
            me.apiUrl = urlService;
        }
        else {
            me.apiUrl = me.apiUrlTemp;
        }
        //7. check API version
        if (core.util.checkValue(op.versionAPI)) {
            me.apiUrl = me.apiUrl + "/" + op.versionAPI + "/" + op.action;
        }
        else {
            me.apiUrl = me.apiUrl + "/" + op.action;
        }
        //8. unknonw??
        var dataPost = op.data;
        if (me.isDebug) {
            console.log(dataPost);
        }
        if (me.isDebug) {
            if (typeof op.fakedb !== 'undefined')
                onSuccess(op.fakedb);
        } else {
            if (is_authen) {
                $.ajax({
                    type: op.type,
                    crossDomain: true,
                    url: me.apiUrl,
                    //headers: { 'Authorization': me.tokenJWT },
                    data: dataPost,
                    cache: false,
                    dataType: constant.setting.method.DATA_TYPE,
                    success: function (d, s, x) {
                        var result = d;
                        if (core.util.checkValue(result)) {
                            onSuccess(result);
                        }
                    },
                    error: function (x, t, m) {
                        onError(x);
                    },
                    async: op.async,
                    timeout: op.timeout !== undefined ? op.timeout : 3000000
                });
            }
            else {
                $.ajax({
                    type: op.type,
                    crossDomain: true,
                    url: me.apiUrl,
                    data: dataPost,
                    cache: false,
                    dataType: constant.setting.method.DATA_TYPE,
                    success: function (d, s, x) {
                        var result = d;
                        if (core.util.checkValue(result)) {
                            onSuccess(result);
                        }
                    },
                    error: function (x, t, m) {
                        onError(x);
                    },
                    async: op.async,
                    timeout: op.timeout !== undefined ? op.timeout : 3000000
                });
            }
        }
    },
    /*
    -- author:
    -- discription: loading global
    -- date: 
    */
    beginLoading: function () {
        document.getElementById('overlay').style.display = "";
    },
    endLoading: function () {
        document.getElementById('overlay').style.display = "none";
    },
    /*
    -- author:
    -- discription:  Hiển thị loadding khi click button
    -- date: 
    */
    buttonLoading: function () {
        var me = this;
        $('.btnwaitsucces').on('click', function () {
            var x = $(this);
            if (me.button_adress) {
                me.button_adress.button('reset');
            }
            me.button_adress = x;
            document.getElementById(this.id).className += "btn-lg";
            x.attr("data-loading-text", "<i class='fa fa-spinner fa-spin '></i> Đang gửi");
            x.button('loading');
            setTimeout(function () { me.button_adress.button('reset'); }, 30000);
        });
    },
    buttonEndLoading: function () {
        if (this.button_adress) this.button_adress.button('reset');
    },
    /*
    -- author: 
    -- discription: load html page
    -- date: 
    */
    initMain: function (strDisplayedPath, strRootPath) {
        var me = this;
        me.pageIndex_default = 1;
        var m = "";
        if (strRootPath == undefined || strRootPath == null) {
            strRootPath = localStorage.strRootPath;
        }
        else {
            strRootPath = me.rootPath + strRootPath;
        }
        if (strDisplayedPath == undefined || strDisplayedPath == null) {
            var hash = window.location.hash, hashArr = hash.split('/'), params = [];

            if (hashArr.length > 1) {
                for (var i = 0; i < hashArr.length; i++) {
                    params.push(hashArr[i]);
                }
            }
            if (params != undefined && params != "") {
                m = params[0];
            }
            else {
                m = "#" + window.location.hash.substr(1);
            }
        }
        else {
            m = strDisplayedPath;
        }
        var path = m;
        location.href = path;
        if (typeof (Storage) !== "undefined") {
            if (strRootPath != undefined || strRootPath != null) {
                localStorage.setItem("strRootPath", strRootPath);
            }
        }
        me.loadFunctionPath(strRootPath);
    },
    checkPermissionByUser: function (userName, strDisplayedPath, strRootPath) {
        var me = this;
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.init(FunctionUrl);
                }
                else {
                    $(me.ctPlacehoder).html("");
                    $(me.ctPlacehoder).html("<div class='IMSNotesWrapper'>Bạn không có quyền truy cập chức năng này!</div>");
                }
            },
            error: function (er) {
                $(me.ctPlacehoder).html("");
                $(me.ctPlacehoder).html("<div class='IMSNotesWrapper'>Bạn không có quyền truy cập chức năng này!</div>");
            },
            action: 'NguoiDung/checkPermissionByUser',
            data: {
                'userName': userName,
                'functionPath': strDisplayedPath
            },
            fakedb: [
            ]
        }, false, false, false, me.apiUrlCommom);
    },
    loadFunctionPath: function (strRootPath) {
        var me = this;
        var main_place = me.ctPlacehoder;
        var urlPage = strRootPath;
        //do
        $(main_place).html("");
        if (main_place == null || main_place == "" || main_place == undefined) {
            main_place = constant.setting.initsystem.content_placehoder;
        }
        if (urlPage != null && urlPage != "") {
            //$(main_place).fadeOut('slow').load(strRootPath).fadeIn('slow', );
            me.loadPage($(main_place), strRootPath, function () {
                //check existance path
                if ($(main_place).children("div").length <= 0) {
                    console.log("Không tìm thấy đường dẫn trang: " + strRootPath);
                    return false;
                }
            });
            // $(main_place).fadeOut('slow').load(strRootPath).fadeIn('slow', function () {
            //     //check existance path
            //     if ($(main_place).children("div").length <= 0) {
            //         console.log("Không tìm thấy đường dẫn trang: " + strRootPath);
            //         return false;
            //     }
            // });

        }
        else {
            $(main_place).html("<div class='IMSNotesWrapper'>Chức năng chưa được kích hoạt!</div>");
        }


    },

    /*--------------------------------------
    -- author: tvhiep
    -- discription: Sửa lại hàm load $(main_place).load(strRootPath)
    -- date:  13/11/2018
    -- Mục đích: chống cache bằng cách cộng thêm version cho file .html và file .js
    */
    loadPage: function(self, url, params, callback) {
        var selector, type, response,
            off = url.indexOf(" ");

        EditUrlHtml();
        if (off > -1) {
            selector = stripAndCollapse(url.slice(off));
            url = url.slice(0, off);
        }

        // If it's a function
        if (jQuery.isFunction(params)) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if (params && typeof params === "object") {
            type = "POST";
        }

        // If we have elements to modify, make the request
        if (self.length > 0) {
            jQuery.ajax({
                url: url,

                // If "type" variable is undefined, then "GET" method will be used.
                // Make value of this field explicit since
                // user can override it through ajaxSetup method
                type: type || "GET",
                dataType: "html",
                data: params
            }).done(function (responseText) {
                responseText = EditUrlJS(responseText);
                // Save response for use in complete callback
                response = arguments;
                //console.log(responseText);
                self.html(selector ?

                    // If a selector was specified, locate the right elements in a dummy div
                    // Exclude scripts to avoid IE 'Permission Denied' errors
                    jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

                    // Otherwise use the full result
                    responseText);

                // If the request succeeds, this function gets "data", "status", "jqXHR"
                // but they are ignored because response was set above.
                // If it fails, this function gets "jqXHR", "status", "error"
            }).always(callback && function (jqXHR, status) {
                self.each(function () {
                    callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
                });
            });
        }
        //Cộng thêm version cho file html
        function EditUrlHtml() {
            var newVersion = "v=" + randomInt(4) + "." + randomInt(4) + "." + randomInt(4) + "." + randomInt(4);
            if (url.indexOf('?') != -1) {
                url += "&" + newVersion
            }
            else {
                url += "?" + newVersion;
            }
        }

        function EditUrlJS(strData) {
            var newVersion = "?v=" + randomInt(4) + "." + randomInt(4) + "." + randomInt(4) + "." + randomInt(4);
            var iStart = 0;
            while (1) {
                var ivitri = strData.indexOf("<script", iStart);
                if (ivitri == -1) break;
                iStart = ivitri + 5;
                var strSrc = strData.substring(iStart, strData.indexOf(">", iStart));
                if (strSrc.indexOf('src="') != -1) {
                    var ivitrijs = strSrc.indexOf(".js") + 3;
                    var strVersion = strSrc.substring(ivitrijs, strSrc.indexOf('"', ivitrijs));
                    var strNewSrc = strSrc.replace(strVersion, newVersion);
                    strData = strData.replace(strSrc, strNewSrc);
                }
                else {
                    continue;
                }
            }
            return strData;
        }

        function randomInt(len, charSet) {
            charSet = charSet || '0123456789';
            var randomString = '';
            for (var i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            return randomString;
        }
    },
    /*--------------------------------------
    -- author: tvhiep
    -- discription: Xủ lý upload nhiều file
    -- date:  13/10/2018
    */
    uploadFiles: function (arrZoneId, strFolderExtend, callback) {
        //in html: <div id="uploadFile_PN"></div>
        //in html: <div id="zoneHienThiFIle"></div>
        //in js: core.system.uploadImage(["uploadFile_PN"], "");
        //core.system.uploadImage(["uploadFile_PN:zoneHienThiFIle"], "");
        //Nếu có dấu : tức là sẽ có tùy chọn zone hiển thị riêng không sử dụng mặc định nữa
        //callback sẽ gồm 2 tham số: strId == arrZoneId[i], danh sách tên file trả về. Mỗi khi thêm hoặc xóa file đều gọi callback
        //Danh sách tên file trả về mặc định lưu ở textarea id="txtFiles" + arrZoneId[i]
        //in html: <div id="uploadPicture_PN"></div>
        //in js: core.system.singleFileUp(["uploadPicture_PN"], "");
        //if (typeof (UploadFile) != "function") {
        //    //var newVersion = "v=" + randomInt(4) + ".0.0.1";
        //    $(me.ctPlacehoder).append('<script src="' + me.rootPathUpload + '/Core/uploadfile.js"></script>');
        //    setTimeout(function () {
        //        me.uploadFiles(arrZoneId, strFolderExtend, callback);
        //    }, 100);
        //    return;
        //}
        var me = this;
        UploadFile(arrZoneId, me.shareWebName, me.folderDoc, strFolderExtend, callback);
        //function randomInt(len, charSet) {
        //    charSet = charSet || '0123456789';
        //    var randomString = '';
        //    for (var i = 0; i < len; i++) {
        //        var randomPoz = Math.floor(Math.random() * charSet.length);
        //        randomString += charSet.substring(randomPoz, randomPoz + 1);
        //    }
        //    return randomString;
        //}
    },
    uploadAvatar: function (arrZoneId, strFolderExtend, callback, iWidth, iHeight) {
        var me = this;
        //if (typeof (UploadAvatar) != "function") {
        //    //var newVersion = "v=" + randomInt(4) + ".0.0.1";
        //    $(me.ctPlacehoder).append('<script src="' + me.rootPathUpload + '/Core/uploadavatar.js"></script>');
        //    setTimeout(function () {
        //        me.uploadAvatar(arrZoneId, strFolderExtend, callback, iWidth, iHeight);
        //    }, 100);
        //    return;
        //}
        if (!core.util.checkValue(iWidth)) iWidth = 336;
        if (!core.util.checkValue(iHeight)) iHeight = 448;
        UploadAvatar(arrZoneId, me.shareWebName, me.folderAvatar, strFolderExtend, callback, iWidth, iHeight);
        //function randomInt(len, charSet) {
        //    charSet = charSet || '0123456789';
        //    var randomString = '';
        //    for (var i = 0; i < len; i++) {
        //        var randomPoz = Math.floor(Math.random() * charSet.length);
        //        randomString += charSet.substring(randomPoz, randomPoz + 1);
        //    }
        //    return randomString;
        //}
    },
    uploadImport: function (arrZoneId, callback) {
        //in html: <div id="uploadFile_PN"></div>
        //in html: <div id="zoneHienThiFIle"></div>
        //in js: core.system.uploadImage(["uploadFile_PN"], "");
        //core.system.uploadImage(["uploadFile_PN:zoneHienThiFIle"], "");
        //Nếu có dấu : tức là sẽ có tùy chọn zone hiển thị riêng không sử dụng mặc định nữa
        //callback sẽ gồm 2 tham số: strId == arrZoneId[i], danh sách tên file trả về. Mỗi khi thêm hoặc xóa file đều gọi callback
        //Danh sách tên file trả về mặc định lưu ở textarea id="txtFiles" + arrZoneId[i]
        //in html: <div id="uploadPicture_PN"></div>
        //in js: core.system.singleFileUp(["uploadPicture_PN"], "");
        var me = this;
        var strModule_Name = "";
        var strFolderExtend = "";
        var strLinkUpload = "";
        var strOutFolderPath = "Upload/File/";
        if (!core.util.checkValue(strFolderExtend)) {
            strFolderExtend = "";
        }
        if (!core.util.checkValue(arrZoneId)) {
            me.alert("Chưa truyền vào arrZoneId", "w");
            return false;
        }
        //Kiểm tra id file có tồn tại không
        for (var i = 0; i < arrZoneId.length; i++) {
            var temp = arrZoneId[i];
            //Nếu file chứa dấu : kiểm tra xem có tồn tại id đó không
            if (temp.indexOf(":") != -1) {
                if (document.getElementById(temp.substring(0, temp.indexOf(":"))) == undefined) {
                    me.alert("Không tồn tại id: " + temp, "w");
                    continue;
                }
            }
            else {
                if (document.getElementById(temp) == undefined) {
                    me.alert("Không tồn tại id: " + temp, "w");
                    continue;
                }
            }
        }
        var arrMulFileUp = [];// Mảng 2 chiều [["newFileName1", "FileName2"],["newFileName1", "FileName2"]]
        var loadFileSuccess = 0; //Lưu tình trạng tải file: 0 có thể gửi, 1 đang tải file đính kèm lên server, 2 đã hoàn thành tải file lên server
        //Thêm thư viện
        //var row = "";
        //row += '<link href="' + strLinkUpload + 'Core/jquery-ui.structure.min.css" rel="stylesheet" />';
        //row += '<link href="' + strLinkUpload + 'Core/jquery-ui.theme.min.css" rel="stylesheet" />';
        //$(me.ctPlacehoder).append(row);
        uploadFile(arrZoneId);

        function uploadFile(arrFile) {
            for (var i = 0; i < arrFile.length; i++) {
                var elementId = arrFile[i];
                var strZoneFileDinhKem = "";
                //Nếu file chứa dấu : tức là có zone upload riêng
                if (elementId.indexOf(":") != -1) {
                    strZoneFileDinhKem = elementId.substring(elementId.indexOf(":") + 1);
                    elementId = elementId.substring(0, elementId.indexOf(":"));
                }
                else {
                    strZoneFileDinhKem = "zoneFileDinhKem" + elementId;
                }
                var row = "";
                row += '<input id="divupload' + elementId + '" type="image" src="' + me.rootPathDepend + '/App_Themes/CMS/images/file_add.png" value="Upload" />';
                row += '<input id="uploader' + elementId + '" type="file" style="display: none">';
                row += '<textarea id="txtFiles' + elementId + '" style="display: none"></textarea>';
                row += '<div class="clear"></div>';
                row += '<div id="zoneFileDinhKem' + elementId + '"></div>';
                row += '<div class="clear"></div>';
                row += ' <div id="progress-bar' + elementId + '" style="position: relative; display: none">';
                row += '<span id="progressbar-label' + elementId + '" style="position: absolute; left: 0%; top: 20%;">Please Wait...</span>';
                row += '</div>';
                $("#" + elementId).html(row);
                //Sự kiện khi nhấn 
                $("#divupload" + elementId).click(function (e) {
                    e.preventDefault();
                    $("#uploader" + elementId).trigger("click");
                });

                document.getElementById("uploader" + elementId).addEventListener("change", function () {
                    upLoadFiles(elementId, strZoneFileDinhKem);
                });

                //Sự kiến xóa file khi click vào nút xóa tại mỗi ô file upload
                $(document).delegate(".btnDeleteFileUp" + elementId, "click", function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var point = this;
                    //var strId = $(this).attr("name");
                    //var strNewFileName = $(this).attr("title");
                    $(point.parentNode.parentNode).replaceWith('');
                    //Khac ban chinh
                    //$.ajax({
                    //    url: strLinkUpload + 'Handler/del_file_v2.ashx?strFileDel=' + strNewFileName,
                    //    method: 'post',
                    //    success: function (data) {
                    //        $(point.parentNode.parentNode).replaceWith('');
                    //        outThongTinDinhKem(strId);
                    //    }
                    //});
                    //Thay đổi hiển thị nút upload
                    $("#divupload" + elementId).attr("src", me.rootPathDepend + "/App_Themes/CMS/images/file_add.png");
                    $("#txtFiles" + elementId).val("")
                });
            }
        }

        function upLoadFiles(elementId, strZoneUp) {
            //Cập nhật trạng thái đang up file
            loadFileSuccess = 1;
            var uploadedFiles = $('#uploader' + elementId)[0].files;
            //Chứa danh sách tên file cho lần upload hiện tại trên giao diện
            var arrFileName = [];
            //Lấy lại danh sách file bao gồm file lưu dưới db và tên file hiển thị
            arrMulFileUp = getDSFile(elementId);
            //Chỉnh sửa lại arrMulFileUp
            //Số file select trên giao diện
            if (uploadedFiles.length > 0) {
                var formData = new FormData();
                //Kiểm tra sự trùng lặp file khi upload
                for (var i = 0; i < uploadedFiles.length; i++) {
                    var icheck = true;
                    for (var j = 0; j < arrMulFileUp.length; j++) {
                        //Kiểm tra dự vào file name
                        if (uploadedFiles[i].name == arrMulFileUp[j][1]) icheck = false;
                    }
                    if (icheck) {
                        //Kiểm tra đuôi file
                        var strFileName = uploadedFiles[i].name;
                        var vitri = strFileName.lastIndexOf(".");
                        var strExtensionFile = strFileName.substring(vitri + 1);
                        var strCheck = checkFileImport(strExtensionFile);
                        if (strCheck == "") {
                            me.alert("File <b>" + strFileName + "</b> không hợp lệ!", 'w');
                            return;
                        }
                        formData.append(strFileName, uploadedFiles[i]);
                        arrFileName.push(strFileName);
                    }
                }
            }
            else {
                me.alert("Bạn chưa chọn file nào!", 'w');
                return;
            }
            //Kiểm tra nếu không có new file thoát ra
            if (arrFileName.length <= 0) {
                me.alert("Không có file nào mới!", 'w');
                return;
            }

            var progressbarLabel = $('#progressbar-label' + elementId);
            var progressbarDiv = $('#progress-bar' + elementId);
            console.log(me.rootPath);
            console.log(strOutFolderPath);
            $.ajax
                ({
                    url: me.rootPath + "/Handler/up_fileImport.ashx?outFolderPath=" + strOutFolderPath,
                    method: 'POST',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (response) {
                        //

                        //Cập nhật trạng thái load thành công
                        loadFileSuccess = 2;
                        //Thông báo lỗi khi response trả về có chứa "Loi System"
                        if (response.indexOf('Loi System') != -1) {
                            me.alert(response, 'w');
                            return;
                        }
                        progressbarLabel.text('Tải lên server thành công!', 'w');
                        if (arrFileName.length > 1) {
                            var arrfile = response.split(",");
                            if (arrfile.length != arrFileName.length) {
                                me.alert("File đính kèm không hợp lệ. Vui lòng thử lại", "w");
                                return;
                            }
                            for (var i = 0; i < arrfile.length; i++) {
                                arrMulFileUp.push([arrfile[i], arrFileName[i]]);
                            }
                        }
                        else {
                            if (arrFileName.length > 0) arrMulFileUp = [[response, arrFileName[0]]];
                        }
                        //Thay đổi hiển thị nút upload
                        $("#divupload" + elementId).attr("src", "");
                        $("#divupload" + elementId).val("Thay đổi");
                        $("#" + strZoneUp).html("");
                        //Hiển thị lại danh sách
                        viewFileDinhKem(elementId, strZoneUp);
                        progressbarDiv.fadeOut(2000);
                    },
                    error: function (err) {
                        console.log(11111);
                        loadFileSuccess = 2;
                        me.alert(err.statusText);
                    }
                });
            progressbarLabel.text('Vui lòng chờ đợi...');
            progressbarDiv.progressbar({
                value: false
            }).fadeIn(1000);
        }

        function viewFileDinhKem(elementId, strZoneUp) {
            $("#" + strZoneUp).html("");
            var row = '';
            for (var i = 0; i < arrMulFileUp.length; i++) {
                //Hiện thị hình ảnh đuôi mở rộng
                var strFileName = arrMulFileUp[i][1];
                var strFileNameInStorage = arrMulFileUp[i][0];
                vitri = strFileNameInStorage.lastIndexOf(".");
                var strExtensionFile = strFileNameInStorage.substr(vitri + 1, strFileNameInStorage.length);

                var strColor = "black";
                var strFileStyle = "fa fa-file";
                switch (strExtensionFile.trim()) {
                    case "jpg":
                    case "png":
                    case "jpeg":
                    case "gif":
                        strFileStyle = "fa fa-file-image-o";
                        strColor = "pink";
                        break;
                    case "doc":
                    case "docx":
                        strFileStyle = "fa fa-file-word-o";
                        strColor = "blue";
                        break;
                    case "xls":
                    case "xlsx":
                        strFileStyle = "fa fa-file-excel-o";
                        strColor = "green";
                        break;
                    case "pdf":
                        strFileStyle = "fa fa-file-pdf-o";
                        strColor = "red";
                        break;
                    case "rar":
                        strFileStyle = "fa fa-file-archive-o";
                        strColor = "purple";
                        break;
                }
                var content = '';
                if (strExtensionFile == "jpg" || strExtensionFile == "png" || strExtensionFile == "png" || strExtensionFile == "png") {
                    var pictureUp = strLinkUpload + strFileNameInStorage;
                    content = '<img class="user-image" style="height: 111px; witdh: 80px; overflow: hidden" src="' + pictureUp + '"/>';
                }
                else {
                    content += '<i style="color: ' + strColor + '" class="' + strFileStyle + '" title="' + strFileName + '"></i>';
                }

                row += '<li>';
                row += '<span class="mailbox-attachment-icon">';
                row += content;
                row += '<a style="left: 0px; top: 0px; z-index: 99999999999;" class="btn btn-default btn-xs pull-right btnDeleteFileUp' + elementId + '" name="' + elementId + '" title="' + strFileNameInStorage + '" filename="' + strFileName + '" href="#">';
                row += '<i class="fa fa-times-circle"></i>';
                row += '</a>';
                row += '</span>';
                row += '<div class="mailbox-attachment-info">';
                row += '<div class="mailbox-attachment-name" href="#" title="' + strFileName + '" style="text-overflow: ellipsis; overflow: hidden;height: 20px; display: inline - block;white-space: nowrap;">';
                row += strFileName;
                row += '</div>';
                row += '</div>';
                row += '</li>';
                //Cập nhật danh sách file upload
            }
            $("#" + strZoneUp).append('<ul class="mailbox-attachments">' + row + '</ul>');
            outThongTinDinhKem(elementId);
        }

        function outThongTinDinhKem(elementId) {
            var row = "";
            var x = document.getElementsByClassName("btnDeleteFileUp" + elementId);
            for (var i = 0; i < x.length; i++) row += x[i].title + ",";
            row = row.substring(0, row.length - 1);
            row = row.replace(/\\/g, '\\\\');//Khac ban chinh
            $("#txtFiles" + elementId).val(row);
            if (typeof (callback) == 'function') {
                callback(elementId, row, loadFileSuccess);
            }
        }

        function getDSFile(elementId) {
            var arrTemp = [];
            var x = document.getElementsByClassName("btnDeleteFileUp" + elementId);
            for (var i = 0; i < x.length; i++) {
                var point = x[i];
                arrTemp.push([$(point).attr("title"), $(point).attr("filename")]);
            }
            return arrTemp;
        }

        function checkFileImport(extention) {
            extention = extention.toLowerCase();
            //Kiểm tra những file được phép đi xuống
            //Dưới file server cũng check lại như vậy
            var check = "";
            var strTypeOfFile = "";
            check += ".xls.xlsx";//".csv.doc.docx.djvu.odp.ods.odt.pps.ppsx.ppt.pptx.pdf.ps.eps.rtf.txt.wks.wps.xls.xlsx.xps.svg";// định dạng text
            if (check.indexOf('.' + extention) != -1) strTypeOfFile = "text";
            //else {
            //    check = ".7z.zip.rar.jar.tar.tar.gz.cab";// định dạng file nén
            //    if (check.includes('.' + extention)) strTypeOfFile = "file";
            //    else {
            //        check = ".bmp.exr.gif.ico.jp2.jpeg.pbm.pcx.pgm.png.ppm.psd.tiff.tga.jpg";// định dạng ảnh
            //        if (check.includes('.' + extention)) strTypeOfFile = "picture";
            //        //else {
            //        //    check = ".3gp.avi.flv.m4v.mkv.mov.mp4.mpeg.ogv.wmv.webm";// định dạng video
            //        //    if (check.includes('.' + extention)) strTypeOfFile = "video";
            //        //    else {
            //        //        check = ".aac.ac3.aiff.amr.ape.au.flac.m4a.mka.mp3.mpc.ogg.ra.wav.wma";// định dạng audio
            //        //        if (check.includes('.' + extention)) strTypeOfFile = "audio";
            //        //        else {
            //        //            check = ".chm.epub.fb2.lit.lrf.mobi.pdb.rb.tcr";// định dạng sách
            //        //            if (check.includes('.' + extention)) strTypeOfFile = "book";
            //        //        }
            //        //    }
            //        //}
            //    }
            //}
            return strTypeOfFile;
        }
    },
    viewFiles: function (strZoneId, strDuLieu_Id, strApi, callback) {
        var me = this;
        ////Load file nếu chưa tồn tại
        //if (typeof (UploadFile) != "function") {
        //    setTimeout(function () {
        //        getList_File();
        //    }, 500);
        //}
        //else {
        //    getList_File();
        //}
        //Xóa trắng vùng hiển thị nếu nhập sai dữ liệu
        if (!core.util.checkValue(strDuLieu_Id)) {
            viewFile(strZoneId, "");
            return;
        }
        if (strApi == undefined) {
            console.log("ViewFile: " + strZoneId + " : " + strDuLieu_Id + " : " + strApi);
            return;
        }
        getList_File();
        //
        $(document).delegate(".btnDelUploadedFile", "click", function (e) {
            if (strApi == undefined) return;
            e.stopImmediatePropagation();
            var strId = $(this).attr("name");
            var strFileName = $(this).attr("title");
            core.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                delete_File(strId, strFileName);
            });
        });

        function getList_File() {

            var obj_detail = {
                'action': strApi + '/LayDanhSach',
                'versionAPI': 'v1.0',
                'strDuLieu_Id': strDuLieu_Id
            }
            //core.system.beginLoading();
            core.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        if (json != null) {
                            viewFile(strZoneId, json, callback);
                        } else {
                            console.log("Lỗi ");
                        }
                    } else {
                        console.log("Thông báo: có lỗi xảy ra!");
                    }
                    core.system.endLoading();
                },
                error: function (er) { core.system.endLoading(); },
                type: "GET",
                action: obj_detail.action,
                versionAPI: obj_detail.versionAPI,
                contentType: true,
                authen: true,
                data: obj_detail,
                fakedb: []
            }, false, false, false, null);
        }
        function delete_File(strIds, strFileNames) {
            //--Edit
            var obj_delete = {
                'action': strApi + '/Xoa',
                'versionAPI': 'v1.0',
                'strIds': strIds,
                'strNguoiThucHien_Id': core.system.userId
            };
            //default
            core.system.beginLoading();
            core.system.makeRequest({
                success: function (data) {
                    deleteFiles(strFileNames);
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
                type: "POST",
                action: obj_delete.action,
                versionAPI: obj_delete.versionAPI,
                contentType: true,
                authen: true,
                data: obj_delete,
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },
    getRootPathImg: function (ImageName, imageType, isLocal) {
        //old_name getImageUrl ===> getRootPathImg
        var me = this;
        var urlRootUpload = me.rootPathUpload;
        var strDefault = "/Core/images/no-avatar.png";
        var strFileNotFound = "/Core/images/no-avatarfound.png";

        //update: 17/04/2018 by nxduong
        //note: Xử lý trường hợp dữ liệu file tập chung
        var url_media = me.rootPathCDN;
        if (!core.util.checkValue(url_media)) {
            url_media = urlRootUpload;
        }
        else {
            urlRootUpload = url_media;
        }
        //Xử lý trường hợp nếu user sử dụng file tại local
        if (!core.util.checkValue(isLocal)) {
            isLocal = false;
        }
        if (isLocal) {
            urlRootUpload = me.rootPathUpload;
        }
        if (!core.util.checkValue(ImageName)) {
            return urlRootUpload + strDefault;
        }
        else {
            //update vanhiep
            //Kiểm tra sự tồn tại của file
            var strUrl = "";
            var x = $.ajax({
                url: core.system.rootPathUpload + '/Handler/checkFileAvailable.ashx?strFileName=' + ImageName,
                method: 'post',
                async: false,
                success: function (data) {
                    if (data == "404" || data == 404) {
                        strUrl = urlRootUpload + strFileNotFound;
                    } else {
                        strUrl = urlRootUpload + "/" + ImageName;
                    }
                }
            });
            return strUrl;
            //sử dụng trực tiếp không cần switch nữa
            //switch (imageType) {
            //    case constant.setting.EnumImageType.ACCOUNT:
            //        return urlRootUpload + "/" + me.shareWebName + "/" + me.folderAvatar + "/" + ImageName;
            //    case constant.setting.EnumImageType.DOCUMENT:
            //        return urlRootUpload + "/" + me.shareWebName + "/" + me.folderDoc + "/" + ImageName;
            //    default:
            //        return urlRootUpload + "/" + me.shareWebName + "/" + me.folderAvatar + "/" + "no-avatar.png";
            //}
        }
    },
    saveFiles: function (strZone, strDuLieu_Id, strApi, callback) {
        var me = this;
        //Kiểm tra tồn tại của id đầu vào
        if (document.getElementById(strZone) == undefined) {
            core.system.alert("Không tìm thấy: " + strZone, "w");
            return;
        }
        //Kiểm tra xem đã truyền tên Controller chưa, nếu chưa sẽ lấy từ ...
        if (!core.util.checkValue(strApi)) {
            var strNewApi = $("#" + strZone).attr(name);
            if (strNewApi != undefined) {
                strApi = strNewApi;
            }
        }
        //Lấy toàn bộ file chưa lưu (chưa có dữ liệu trong trường id)
        var item = $(".btnDeleteFileUp" + strZone + "[name ='']");
        if (item.length == 0) return;
        var arrFileMinhChung = [];
        var arrTenHienThi = [];
        //Thực hiện lưu những file trong zone mà chưa lưu
        for (var i = 0; i < item.length; i++) {
            arrFileMinhChung.push($(item[i]).attr("title"));
            arrTenHienThi.push($(item[i]).attr("filename"));
        }

        var obj_save = {
            'action': strApi + '/ThemMoi',
            'versionAPI': 'v1.0',

            'strDuLieu_Id': strDuLieu_Id,
            'strTenHienThi': arrTenHienThi.toString(),
            'strThongTinMinhChung': '',
            'strFileMinhChung': arrFileMinhChung.toString(),
            'strNguoiThucHien_Id': core.system.userId,
        };

        core.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    core.system.alert("Đã thêm mới: " + arrTenHienThi.toString());
                    if (typeof (callback) == "function") {
                        callback();
                    }
                }
                else {
                    core.system.alert("Lỗi: " + JSON.stringify(data.Message), "w");
                }
                core.system.endLoading();
            },
            error: function (er) { core.system.endLoading(); },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*--------------------------------------
    -- author: 
    -- discription: date server
    -- date:  
    */

    /*
     *************************************************************************
     ********* orde: [2] *****************************************************
     ********* name: KHOI HAM BIND DU LIEU ***********************************
     ********* disc: *********************************************************
     *************************************************************************
    */
    /*
    -- author:
    -- discription:  Xữ lý phân trang
                    1. Hàm render html số trang tùy chọn và thông tin dữ liệu hiển thị
                    2. Hàm setup thông tin phân trang và xữ lý sự kiện next page (strFuntionName: Tên khai báo hàm trong file js,
                    strTable_Id: Id bảng dữ liệu, iDataRow: Tổng số dữ liệu)
                    Cách gọi như sau:
                    1. Tại hàm init gọi hàm pagInfoRender để render html
                    2. Tại hàm load dữ liệu sau khi trả về kết quả json thì gọi hàm pagButtonRender
    -- date: 
    */
    pagInfoRender_specialedition: function (strClassName) {
        var me = this;
        if (!core.util.checkValue(strClassName))
            strClassName = "tbl-pagination";

        var x = document.getElementsByClassName(strClassName);
        for (var i = 0; i < x.length; i++) {
            var strTable_Id = x[i].id;
            var strPageSize_Id = "change" + strTable_Id;
            $("#" + strTable_Id).parent().before('<div class="clear"></div>');
            var class_pull_left = '';
            class_pull_left += '<div class="pull-left col-lg-6" id="' + strPageSize_Id + '" style="padding-left:0px; font-style:itali"></div>';
            $("#" + strTable_Id).before(class_pull_left);

            var strFilter_Id = strTable_Id + '_filter';
            var class_pull_right = '';
            class_pull_right += '<div id="' + strFilter_Id + '" class="col-lg-6 pull-right"></div>';
            $("#" + strTable_Id).before(class_pull_right);

            var row_change = "";
            row_change += '<div style="padding-left:0 !important; margin-top:6px; float:left; font-style:italic">';
            row_change += '<label>Hiển thị</label>';
            row_change += '</div>';
            row_change += '<div style="width: 70px; padding-left:3px !important; float:left">';
            row_change += '<select id="dropPageSize' + strPageSize_Id + '" class="select-opt">';
            row_change += '<option value="10"> 10 </option>';
            row_change += '<option value="15"> 15 </option>';
            row_change += '<option value="25"> 25 </option>';
            row_change += '<option value="50"> 50 </option>';
            row_change += '<option value="-1"> Tất cả </option>';
            row_change += '</select>';
            row_change += '</div>';
            row_change += '<div style="padding-left:3px !important; margin-top:6px; float:left; font-style:italic">';
            row_change += '<label>dữ liệu</label>';
            row_change += '</div>';
            $("#" + strPageSize_Id).html(row_change);
            $(".select-opt").select2();


            var row_pagesize_top = '';
            row_pagesize_top += '<div class="pull-right" style="margin-right: -15px">';
            row_pagesize_top += '<div class="light-pagination' + strTable_Id + '" style="float:right"></div>';
            row_pagesize_top += '</div>';
            $("#" + strFilter_Id).html(row_pagesize_top);

            var row_info = '';
            row_info += '<div style="width:100%; float:right; margin-top: 10px">';
            row_info += '<div id="tbldata_info' + strTable_Id + '" style="width: 40%; float:left"></div>';
            row_info += '<input type="hidden" id="hr_total_rows' + strTable_Id + '" value="0" />';
            row_info += '<div id="light-pagination' + strTable_Id + '" class="light-pagination' + strTable_Id + '" style="float:right; width: 60%"></div>';
            row_info += '</div>';
            $("#" + strTable_Id).after(row_info);

            row_inputhiden = '';
            row_inputhiden += '<input type="hidden" value="10" id="' + strTable_Id + '_DataRow" />';
            $("#" + strTable_Id).after(row_inputhiden);
            me.getLocalStorage(strTable_Id);
        }
    },
    pagInfoRender: function (strTable_Id) {
        $(".zone-pag-header" + strTable_Id).replaceWith('');
        $(".zone-pag-footer" + strTable_Id).replaceWith('');
        var zonePagHeader = '<div class="zone-pag-header' + strTable_Id + '">';
        zonePagHeader += '<div class="clear"></div>';
        //html change top left
        zonePagHeader += '<div class="pull-left col-lg-6 change-' + strTable_Id + '" id="change' + strTable_Id + '" style="padding-left:0px; font-style:itali">';
        zonePagHeader += '<div style="padding-left:0 !important; margin-top:6px; float:left; font-style:italic">';
        zonePagHeader += '<label>Hiển thị</label>';
        zonePagHeader += '</div>';
        zonePagHeader += '<div style="width: 70px; padding-left:3px !important; float:left">';
        zonePagHeader += '<select id="dropPageSizechange' + strTable_Id + '" class="select-opt">';
        zonePagHeader += '<option value="10"> 10 </option>';
        zonePagHeader += '<option value="15"> 15 </option>';
        zonePagHeader += '<option value="25"> 25 </option>';
        zonePagHeader += '<option value="50"> 50 </option>';
        zonePagHeader += '<option value="-1"> Tất cả </option>';
        zonePagHeader += '</select>';
        zonePagHeader += '</div>';
        zonePagHeader += '<div style="padding-left:3px !important; margin-top:6px; float:left; font-style:italic">';
        zonePagHeader += '<label>dữ liệu</label>';
        zonePagHeader += '</div>';
        zonePagHeader += '</div>';
        //End left

        //html button to change the page top right
        zonePagHeader += '<div class="filter-' + strTable_Id + ' col-lg-6 pull-right">';
        zonePagHeader += '<div class="pull-right" style="margin-right: -15px">';
        zonePagHeader += '<div class="light-pagination' + strTable_Id + '" style="float:right"></div>';
        zonePagHeader += '</div>';
        //End top right
        zonePagHeader += '</div>';
        $("#" + strTable_Id).before(zonePagHeader);
        $("#dropPageSizechange" + strTable_Id).select2();
        //End zone page header

        var zonePagFooter = '';
        zonePagFooter += '<div class="zone-pag-footer' + strTable_Id + '" style="width:100%; float:right; margin-top: 10px">';
        zonePagFooter += '<div class="info-' + strTable_Id + '" style="width: 40%; float:left"></div>';
        zonePagFooter += '<div id="light-pagination' + strTable_Id + '" class="light-pagination' + strTable_Id + '" style="float:right; width: 60%"></div>';
        zonePagFooter += '</div>';
        $("#" + strTable_Id).after(zonePagFooter);
    },
    pagButtonRender: function (strFuntionName, strTable_Id, iDataRow, obj) {
        var me = this;
        //option
        var pageIndex = me.pageIndex_default;
        var pageSize = me.pageSize_default;
        if (obj != null && obj != undefined) {
            if (obj.bChange == false && obj.bChange != undefined) $(".change-" + strTable_Id).replaceWith('');
            if (obj.bInfo == false && obj.bInfo != undefined) $(".info-" + strTable_Id).replaceWith('');
            if (obj.bLeft == false) $(".filter-" + strTable_Id).replaceWith('');
            if (core.util.checkValue(obj.pageSize)) pageSize = obj.pageSize;
        }


        var first_item = 1;
        if (pageIndex != 1) {
            first_item = (pageSize * pageIndex) - pageSize + 1;
        }
        if (pageSize == 1000000) {
            first_item = 1;
        }
        var items_in = "";
        if (parseInt(iDataRow) < parseInt(pageSize)) {
            items_in = iDataRow.toString();
        }
        else {
            items_in = (pageSize * pageIndex).toString();
        }
        if (parseInt(iDataRow) < parseInt(items_in)) {
            items_in = iDataRow.toString();
        }
        $(".info-" + strTable_Id).html('<span class="italic">' + first_item + ' đến ' + items_in + ' trong ' + iDataRow + ' dữ liệu<span>');
        me.pagInit(strFuntionName, strTable_Id, pageSize, iDataRow);
    },
    pagInit: function (strFuntionName, strTable_Id, pageSize_default, totalRows) {
        var me = this;
        $('.light-pagination' + strTable_Id).pagination({
            items: totalRows,
            itemsOnPage: pageSize_default,
            currentPage: me.pageIndex_default,
            cssStyle: 'compact-theme',
            onPageClick: function (pageNumber, event) {
                event.preventDefault();
                me.pageIndex_default = pageNumber;
                eval(strFuntionName);
            }
        });
        $('#dropPageSizechange' + strTable_Id).on('select2:select', function (e) {
            e.stopImmediatePropagation();
            me.pageIndex_default = 1;
            me.pageSize_default = $("#dropPageSizechange" + strTable_Id).val();
            me.setLocalStorage(strTable_Id);
            if (me.pageSize_default == "-1" || me.pageSize_default == -1) {
                me.pageSize_default = 1000000;
            }
            eval(strFuntionName);
            return false;
        });
    },
    insertFilterToTable: function (strTable_Id, strFuntionName) {
        var me = this;
        var row_filter = '';

        row_filter += '<div class="input-group pull-right" style="margin-right: -15px">';
        row_filter += '<input id="' + strTable_Id + '_input" type="text" name="q" class="form-control" style="width: 200px; float: right" placeholder="Tìm theo từ khóa">';
        row_filter += '<span class="input-group-btn">';
        row_filter += '<a type="submit" name="search" id="' + strTable_Id + '_search_btn" class="btn btn-flat" style="margin-left: -36px; z-index:4; height: 26px"><i class="fa fa-search"></i></a>';
        row_filter += '</span>';
        row_filter += '</div>';
        $('.filter-' + strTable_Id).html(row_filter);

        $("#" + strTable_Id + "_input").keypress(function (e) {
            e.stopImmediatePropagation();
            if (e.which == 13) {
                me.pageIndex_default = 1;
                eval(strFuntionName);
            }
        });
        $("#" + strTable_Id + "_search_btn").click(function (e) {
            e.stopImmediatePropagation();
            me.pageIndex_default = 1;
            eval(strFuntionName);
        });
    },
    insertChangLenghtToTable: function (arraySetMenuChange, strTable_Id) {
        var i;
        var getList = "";
        for (i = 0; i < arraySetMenuChange[0].length; i++) {
            getList += "<option value='" + arraySetMenuChange[0][i] + "'>" + arraySetMenuChange[1][i] + "</option>";
        }
        var tbCombo = $('[id$=dropPageSizechange' + strTable_Id + ']');
        tbCombo.html('');
        tbCombo.html(getList);
        tbCombo.val(arraySetMenuChange[0][0]).trigger("change");
    },
    setLocalStorage: function (strTable_Id) {
        if (this.urllocal == '') {
            var x = window.location.href;
            var vitribatdau = x.lastIndexOf("#");
            this.urllocal = x.substring(vitribatdau + 1);
        }

        var url = this.urllocal + strTable_Id;
        localStorage.setItem(url, $("#dropPageSizechange" + strTable_Id).val());
    },
    getLocalStorage: function (strTable_Id) {
        if (this.urllocal == '') {
            var x = window.location.href;
            var vitribatdau = x.lastIndexOf("#");
            this.urllocal = x.substring(vitribatdau + 1);
        }

        var url = this.urllocal + strTable_Id;
        try {
            var strVar = eval("localStorage." + url);
            if (strVar != "" && strVar != null && strVar != undefined) {
                this.pageSize_default = parseInt(strVar);
                $('#dropPageSizechange' + strTable_Id).val(strVar).trigger("change");
            }
        }
        catch (ex) {
            return;
        }
    },
    /*
    -- author: tvhiep
    -- discription: Render data into <Table> and pagination
    -- date: 02/06/2018
   */
    loadToTable_data: function (obj) {
        var me = this;
        var strTableId = obj.strTable_Id;
        var jsonData = obj.aaData;
        mainTable();
        //
        function mainTable() {
            $("#" + strTableId + " tbody").html("");
            if (core.util.checkValue(jsonData)) {
                if (jsonData.length > 0) {
                    addPagination();
                    fillTable();
                    sortAndOrder();
                    changeStyle();
                    posColumn();
                    addClassName();
                    hidden_Order();
                    hidden_Header();
                }
                else {
                    dataIsNull();
                    return;
                }
            }
            else {
                dataIsNull();
            }
        }
        function dataIsNull() {
            var html_Table = "";
            html_Table = '<tr><td colspan ="' + (obj.aoColumns.length + 1) + '" class="td-center"><span class="lang" key="">Không tìm thấy dữ liệu!</span></td></tr>';
            $("#" + strTableId + " tbody").html(html_Table);
            $(".zone-pag-footer" + strTableId).replaceWith('');
            $(".change-" + strTableId).html('');
        }
        function fillTable() {
            var html_table = "";
            var html_row = "";
            var col_name = '';
            var td_value = '';
            var col_func = '';
            var record_id = '';
            var stt = 0;
            var bcheck_orowid = false;
            if (core.util.checkValue(obj.orowid)) {
                if (core.util.checkValue(obj.orowid.id)) {
                    bcheck_orowid = true;
                }
                if (core.util.checkValue(obj.orowid.prefixId)) {
                    record_id = obj.orowid.prefixId;
                }
            }
            for (var i = 0; i < jsonData.length; i++) {
                me.icolumn = 0;
                stt++;
                html_row = "";
                var newId = "";
                bcheck_orowid ? newId = record_id + jsonData[i][obj.orowid.id] : newId = record_id + jsonData[i].ID;
                //process
                html_row += "<tr id='" + newId + "'>";
                html_row += '<td>' + stt + '</td>';
                for (var j = 0; j < obj.aoColumns.length; j++) {
                    col_name = obj.aoColumns[j].mDataProp;
                    html_row += '<td>';
                    switch (core.util.checkValue(col_name)) {
                        case true:
                            td_value = jsonData[i][col_name];
                            html_row += core.util.checkEmpty(td_value);
                            break;
                        case false:
                            col_func = obj.aoColumns[j].mRender;
                            if (core.util.checkValue(col_func)) {
                                html_row += col_func(i, jsonData[i]);
                            }
                            break;
                    }
                    html_row += "</td>";
                }
                html_row += "</tr>";
                html_table += html_row;
            }
            $("#" + strTableId).append(html_table);
            //me.common_setup_page();//select situation -->nnthuong comment
        }
        function addPagination() {
            if (obj.bPaginate != undefined && obj.bPaginate != false) {
                if (!core.util.checkValue(obj.bPaginate.iDataRow) || obj.bPaginate.iDataRow == 0) obj.bPaginate.iDataRow = jsonData.length;
                if (!core.util.checkValue($("#light-pagination" + strTableId).html())) {
                    me.pagInfoRender(strTableId);
                    if (obj.bPaginate.bFilter == true) me.insertFilterToTable(strTableId, obj.bPaginate.strFuntionName);
                    if (obj.bPaginate.lengthMenu != undefined && obj.bPaginate.lengthMenu != false) {
                        me.insertChangLenghtToTable(obj.bPaginate.lengthMenu, strTableId);
                    }
                    if (obj.bPaginate.saveChange == true) {
                        me.getLocalStorage(strTableId);
                        if (obj.bPaginate.saveChange == true) eval(obj.bPaginate.strFuntionName);
                    }
                }
                if (obj.bPaginate.strFuntionName != undefined) me.pagButtonRender(obj.bPaginate.strFuntionName, strTableId, obj.bPaginate.iDataRow, obj.bPaginate);
                var x = $("#dropPageSizechange" + strTableId + " option[value=" + me.pageSize_default + "]");
                if (x.length > 0) $("#dropPageSizechange" + strTableId).val(me.pageSize_default).trigger('change');
            }
        }
        function sortAndOrder() {
            if (obj.sort != undefined && obj.sort != false) {
                if (obj.order != undefined) {
                    sortTable(strTableId).sortTable($("#" + strTableId), obj.order[0][0], obj.order[0][1]);
                } else {
                    sortTable(strTableId);
                }
            }
            else {
                if (obj.order != undefined) {
                    sortTable().sortTable($("#" + strTableId), obj.order[0][0], obj.order[0][1]);
                }
            }
        }
        function changeStyle() {
            if (obj.addClass != undefined) {
                for (var i = 0; i < obj.addClass.length; i++)
                    addClassToColumn(strTableId, obj.addClass[i][0], obj.addClass[i][1]);
            }
        }
        function posColumn() {
            if (obj.colPos != undefined) {
                if (obj.colPos.fix != undefined) {
                    for (var i = 0; i < obj.colPos.fix.length; i++) {
                        addClassToColumn(strTableId, obj.colPos.fix[i], "td-fix");
                    }
                } if (obj.colPos.center != undefined) {
                    for (var i = 0; i < obj.colPos.center.length; i++) {
                        changeStyleTd(strTableId, obj.colPos.center, "text-align: center");
                    }
                } if (obj.colPos.right != undefined) {
                    for (var i = 0; i < obj.colPos.right.length; i++) {
                        changeStyleTd(strTableId, obj.colPos.right, "text-align: right");
                    }
                } if (obj.colPos.left != undefined) {
                    for (var i = 0; i < obj.colPos.left.length; i++) {
                        changeStyleTd(strTableId, obj.colPos.left, "text-align: left");
                    }
                }
            }
        }
        function changeStyleTd(strTableId, listTd, style) {
            if (listTd.length == 0) return null;
            x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
            for (var i = 0; i < listTd.length; i++) {
                for (var j = 0; j < x.length; j++) {
                    x[j].cells[listTd[i]].style = style;
                }
            }
        }
        function addClassToColumn(strTableId, iColumn, strClassName) {
            if (iColumn == undefined) return null;
            x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
            for (var j = 0; j < x.length; j++) {
                x[j].cells[iColumn].className += strClassName;
            }
        }
        function sortTable(strTableId) {
            var myTable = "#" + strTableId;
            var myTableBody = myTable + " tbody";
            var myTableRows = myTableBody + " tr";
            var myTableColumn = myTable + " th";

            //Starting table state
            function initTable() {

                //Increment the table width for sort icon support
                //$(myTableColumn).each(function () {
                //   var width = $(this).width();
                //   $(this).width(width + 40);
                //});

                $(myTableColumn).addClass("sorting");

                //Set the first column as sorted ascending
                $(myTableColumn).eq(0).addClass("sorted-asc");

                //Sort the table using the current sorting order
                sortTable($(myTable), 0, "asc");

            }

            //Table starting state
            initTable();

            //Table sorting function
            function sortTable(table, column, order) {
                var asc = order === 'asc';
                var tbody = table.find('tbody');
                //Sort the table using a custom sorting function by switching 
                //the rows order, then append them to the table body
                tbody.find('tr').sort(function (a, b) {
                    var aa = $('td:eq(' + column + ')', a).text();
                    var bb = $('td:eq(' + column + ')', b).text();
                    if (!isNaN(aa)) {
                        x = parseFloat(aa);
                        y = parseFloat(bb);
                        if (asc) {
                            if (x > y)
                                return 1;
                            else
                                return -1;
                        }
                        else {
                            if (x > y)
                                return -1;
                            else
                                return 1;
                        }
                    }
                    else {
                        if (asc) {
                            return aa.localeCompare(bb);
                        } else {
                            return bb.localeCompare(aa);
                        }
                    }
                }).appendTo(tbody);

            }
            //Heading click
            $(myTableColumn).click(function () {
                //Remove the sort classes for all the column, but not the first
                $(myTableColumn).not($(this)).removeClass("sorted-asc sorted-desc");

                //Set or change the sort direction
                if ($(this).hasClass("sorted-asc") || $(this).hasClass("sorted-desc")) {
                    $(this).toggleClass("sorted-asc sorted-desc");
                } else {
                    $(this).addClass("sorted-asc");
                }

                //Sort the table using the current sorting order
                sortTable($(myTable),
                    $(this).index(),
                    $(this).hasClass("sorted-asc") ? "asc" : "desc");

            });
            return {
                sortTable: sortTable
            };
        }
        function addClassName() {
            if (core.util.checkValue(obj.arrClassName)) {
                var arrClassName = obj.arrClassName;
                var x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
                for (var i = 0; i < x.length; i++) {
                    for (var j = 0; j < arrClassName.length; j++) {
                        x[i].classList.add(arrClassName[j]);
                    }

                }
            }
        }
        function hidden_Order() {
            if (obj.bHiddenOrder == true) {
                var x = document.getElementById(strTableId).getElementsByTagName('tbody')[0].rows;
                for (var i = 0; i < x.length; i++) {
                    x[i].cells[0].style.display = 'none';
                }
            }
        }
        function hidden_Header() {
            if (core.util.checkValue(obj.bHiddenHeader)) {
                if (obj.bHiddenHeader) {
                    $(".zone-pag-header" + strTableId).hide();
                }
            }
        }
    },
    /*
    -- author: tvhiep
    -- discription: Render pagination to any <div>
    -- date: 02/06/2018
   */
    loadPagination: function (strzoneId, strFuntionName, iDataRow, obj) {
        var me = this;
        //Dữ liệu null
        if (core.util.checkValue(iDataRow) && iDataRow > 0) {
            //Trước đó chưa hiển thị phân trang thì sẽ hiển thị phân trang
            if (document.getElementsByClassName("zone-pag-footer" + strzoneId).length === 0) {
                me.pagInfoRender(strzoneId);
                ////Tùy chọn Cập nhật lại PageSizechange
                $("#dropPageSizechange" + strzoneId).val(core.system.pageSize_default).trigger('change');
                //Tạo dải phân cách giữa 2 thằng sau sẽ xóa
                $(".zone-pag-clear" + strzoneId).replaceWith('');
                $("#" + strzoneId).before('<div class="zone-pag-clear' + strzoneId + '" style="clear: both;"></div>');
            }
            me.pagButtonRender(strFuntionName, strzoneId, iDataRow, obj);
        } else {
            $(".zone-pag-footer" + strzoneId).replaceWith('');
            $(".change-" + strzoneId).html('');
            $("#" + strzoneId).html("Không tìm thấy dữ liệu");
        }
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Select2_combo>
    -- date: 02/06/2018
   */
    loadToCombo_data: function (obj) {
        var me = this;
        var render_places = obj.renderPlace;
        var render = obj.renderInfor;
        var data = obj.data;
        //
        var dropToGen = "";
        var getList = "";
        var style = "";
        var stt = 0;
        var default_val = '';
        //
        var id = "";
        var parent_id = "";
        var name = "";
        var code = "";
        var type = "";
        var avatar = "";
        for (var i = 0; i < render_places.length; i++) {
            getList = "";
            type = "";
            avatar = "";
            stt = 0;
            //determine where to generate.. [how many places to gen?]
            if (core.util.checkId(render_places[i].trim())) {
                dropToGen = "#" + render_places[i].trim();
                $(dropToGen).html("");
            }
            //determine data to generate
            if (data.length > 0) {
                if (core.util.checkValue(render)) {//..[user]
                    id = render.id;
                    parent_id = core.util.returnEmpty(render.parentId);
                    name = render.name;
                    code = render.code;
                    type = obj.type;
                    avatar = core.util.returnEmpty(render.avatar);
                }
                else {//..[default]
                    id = 'ID';
                    parent_id = 'QUANHECHA_ID';
                    name = 'TEN';
                    code = 'MA';
                    type = obj.type;
                }
                comboRender();
            }
            else {
                getList += "<option value=''>-- Không tìm thấy dữ liệu! --</option>";
            }
            bindData();
        }
        //processing function
        function comboRender() {
            getList += checkTitle();//check title
            for (var j = 0; j < data.length; j++) {
                //old code, i changed on 13/12/2018 into code behind
                //if (!core.util.checkValue(data[j][parent_id])) {
                //    switch (type) {
                //        case 'order':
                //            stt++;
                //            style = stt + ".";
                //            extraRender(j);
                //            break;
                //        case 'unorder':
                //            style = "-";
                //            extraRender(j);
                //            break;
                //        default:
                //            style = "";
                //            extraRender(j);
                //    }
                //}
                switch (type) {
                    case 'order':
                        stt++;
                        style = stt + ".";
                        extraRender(j);
                        break;
                    case 'unorder':
                        style = "-";
                        extraRender(j);
                        break;
                    default:
                        style = "";
                        extraRender(j);
                }
            }
        }
        function checkTitle() {
            var title = '';
            if (core.util.checkValue(obj.title)) {
                title += "<option value=''>" + obj.title + "</option>";
            }
            else {
                if (core.util.checkValue(data[0].CHUNG_TENDANHMUC_TEN)) {
                    title += "<option value=''>Chọn " + data[0].CHUNG_TENDANHMUC_TEN.toLowerCase() + "</option>";
                }
            }
            return title;
        }
        function extraRender(j) {
            getList += "<option id='" + data[j][avatar] + "' value='" + data[j][id] + "'>" + style + " " + data[j][name] + "</option>";
            if (data.length > 1) {
                me.combonode = "";
                if (core.util.checkValue(parent_id)) {
                    getList += me.recursive_combo(obj, data[j][id], style);
                }
            }
            else {
                default_val = data[j][id];
            }
        }
        function bindData() {
            $(dropToGen).html(getList);//fill data
            if (default_val != "") {
                $(dropToGen).val(default_val).trigger("change");
            }
        }
    },
    recursive_combo: function (obj, parentid, parentStyle) {
        var me = this;
        var data = obj.data;
        //
        var id = '';
        var parent_id = '';
        var name = '';
        var code = '';
        var type = '';
        var avatar = "";
        var style;
        var stt;
        if (data.length > 0) {
            var render = obj.renderInfor;
            if (core.util.checkValue(render)) {//determine data to generate..[user]
                id = render.id;
                parent_id = render.parentId;
                name = render.name;
                code = render.code;
                type = obj.type;
                avatar = core.util.returnEmpty(render.avatar);
            }
            else {//determine data to generate..[default]
                id = 'ID';
                parent_id = 'QUANHECHA_ID';
                name = 'TEN';
                code = 'MA';
                type = obj.type;
            }
            comboRender();
        }
        return me.combonode;
        //processing function
        function comboRender() {
            stt = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i][parent_id] == parentid) {
                    switch (type) {
                        case 'order':
                            stt++;
                            style = parentStyle + stt + ".";
                            extraRender(i);
                            break;
                        case 'unorder':
                            style = parentStyle + "--";
                            extraRender(i);
                            break;
                        default:
                            style = parentStyle + "--";
                            extraRender(i);
                    }
                }
            }
        };
        function extraRender(i) {
            me.combonode += "<option id='" + data[i][avatar] + "' value='" + data[i][id] + "'>" + style + " " + data[i][name] + "</option>";
            me.recursive_combo(obj, data[i][id], style);
        };
    },
    loadToCombo_detail: function (dropToGen, activeId) {
        var checkId = core.util.checkId(dropToGen);
        if (checkId) {
            var dropToGen_Id = "#" + dropToGen;
            $(dropToGen_Id).val(activeId).trigger("change");//active data
        }
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Radio>
    -- date: 10/01/2019
    */
    loadToCheckBox_data: function (obj) {
        //usage:
        //var obj = {
        //    renderPlace: "zone",
        //    data: [],
        //    prefix: "toanha_",
        //    name:"TEN",
        //    id: "ID"
        //};
        //core.system.loadToCheckBox_data(obj);

        var me = this;
        var render  = obj.renderPlace;
        var data    = obj.data;
        var prefix  = obj.prefix;
        var name = obj.name;
        var id = obj.id;

        var place = "#" + render;
        var html = '';
        $(place).html(html);
        for (var i = 0; i < data.length; i++) {
            html += '<div class="checkbox">';
            html += '<label>';
            html += '<input type="checkbox" id="' + prefix + data[i][id]+ '"> ' + data[i][name];
            html += '</label>';
            html += '</div>';
        }
        $(place).html(html);
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Radio>
    -- date: 24/11/2018
    */
    loadToRadio_data: function (obj) {
        var me = this;
        var render_places = obj.renderPlace;
        var name = obj.name;
        var data = obj.data;
        var title = obj.title;

        var place = "#" + render_places;
        var html = '';
        $(place).html(html);
        if (core.util.checkValue(title)) {
            html += '<span class="italic">' + title + ": </span>";
        }
        for (var i = 0; i < data.length; i++) {
            html += '<div class="radio">';
            html += '<label>';
            html += '<input type="radio" id="' + name + data[i].ID + '" name="' + name + '" class="' + name + '" value="' + data[i].ID + '"/>';
            html += ' ' + data[i].TEN + " ";
            html += '</label>';
            html += '</div >';
        }
        $(place).html(html);
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Treejs>
    -- date: 02/06/2018
    */
    loadToTreejs_data: function (obj) {
        //1.the way to get id checked on checkbox
        //$(place).on('changed.jstree', function (e, data) {
        //    var i, j, r = [];
        //    for (i = 0, j = data.selected.length; i < j; i++) {
        //        r.push(data.instance.get_node(data.selected[i]).id);
        //    }
        //    jsTree_checked.push(r.join(','));
        //}).jstree();

        var me = this;
        var data = obj.data;
        var render = obj.renderInfor;
        var id = render.id;
        var parent_id = render.parentId;
        var name = render.name;
        var render_places = obj.renderPlaces;

        var place = "";
        for (var p = 0; p < render_places.length; p++) {
            var node = "";
            if (core.util.checkId(render_places[p])) {//determine where to generate.. [how many places to gen?]
                place = "#" + render_places[p];
                $(place).html("");
                $(place).jstree('destroy');
            }
            if (data.length > 0) {
                if (core.util.checkValue(render)) {//determine data to generate..[default or user]
                    userRender();
                }
                else {
                    defaultRender();
                }
            }
            else {
                node += '<ul><li>Không tìm thấy dữ liệu!</li></ul>'
            }
            $(place).append(node);
            configTreejs();
        }
        //processing functions
        function userRender() {
            node += '<ul>';
            for (var i = 0; i < data.length; i++) {
                if (data[i][parent_id] == null || data[i][parent_id] == "" || data[i][parent_id] == undefined) {
                    node += '<li class="btnEvent jstree-open" id="' + data[i][id] + '" title="' + data[i][name] + '">' + core.util.splitString(data[i][name], 30);
                    node += '<ul>';
                    me.treenode = "";
                    node += me.recursive_treejs(obj, data[i][id]);
                    node += '</ul>';
                    node += '</li>';
                }
            }
            node += '</ul>';
        }
        function defaultRender() {
            node += '<ul>';
            for (var i = 0; i < data.length; i++) {
                if (data[i].QUANHECHA_ID == null || data[i].QUANHECHA_ID == "") {
                    node += '<li class="btnEvent jstree-open" id="' + data[i].ID + '" title="' + data[i].TEN + '">' + core.util.splitString(data[i].TEN, 30);
                    node += '<ul>';
                    me.treenode = "";
                    node += me.recursive_treejs(obj, data[i].ID);
                    node += '</ul>';
                    node += '</li>';
                }
            }
            node += '</ul>';
        }
        function configTreejs() {
            //1. check
            if (core.util.checkValue(obj.check)) {
                var arr_checked = obj.arrChecked;
                //1. config to allow check in treejs
                $(place).jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"]
                });
                //2.the way to refresh treejs --> when update something new
                $(place).one("refresh.jstree", function (e, data) {
                    if (core.util.checkValue(arr_checked)) {
                        for (var i = 0; i < arr_checked.length; i++) {
                            data.instance.select_node(arr_checked[i]);
                        }
                    }
                }).jstree(true).refresh();
            }
            //2. style user
            else {
                if (core.util.checkValue(obj.style)) {//user style-user
                    $(place).jstree({
                        "types": {
                            "default": {
                                "icon": obj.style
                            }
                        },
                        "plugins": ["types"]
                    });
                }
                else {
                    $(place).jstree();//default user
                }
                $(place).jstree(true).refresh();
                $(place).one("refresh.jstree").jstree(true).refresh();
            }
        }
    },
    recursive_treejs: function (obj, parentId) {
        var me = this;
        var data = obj.data;
        var render = obj.renderInfor;
        var id = render.id;
        var parent_id = render.parentId;
        var name = render.name;

        if (data.length > 0) {
            if (core.util.checkValue(render)) {//determine data to generate..[default or user]
                userRender();
            }
            else {
                defaultRender();
            }
        }
        return me.treenode;
        function userRender() {
            for (var i = 0; i < data.length; i++) {
                if (data[i][parent_id] == parentId) {
                    me.treenode += '<li id=' + data[i][id] + ' class="btnEvent jstree-open" title="' + data[i][name] + '">' + core.util.splitString(data[i][name], 30);
                    me.treenode += '<ul>';
                    me.recursive_treejs(obj, data[i][id]);
                    me.treenode += '</ul>';
                    me.treenode += '</li>';
                }
            }
        }
        function defaultRender() {
            for (var i = 0; i < data.length; i++) {
                if (data[i].QUANHECHA_ID == parentId) {
                    me.treenode += '<li id=' + data[i].ID + ' class="btnEvent jstree-open" title="' + data[i].TEN + '">' + core.util.splitString(data[i].TEN, 30);
                    me.treenode += '<ul>';
                    me.recursive_treejs(obj, data[i].ID);
                    me.treenode += '</ul>';
                    me.treenode += '</li>';
                }
            }
        }
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <List>Render data into <List>
    -- date: 02/06/2018
    */
    loadToList_data: function (obj) {
        var me = this;
        var data = obj.data;
        var renderInfor = obj.renderInfor;
        var id = renderInfor.id;
        var name = renderInfor.name;
        var amount = renderInfor.amount;
        var render_places = obj.renderPlaces;
        var place = "";
        var list_html = '';

        for (var p = 0; p < render_places.length; p++) {
            list_html = '';
            if (core.util.checkId(render_places[p])) {//determine where to generate.. [how many places to gen?]
                place = "#" + render_places[p];
                $(place).html("");
            }
            for (var i = 0; i < data.length; i++) {
                list_html += '<li class="list-group-item">' + (i + 1) + ". " + data[i][name] + '<span class="badge">' + (i + 1) + '</span></li>';
            }
            $(place).append(list_html);
        }
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Tab>
    -- date: 02/06/2018
    */
    loadToTab_data: function (obj) {
        var me = this;
        var data = obj.data;
        var renderInfor = obj.renderInfor;
        var id = renderInfor.id;
        var name = renderInfor.name;
        var renderPlace = obj.renderPlace;

        var tabhead_html = '';
        var tab_index = 0;
        var active_id = '';
        var active = "";
        if (core.util.checkId(renderPlace)) {
            var tabhead_id = '#' + renderPlace;
            $(tabhead_id).html("");
        }
        for (var i = 0; i < data.length; i++) {
            tab_index = (i + 1);
            if (i == 0) {
                active = 'active';
                active_id = data[i][id];
            } else {
                active = '';
            }
            tabhead_html += '<li class="' + active + '"><a href="#tab' + tab_index + '" data-toggle="tab" aria-expanded="false" id="' + data[i][id] + '">' + data[i][name] + '</a></li>';
        }

        $(tabhead_id).append(tabhead_html);
        return active_id;
    },
    switchTab: function (openTab_id) {
        var x = $('a[href="#' + openTab_id + '"]')[0].parentElement.parentElement;
        var arrli = x.getElementsByTagName('li');
        var arrId = [];
        for (var i = 0; i < arrli.length; i++) {
            arrId.push($(arrli[i].getElementsByTagName('a')[0]).attr('href').replace(/#/g, ""));
        }

        for (var i = 0; i < arrli.length; i++) {
            arrli[i].classList.remove("active");
        }

        for (var i = 0; i < arrId.length; i++) {
            document.getElementById(arrId[i]).classList.remove("active");
        }

        $('a[href="#' + openTab_id + '"]')[0].parentElement.classList.add("active");
        document.getElementById(openTab_id).classList.add("active");
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <popover>
    -- date: 02/06/2018
    */
    loadToPopover_data: function (obj) {
        //Usage
        //var objParam = {
        //    obj: obj,
        //    title: "",
        //    content: function(){ do html and then return html},
        //    event: 'hover',
        //    place: 'right',
        //}
        //core.system.loadToPopover_data(objParam);

        $(obj.obj).popover({
            title: obj.title,
            content: obj.content,
            trigger: obj.event,
            html: true,
            placement: obj.place,
        });
        $(obj.obj).popover('show');
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render progressBar
    -- date: 02/06/2018
    */
    getProgressBar: function (obj) {
        //--date    : 30/05/2018
        //--Object  : obj{title, items, renderPlace}
        var me = this;
        var html = '';
        var render_place = '';
        var tile = '';
        var items = '';
        var objNotify = {};
        //1. check renderPlace
        if (core.util.checkValue(obj.renderPlace)) {
            render_place = obj.renderPlace;
        }
        else {
            objNotify = {
                content: "Not found place to gen html - wrong id name!",
                type: "w"
            }
            me.alertOnModal(objNotify);
            return false;
        }
        if (!core.util.checkId(render_place)) {
            objNotify = {
                content: "Not found place to gen html- wrong id name!",
                type: "w"
            }
            me.alertOnModal(objNotify);
            return false;
        }
        //2. check title
        if (core.util.checkValue(obj.title)) {
            tile = obj.title;
        }
        else {
            tile = "Tổng số lượng";
        }
        //3. check title
        if (core.util.checkValue(obj.items)) {
            items = obj.items;
        }
        else {
            items = 'Chưa xác định!';
        }
        //4. gen html
        html += '<div class="box-body" style="padding: 1px 3px">';
        html += '<div class="box-body" style="padding-left:0px; padding-right:0px;">';
        html += '<div class="clearfix">';
        html += '<span class="pull-left">' + tile + ': <span id="items_' + render_place + '">' + items + '</span></span>';
        html += '<small id="percent_lable_' + render_place + '" class="pull-right" style="font-weight:bold; font-size:15px">0%</small>';
        html += '</div>';
        html += '<div class="progress progress-sm active" style="margin-bottom:0px;">';
        html += '<div id="percent_' + render_place + '" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        $("#" + render_place).html(html);
        //remove effect
        var $percent = "#percent_" + render_place;
        me.removeEffectProgressBar($percent);
    },
    updateProgressBar: function (obj) {
        //--date    : 30/05/2018
        //--Render  : percent_lable_, percent_, 
        //--Object  : obj{items, completed, renderPlace}
        var me = this;
        var render_place = '';
        var items = 0;
        var completed = 0;
        //1. check renderPlace
        if (core.util.checkValue(obj.renderPlace)) {
            render_place = obj.renderPlace;
        }
        else {
            objNotify = {
                content: "Not found place to gen html - wrong id name!",
                type: "w"
            }
            me.alertOnModal(objNotify);
            return false;
        }
        if (!core.util.checkId(render_place)) {
            objNotify = {
                content: "Not found place to gen html- wrong id name!",
                type: "w"
            }
            me.alertOnModal(objNotify);
            return false;
        }
        if (core.util.checkValue(obj.items)) {
            items = obj.items;
        }
        else {
            objNotify = {
                content: "Not indentify param_items!",
                type: "w"
            }
            me.alertOnModal(objNotify);
        }
        if (core.util.checkValue(obj.completed)) {
            completed = obj.completed;
        }
        else {
            objNotify = {
                content: "Not indentify param_completed!",
                type: "w"
            }
            me.alertOnModal(objNotify);
        }
        //2. get id - process
        var $percent_lable = "#percent_lable_" + render_place;
        var $percent = "#percent_" + render_place;
        var iPercent = ((completed / items) * 100).toFixed(2);
        //3. update percent
        $($percent_lable).html(iPercent + "%");
        $($percent).css("width", iPercent + "%");
        if (completed == items) {
            objNotify = {
                content: "Tiến trình chạy thành công!",
                type: "i"
            }
            me.alertOnModal(objNotify);
            $("#" + render_place).html('');
        }
        me.addEffectProgressBar($percent);
    },
    addEffectProgressBar: function ($percent) {
        $($percent).addClass("progress-bar-striped");
    },
    removeEffectProgressBar: function ($percent) {
        $($percent).removeClass("progress-bar-striped");
    },
    /*--------------------------------------
    Discri: Cache data (chrome - 4.0, ie - 8.0, firefox - 3.5, opera - 11.5)
    Author: nnthuong
    DateOf: 05/06/2018 
    */
    getCache_LocalStore: function (name, key) {
        //name  : name of the param localstorage, 
        //key   : value to compare and get data from db or cache? if key is null --> get all
        //obj   : {key: {}, data: [{}]}
        var obj;
        if (typeof Storage !== "undefined") {
            if (core.util.checkValue(localStorage.getItem(name))) {
                var dtCached = JSON.parse(localStorage.getItem(name));
                if (core.util.checkValue(key)) {//return by key
                    var strKey = '';
                    var dtData = '';
                    for (var i = 0; i < dtCached.length; i++) {
                        strKey = dtCached[i].key;
                        dtData = dtCached[i].data;
                        if (strKey == key) {
                            obj = dtData;
                        }
                    }
                }
                else {//return all
                    obj = dtCached;
                }
            }
            else {//cache not initial
                obj = [];
            }
        }
        else {// cache not support
            obj = [];
            alert("Bạn nên nâng cấp trình duyệt để được hỗ trợ tốt hơn!");
        }
        return obj;
    },
    setCache_LocalStore: function (name, dtCache) {
        if (typeof Storage !== "undefined") {
            //0. value is a arr obj: example --> [{key: "", data: [{"ID":"", "":""},{"ID":""}]}, {key: "", data: [{}, {}]}]
            //1. check name befor create a new name of param
            //2. update for the same key
            //3. create a new name of param
            localStorage.setItem(name, JSON.stringify(dtCache));
        }
        else {
            alert("Bạn nên nâng cấp trình duyệt để được hỗ trợ tốt hơn!");
        }
    },
    delCache_LocalStore: function (name) {
        localStorage.removeItem(name);
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render chartjs
    -- date: 02/06/2018
    */
    barChart: function (obj) {
        //Usage
        //var datasets = [
        //    {
        //        label: "Tổng",
        //        data: me.data_NhanSuTong,
        //        backgroundColor: '#eeff56'
        //    },
        //    {
        //        label: 'Tăng',
        //        data: me.data_NhanSuTang,
        //        backgroundColor: '#36a2eb'
        //    }
        //];
        //var labels = me.arr_month;
        //var objChart = {
        //    placement: "barChart",
        //    data: datasets,
        //    labels: labels,
        //    title: "BIỂU ĐỒ THỐNG KÊ TÀI CHÍNH THEO KHÓA "
        //}
        //core.system.barChart(objChart);

        var ctx = document.getElementById(obj.placement).getContext('2d');
        var config = {
            type: 'bar',
            data: {
                datasets: obj.data,
                labels: obj.labels
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: obj.title
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                if (parseInt(value) >= 1000) {
                                    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                } else {
                                    return '$' + value;
                                }
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        },
                    },
                }
            }
        };
        //create a new chart in the intefacce
        var myChart = new Chart(ctx, config);
    },
    lineChart: function (obj) {
        //Usage
        //var datasets = [
        //    {
        //        label: "Tieu de",
        //        data: me.data_SameAge
        //    }
        //];
        //var labels = me.data_UniqAge;
        //var obj = {
        //    placement: "areaChart_Tuoi",
        //    data: datasets,
        //    labels: labels,
        //    titletooltip: labels,
        //    title: "THỐNG KÊ THEO ĐỘ TUỔI"
        //}
        //core.system.lineChart(obj);


        var ctx = document.getElementById(obj.placement).getContext('2d');
        var config = {
            type: 'line',
            data: {
                newTitleTooltips: obj.titletooltip,
                labels: obj.labels,
                datasets: obj.data
            },
            options: {
                responsive: true,
                legend: {
                    display: true,
                    position: 'top',
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: obj.title
                },
                tooltips: {
                    mode: 'point',
                    callbacks: {
                        title: function (tooltipItems, data) {
                            var newtitle_tooltip = "";
                            tooltipItems.forEach(function (tooltipItem) {
                                newtitle_tooltip = data.newTitleTooltips[tooltipItem.index];
                            });
                            return newtitle_tooltip;
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };
        var myLineChart = new Chart(ctx, config);
    },
    doughnutChart: function (obj) {
        //-------------
        //- CHART -
        //-------------
        //var datasets = [
        //    {
        //        data: [me.iGioiTinhNam, me.iGioiTinhNu],
        //        backgroundColor: ['#eeff56', '#36a2eb']
        //    }
        //];
        //var objChart = {
        //    placement: "pieChart_GioiTinh",
        //    data: datasets,
        //    title: "THỐNG KÊ TỶ LỆ GIỚI TÍNH",
        //    labels: ["Nam", "Nữ"],
        //    type: "pie" //pie or dougnut
        //}
        //core.system.doughnutChart(objChart);

        if (!core.util.checkValue(obj.labels)) {
            obj.labels = [];
        }
        if (!core.util.checkValue(obj.type)) {
            obj.type = "doughnut"
        }

        var ctx = document.getElementById(obj.placement).getContext('2d');
        var config = {
            type: obj.type,
            data: {
                datasets: obj.data,
                labels: obj.labels
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: obj.title
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };
        var myPieChart = new Chart(ctx, config);
    },
    /*
     **************************************************************************
     ********* orde: [3] ******************************************************
     ********* name: KHOI HAM TRUY VAN DU LIEU DB *****************************
     ********* disc: **********************************************************
     **************************************************************************
     */
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 22/05/2018
    --Discription: [1] HangDoi from db (1 HangDoi <==> 1 Task)
    ----------------------------------------------*/
    getList_HangDoi: function (obj, resolve, reject, callback) {
        var me = this;
        var strLoaiNhiemVu_Id = obj.strLoaiNhiemVu;
        var strNguoiThucHien_Id = me.userId;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 1000;

        me.beginLoading();
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (core.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                        else {
                            me.taskControl(dtResult);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve(dtResult);
                        }
                        else if (typeof callback === "function") {
                            callback(dtResult);
                        }
                        else {
                            me.taskControl(dtResult);
                        }
                    }
                }
                else {
                    me.endLoading();
                    me.alert("CMS_HangDoiTuTao.LayDanhSachHangDoi: " + JSON.stringify(data.Message), "w");
                }
                me.endLoading();
            },
            error: function (er) {
                me.endLoading();
                me.alert("CMS_HangDoiTuTao.LayDanhSachHangDoi (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CMS_HangDoiTuTao/LayDanhSachHangDoi',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: {
                'strLoaiNhiemVu_Id': strLoaiNhiemVu_Id,
                'strNguoiThucHien_Id': strNguoiThucHien_Id,
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_HangDoi: function (obj, resolve, reject, callback) {
        var me = this;
        var strId = obj.strHangDoi_Id;

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var objRespond = {
                        id: "",
                        iTongDuLieuDaHoanThanh: 0,
                        iTongDuLieuCanThucHien: 0,
                    };
                    if (core.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        //create objRespond
                        objRespond.id = obj.strHangDoi_Id;
                        objRespond.iTongDuLieuDaHoanThanh = dtResult[0].TONGDULIEUDAHOANTHANH;
                        objRespond.iTongDuLieuCanThucHien = dtResult[0].TONGDULIEUCANTHUCHIEN;
                        //
                        console.log("objRespond_Queue: " + objRespond);
                        if (typeof resolve === "function") {
                            resolve(objRespond);
                            //me.updateStatus_Task(obj);
                            //me.getList_XuLyNhiemVu(strHangDoi_Id);
                        }
                        else if (typeof callback === "function") {
                            callback(objRespond, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve(objRespond);
                        }
                        else if (typeof callback === "function") {
                            callback(objRespond);
                        }
                    }
                }
                else {
                    me.endLoading();
                    me.alert("CMS_HangDoiTuTao.LayChiTietHangDoi: " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CMS_HangDoiTuTao.LayChiTietHangDoi (er): " + JSON.stringify(er), "w");
                reject();
            },
            type: 'GET',
            action: 'CMS_HangDoiTuTao/LayChiTietHangDoi',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: {
                'strId': strId
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_XuLyNhiemVu: function (obj, resolve, reject, callback) {
        var me = this;
        var iTinhTrang = 0;
        var strHangDoi_Id = obj.strHangDoi_Id;
        var strNguoiThucHien_Id = me.userId;
        var strTuKhoa = obj.strTuKhoa;
        var pageIndex = obj.pageIndex;
        var pageSize = obj.pageSize;

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        if (typeof resolve === "function") {
                            resolve(dtResult);
                            //me.save_XuLyNhiemVu(dtResult, strHangDoi_Id);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve(dtResult);
                        }
                        else if (typeof callback === "function") {
                            callback(dtResult);
                        }
                    }
                }
                else {
                    me.endLoading();
                    me.alert("CMS_HangDoiTuTao.LayDanhSachXuLyNhiemVu: " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CMS_HangDoiTuTao.LayDanhSachXuLyNhiemVu (er): " + JSON.stringify(er), "w");
                reject();
            },
            type: 'GET',
            action: 'CMS_HangDoiTuTao/LayDanhSachXuLyNhiemVu',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: {
                'iTinhTrang': iTinhTrang,
                'strHangDoi_Id': strHangDoi_Id,
                'strNguoiThucHien_Id': strNguoiThucHien_Id,
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_XuLyNhiemVu: function (obj, resolve, reject, callback) {
        var me = this;
        //data, strHangHoi_Id
        var strNguoiThucHien_Id = me.userId;
        var strNhiemVu_Id = obj.strNhiemVu_Id;
        var $task_percent = "#task_percent" + obj.strHangDoi_Id;
        //for(obj.data){
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        if (typeof resolve === "function") {
                            resolve(dtResult);
                            //me.getDetail_HangDoi(strHangDoi_Id); --> loop
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve(dtResult);
                        }
                        else if (typeof callback === "function") {
                            callback(dtResult);
                        }
                    }

                }
                else {
                    me.endLoading();
                    me.alert("CMS_HangDoiTuTao.XuLyNhiemVu: " + JSON.stringify(data.Message), "w");
                    //me.removeEffect_Task($task_percent);
                }
            },
            error: function (er) {
                me.endLoading();
                me.removeEffect_Task($task_percent);
                var statusText = er.statusText;
                if (statusText == "abort") {
                    me.alert("Tiến trình xử lý nhiệm vụ đã dừng hoạt động!");
                }
                else {
                    me.alert("CMS_HangDoiTuTao.XuLyNhiemVu (er): " + JSON.stringify(er), "w");
                }
                reject();
                return false;
            },
            type: 'GET',
            action: 'CMS_HangDoiTuTao/XuLyNhiemVu',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: {
                'strNguoiThucHien_Id': strNguoiThucHien_Id,
                'strId': strNhiemVu_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
        //}
    },
    /*
    -- author: nnthuong
    -- discription: [ThoiGianDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_ThoiGianDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strNam_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //core.system.getList_ThoiGianDaoTao(obj, resolve, reject, callback);

        var strDAOTAO_Nam_Id = core.util.returnEmpty(obj.strNam_Id);
        var strNguoiThucHien_Id = core.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);


        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDanhSach_ThoiGianDaoTao',
            'versionAPI': 'v1.0',

            'strDAOTAO_Nam_Id': strDAOTAO_Nam_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.beginLoading();
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.endLoading();
                    me.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao: " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [HeDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_HeDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strHinhThucDaoTao_Id: "",
        //    strBacDaoTao_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //core.system.getList_HeDaoTao(obj, resolve, reject, callback);

        var strDAOTAO_HinhThucDaoTao_Id = core.util.returnEmpty(obj.strHinhThucDaoTao_Id);
        var strDaoTao_BacDaoTao_Id = core.util.returnEmpty(obj.strBacDaoTao_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);


        var obj_list = {
            'action': 'CM_HeDaoTao/LayDanhSach',
            'versionAPI': 'v1.0',

            'strDAOTAO_HinhThucDaoTao_Id': strDAOTAO_HinhThucDaoTao_Id,
            'strDaoTao_BacDaoTao_Id': strDaoTao_BacDaoTao_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_HeDaoTao.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                    return false;
                }
            },
            error: function (er) {
                me.alert("CM_HeDaoTao.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
                return false;
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [KhoaDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_KhoaDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strHeDaoTao_Id: "",
        //    strCoSoDaoTao_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //core.system.getList_KhoaDaoTao(obj, resolve, reject, callback);

        var strDAOTAO_HeDaoTao_Id = core.util.returnEmpty(obj.strHeDaoTao_Id);
        var strDaoTao_CoSoDaoTao_Id = core.util.returnEmpty(obj.strCoSoDaoTao_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);

        var obj_list = {
            'action': 'CM_KhoaDaoTao/LayDanhSach',
            'versionAPI': 'v1.0',

            'strDAOTAO_HeDaoTao_Id': strDAOTAO_HeDaoTao_Id,
            'strDaoTao_CoSoDaoTao_Id': strDaoTao_CoSoDaoTao_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_KhoaDaoTao.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_KhoaDaoTao.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [ChuongTrinhDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_ChuongTrinhDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strKhoaDaoTao_Id: "",
        //    strN_CN_LOP_Id: "",
        //    strKhoaQuanLy_Id: "",
        //    strToChucCT_Cha_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 10000,
        //};
        //core.system.getList_ChuongTrinhDaoTao(obj, resolve, reject, callback);
        //---------------------------------------------------------------------
        var strDAOTAO_KhoaDaoTao_Id = core.util.returnEmpty(obj.strKhoaDaoTao_Id);
        var strDaoTao_N_CN_LOP_Id = core.util.returnEmpty(obj.strN_CN_LOP_Id);
        var strDaoTao_KhoaQuanLy_Id = core.util.returnEmpty(obj.strKhoaQuanLy_Id);
        var strDaoTao_ToChucCT_Cha_Id = core.util.returnEmpty(obj.strToChucCT_Cha_Id);
        var strNguoiThucHien_Id = core.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);

        var obj_list = {
            'action': 'CM_ChuongTrinhDaoTao/LayDanhSach',
            'versionAPI': 'v1.0',
            'strDAOTAO_KhoaDaoTao_Id': strDAOTAO_KhoaDaoTao_Id,
            'strDaoTao_N_CN_LOP_Id': strDaoTao_N_CN_LOP_Id,
            'strDaoTao_KhoaQuanLy_Id': strDaoTao_KhoaQuanLy_Id,
            'strDaoTao_ToChucCT_Cha_Id': strDaoTao_ToChucCT_Cha_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_ChuongTrinhDaoTao.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_ChuongTrinhDaoTao.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [NganhDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_NganhDaoTao: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [CoSoDaoTao] Get data from db 
    -- date: 14/08/2018
    */
    getList_CoSoDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //core.system.getList_CoSoDaoTao(obj, resolve, reject, callback);
        //---------------------------------------------------------------------

        var strNguoiThucHien_Id = core.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);

        var obj_list = {
            'action': 'CM_CoSoDaoTao/LayDanhSach',
            'versionAPI': 'v1.0',

            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_CoSoDaoTao.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_CoSoDaoTao.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [LopQuanLy] Get data from db 
    -- date: 30/07/2018
    */
    getList_LopQuanLy: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strCoSoDaoTao_Id: "",
        //    strKhoaDaoTao_Id: "",
        //    strNganh_Id: "",
        //    strLoaiLop_Id: "",
        //    strToChucCT_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //core.system.getList_LopQuanLy(obj, resolve, reject, callback);
        //---------------------------------------------------------------------

        var strDaoTao_CoSoDaoTao_Id = core.util.returnEmpty(obj.strCoSoDaoTao_Id);
        var strDaoTao_KhoaDaoTao_Id = core.util.returnEmpty(obj.strKhoaDaoTao_Id);
        var strDaoTao_Nganh_Id = core.util.returnEmpty(obj.strNganh_Id);
        var strDaoTao_LoaiLop_Id = core.util.returnEmpty(obj.strLoaiLop_Id);
        var strDaoTao_ToChucCT_Id = core.util.returnEmpty(obj.strToChucCT_Id);
        var strNguoiThucHien_Id = core.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);

        var obj_list = {
            'action': 'CM_LopQuanLy/LayDanhSach',
            'versionAPI': 'v1.0',

            'strDaoTao_CoSoDaoTao_Id': strDaoTao_CoSoDaoTao_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strDaoTao_Nganh_Id': strDaoTao_Nganh_Id,
            'strDaoTao_LoaiLop_Id': strDaoTao_LoaiLop_Id,
            'strDaoTao_ToChucCT_Id': strDaoTao_ToChucCT_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_LopQuanLy.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_LopQuanLy.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [LopQuanLy] Get data from db 
    -- date: 30/07/2018
    */
    getList_LopHocPhan: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strCoSoDaoTao_Id: "",
        //    strKhoaDaoTao_Id:"",
        //    strThoiGianDaoTao_Id:"",
        //    strHocPhan_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //core.system.getList_LopHocPhan(obj, resolve, reject, callback);
        //---------------------------------------------------------------------

        var strCoSoDaoTao_Id = core.util.returnEmpty(obj.strCoSoDaoTao_Id);
        var strKhoaDaoTao_Id = core.util.returnEmpty(obj.strKhoaDaoTao_Id);
        var strThoiGianDaoTao_Id = core.util.returnEmpty(obj.strThoiGianDaoTao_Id);
        var strHocPhan_Id = core.util.returnEmpty(obj.strHocPhan_Id);
        var strNguoiThucHien_Id = core.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);

        var obj_list = {
            'action': 'CM_LopHocPhan/LayDanhSach',
            'versionAPI': 'v1.0',

            'strDaoTao_CoSoDaoTao_Id': strCoSoDaoTao_Id,
            'strDaoTao_KhoaDaoTao_Id': strKhoaDaoTao_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTao_Id,
            'strDaoTao_HocPhan_Id': strHocPhan_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_HocPhan.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_HocPhan.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [LopQuanLy] Get data from db 
    -- date: 30/07/2018
    */
    getList_HocPhan: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strChuongTrinh_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //core.system.getList_HocPhan(obj, resolve, reject, callback);
        //---------------------------------------------------------------------

        var strChuongTrinh_Id = core.util.returnEmpty(obj.strChuongTrinh_Id);
        var strNguoiThucHien_Id = core.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);

        var obj_list = {
            'action': 'CM_HocPhan/LayDanhSach',
            'versionAPI': 'v1.0',

            'strDaoTao_ChuongTrinh_Id': strChuongTrinh_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_HocPhan.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_HocPhan.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [CoCauToChuc] Get data from db 
    -- date: 30/07/2018
    */
    getList_CoCauToChuc: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strCCTC_Loai_Id: "",
        //    strCCTC_Cha_Id:"",
        //    iTrangThai:1
        //};
        //core.system.getList_CoCauToChuc(obj, resolve, reject, callback);

        var strCCTC_Loai_Id = obj.strCCTC_Loai_Id;
        var strCCTC_Cha_Id = obj.strCCTC_Cha_Id;
        var iTrangThai = obj.iTrangThai;

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_CoCauToChuc.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_CoCauToChuc.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CM_CoCauToChuc/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: {
                'strLoaiCoCauToChuc_Id': strCCTC_Loai_Id,
                'strCoCauToChucCha_Id': strCCTC_Cha_Id,
                'iTrangThai': iTrangThai
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [DanhMuc] Get data from db 
    -- date: 30/07/2018
    */
    getList_DanhMucDulieu: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strMaBangDanhMuc: "",
        //    strTenCotSapXep:"",
        //    iTrangThai:1
        //};
        //core.system.getList_DanhMucDulieu(obj, resolve, reject, callback);

        var strMaBangDanhMuc = obj.strMaBangDanhMuc;
        var strTenCotSapXep = obj.strTenCotSapXep;
        var iTrangThai = obj.iTrangThai;

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_DuLieuDanhMuc.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DuLieuDanhMuc.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CM_DanhMucDuLieu/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: true,
            authen: false,
            data: {
                'strMaBangDanhMuc': strMaBangDanhMuc,
                'strTenCotSapXep': strTenCotSapXep,
                'iTrangThai': iTrangThai
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [DanhMuc] Get data from db 
    -- date: 30/07/2018
    */
    getList_DMDL_Cap1: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strMaBangDanhMuc: "",
        //    strTenCotSapXep:""
        //};
        //core.system.getList_DMDL_Cap1(obj, resolve, reject, callback);

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_DuLieuDanhMuc.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DuLieuDanhMuc.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CM_DanhMucDuLieu/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: true,
            authen: false,
            data: {
                'strMaBangDanhMuc': obj.strMaBangDanhMuc,
                'strTenCotSapXep': obj.strTenCotSapXep
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [DanhMuc] Get data from db 
    -- date: 30/07/2018
    */
    getList_DMDL_TheoCha: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strCha_Id: "",
        //    strTuKhoa:"",
        //    strDanhMucTenBang_Id:"",
        //    strTenCotSapXep:"",
        //    pageIndex:1,
        //    pageSize:10000
        //};
        //core.system.getList_DMDL_TheoCha(obj, resolve, reject, callback);

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_DuLieuDanhMuc.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DuLieuDanhMuc.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CM_DanhMucDuLieu/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: false,
            authen: true,
            data: {
                'strCha_Id': obj.strCha_Id,
                'strTuKhoa': obj.strTuKhoa,
                'strDanhMucTenBang_Id': obj.strDanhMucTenBang_Id,
                'strTenCotSapXep': obj.strTenCotSapXep,
                'pageIndex': obj.pageIndex,
                'pageSize': obj.pageSize,
                'iTrangThai':1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [HocVien] Get data from db 
    -- date: 30/07/2018
    */
    getList_HocVien: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [NghienCuuSinh] Get data from db 
    -- date: 30/07/2018
    */
    getList_NghienCuuSinh: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [NguoiDung] Get data from db 
    -- date: 30/07/2018
    */
    getList_NguoiDung: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000
        //};
        //core.system.getList_NguoiDung(obj, resolve, reject, callback);

        var iTrangThai = 1;//get user active
        var strNguoiThucHien_Id = core.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);

        var obj_list = {
            'action': 'CM_NguoiDung/LayDanhSach',
            'versionAPI': 'v1.0',

            'iTrangThai': iTrangThai,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_NguoiDung.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_NguoiDung.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [NhaKhoaHoc] Get data from db 
    -- date: 30/07/2018
    */
    getList_NhaKhoaHoc: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [NhanSu] Get data from db 
    -- date: 30/07/2018
    */
    getList_NhanSu: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //    strCoCauToChuc_Id: "",
        //    strNguoiThucHien_Id:""
        //};
        //core.system.getList_NhanSu(obj, resolve, reject, callback);

        var strTuKhoa = obj.strTuKhoa;
        var pageIndex = obj.pageIndex;
        var pageSize = obj.pageSize;
        var strCoCauToChuc_Id = obj.strCoCauToChuc_Id;
        var strNguoiThucHien_Id = obj.strNguoiThucHien_Id;

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("NS_HoSoV2.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("NS_HoSoV2.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'NS_HoSoV2/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: {
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize,
                'strDaoTao_CoCauToChuc_Id': strCoCauToChuc_Id,
                'strNguoiThucHien_Id': strNguoiThucHien_Id
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [Notify] Get data from db 
    -- date: 30/07/2018
    */
    getList_Notify: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [Queue] Get data from db 
    -- date: 30/07/2018
    */
    getList_Queue: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [SinhVien] Get data from db 
    -- date: 30/07/2018
    */
    getList_SinhVien: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strHeDaoTao_Id: "",
        //    strKhoaDaoTao_Id: "",
        //    strChuongTrinh_Id: "",
        //    strLopQuanLy_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 1000000
        //};
        //core.system.getList_SinhVien(obj, resolve, reject, callback);

        var strHeDaoTao_Id = core.util.returnEmpty(obj.strHeDaoTao_Id);
        var strKhoaDaoTao_Id = core.util.returnEmpty(obj.strKhoaDaoTao_Id);
        var strChuongTrinh_Id = core.util.returnEmpty(obj.strChuongTrinh_Id);
        var strLopQuanLy_Id = core.util.returnEmpty(obj.strLopQuanLy_Id);
        var strTuKhoa = core.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = core.util.returnZero(obj.pageIndex);
        var pageSize = core.util.returnZero(obj.pageSize);

        var obj_list = {
            'action': 'CM_SinhVien/LayDanhSach',
            'versionAPI': 'v1.0',

            'strHeDaoTao_Id': strHeDaoTao_Id,
            'strKhoaDaoTao_Id': strKhoaDaoTao_Id,
            'strChuongTrinh_Id': strChuongTrinh_Id,
            'strLopQuanLy_Id': strLopQuanLy_Id,
            'strNguoiThucHien_Id': me.userId,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (core.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_SinhVien.LayDanhSach: " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_SinhVien.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [VaiTro] Get data from db 
    -- date: 30/07/2018
    */
    getList_VaiTro: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [UNGDUNG] Get data from db 
    -- date: 02/06/2018
    */
    getListByUser_UngDung: function () {
        var me = this;
        var strNgonNgu_Id = me.langId;
        var strNguoiDung_Id = me.userId;

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var jsonResult = $.parseJSON(mystring);
                    var app_list = '';
                    $("#app_list").html('');
                    if (core.util.checkValue(jsonResult)) {
                        for (var j = 0; j < jsonResult.length; j++) {
                            var strTenUngDung = jsonResult[j].TENUNGDUNG;
                            var strUrlSSO = me.rootPath + "/Redirect.aspx?url=" + jsonResult[j].DUONGDANTRUYCAPSSO + "&appId=" + jsonResult[j].ID;
                            var strIcon = jsonResult[j].TENANH;
                            var strMaUngDung = jsonResult[j].MAUNGDUNG;
                            app_list += '<div style="width:28%;height:80px;float:left; margin-right:2%; text-align:center">';
                            app_list += "<a title='" + strTenUngDung + "' href='" + strUrlSSO + "' style='width:100%; height:80px;'><i class='" + strIcon + " fa-2x user-icon-board'></i>";
                            app_list += "<br /><span class='board-title'>" + strMaUngDung + "</span>";
                            app_list += '</a>';
                            app_list += '</div>';
                        }
                    }
                    else {
                        app_list += '<div style="text-align:center">';
                        app_list += "<span>Không tìm thấy ứng dụng!</span>"
                        app_list += '</div>';
                    }
                    $("#app_list").html(app_list);//Fill to app list
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: 'GET',
            action: 'CM_HeThong/getListByUser_UngDung',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: {
                'strNguoiDung_Id': strNguoiDung_Id,
                'strNgonNgu_Id': strNgonNgu_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [CHUCNANG] Get data from db 
    -- date: 02/06/2018
    */
    getlistByUser_ChucNang: function () {
        var me = this;

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (core.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtChucNang = dtResult;
                    me.genHTML_MenuVertical(dtResult);
                }
                else {
                    me.alert("CM_ChucNang/LayDanhSach: " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                me.alert("CM_ChucNang/LayDanhSach: " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CM_ChucNang/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: {
                'strNguoiDung_Id'   : me.userId,
                'strNgonNgu_Id'     : me.langId,
                'strUngDung_Id'     : me.appId
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [NGONNGU] Get data from db 
    -- date: 02/06/2018
    */
    getList_NgonNgu: function () {
        var me = this;
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var jsonLang = $.parseJSON(mystring);
                    if (jsonLang != null && jsonLang != "") {
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
            },
            error: function (er) { me.endLoading(); },
            type: 'GET',
            action: 'CM_HeThong/ThietLapNgonNgu',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: {
                'strNgonNgu_Id': me.langId
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [DANHMUC] Get data from db and load to COMBO
    -- date: 02/06/2018
    */
    loadToCombo_DanhMucDuLieu: function (strCode, zone_id, type, callback) {
        //--------------------------Usage------------------------------------
        //core.system.loadToCombo_DanhMucDuLieu(strCode, zone_id, type);

        var me = this;
        if (!core.util.checkValue(type)) {
            type = "";
        }
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var jsonResult = data.Data;
                    if (core.util.checkValue(jsonResult)) {
                        //zone_id 
                        var zoneId = zone_id.split(",");
                        //call
                        var obj = {
                            data: jsonResult,
                            renderPlace: zoneId,
                            type: type
                        };
                        me.loadToCombo_data(obj);
                    }
                    if (typeof callback === "function") {
                        callback();
                    }
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CM_DanhMucDuLieu/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: true,
            authen: false,
            data: {
                'strMaBangDanhMuc': strCode,
                'strTenCotSapXep': "",
                'iTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DMDL_Cap1: function (strCode, zone_id, type) {
        //--------------------------Usage------------------------------------
        //core.system.genCombo_DMDL_Cap1(strCode, zone_id, type);
        var me = this;
        if (!core.util.checkValue(type)) {
            type = "";
        }
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var jsonResult = data.Data;
                    if (core.util.checkValue(jsonResult)) {
                        //zone_id 
                        var zoneId = zone_id.split(",");
                        //call
                        var obj = {
                            data: jsonResult,
                            renderPlace: zoneId,
                            type: type
                        };
                        me.loadToCombo_data(obj);
                    }
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CM_DanhMucDuLieu/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: true,
            authen: false,
            data: {
                'strMaBangDanhMuc': strCode,
                'strTenCotSapXep': ""
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DMDL_TheoCha: function (strCode, strCha_Id, zone_id, type) {
        //--------------------------Usage------------------------------------
        //core.system.genCombo_DMDL_TheoCha(strCode, strCha_Id, zone_id, type);
        var me = this;
        if (!core.util.checkValue(type)) {
            type = "";
        }
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var jsonResult = data.Data;
                    if (core.util.checkValue(jsonResult)) {
                        //zone_id 
                        var zoneId = zone_id.split(",");
                        //call
                        var obj = {
                            data: jsonResult,
                            renderPlace: zoneId,
                            type: type
                        };
                        me.loadToCombo_data(obj);
                    }
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CM_DanhMucDuLieu/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: true,
            authen: false,
            data: {
                'strCha_Id': strCha_Id,
                'strTuKhoa': "",
                'strDanhMucTenBang_Id': strCode,
                'strTenCotSapXep': "",
                'pageIndex': 1,
                'pageSize': 100000,
                'iTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    setItemDefault_DanhMuc: function (strMaBangDanhMuc, zone_id, strMaDuLieu) {
        var me = this;
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var jsonResult = $.parseJSON(mystring);
                    if (core.util.checkValue(jsonResult)) {
                        var mlen = jsonResult.length;
                        var tbCombo = $('[id$=' + zone_id + ']');
                        var id = jsonResult[0].ID;
                        tbCombo.val(id).trigger("change");
                    }
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: 'GET',
            action: 'CM_HeThong/setItemDefault_DanhMucDuLieu',
            versionAPI: 'v1.0',
            contentType: true,
            authen: false,
            data: {
                'strMaBangDanhMuc': strMaBangDanhMuc,
                'strMaDuLieu': strMaDuLieu
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DLDM_Cache: function (strDanhMuc_Ma) {
        var me = this;
        var strMaBangDanhMuc = strDanhMuc_Ma;
        if (!core.util.objEqualVal(me.dataCache, "key", strDanhMuc_Ma)) {//still not cache yet
            me.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var dtResult = [];
                        var obj = {};
                        if (core.util.checkValue(data.Data)) {
                            dtResult = data.Data;
                            obj = {
                                key: strDanhMuc_Ma,
                                data: dtResult
                            };
                            //1. push current data
                            me.dataCache.push(obj);
                            //2. cache
                            me.setCache_LocalStore("dataCache", me.dataCache);
                        }
                    }
                    else {
                        console.log(data.Message);
                    }
                },
                error: function (er) {
                    me.endLoading();
                },
                type: 'GET',
                action: 'CM_DanhMucDuLieu/LayDanhSach',
                versionAPI: 'v1.0',
                contentType: true,
                async: false,
                authen: false,
                data: {
                    'strMaBangDanhMuc': strMaBangDanhMuc,
                    'strTenCotSapXep': "",
                    'iTrangThai': 1
                },
                fakedb: [

                ]
            }, false, false, false, null);
        }
        else {//already cached
            console.log("exist in dtCache");
        }
    },
    /*
    -- author: nnthuong
    -- discription: [DANHMUC] Get data from db and load to RADIO
    -- date: 24/11/2018
    */
    loadToRadio_DanhMucDuLieu: function (obj) {
        var me = this;
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var dtResult = $.parseJSON(mystring);
                    if (core.util.checkValue(dtResult)) {
                        //load to radio
                        var objParam = {
                            data: dtResult,
                            renderPlace: obj.renderPlace,
                            name: obj.nameRadio,
                            title: obj.title
                        }
                        me.loadToRadio_data(objParam);
                    }
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + obj.code + ": " + JSON.stringify(data.Message), "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + obj.code + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CM_DanhMucDuLieu/LayDanhSach',
            versionAPI: 'v1.0',
            contentType: true,
            authen: false,
            data: {
                'strMaBangDanhMuc': obj.code,
                'strTenCotSapXep': "",
                'iTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
     **************************************************************************
     ********* orde: [4]*******************************************************
     ********* name: GEN HTML *************************************************
     ********* disc: **********************************************************
     **************************************************************************
     */
    /*
    -- author: nnthuong
    -- discription: modal
    -- date: 02/06/2018
    */
    updateModal: function (obj, objHTML) {
        var selected_id = obj.id;
        objHTML.tl_update = '<i class="fa fa-pencil color-active"></i> Cập nhật dữ liệu';
        if (selected_id == "" || selected_id == null || selected_id == undefined) {
            selected_id = "";
            return selected_id;
        }
        else {
            $("#myModalLabel").html(objHTML.tl_update);
            var btn_Id = "#" + objHTML.btn_save_id;
            $(btn_Id).html('<i class="fa fa-ellipsis-h"></i> Cập nhật');
            return selected_id;
        }
    },
    copyModal: function (objHTML) {
        objHTML.tl_copy = "<i class='fa fa-clipboard color-active'></i> Sao chép dữ liệu";
        var btn_Id = "#" + objHTML.btn_save_id;
        $("#myModalLabel").html(objHTML.tl_copy);
        $(btn_Id).html('<i class="fa fa-clipboard"></i> ' + objHTML.btn_save_tl);
    },
    createModal: function (objHTML) {
        objHTML.tl_addnew = "<i class='fa fa-pencil color-active'></i> Thêm mới dữ liệu";
        var btn_Id = "#" + objHTML.btn_save_id;
        $("#myModalLabel").html(objHTML.tl_addnew);
        $(btn_Id).html('<i class="fa fa-pencil"></i> ' + objHTML.btn_save_tl);
    },
    /*
    -- author: nnthuong
    -- discription: Notify, Alert, Confirm
    -- date: 02/06/2018
    */
    alert: function (content, code) {
        var me = this;
        var alert = "";
        var title = "";
        main();
        function main() {
            switch (code) {
                case "w":
                    title = '<i class="fa fa-exclamation-triangle fa-notify fa-warning"> ' + core.constant.getting("LABLE", "CODE_W") + '</i>';
                    genBox_Alert();
                    break;
                case "h":
                    title = '<i class="fa fa-question-circle fa-notify fa-help"> ' + core.constant.getting("LABLE", "CODE_H") + '</i>';
                    genBox_Alert();
                    break;
                default:
                    title = '<i class="fa fa-info-circle fa-default"> ' + core.constant.getting("LABLE", "CODE_I") + '</i>';
                    genBox_Alert();
                    break;
            }
        }
        function genBox_Alert() {
            if (!me.flag_alert) {

                alert += '<div id="myModalAlert" class="modal fade modal-alert" role="dialog" style=""><div class="modal-dialog">';
                alert += '<div class="modal-content"><div class="modal-header">';
                alert += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
                alert += '<h4 class="modal-title">' + title + '</h4>';
                alert += ' </div>';
                alert += '<div class="modal-body" id="alert_content">';
                alert += '</div>';
                alert += '<div class="modal-footer">';
                alert += '<button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle"></i> ' + core.constant.getting("BUTTON", "CLOSE") + '</button>';
                alert += '</div>';
                alert += '</div>';

                $("#alert").html(alert);
                $('#alert>#myModalAlert').modal('show');
                genContent_Alert();
                me.flag_alert = true;
            }
            else {
                genContent_Alert();
            }
        }
        function genContent_Alert() {
            $('#myModalAlert #alert_content').append('<p>' + content + '</p>');
        };
        $('#myModalAlert').on('hidden.bs.modal', function () {
            $("#alert").html("");
            me.flag_alert = false;
        })
    },
    confirm: function (content, code) {
        $(".wrapper>#alert").html('');
        var confirm = "";
        var title = "";
        switch (code) {
            case "w":
                title = '<i class="fa fa-exclamation-triangle fa-notify fa-warning"> ' + core.constant.getting("LABLE", "CODE_W") + '</i>';
                break;
            case "h":
                title = '<i class="fa fa-question-circle fa-help"> ' + core.constant.getting("LABLE", "CODE_H") + '</i>';
                break;
            case "q":
                title = '<i class="fa fa-question-circle fa-default"> ' + core.constant.getting("LABLE", "CODE_Q") + '</i>';
                break;
            default:
                title = '<i class="fa fa-info-circle fa-default"> ' + core.constant.getting("LABLE", "CODE_I") + '</i>';
                break;
        }
        genBox_Alert();
        function genBox_Alert() {

            confirm += '<div id="myModalAlert" class="modal fade modal-confirm" role="dialog"><div class="modal-dialog">';
            confirm += '<div class="modal-content"><div class="modal-header">';
            confirm += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
            confirm += '<h4 class="modal-title" id="lblConfirmTitle">' + title + '</h4>';
            confirm += ' </div>';
            confirm += '<div class="modal-body">';
            confirm += '<p id="lblConfirmContent">' + content + '</p>';
            confirm += '</div>';
            confirm += '<div class="modal-footer">';
            confirm += '<button type="button" class="btn btn-primary" id="btnYes"><i class="fa fa-check-circle"></i> ' + core.constant.getting("BUTTON", "YES") + '</button>';
            confirm += '<button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle"></i> ' + core.constant.getting("BUTTON", "CLOSE") + '</button>';
            confirm += '</div>';
            confirm += '</div>';
        }
        $(".wrapper>#alert").html(confirm);
        $('.wrapper>#alert>#myModalAlert').modal('show');
        return;
    },
    afterComfirm: function (objHTML) {
        var me = this;
        var title = objHTML.title;
        var content = objHTML.content;
        var code = objHTML.code;
        //default notify delete data successfull
        if (core.util.checkValue(title)) {
            title = title;
        }
        else {
            title = core.constant.getting("LABLE", "CODE_I");
        }
        if (core.util.checkValue(content)) {
            content = content;
        }
        else {
            content = core.constant.getting("NOTIFY", "DELETE_S");
        }
        if (!core.util.checkValue(code)) {
            title = "<i class='fa  fa-info-circle fa-default'> " + title + "</i>";
        }
        else {
            //optionals w-warning, h-help, default: info..
            switch (code) {
                case "w":
                    title = "<i class='fa fa-exclamation-triangle fa-notify fa-warning'> " + title + "</i>";
                    break;
                case "h":
                    title = "<i class='fa fa-question-circle fa-notify fa-help'> " + title + "</i>";
                    break;
                default:
                    title = "<i class='fa fa-info-circle fa-default'> " + title + "</i>";
            }
        }

        $("#lblConfirmTitle").html(title);
        $("#lblConfirmContent").html(content);
        $("#btnYes").hide();
    },
    alertOnModal: function (obj) {

        $("#btnNotifyModal").remove();
        //select type
        switch (obj.type) {
            case "s":
                obj.type = "alert-success";
                break;
            case "i":
                obj.type = "alert-info";
                break;
            case "w":
                obj.type = "alert-warning";
                break;
            default:
                obj.type = "";
        }
        //title default
        if (obj.title == "" || obj.title == undefined || obj.title == null) {
            obj.title = "Thông báo";
        }
        //notifyZone default
        if (obj.prePos == "" || obj.prePos == undefined || obj.prePos == null) {
            obj.prePos = "#notify";
        }
        //gen html
        var html = "<div id='btnNotifyModal' class='alert " + obj.type + " alert-dismissible' style='text-align:center;'>" +
                    "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                    "<strong><span style='font-size:16px;'>" + obj.title + ": " + obj.content + "</span></strong>" +
                "</div>";
        $(obj.prePos).append(html);
        $(obj.prePos).slideDown("slow");
        setTimeout(function () {
            $(obj.prePos).append("");
            $(obj.prePos).slideUp("slow");
        }, 2500);
        /*colorCode: - 'alert-danger' - 'alert-dismissible' - 'alert-info' - 'alert-link' - 'alert-success'- 'alert-warning' */
    },
    alertTimer: function (obj) {
        var me = this;
        var html = "";
        var title = "";
        var content = "";
        var time = "";
        //check exist
        if (core.util.checkValue(obj.title)) {
            title = obj.title;
        }
        else {
            title = core.constant.getting("LABLE", "CODE_I");
        }
        if (core.util.checkValue(obj.content)) {
            content = obj.content;
        }
        else {
            title = core.constant.getting("NOTIFY", "PROCESS_S");
        }
        if (core.util.checkValue(obj.time)) {//check exist
            if (core.util.intValid(obj.time)) {//check interger type
                time = obj.time;
            }
            else {
                time = 2000;
            }
        }
        else {
            time = 2000;
        }
        //
        $(".alert_timer").html(html);
        html += '<li class="header">';
        html += '<span>' + title + ': </span>';
        html += '<span id="">' + content + '</span>';
        html += '</li>';

        $(".alert_timer").append(html);
        $(".alert_timer").fadeIn(500);
        setTimeout(function () {
            $(".alert_timer").fadeOut(1000);
        }, time);
    },
    notifyLocal: function (obj) {
        var me = this;

        var title = obj.title;
        var renderPlace = obj.renderPlace;
        var type = obj.type;
        var autoClose = obj.autoClose;
        var content_html_befor = "";
        var class_event_befor = "";
        //-----------------------------
        main();
        //-----------------------------
        function main() {
            //[0] call funtion tem
            check_param_input();
            color_warning();
            //[1] get content befor show notity (value same all)
            content_html_befor = $("#" + renderPlace).html();
            class_event_befor = $("#" + renderPlace).attr("class");
            //[2] show notify and remove class_event
            $("#" + renderPlace).html('<span class="' + type + ' notify">' + title + ' <a class="btn btn-default btn-circle btnClose" id="closeZone_' + renderPlace + '"><i class="fa fa-times-circle"></i></a></span>');
            $("#" + renderPlace).removeClass(class_event_befor);
            //[3] return back content befor and class_event and remove notity
            if (autoClose) {
                setTimeout(function () {
                    recover(renderPlace);
                }, 1200);
            }
            else {
                $("#" + renderPlace).delegate(".btnClose", "click", function () {
                    var closeZone_id = this.id;
                    closeZone_id = core.util.cutPrefixId(/closeZone_/g, closeZone_id);
                    recover(closeZone_id);
                });
            }
        }
        function check_param_input() {
            //[1] check param input
            if (!core.util.checkValue(title)) {
                title = "";
            }
            if (!core.util.checkId(renderPlace)) {
                return false;
            }
            if (!core.util.checkValue(autoClose)) {
                autoClose = false;
            }
            if (!core.util.checkValue(type)) {
                type = "";
            }
        }
        function color_warning() {
            //[2] color_warning
            switch (type) {
                case "s":
                    //success
                    type = "badge bg-green";
                    break;
                case "w":
                    //warning
                    type = "badge bg-yellow";
                    break;
                case "d":
                    //danger
                    type = "badge bg-red";
                    break;
                default:
                    //info
                    type = "";
            }
        }
        function recover(closeZone) {
            $("#" + closeZone).html(content_html_befor);
            $("#" + closeZone).addClass(class_event_befor);
            $("#" + closeZone + ">.notify").remove('');
        }
    },
    /*
    -- author: 
    -- discription: datePicker
    -- date: 02/06/2018
    */
    pickerdate: function (strClassName) {
        if (strClassName == undefined || strClassName == null || strClassName == "")
            strClassName = "input-datepicker";
        var x = document.getElementsByClassName(strClassName);
        for (var i = 0; i < x.length; i++) {
            var strInput_Id = x[i].id;
            var cleave = new Cleave('#' + strInput_Id, {
                date: true,
                datePattern: ['d', 'm', 'Y']
            });
            //$('#' + strInput_Id).datepicker({//bootstrap
            //    todayHighlight: true,
            //    autoclose: true,
            //    format: "dd/mm/yyyy",
            //    changeMonth: true,
            //    changeYear: true
            //});
        }
    },
    lunarCalendar: function (place) {
        var me = this;
        var place = "." + place;
        $(place).append('<IFRAME src="' + me.rootPathDepend + '/App_Themes/Plugins/amlich-js/currentmonth.html" style="width:100%; height: 250px" name="CurentMonth" scrolling="no" frameborder=0></IFRAME>');
    },
    /*
    -- author: nnthuong
    -- discription: date to combo
    -- date: 11/10/2018
    */
    dateYearToCombo: function (year, dropName, title) {
        //year: display the starting year, ex 1930, 1990... until this year
        var me = this;
        var dropControl = "";
        var activeOption = core.util.thisYear()
        //only one dropName
        if (dropName.indexOf(",") == -1) {
            dropControl = "#" + dropName;
            $(dropControl).html("");
            if (title == "" || title == null || title == undefined) {
                title = "-- Chọn dữ liệu --";
            }
            else {
                title = "-- " + title + " --";
            }
            $(dropControl).append($('<option value=""></option>').html(title));
            for (i = new Date().getFullYear() + 5; i > year; i--) {
                $(dropControl).append($('<option />').val(i).html(i));
            }
            //plugin select2 need these code below more.
            $(".chosen-select").select();
            $(dropControl).val(activeOption).trigger("change");
        }
        //dropNames
        else {
            dropControl = dropName.split(",");
            for (var i = 0; i < dropControl.length; i++) {
                dropControl[i] = "#" + dropControl[i];
                $(dropControl[i]).html("");
                if (title == "" || title == null || title == undefined) {
                    title = "-- Chọn dữ liệu --";
                }
                else {
                    title = "-- " + title + " --";
                }
                $(dropControl[i]).append($('<option value=""></option>').html(title));
                for (j = new Date().getFullYear(); j > year; j--) {
                    $(dropControl[i]).append($('<option />').val(j).html(j));
                }
                //plugin select2 need these code below more.
                $(".chosen-select").select();
                $(dropControl[i]).val(activeOption).trigger("change");
            }
        }

    },
    dateMonthToCombo: function (dropName, title) {
        //month: display the month
        var me = this;
        var dropControl = "";
        var activeOption = core.util.thisMonth();
        var month_text = 0;
        var month_val = 0;
        if (dropName.indexOf(",") == -1) {  //only one dropName
            dropControl = "#" + dropName;
            $(dropControl).html("");
            if (title == "" || title == null || title == undefined) {
                title = "-- Chọn dữ liệu --";
            }
            else {
                title = "-- " + title + " --";
            }
            $(dropControl).append($('<option value=""></option>').html(title));
            for (i = 0; i < 12; i++) {
                month_text = core.util.addZeroToDate(i + 1);
                month_val = i + 1;
                $(dropControl).append($('<option />').val(month_val).html(month_text));
            }
            //plugin select2 need these code below more.
            $(".chosen-select").select();
            $(dropControl).val(activeOption).trigger("change");
        }
        else {                              //arr dropName seprate by ','
            dropControl = dropName.split(",");
            for (var i = 0; i < dropControl.length; i++) {
                dropControl[i] = "#" + dropControl[i];
                $(dropControl[i]).html("");
                if (title == "" || title == null || title == undefined) {
                    title = "-- Chọn dữ liệu --";
                }
                else {
                    title = "-- " + title + " --";
                }
                $(dropControl[i]).append($('<option value=""></option>').html(title));
                for (j = 0; j < 12; j++) {
                    month = core.util.addZeroToDate(j + 1);
                    $(dropControl[i]).append($('<option />').val(month).html(month));
                }
                //plugin select2 need these code below more.
                $(".chosen-select").select();
                $(dropControl[i]).val(activeOption).trigger("change");
            }
        };
    },
    daysOfWeekToCombo: function (dropName, title) {
        //day: display the days of the week
        var me = this;
        var dropControl = "";
        //var activeOption = core.util.thisDay();
        if (dropName.indexOf(",") == -1) {  //only one dropName
            dropControl = "#" + dropName;
            $(dropControl).html("");
            if (title == "" || title == null || title == undefined) {
                title = "-- Chọn dữ liệu --";
            }
            else {
                title = "-- " + title + " --";
            }
            $(dropControl).append($('<option value=""></option>').html(title));
            for (i = 2; i < 9; i++) {
                if (i < 8) {
                    $(dropControl).append($('<option />').val(i).html("T" + i));
                }
                else {
                    $(dropControl).append($('<option />').val(i).html("CN"));
                }
            }
            //plugin select2 need these code below more.
            $(".chosen-select").select();
            //$(dropControl).val(activeOption).trigger("change");
        }
        else {                              //arr dropName seprate by ','
            dropControl = dropName.split(",");
            for (var i = 0; i < dropControl.length; i++) {
                dropControl[i] = "#" + dropControl[i];
                $(dropControl[i]).html("");
                if (title == "" || title == null || title == undefined) {
                    title = "-- Chọn dữ liệu --";
                }
                else {
                    title = "-- " + title + " --";
                }
                $(dropControl[i]).append($('<option value=""></option>').html(title));
                for (j = 2; j < 9; j++) {
                    if (j < 8) {
                        $(dropControl[i]).append($('<option />').val(j).html("T" + j));
                    }
                    else {
                        $(dropControl).append($('<option />').val(i).html("CN"));
                    }
                }
                //plugin select2 need these code below more.
                $(".chosen-select").select();
                //$(dropControl[i]).val(activeOption).trigger("change");
            }
        };
    },
    /*
    -- author: nnthuong
    -- discription: Plugin Editor
    -- date: 02/06/2018
    */
    LoadEditor: function (editorName) {
        var me = this;
        if (typeof (CKEDITOR) != "undefined") {
            var configCK = {
                customConfig: '',
                height: '320px',
                width: '100%',
                language: 'vi',
                entities: false,
                fullPage: false,
                toolbarCanCollapse: false,
                resize_enabled: false,
                startupOutlineBlocks: true,
                colorButton_enableMore: false,
                toolbar:
                [
                    { name: 'document', items: ['Source'] },
                    { name: 'tools', items: ['Maximize'] },
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'TextColor', 'BGColor', 'Link', 'Unlink'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'Iframe', 'Preview'] },
                    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                ],
                filebrowserImageUploadUrl: me.rootPath + '/Editor/Upload.ashx',
                filebrowserBrowseUrl: me.rootPath + '/Editor/ckfinder/ckfinder.html'
            };
            var editor = CKEDITOR.replace(editorName, configCK);
            CKEDITOR.on('instanceReady', function (e) {
                CKFinder.setupCKEditor(editor, me.rootPath + '/Editor/ckfinder/');
            });
        }
    },
    LoadEditor_Basic: function (editorName) {
        var me = this;
        if (typeof (CKEDITOR) != "undefined") {
            var configCK = {
                customConfig: '',
                height: '320px',
                width: '100%',
                language: 'vi',
                entities: false,
                fullPage: false,
                toolbarCanCollapse: false,
                resize_enabled: false,
                startupOutlineBlocks: true,
                colorButton_enableMore: false,
                toolbar:
                [
                    { name: 'document', items: ['Source'] },
                    { name: 'tools', items: ['Maximize'] },
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'TextColor', 'BGColor'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                    { name: 'insert', items: ['HorizontalRule', 'SpecialChar'] },
                    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                ],
                filebrowserImageUploadUrl: me.rootPath + '/App_Themes/Plugins/Upload.ashx',
                filebrowserBrowseUrl: me.rootPath + '/App_Themes/Plugins/ckfinder/ckfinder.html'
            };
            var editor = CKEDITOR.replace(editorName, configCK);
            CKEDITOR.on('instanceReady', function (e) {
                CKFinder.setupCKEditor(editor, me.rootPath + '/App_Themes/Plugins/ckfinder/');
            });
        }
    },
    /*
     -- author: nnthuong
     -- discription: Plugin Select 2 - for loading image into combo
     -- date: 02/06/2018
     */
    formatState: function (state) {
        if (!state.id) { return state.text; }
        var $state = $(
        '<span><img src="' + state.element.id + '" class="drop-img" /> ' + state.text + '</span>'
        );
        return $state;
    },
    /*
     -- author: nnthuong
     -- discription: HangDoi gen html taskbar/content
     -- date: 02/06/2018
     */
    taskControl: function (data) {
        var me = this;
        //1. initial params
        var $renderPlace = '#sysTask_Content';
        $($renderPlace).html("");
        var numberTask = 0;
        var html = '';
        var obj = {
            id: '',
            ten: '',
            iTongDuLieuDaHoanThanh: '',
            iTongDuLieuCanThucHien: '',
        }
        //2. main func
        for (var i = 0; i < data.length; i++) {
            html = '';
            obj = {};
            //create obj
            obj.id = data[i].ID;
            obj.ten = data[i].TEN;
            obj.iTongDuLieuDaHoanThanh = data[i].TONGDULIEUDAHOANTHANH;
            obj.iTongDuLieuCanThucHien = data[i].TONGDULIEUCANTHUCHIEN;
            //exclude finished ones
            if (obj.iTongDuLieuDaHoanThanh != obj.iTongDuLieuCanThucHien) {
                numberTask++;
                //1. gender khung task
                html = me.genHTML_TaskContent(obj);
                $($renderPlace).append(html);
                //2. update status
                me.updateStatus_Task(obj);
            }
        }
        $("#sysTask_Notify").html(numberTask);
    },
    genHTML_TaskContent: function (obj) {
        var $btnStart = 'btnStart_Queue';
        var $btn_bg = 'btn-primary';
        var html = '';
        html += '<div class="box-body" style="padding: 1px 3px">';
        html += '<div class="box" style="margin-bottom:0px; border-radius:0px;">';
        html += '<div class="box-body" style="padding-left:0px; padding-right:0px;">';
        html += '<div class="clearfix">';
        html += '<span class="pull-left">' + obj.ten + ' (<span id="task_items' + obj.id + '">' + obj.iTongDuLieuCanThucHien + '</span>)</span>';
        html += '<small id="task_lblpercent' + obj.id + '" class="pull-right" style="font-weight:bold; font-size:15px">0%</small>';
        html += '</div>';
        html += '<div class="progress progress-sm active" style="margin-bottom:0px;">';
        html += '<div id="task_percent' + obj.id + '" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 0%">';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html;
    },
    updateStatus_Task: function (obj) {
        //get id
        var $task_lblpercent = "#task_lblpercent" + obj.id;
        var $task_percent = "#task_percent" + obj.id;
        //process
        console.log("obj.iTongDuLieuDaHoanThanh: " + obj.iTongDuLieuDaHoanThanh);
        console.log("obj.iTongDuLieuCanThucHien: " + obj.iTongDuLieuCanThucHien);
        var iPercent = ((obj.iTongDuLieuDaHoanThanh / obj.iTongDuLieuCanThucHien) * 100).toFixed(2);

        //update percent
        $($task_lblpercent).html(iPercent + "%");
        $($task_percent).css("width", iPercent + "%");
        if (obj.iTongDuLieuDaHoanThanh == obj.iTongDuLieuCanThucHien) {
            me.alert("Thông báo", "Tiến trình chạy thành công, tổng dữ liệu xử lý là " + obj.iTongDuLieuDaHoanThanh);
            me.getList_HangDoi();
        }
    },
    addEffect_Task: function ($task_percent) {
        $($task_percent).addClass("progress-bar-striped");
    },
    removeEffect_Task: function ($task_percent) {
        $($task_percent).removeClass("progress-bar-striped");
    },
    enableBtnStop_Queue: function (id) {
        //1. add class btnStart
        //2. add class btn-primary
        //3. remove class btn-default
        var $btnStart = "#start_queue_" + id;
        var $btnStop = "#stop_queue_" + id;

        $($btnStart).removeClass("btn-primary btnStart_Queue");
        $($btnStart).addClass("btn-default");

        $($btnStop).removeClass("btn-default");
        $($btnStop).addClass("btn-primary btnStop_Queue");

    },
    enableBtnStart_Queue: function (id) {
        //1. add class btnStart
        //2. add class btn-primary
        //3. remove class btn-default
        var $btnStart = "#start_queue_" + id;
        var $btnStop = "#stop_queue_" + id;

        $($btnStop).removeClass("btn-primary btnStop_Queue");
        $($btnStop).addClass("btn-default");

        $($btnStart).removeClass("btn-default");
        $($btnStart).addClass("btn-primary btnStart_Queue");
    },
    /*
     -- author: nnthuong
     -- discription: Menu VERTICAL
     -- date: 27/088/2018
     */
    genHTML_MenuVertical: function (data) {
        var me = this;
        var strDuongDanHienThi = "";
        var strDuongDanFile = "";
        var node = '';
        me.arrMenu_HasChild = [];

        $("#menu_vertical").html("");
        for (var j = 0; j < data.length; j++) {
            if (data[j].CHUCNANGCHA_ID == null || data[j].CHUCNANGCHA_ID == "") {//get parents
                strDuongDanHienThi = data[j].DUONGDANHIENTHI;
                strDuongDanFile = data[j].DUONGDANFILE;

                node += '<li id="chucnang' + data[j].ID + '" class="treeview btnMenuVertical">';
                if (strDuongDanHienThi == null || strDuongDanHienThi == undefined || strDuongDanHienThi == "null" || strDuongDanHienThi == "") {
                    node += '<a href="javascript:void(0)">';
                    node += '<i class="' + data[j].TENANH + '""></i> <span id="mark_submenu' + data[j].ID + '">' + data[j].TENCHUCNANG + '</span>';
                }
                else {
                    node += '<a onclick="core.system.initMain(' + "\'" + strDuongDanHienThi + "\'" + ',' + "\'" + strDuongDanFile + "\'" + ')" href="' + strDuongDanHienThi + '">';
                    node += '<i class="' + data[j].TENANH + '""></i> <span>' + data[j].TENCHUCNANG + '</span>';
                }
                node += ' </a>';
                me.node_submenu = "";
                node += me.genHTML_MenuVertical_Recusive(data, data[j].ID, node);
                node += '</li>';
            }
        }
        //1. Append to left_content_tree
        $("#menu_vertical").append(node);
        //2. mark the parent has child
        me.genHTML_MenuVertical_Mark();
        //3. reset
        node = "";
    },
    genHTML_MenuVertical_Recusive: function (data, parent_id, nodeMenuVertical) {
        var me = this;
        var strDuongDanHienThi = "";
        var strDuongDanFile = "";

        me.node_submenu += '<ul class="treeview-menu">';
        for (var i = 0; i < data.length; i++) {
            if (data[i].CHUCNANGCHA_ID == parent_id) {
                //1. check menu has child, and push into arr
                if (!core.util.arrCheckExist(me.arrMenu_HasChild, parent_id)) {
                    me.arrMenu_HasChild.push(parent_id);
                }
                //2. get val of sub menu
                strDuongDanHienThi = data[i].DUONGDANHIENTHI;
                strDuongDanFile = data[i].DUONGDANFILE;

                me.node_submenu += '<li id="chucnang' + data[i].ID + '" class="treeview btnMenuVertical">';
                if (strDuongDanHienThi == null || strDuongDanHienThi == undefined || strDuongDanHienThi == "null" || strDuongDanHienThi == "") {
                    me.node_submenu += '<a href="javascript:void(0)">';
                }
                else {
                    me.node_submenu += '<a onclick="core.system.initMain(' + "\'" + strDuongDanHienThi + "\'" + ',' + "\'" + strDuongDanFile + "\'" + ')" href="' + strDuongDanHienThi + '">';
                }
                me.node_submenu += '<i class="' + data[i].TENANH + '""></i> <span>' + data[i].TENCHUCNANG + '</span>';
                //me.node_submenu += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
                me.node_submenu += ' </a>';
                me.genHTML_MenuVertical_Recusive(data, data[i].ID, nodeMenuVertical);
                me.node_submenu += '</li>';
            }
        }
        me.node_submenu += '</ul>';
        return me.node_submenu;
    },
    genHTML_MenuVertical_Mark: function () {
        //mark the parent has child
        var me = this;
        var mark_submenu = "";
        for (var i = 0; i < me.arrMenu_HasChild.length; i++) {
            mark_submenu = "#mark_submenu" + me.arrMenu_HasChild[i];
            $(mark_submenu).after('<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>');
        }
    },
    getDetail_ChucNang: function (strMa) {
        var me = this;
        core.util.objGetDataInData(strMa, me.dtChucNang, "ID", me.genPath_ChucNang);
    },
    genPath_ChucNang: function (data) {
        var me = core.system;
        me.pathChucNang += '<a onclick="" class="list-group-a"><span class="fa fa-home"></span> Bảng điều khiển</a>';
        me.pathChucNang += '<span class="sub-path opacity-5"> / ' + data[0].TENCHUCNANG + '</span>';
        if (core.util.checkValue(data[0].DUONGDANHUONGDANSUDUNG)) {
            me.pathChucNang += '<a id="btnHuongDanSuDung" name= "' + data[0].DUONGDANHUONGDANSUDUNG + '" style="float:right; cursor: pointer" data-toggle="popover" data-placement="left" title="' + data[0].DUONGDANHUONGDANSUDUNG +'" data-content="intro.user"><i class="fa fa-youtube-play" style="color:red"> Hướng dẫn sử dụng</i></a>';
        }
        else {
            me.pathChucNang += '<a style="float:right; cursor: pointer" data-toggle="popover" data-placement="left" title="Help" data-content="intro.user"><i class="fa fa-question-circle fa-customer"></i></a>';
        }
        $("#lblPath_ChucNang").html(me.pathChucNang);
        $("#btnHuongDanSuDung").click(function () {
            var url = this.name;
            var win = window.open(url, '_blank');
            win.focus();
        });
    }
}