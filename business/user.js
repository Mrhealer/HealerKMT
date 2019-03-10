var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');
var User        = require('../models/user');
var NguoiDung   = require('../entities/bus/user');

var _NguoiDung = new NguoiDung();

//----------------------------Xu ly nghiep vu bai toan---------------------------------
var getlist = function (req, res) {
    User.getlist(req, res, function(result){
        console.log("Thuong oi: " + result);
        //Xuwr lys du lieu truoc khi tra ve API
        res.json(result);
    });
}
module.exports.getlist = getlist