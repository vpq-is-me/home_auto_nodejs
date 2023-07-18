const express = require("express");
const app=express();


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname +'/css'))


var rec_buf='';
app.get('/',(req,res)=>{
    res.render('pages/index',{
        received_buf: rec_buf
    });
});

app.get('/jfile', (req,res)=>{
    res.json( rec_buf);
})

app.get('/reset_alarm',(req,res)=>{
//    if(req.body.button==="Reset"){
	unix_client.write(JSON.stringify({'tag':TAG_CMDRESETALARM}));
//    }
     res.end('reset_done');
})

app.listen(8080,()=>{
    console.log('server started on port 8080')
});
//************************************************************** */
const net=require('net');
const Stream = require("stream");
const UP2WEB_SOCKET="/tmp/water_pump_socket.socket";

var unix_client=net.createConnection(UP2WEB_SOCKET);
const TAG_REQSNAP        =1;
const TAG_CMDRESETALARM  =2;

unix_client.on('connect',() => {
    console.log('Unix socket connected');
    setInterval(()=>{
        unix_client.write(JSON.stringify({'tag':TAG_REQSNAP}));
    },1000);
})
unix_client.on('data', (msg) => {
    var jrec = JSON.parse(msg.toString());
    //TODO vpq !!! parse can throw exception!!!
    console.log(jrec);
    rec_buf = jrec;
})
