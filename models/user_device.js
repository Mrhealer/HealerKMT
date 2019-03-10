var mongoose = require('mongoose');

var server      = 'http://localhost:27017';
var database    = 'smarthome';
var user        = '';
var password    = '';

//mongoose.connect('mongodb://username:password@host:port/database');
mongoose.connect('mongodb://localhost:27017/smarthome', {
    useCreateIndex: true,
    useNewUrlParser: true
});
var User_DeviceSchema = new mongoose.Schema({
    userId: String,
    deviceId: String
});

module.exports = mongoose.model('User_Device', User_DeviceSchema);
