

var basic_trends;

async function GetTrendData(val2draw){
    let query={
        base:"last",
        direction:"up",
        amount:50,
        columns: ["id"],
    };
    for(let k=0; k< val2draw.length;k++){
        if(val2draw[k] in table_rows){
            query.columns.push(val2draw[k]);
        }
    }
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
            plugins:{legend:{display:false,}}}
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
    console.log(trend_js); 
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
    let init_query=[];
    for(let key in table_rows){
        if(table_rows[key].checked==="checked"){
            init_query.push(key.toString());
        }
    }
    let trend_data=await GetTrendData(init_query);
    InitChart(trend_data);
    DrawTrends(trend_data);
}
DrawBasicTrandInitial();
//********************************************** */
async function TrendMoveL(){
    alert("chekaj");
}