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
var Action_DeviceSchema = new mongoose.Schema({
    actionId: String,
    deviceId: String,
    statusId: String,//data is: ON || OFF
    content: String
});

module.exports = mongoose.model('Action_Device', Action_DeviceSchema);
