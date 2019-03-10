var express = require('express');
var router = express.Router();

var Cat_DeviceModel = require('../models/cat_device');

//Create a new Cat_Device
router.post('/cat_device', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }

    var Device = new Cat_DeviceModel(req.body);
    
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
//Update a Cat_Device
router.put('/cat_device', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    Cat_DeviceModel.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: data._id,
            message:'',
            data: req.body
        });
    });
});
//Delete a Cat_Device
router.delete("/cat_device", function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    Cat_DeviceModel.findOneAndRemove({_id: req.body._id}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: '',
            message:'',
            data: ''
        });
    });
});
//Get a Cat_Device
router.get("/cat_device/:id", function(req, res){
    if(!req.params.id || req.params.id === ""){
        return res.status(400).send('ULR is missing!');
    }
    Cat_DeviceModel.findOne({_id: req.params.id}, function(err, data){
        res.json({
            success: true, 
            id: req.params.id,
            message:'',
            data: data
        });
    });
});
//Get list Cat_Device
router.get("/cat_device", function(req, res){

    Cat_DeviceModel.find(function(err, data){
        res.json({
            success: true, 
            id: '',
            message:'',
            data: data
        });
    });
});

module.exports = router;