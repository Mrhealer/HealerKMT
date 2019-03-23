var express = require('express');
var router = express.Router();

var UserModel = require('../models/user');

//Create a new User
router.post('/login', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }

    console.log("req.body: " + JSON.stringify(req.body));
    
    UserModel.findOne({username: req.body.username}, function(err, data){
        //No exit
        if(data === null){
            res.json({
                success: false, 
                id: '',
                message:'Not exit username!',
                data: ''
            });
        }
        //exit and check password
        else if(data.password != req.body.password){
            res.json({
                success: false, 
                id: '',
                message:'Username or password is incorect!',
                data: ''
            });
        }
        //check user and pass are ok
        else{
            //check STATUS of user
            if(data.status=="1"){
                res.json({
                    success: true, 
                    id: data._id,
                    message:'',
                    data: ''
                });
            }
            else if(data.status=="-1"){
                res.json({
                    success: false, 
                    id: data._id,
                    message:'Blocked User!!!',
                    data: ''
                });
            }
            else if(data.status=="0"){
                res.json({
                    success: false, 
                    id: data._id,
                    message:'Pending...!',
                    data: ''
                });
            }
            else{
                res.json({
                    success: false, 
                    id: data._id,
                    message:'Could not identify!',
                    data: ''
                });
            }
        }
    });
});
//Block a User
router.put('/block', function(req, res){
    if(!req.body){
        return res.status(400).send('Request body is missing!');
    }
    UserModel.findOne({_id: req.body._id}, function(err, data){
        data.status = req.body.status;
        data.save(function(err) {
            res.json({
                success: true, 
                id: data._id,
                message: err,
                data: req.body
            });
        });
    });
});
//Reset a User

module.exports = router;