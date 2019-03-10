var express = require('express');
var router = express.Router();

//API Sevices
router.use(require('../controllers/authen'));
router.use(require('../controllers/user'));
router.use(require('../controllers/device'));
router.use(require('../controllers/cat_device'));
//Other routes here [all the routes that not match any route above]
router.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
 });

 module.exports = router;