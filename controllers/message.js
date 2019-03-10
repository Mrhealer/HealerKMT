var express = require('express');
var router = express.Router();

var MessageModel = require('../models/message');

const socket_io = require('socket.io');
var io = socket_io();

//Create a new Message
router.post('/message', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }

    var Message = new MessageModel(req.body);
    
    Message.save(function (err, data) {
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
//Update a Message
router.put('/message', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    MessageModel.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, function(err, data){
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
//Delete a Message
router.delete("/message", function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    MessageModel.findOneAndRemove({_id: req.body._id}, function(err, data){
        // updated!
        res.json({
            success: true, 
            id: '',
            message:'',
            data: ''
        });
    });
});
//Get a Message
router.get("/message/:id", function(req, res){
    if(!req.params.id || req.params.id === ""){
        return res.status(400).send('ULR is missing!');
    }
    MessageModel.findOne({_id: req.params.id}, function(err, data){
        res.json({
            success: true, 
            id: req.params.id,
            message:'',
            data: data
        });
    });
});
//Get list Message
router.get("/message", function(req, res){

    MessageModel.find(function(err, data){
        res.json({
            success: true, 
            id: '',
            message:'',
            data: data
        });
    });
});

module.exports = router;