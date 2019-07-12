var fs=require('fs');
var path= require('path');
const http=require('http');
var server=http.createServer(handleRequestAndResponse);
server.listen(2525,()=>{
    console.log('server started');
});


function serveFile(pathName,response) {
    var newpath=path.join(__dirname,pathName);
    var readstream=fs.createReadStream(newpath);
    readstream.pipe(response);
}


function isStatic(url) {
    var extensions=['.html','.css','.jpg','.png','.gif','.jpeg','.js'];
    var ext=path.extname(url);
    var index=extensions.indexOf(ext);
    return index>=0;
}

var arr=[];
function handleRequestAndResponse(request,response){
   
    console.log(request.url);
    console.log(request.method);
    if(request.url=='/'){
        serveFile('public/login.html',response);
    }


    else if(isStatic(request.url)){
serveFile('public/'+request.url,response);
    }


    else if(request.url.includes('/doLogin') && request.method=='GET'){
        const url=require('url');
        var obj=url.parse(request.url,true);
        console.log(obj.query.userid);
        if(obj.query.userid==obj.query.pass){
            response.write("Welcome "+obj.query.userid);
        }
        else{
            response.write("Wrong Userid or Password");
        }
        response.end();
    }
    else
    if(request.url=='/dosignup' && request.method=='POST'){
        var postData ='';  
        request.on('data',(chunk)=>{
            postData+=chunk;
          })  
          request.on('end',()=>{
              console.log('POST DATA is ',postData);
           // response.write('Inside POST');
            const qs = require('querystring');
            var obj = qs.parse(postData);
            console.log('After QS 1 ',obj);
            arr.push(obj);
            console.log('array is ',arr);
          //   response.write('<a href="/sucess.html"><button id="butt_index">' +
          //   '  Login Page' +
          //   '</button></a>');

            
         // response.end();
            })
           serveFile('public/sucess.html',response);
          }

    else
    if(request.url=='/dologin' && request.method=='POST'){
        var postData ='';  
        request.on('data',(chunk)=>{
            postData+=chunk;
          })  
          request.on('end',()=>{
              console.log('POST DATA is ',postData);
           // response.write('Inside POST');
            const qs = require('querystring');
            var obj = qs.parse(postData);
            console.log('After QS ',obj); //obj.userid and obj.pass
           for(let key of arr){
               if(key.userid==obj.userid && key.password==obj.pass){
                   response.write('Welcome '+ key.name);
                   break;
               }
               else{
                response.write('Invalid Userid or Password');
               }
           }
            response.end();
            })
          }

         


    else{
        response.write('OOPs You Type Somrthig wrong, Error 404, Page not Found');
        response.end();
    }

}