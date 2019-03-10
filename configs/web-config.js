module.exports = {
    db_name     : 'CALL apisdb1.',                      //use for plsql of mariadb to call procedure
    call_sp     : function(sp_name){
        return this.db_name + sp_name;                  //call procedure in mysql
    },
    db_connect  : 'mariadb/mariadb-cluster',            //connect to any database
    db_secret   : 'APIs',                               //secrete key for DB
    mariadb     : 'mariadb/mariadb-cluster',
    oracledb    : 'oracledb/oracledb',
    keySession  : '',                                   //secrete key for session
    keyToken    : '',                                   //secret ket for Token
    api_path    : 'localhost:8081',                     //font end
}