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
var DeviceSchema = new mongoose.Schema({
    id: String,
    code: String,
    name: String,
    content: String,
    category: String,
    image: String,
    userId: String
});

module.exports = mongoose.model('Device', DeviceSchema);
