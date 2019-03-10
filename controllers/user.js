var express = require('express');
var router = express.Router();

var UserModel = require('../models/user');

//Create a new User
router.post('/user', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }

    var User = new UserModel(req.body);
    
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
router.put('/user', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    UserModel.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, function(err, data){
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
router.delete("/user", function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    UserModel.findOneAndRemove({_id: req.body._id}, function(err, data){
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
router.get("/user/:id", function(req, res){
    if(!req.params.id || req.params.id === ""){
        return res.status(400).send('ULR is missing!');
    }
    UserModel.findOne({_id: req.params.id}, function(err, data){
        res.json({
            success: true, 
            id: req.params.id,
            message:'',
            data: data
        });
    });
});
//Get list user
router.get("/user", function(req, res){

    UserModel.find(function(err, data){
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