/**
 * Created by USER on 2018-03-22.
 */
var http = require('http');  //在node_module中已经有了这里的方法
var mysql= require('mysql');  //同上

var connection= mysql.createConnection({
    host     :"localhost",
    user     : 'root',
    password : '20180324',
    database: "mysql"
});
//开始你的mysql连接
connection.connect();
var server = http.createServer(function (req,res){
    //如果你发一个GET到http://127.0.0.1:9000/test
    var url_info = require('url').parse(req.url,true);
    //检查是不是给/test的request
    if(url_info.pathname === '/getAll'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        connection.query('SELECT * FROM `mysql` .mouyao_test order by id desc',function(err,rows,fields){
            res.end(JSON.stringify(rows));
            res.end(rows.join);
        });
    }else if(url_info.pathname ==='/Insert'){  //增加人员信息
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var test1="";
        req.on('data', function (data) {
            test1+=data;  //这里的chunk就是前端传来的数据,应该是一阵一整的传过来的
        });
        req.on("end",function(){
            var test=JSON.parse(test1);
            var  sql = 'INSERT INTO  mouyao_test(id,name,age) VALUES(?,?,?)';
            var  userAddSql= [test.id,test.name,test.age];
            connection.query(sql,userAddSql,function(err,rows,fields){
                //返回插入的结果情况
                res.end(JSON.stringify(rows));
                console.log("insert sussess");
            });
        });
    }else if(url_info.pathname ==='/Delete'){  //删除人员信息
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var testDelete="";
        req.on('data', function (data) {
            testDelete+=data;  //这里的chunk就是前端传来的数据,应该是一阵一整的传过来的
        });
        req.on("end",function(){
            var test=JSON.parse(testDelete);
            connection.query('DELETE FROM  mouyao_test where id ='+test.id,function(err,rows,fields){ //错误信息
                res.end(JSON.stringify(rows));     //返回插入的结果情况，成功后的信息
                //res.end(JSON.stringify(fields));     //返回插入的结果情况
                console.log("insert sussess");
            });
        });
    }else if(url_info.pathname ==='/Update'){  //删除人员信息
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var testUpdate="";
        req.on('data', function (data) {
            testUpdate+=data;  //这里的chunk就是前端传来的数据,应该是一阵一整的传过来的
        });
        req.on("end",function(){
            var test=JSON.parse(testUpdate);
            var updateSql = 'UPDATE  mouyao_test  set  name= ?   where id = ? ';
            var updateParams = [test.name,test.id];
            connection.query(updateSql,updateParams,function(err,rows,fields){ //错误信息
                res.end(JSON.stringify(rows));     //返回插入的结果情况，成功后的信息
            });
        });
    }
    //这个是用来回复上面那个post的，显示post的数据以表示成功了。你要是有别的目标，自然不需要这一段。
    else{
        req.pipe(res);
    }
});
server.listen(9000, '192.168.0.3');
//在server关闭的时候也关闭mysql连接
server.on('close',function(){
    connection.end();
});
console.log('listening on port http://192.168.0.3:9000/');

