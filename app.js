const express = require("express");
const app=express();


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname +'/css'))
app.use(express.static(__dirname +'/src'))


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
    //if(req.body.button==="Reset"){
	unix_client.write(JSON.stringify({'tag':TAG_CMDRESETALARM}));
    //}
     res.end('reset_done');
})
//****************** */
let trend_resp;
let waiting=0;
app.post('/basic_trend_data',(req,res)=>{
    let body=req.body;
    console.log("receive data->"+JSON.stringify(body));
    let down_req=Object.assign({tag:3},body);
    unix_client.write(JSON.stringify(down_req));
    trend_resp=res;
    waiting=1;
})
async function GetTrendDataFromManager(){

}
//****************** */
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
const TAG_DB_REQUEST     =3;

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
    if('tag' in jrec){       
        if(jrec.tag===3 && waiting===1){
            waiting=0;
            trend_resp.send(JSON.stringify(jrec));
        }
    }else{
         rec_buf = jrec;
    }    
})
