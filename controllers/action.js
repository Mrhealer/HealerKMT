var express = require('express');
var router = express.Router();

var ActionModel = require('../models/action');

//Create a new Action
router.post('/action', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }

    var Device = new ActionModel(req.body);
    
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
//Update a Action
router.put('/action', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    ActionModel.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: data._id,
            message:'',
            data: req.body
        });
    });
});
//Delete a Action
router.delete("/action", function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    ActionModel.findOneAndRemove({_id: req.body._id}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: '',
            message:'',
            data: ''
        });
    });
});
//Get a Action
router.get("/action/:id", function(req, res){
    if(!req.params.id || req.params.id === ""){
        return res.status(400).send('ULR is missing!');
    }
    ActionModel.findOne({_id: req.params.id}, function(err, data){
        res.json({
            success: true, 
            id: req.params.id,
            message:'',
            data: data
        });
    });
});
//Get list Action
router.get("/action", function(req, res){

    ActionModel.find(function(err, data){
        res.json({
            success: true, 
            id: '',
            message:'',
            data: data
        });
    });
});
//Get list DEVICE for USER
router.get("/user_action/:userId", function(req, res){
    
    ActionModel.find({userId: req.params.userId}, function(err, data){
        res.json({
            success: true, 
            id: '',
            message:'',
            data: data
        });
    });
});

module.exports = router;