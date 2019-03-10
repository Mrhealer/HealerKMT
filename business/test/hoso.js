var HoSo        = require('../../models/test/hoso');

//----------------------------Xu ly nghiep vu bai toan---------------------------------
var insert = function (obj, res) {
    HoSo.insert(obj, res, function(result){
        //processing data befor returning to API
        res.json(result);
    });
}
var getlist = function (req, res) {
    HoSo.getlist(req, res, function(result){
        console.log("[Data]: " + result);
        //processing data befor returning to API
        res.json(result);
    });
}
module.exports.getlist = getlist
module.exports.insert  = insert