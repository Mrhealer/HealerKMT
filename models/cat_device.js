var mongoose    = require('mongoose');

var server      = 'http://localhost:27017';
var database    = 'smarthome';
var user        = '';
var password    = '';

//mongoose.connect('mongodb://username:password@host:port/database');
mongoose.connect('mongodb://localhost:27017/smarthome', {
    useCreateIndex: true,
    useNewUrlParser: true
});
var Cat_DeviceSchema = new mongoose.Schema({
    code: String,
    name: String,
    discript: String
});

module.exports = mongoose.model('Cat_Device', Cat_DeviceSchema);
