

var basic_trends;


//***************************************************************************** */
async function GetTrendData(query){
    try {
        const resp = await fetch('/basic_trend_data',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(query),
         });
        let trend_js = await resp.json();
        return trend_js;
    }catch(err){
        console.error("Trend data request error->", err);
    }
}
//***************************************************************************** */
function InitChart(trend_js){    
    basic_trends = new Chart("basic_trend", {
        type: "line",
        data: {
            labels: trend_js.data.id,
            datasets: [],
        },                
        options: {
            scales:{
                x:{
                    title:{
                        color:'red',
                        display: false,
                        text: "basic pump trend",
                    }
                },
                y1:{min:0,max:0.8},
                y10:{min:0,max:25.0},
                y20:{min:0,max:25.0},
            },
            plugins:{
                legend:{display:false,},
                title:{display:true,text: 'ne poimi'},
                afterUpdate: function(chart, args, options){
                    
                        this.options.plugins.title.text=this.data.labels[0].toString();
                },
                tooltip: {
                    callbacks: {
                        footer: (tooltipItems) => {
                            let index = tooltipItems[0].chart.data.datasets.find((value, index, array)=>{
                                return value.label==="date"
                            });            
                            if(index!=undefined){
                                let tm=new Date(index.data[tooltipItems[0].dataIndex]*1000);
                                let txt=tm.toLocaleString("ru-RU");
                                return txt;
                            }
                            return '---';
                          }
                    }
                }
            },
            animation:{
                duration:1000,
                easing:'easeInOutCubic',
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false,
            },
                //TODO vpq !!! add animation when scroll left-right
        },
        plugins:[
            {
                id: 'update lable',
                beforeUpdate: function(chart, args, options){ 
                    let index = chart.data.datasets.find((value, index, array)=>{
                        return value.label==="date"
                    });            
                    if(index!=undefined){
                        let beg_time=new Date(index.data[0]*1000);
                        let end_time=new Date(index.data[index.data.length-1]*1000);
                        chart.options.plugins.title.text=beg_time.toLocaleString("ru-RU")+' <---> '+end_time.toLocaleString("ru-RU");
                    }
                },
            },
        ],
    });
}
//***************************************************************************** */
function DrawTrends(trend_js){       
    for(let i=0;i<trend_js.columns.length;i++){//first check if this dataset(trend) already exist
        let ds=0;
        let key=trend_js.columns[i];
        for(ds=0;ds<basic_trends.data.datasets.length;ds++){
            if(trend_js.columns[i]===basic_trends.data.datasets[ds].label){
                basic_trends.data.datasets[ds].data=trend_js.data[key];
                break;
            }                
        }
        if(ds===basic_trends.data.datasets.length){//this trend was not in banch before                
            if("id"===key)continue;
            let new_ds={
                label: key,
                backgroundColor: hexToRgbA(table_rows[key].color,1),
                borderColor: hexToRgbA(table_rows[key].color,0.8),
                data: trend_js.data[key],
                yAxisID: table_rows[key].yscale,
            }
            basic_trends.data.datasets.push(new_ds);
        }
    }
    basic_trends.update();   
}
//********************************************** */
function hexToRgbA(hex,alpha=1){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    throw new Error('Bad Hex');
}
//********************************************** */
async function DrawBasicTrandInitial(){
    let init_query={
        base:"last",
        direction:"up",
        amount:50,
        columns: ["id"],
    };
    for(let key in table_rows){
        if(table_rows[key].checked==="checked"){
            init_query.columns.push(key.toString());
        }
    }
    let trend_data=await GetTrendData(init_query);
    InitChart(trend_data);
    DrawTrends(trend_data);
}
DrawBasicTrandInitial();
//********************************************** */
async function ActivateNewTrend(key){
    let query={
        base:"id",
        id: parseInt(basic_trends.data.labels[0]),
        direction:"up",
        amount:50,
        columns: [],
    };
    query.columns.push(key);
    let trend_data;
    if(key==='consum_rate'){
        let data_ds = basic_trends.data.datasets.find((value, index, array)=>{
            return value.label==="date"
        });            
        query.data={"consum_rate":[]}
        query.data.consum_rate.push(0);//first element actualy has to be calculated with additional previous data. so it will just copy of next 
        if(data_ds!=undefined){
            let rate;
            let factor=1;
            for(let i=1;i<basic_trends.data.labels.length;i++){
                rate=data_ds.data[i]-data_ds.data[i-1];
                if(rate!=0)rate=10*factor/rate;
                query.data.consum_rate.push(rate);
            }
        }else{
            for(let i=1;i<basic_trends.data.labels.length;i++){
                query.data.consum_rate.push(0);
            }            
        }
        trend_data=query;
    }else{//not consum_rate
        trend_data=await GetTrendData(query);
    }
    DrawTrends(trend_data);
}
//********************************************** */
function TrendMoveL(){
        TrendMove_L_LL(0.1);}
function TrendMoveLL(){
        TrendMove_L_LL(0.3);}    

async function TrendMove_L_LL(factor){
    if(basic_trends===undefined)return;
    let ref_id=basic_trends.data.labels[0]-1;
    let length=basic_trends.data.labels.length*factor;
    let query={
        base:"id",
        direction:"down",
        id:ref_id,
        amount:length,
        columns: ["id"],
    };
    for(let i=0; i<basic_trends.data.datasets.length;i++){
        query.columns.push(basic_trends.data.datasets[i].label);
    }
    let trend_data=await GetTrendData(query);
    length=basic_trends.data.labels.length;
    let tmp=trend_data.data["id"].concat(basic_trends.data.labels);
    basic_trends.data.labels=tmp.slice(0,length);
    for(let i=0; i<basic_trends.data.datasets.length;i++){
        tmp=trend_data.data[basic_trends.data.datasets[i].label].concat(basic_trends.data.datasets[i].data);
        basic_trends.data.datasets[i].data=tmp.slice(0,length);
    }
    basic_trends.update('none');//call with 'none' to prevent animation
}
//********************************************** */
function TrendMoveR(){
    TrendMove_R_RR(0.1);}
function TrendMoveRR(){
    TrendMove_R_RR(0.3);}    

async function TrendMove_R_RR(factor){
    if(basic_trends===undefined)return;
    let ref_id=1+parseInt(basic_trends.data.labels[basic_trends.data.labels.length-1]);
    let add_length=basic_trends.data.labels.length*factor;
    let query={
        base:"id",
        direction:"up",
        id:ref_id,
        amount:add_length,
        columns: ["id"],
    };
    for(let i=0; i<basic_trends.data.datasets.length;i++){
        query.columns.push(basic_trends.data.datasets[i].label);
    }
    let trend_data=await GetTrendData(query);
    let length=basic_trends.data.labels.length;
    add_length=trend_data.data["id"].length;
    let tmp=basic_trends.data.labels.concat(trend_data.data["id"]);
    basic_trends.data.labels=tmp.slice(add_length);
    for(let i=0; i<basic_trends.data.datasets.length;i++){
        tmp=basic_trends.data.datasets[i].data.concat(trend_data.data[basic_trends.data.datasets[i].label]);
        basic_trends.data.datasets[i].data=tmp.slice(add_length);
    }
    basic_trends.update('none');
}

async function TrendMoveLast(){
    let query={
        base:"last",
        direction:"up",
        amount:50,
        columns: ["id"],
    };
    for(let i=0; i<basic_trends.data.datasets.length;i++){
        query.columns.push(basic_trends.data.datasets[i].label);
    }
    let trend_data=await GetTrendData(query);
    basic_trends.data.labels=trend_data.data["id"];
    for(let i=0; i<basic_trends.data.datasets.length;i++){
        basic_trends.data.datasets[i].data=trend_data.data[basic_trends.data.datasets[i].label];
    }
    basic_trends.update();
}
async function TrendJump2time(time){
    let epoche_time = Date.parse(time) / 1000;
    let query = {
        base: "date",
        date: epoche_time,
        direction: "down",
        amount: 50,
        columns: ["id"],
    };
    for (let i = 0; i < basic_trends.data.datasets.length; i++) {
        query.columns.push(basic_trends.data.datasets[i].label);
    }
    let trend_data = await GetTrendData(query);
    if(trend_data.error!=undefined){
        alert("Такой даты нет в базе");
        return;
    }
    basic_trends.data.labels = trend_data.data["id"];
    for (let i = 0; i < basic_trends.data.datasets.length; i++) {
        basic_trends.data.datasets[i].data = trend_data.data[basic_trends.data.datasets[i].label];
    }
    basic_trends.update();
}
// function CalculateTrends(beg_idx,end_idx){
//     if(beg_idx===undefined)beg_idx=0;
//     if(end_idx===undefined)end_idx=basic_trends.data.labels.length;
//     if(table_rows.label[consum_rate].checked==="checked"){
//         let index = basic_trends.data.datasets.find((value, index, array)=>{
//             return value.label==="consum_rate"
//         });
//         if(index===undefined)
//     }

    

// }