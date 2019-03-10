var User    = require('../../models/user/user');
var jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens

//----------------------------Xu ly nghiep vu bai toan---------------------------------
var create = function (obj, res) {
    User.create(obj, res, function(result){
        //processing data befor returning to API
        res.json(result);
    });
}
var signin = function (req, res) {
    User.signin(req, res, function(result){
        //processing data befor returning to API
        // find the user
        if (result[0] == null || result[0] == "" || result[0] == undefined) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        }
        else {
            // create a token with only our given payload
            // we don't want to pass in the entire user since that has the password
            var jsonResult = JSON.stringify(result[0]);
            var objResult  = JSON.parse(jsonResult);

            const payload = {
                admin: objResult[0].id
            };
            //1m = 60s * 1s, 1h = 60s * 60s, 1d = 1(d)* 24(h)* 60 * 60
            var token = jwt.sign(payload, "thuongkmt_secret", { expiresIn: 60*60 });
            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Create token seccessful!',
                token: token
            }); 
        }
    });
}
var getlist = function (req, res) {
    User.getlist(req, res, function(result){
        console.log("[Data]: " + result);
        //processing data befor returning to API
        res.json({"data": result[0], "info": result[1]});
    });
}
module.exports.create   = create
module.exports.signin   = signin
module.exports.getlist  = getlist