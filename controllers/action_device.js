var express = require('express');
var router = express.Router();

var Ation_DeviceModel = require('../models/action_device');

//Create a new Action_Device
router.post('/action_device', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }

    var Device = new Ation_DeviceModel(req.body);
    
    Device.save(function (err, data) {
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
//Update a Action_Device
router.put('/action_device', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    Ation_DeviceModel.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: data._id,
            message:'',
            data: req.body
        });
    });
});
//Delete a Action_Device
router.delete("/action_device", function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    Ation_DeviceModel.findOneAndRemove({_id: req.body._id}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: '',
            message:'',
            data: ''
        });
    });
});
//Get a Action_Device
router.get("/action_device/:id", function(req, res){
    if(!req.params.id || req.params.id === ""){
        return res.status(400).send('ULR is missing!');
    }
    Ation_DeviceModel.findOne({_id: req.params.id}, function(err, data){
        res.json({
            success: true, 
            id: req.params.id,
            message:'',
            data: data
        });
    });
});
//Get list Action_Device
router.get("/action_device", function(req, res){

    Ation_DeviceModel.find(function(err, data){
        res.json({
            success: true, 
            id: '',
            message:'',
            data: data
        });
    });
});
//Get list DEVICE for USER
router.get("/action_devices/:actionId", function(req, res){
    
    Ation_DeviceModel.find({actionId: req.params.actionId}, function(err, data){
        res.json({
            success: true, 
            id: '',
            message:'',
            data: data
        });
    });
});

module.exports = router;