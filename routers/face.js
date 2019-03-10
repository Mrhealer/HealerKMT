var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    res.render('index.ejs');
});

router.get("/device", function(req, res){
    res.render('./modules/device.ejs');
});

router.get("/user", function(req, res){
    res.render('./modules/user.ejs');
});

router.get("/cat_device", function(req, res){
    res.render('./modules/cat_device.ejs');
});

router.get("/check_connect", function(req, res){
    res.render('./modules/check_connect.ejs');
});


module.exports = router;