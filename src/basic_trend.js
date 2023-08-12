var basic_trends;
async function GetTrendData(){
    let query={
        base:"last",
        direction:"up",
        amount:50,
        columns:["id","PP_capacity_avg","PP_capacity","TK_volume","PP_RUN_MIN"]
    };
    try {
        const resp = await fetch('/basic_trend_data',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(query),
         });
        let ch_json = await resp.json();

        basic_trends=new Chart("basic_trend", {
            type: "line",
            data: {
                labels: ch_json.data.id,
                datasets: [{
                    label: "pump_capacity_avg",
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.8)",
                    data: ch_json.data.PP_capacity_avg,
                    yAxisID: 'y',
                },
                {
                    label: "pump_capacity",
                    backgroundColor: "rgba(255,0,155,1.0)",
                    borderColor: "rgba(255,0,155,0.8)",
                    data: ch_json.data.PP_capacity,
                    yAxisID: 'y',
                },
                {
                    label: "exp_tank_vol",
                    backgroundColor: "rgba(0,255,0,1.0)",
                    borderColor: "rgba(0,255,0,0.8)",
                    data: ch_json.data.TK_volume,
                    yAxisID: 'y1',
                },
                {
                    label: "pp_shortest_work",
                    backgroundColor: "rgba(100,0,200,1.0)",
                    borderColor: "rgba(100,0,200,0.8)",
                    data: ch_json.data.PP_RUN_MIN,
                    yAxisID: 'y1',
                }
                ]
            },
            //bezierCurve: false,

            options: {
                scales:{
                    x:{
                        title:{
                            color:'red',
                            display: true,
                            text: "basic pump trend",
                        }
                    }
                }
                // animation: true,
                // tension: 0.4,
                // animationEasing: "easeInBounce",
                // bezierCurve:true,
            }
        });

        console.log(ch_json);  
    }catch(err){
        console.error("Trend data request error->", err);
    }

}
GetTrendData();

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