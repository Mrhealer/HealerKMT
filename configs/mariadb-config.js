/**
 * Developer: nnthuong.
 * Date     : 01/03/2018
 * Update   :
 */
var common      = require("../configs/web-config");
var cryption    = require("../libs/cryption/cryption");

module.exports.master = {
    //113.190.254.242-root-abc1234-db
    host        : "113.190.254.242", 
    user        : "root", 
    password    : "abc1234",
    port        : "3307",
    database    : "apisdb1"
   
}
module.exports.slave = {
    //10.162.60.56-test-test-db
    host        : "113.190.254.242", 
    user        : "root", 
    password    : "abc1234",
    port        : "3307",
    database    : "apisdb2"
}