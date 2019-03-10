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
var ActionSchema = new mongoose.Schema({
    name: String,
    code: String,
    image: String,
    content: String,
    userId: String
});

module.exports = mongoose.model('Action', ActionSchema);
