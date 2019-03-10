var express = require('express');
var router = express.Router();

var DeviceModel = require('../models/device');

const socket_io = require('socket.io');
var io = socket_io();

//Create a new DEVICE
router.post('/device', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }

    var Device = new DeviceModel(req.body);
    
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
//Update a DEVICE
router.put('/device', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    DeviceModel.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, function(err, data){
        //realtime
        io.emit('update_device', req.body);
        // updated!
        res.json({
            success: true, 
            id: data._id,
            message:'',
            data: req.body
        });
    });
});
//Delete a DEVICE
router.delete("/device", function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    DeviceModel.findOneAndRemove({_id: req.body._id}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: '',
            message:'',
            data: ''
        });
    });
});
//Get a DEVICE
router.get("/device/:id", function(req, res){
    if(!req.params.id || req.params.id === ""){
        return res.status(400).send('ULR is missing!');
    }
    DeviceModel.findOne({_id: req.params.id}, function(err, data){
        res.json({
            success: true, 
            id: req.params.id,
            message:'',
            data: data
        });
    });
});
//Get list DEVICE
router.get("/device", function(req, res){

    DeviceModel.find(function(err, data){
        res.json({
            success: true, 
            id: '',
            message:'',
            data: data
        });
    });
});
//Get list DEVICE for USER
router.get("/user_device/:userId", function(req, res){
    
        DeviceModel.find({userId: req.params.userId}, function(err, data){
            res.json({
                success: true, 
                id: '',
                message:'',
                data: data
            });
        });
    });

module.exports = router;