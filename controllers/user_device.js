var express = require('express');
var router = express.Router();

var User_DeviceModel = require('../models/user_device');

//Create a new User
router.post('/user_device', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }

    var User_Device = new User_DeviceModel(req.body);
    
    User.save(function (err, data) {
        if (err) return handleError(err);
        // saved!
        res.json({
            success: true, 
            id: data._id,
            message:'',
            data:[]
        });
      });
});
//Update a User
router.put('/user_device', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    User_DeviceModel.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: data._id,
            message:'',
            data: req.body
        });
    });
});
//Delete a User
router.delete("/user_device", function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    User_DeviceModel.findOneAndRemove({_id: req.body._id}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: '',
            message:'',
            data: ''
        });
    });
});
//Get a user
router.get("/user_device/:id", function(req, res){
    if(!req.params.id || req.params.id === ""){
        return res.status(400).send('ULR is missing!');
    }
    User_DeviceModel.findOne({_id: req.params.id}, function(err, data){
        res.json({
            success: true, 
            id: req.params.id,
            message:'',
            data: data
        });
    });
});
//Get list user
router.get("/user_device", function(req, res){

    User_DeviceModel.find(function(err, data){
        // updated!
        res.json({
            success: true, 
            id: '',
            message:'',
            data: data
        });
    });
});

module.exports = router;