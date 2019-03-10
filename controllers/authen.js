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
        //check ok
        else{
            res.json({
                success: true, 
                id: '',
                message:'',
                data: ''
            });
        }
    });
});

module.exports = router;