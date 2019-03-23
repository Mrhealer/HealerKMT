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
var UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: String,
    password: String,
    phone: String,
    address: String,
    avatar: String,
    status: String //[1 -  Enable, 0 - Disable, -1 - Block]
});

module.exports = mongoose.model('User', UserSchema);
