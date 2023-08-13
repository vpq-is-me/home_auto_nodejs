

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
            query.columns.push(table_rows[val2draw[k]].DBname);
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
        let ch_json = await resp.json();
        if (basic_trends === undefined) {
            basic_trends = new Chart("basic_trend", {
                type: "line",
                data: {
                    labels: ch_json.data.id,
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
        for(let i=0;i<val2draw.length;i++){//first check if this dataset(trend) already exist
            let ds=0;
            for(ds=0;ds<basic_trends.data.datasets.length;ds++){
                if(val2draw[i]===basic_trends.data.datasets[ds].label){
                    basic_trends.data.datasets[ds].data=ch_json.data[table_rows[val2draw[i]].DBname];
                    break;
                }                
            }
            if(ds===basic_trends.data.datasets.length){//this trend was not in banch before
                let new_ds={
                    label: val2draw[i],
                    backgroundColor: hexToRgbA(table_rows[val2draw[i]].color,1),
                    borderColor: hexToRgbA(table_rows[val2draw[i]].color,0.8),
                    data: ch_json.data[table_rows[val2draw[i]].DBname],
                    yAxisID: table_rows[val2draw[i]].yscale,
                }
                basic_trends.data.datasets.push(new_ds);
            }
        }
        basic_trends.update();   
        console.log(ch_json);  
    }catch(err){
        console.error("Trend data request error->", err);
    }

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
function DrawBasicTrandInitial(){
    let init_query=[];
    for(let key in table_rows){
        if(table_rows[key].checked==="checked"){
            init_query.push(key.toString());
        }
    }
    GetTrendData(init_query)
}
DrawBasicTrandInitial();
//********************************************** */
// function DrawBasicTrand(ch_json){
//     basic_trends=new Chart("basic_trend", {
//         type: "line",
//         data: {
//             labels: ch_json.data.id,
//             datasets: [{
//                 label: "pump_capacity_avg",
//                 backgroundColor: "rgba(0,0,255,1.0)",
//                 borderColor: "rgba(0,0,255,0.8)",
//                 data: ch_json.data.PP_capacity_avg,
//                 yAxisID: 'y',
//             },
//             {
//                 label: "pump_capacity",
//                 backgroundColor: "rgba(255,0,155,1.0)",
//                 borderColor: "rgba(255,0,155,0.8)",
//                 data: ch_json.data.PP_capacity,
//                 yAxisID: 'y',
//             },
//             {
//                 label: "exp_tank_vol",
//                 backgroundColor: "rgba(0,255,0,1.0)",
//                 borderColor: "rgba(0,255,0,0.8)",
//                 data: ch_json.data.TK_volume,
//                 yAxisID: 'y1',
//             },
//             {
//                 label: "pp_shortest_work",
//                 backgroundColor: "rgba(100,0,200,1.0)",
//                 borderColor: "rgba(100,0,200,0.8)",
//                 data: ch_json.data.PP_RUN_MIN,
//                 yAxisID: 'y1',
//             }
//             ]
//         },
//         //bezierCurve: false,

//         options: {
//             scales:{
//                 x:{
//                     title:{
//                         color:'red',
//                         display: true,
//                         text: "basic pump trend",
//                     }
//                 }
//             }
//             // animation: true,
//             // tension: 0.4,
//             // animationEasing: "easeInBounce",
//             // bezierCurve:true,
//         }
//     });
// }

// const xValues = [50,60,70,80,90,100,110,120,130,140,150];
// const yValues = [7,8,8,9,9,9,10,11,14,14,15];

// new Chart("basic_trend", {
//   type: "line",  
//   data: {
//     labels: xValues,
//     datasets: [{
//       backgroundColor:"rgba(0,0,255,1.0)",
//       borderColor: "rgba(0,0,255,0.8)",
//       data: yValues
//     }]
//   },
//  // options:{...}
// });




// (async function() {
//     const data = [
//       { year: 2010, count: 10 },
//       { year: 2011, count: 20 },
//       { year: 2012, count: 15 },
//       { year: 2013, count: 25 },
//       { year: 2014, count: 22 },
//       { year: 2015, count: 30 },
//       { year: 2016, count: 28 },
//     ];
  
//     new Chart(
//       document.getElementById('basic_trend'),
//       {
//         type: 'bar',
//         data: {
//           labels: data.map(row => row.year),
//           datasets: [
//             {
//               label: 'Acquisitions by year',
//               data: data.map(row => row.count)
//             }
//           ]
//         }
//       }
//     );
//   })();