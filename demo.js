var mysql  = require('mysql');
var connection = mysql.createConnection({     
      host     :"localhost",
     user     : 'root',
     password : '20180324',
     database: "mysql"
});
connection.connect();
var  sql = 'SELECT * FROM `mysql` .mouyao_test order by id desc';
//查
connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
       console.log(result);
});
connection.end();