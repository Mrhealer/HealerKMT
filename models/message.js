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
var MessageSchema = new mongoose.Schema({
    senderId: String,
    recieverId: String,
    date: Date,
    type: String, //text or img
    content: String
});

module.exports = mongoose.model('Message', MessageSchema);
