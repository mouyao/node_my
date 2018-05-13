/**
 * Created by USER on 2018-03-22.
 */
var http = require('http');  //在node_module中已经有了这里的方法
var mysql= require('mysql');  //同上

//连接lt测试数据库
var connection= mysql.createConnection({
    host :"120.25.158.242",
    port:"13316",//默认是使用一个mysql定义好的接口，但是如果改了就要写上；
    user: 'blkg_demo',
    password : 'blkg_demo_2017',
    database: "blkg-show-province-demo"
});

//开始你的mysql连接
connection.connect();
var server = http.createServer(function (req,res){
    //res.setHeader("Access-Control-Allow-Origin","*");
    //res.setHeader("Access-Control-Allow-Headers","Content-Type,Accept,Authorization");
    //res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,UPDATE,DELETE");
    var url_info = require('url').parse(req.url,true);
    //检查是不是给/test的request
    if(url_info.pathname === '/getAll'){
        res.writeHead(200, {'Content-Type': 'text/plain'}); 
        connection.query('SELECT * FROM `blkg-show-province-demo` .student_test order by id desc',function(err,rows,fields){
             var obj={total:160,limit:10,books:rows};
             //这里的分页是后台来分页的，每页都是10个，根据条件来查询；不是前端显示的问题；

             res.end(JSON.stringify(obj));//将获取的数据抛给前端；
             //res.end(rows.join);//这个的作用是干什么的？
        });
    }else if(url_info.pathname ==='/Insert'){  //增加人员信息
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var test1="";
        req.on('data', function (data) { //node.js中的流操作。通过绑定data操作，来不断的通过这个流累加数据，
            test1+=data;  //这里的chunk就是前端传来的数据,应该是一阵一整的传过来的
        });
        req.on("end",function(){   //在流上
             var test=JSON.parse(test1);
             console.log(test+"test");
            var  sql = 'INSERT  INTO  student_test(id,name,address,birthday) VALUES(?,?,?,?)';
            var  userAddSql= [test.id,test.name,test.address,test.birthday];
            connection.query(sql,userAddSql,function(err,rows,fields){
                //返回插入的结果情况
                if(rows){
                	  rows.code=0;//
   					  res.end(JSON.stringify(rows));
                	 console.log("insert sussess"+userAddSql);
                }
                if(err){
                     rows.code=1;
   					 res.end(JSON.stringify(err));
                	 console.log("insert fail"+userAddSql);
                }
            });
        });
    }else if(url_info.pathname ==='/Delete'){  //删除人员信息
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var testDelete="";
        req.on('data', function (data) {
            testDelete+=data;  //这里的chunk就是前端传来的数据,应该是一阵一整的传过来的
            console.log(testDelete+"testDelete");
        });
        req.on("end",function(){
            var test=JSON.parse(testDelete);
            console.log( test+"删除的id号");
            connection.query('DELETE FROM  student_test  where id ='+test,function(err,rows,fields){ //错误信息
                

                var result={"code":0,"info":rows};
                res.end(JSON.stringify(result));     //返回插入的结果情况，成功后的信息
                //res.end(JSON.stringify(fields));     //返回插入的结果情况
                console.log("delete sussess");
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
            var updateSql = 'UPDATE  student_test  set  name=? , birthday=? , address=?  where id=?';
            var updateParams = [test.name,test.birthday,test.address,test.id];
            connection.query(updateSql,updateParams,function(err,rows,fields){ //错误信息
            	if(rows){
                     var  result={"code":0,"info":rows};
                      res.end(JSON.stringify(result));     //返回插入的结果情况，成功后的信息
                        console.log("update success"); 
            	}
            	if(err){
                     console.log("update failed");  
            	}
                
            });
        });
    }
    //这个是用来回复上面那个post的，显示post的数据以表示成功了。你要是有别的目标，自然不需要这一段。
    else{
        req.pipe(res);  //流  管道，数据是一点点流过来的；
    }
});
server.listen(9000, '127.0.0.1');//将服务以这个端口的形式抛出去，供前端来访问；
//在server关闭的时候也关闭mysql连接，避免长连接数据库，造成性能出问题
server.on('close',function(){
    connection.end();
});
console.log('listening on port http://127.0.0.1:9000/');

