/**
 * Developer: nnthuong.
 * Date     : 01/03/2018
 * Update   :
 */
var common      = require("../configs/web-config");
var cryption    = require("../libs/cryption/cryption");

module.exports = {
    //iuwebdhlncs2-abc1234-data
    user            : process.env.NODE_ORACLEDB_USER || cryption.decryptAES("U2FsdGVkX1+WRD6eX8WAox4H5UxhDNiviJwkvagjNkA=", cryption.md5(common.keyDB.toString()).toString()),
    // Instead of hard coding the password, consider prompting for it,
    // passing it in an environment variable via process.env, or using
    // External Authentication.
    password        : process.env.NODE_ORACLEDB_PASSWORD || cryption.decryptAES("U2FsdGVkX185Ok6IZni4b+cvO0dp0CmV4XvkTTdZv7Q=", cryption.md5(common.keyDB.toString()).toString()),
    // For information on connection strings see:
    // https://github.com/oracle/node-oracledb/blob/master/doc/api.md#connectionstrings
    connectString   : process.env.NODE_ORACLEDB_CONNECTIONSTRING || cryption.decryptAES("U2FsdGVkX1+zDlaNSELV0ao23xGmn57LxPewFHMuKuM=", cryption.md5(common.keyDB.toString()).toString()),
    // Setting externalAuth is optional.  It defaults to false.  See:
    // https://github.com/oracle/node-oracledb/blob/master/doc/api.md#extauth
    externalAuth    : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,
};