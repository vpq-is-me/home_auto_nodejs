const table_rows={
    acc_counter:	{val:-1,descr:"Счетчик воды,л",color: "#f00",checked:"disabled",DBname:"WF_counter",yscale: "yinf"},
    pump_capacity:{val:-1,descr:"Производительность насоса, л/с",color: "#c06",checked:"checked",DBname:"PP_capacity",yscale: "y1"},
    pump_capacity_avg:{val:-1,descr:"Производительность \nнасоса средняя,л/с",color: "#30f",checked:"checked",DBname:"PP_capacity_avg",yscale: "y1"},
    exp_tank_vol:{val:-1,descr:"Расчетный объем ГА,л",color: "#acf",checked:"unchecked",DBname:"TK_volume",yscale: "y10"},
    alarms:	{val:-1,descr:"Алармы",color: "#fff",checked:"disabled",DBname:"alarms"},
    last_time:	{val:-1,descr:"Время последней посылки",color: "#cf0",checked:"disabled",DBname:" ",},
    pp_work_between_pulses:	{val:-1,descr:"Полное время \nработы насоса,c",color: "#0f3",checked:"checked",DBname:"PP_ON_ACC",yscale: "y20"},
    pp_longest_work:	{val:-1,descr:"Длиннейшее включение\nнасоса,с",color: "#c60",checked:"unchecked",DBname:"PP_RUN_MAX",yscale: "y20"},
    pp_shortest_work:	{val:-1,descr:"Кратчайшее включение\nнасоса,с",color: "#3ff",checked:"checked",DBname:"PP_RUN_MIN",yscale: "y20"},
    pp_working_at_pulse:	{val:-1,descr:"Время работы насоса\nв момент импульса,с",color: "#fff",checked:"disabled",DBname:"PP_RUN_AT_PULSE",yscale: "y20"},
}

function PumpTableDraw(jpump_data){
    if(jpump_data === undefined){//id="flexCheckDefault">
        for(key in table_rows){
            let row=document.createElement("tr");
            let c1=document.createElement("td");
            c1.innerText=table_rows[key].descr;
            let c2=document.createElement("td");
            c2.id="cell_"+key.toString();
            c2.innerText="---";
            let c3=document.createElement("td");
            if (table_rows[key].checked != "disabled") {
                c3.innerHTML = '<div class="form-check">\
                         <input class="form-check-input" type="checkbox" id=chk_'+ key.toString()+' onchange="enable_trend(this)" value="" '+ table_rows[key].checked + '> \
                         <span class="dot" style="background-color:'+ table_rows[key].color + '"></span> \
                         </div>';
            }
            row.appendChild(c1);
            row.appendChild(c2);
            row.appendChild(c3);
            document.getElementById('inst_tbody_id').appendChild(row);
        }
    } else {   
        for (let key in pump_data_obj) {
            let dist_cell_id = "cell_" + key.toString();
            dist_cell=document.getElementById(dist_cell_id);
            if(dist_cell)dist_cell.textContent = pump_data_obj[key];
        }
    }    
 }
function enable_trend(chk_box){
    let key=chk_box.id.substring(4);
    if(chk_box.checked){
        table_rows[key].checked="checked";
        GetTrendData([key]);
    }else{
        table_rows[key].checked="unchecked";
        let tmp=basic_trends.data.datasets;
        for(let i=0; i<tmp.length;i++){
            if(tmp[i].label===key){
                tmp.splice(i,1);
                break;
            }
        }
        basic_trends.update();
    }
}


// function doalert(checkboxElem) {
//    if (checkboxElem.checked) {
//      alert ("hi" + checkboxElem.id);
//    } else {
//      alert ("bye");
//    }
//  }
//  var inst_table=document.createElement("table");
//  inst_table.setAttribute("id","inst_table_id");
//  inst_table.style.border="2px solid";
//  inst_table.className="table table-sm table-hover table-bordered"
//  head_txt = ['Параметр', 'Значение', 'График'];
//  var tr=inst_table.insertRow(0);
//  for (var i = 0; i < 3; i++) {            
//      var divContainer = document.createElement('div');//create a div in every loop            
//      divContainer.className = 'container';//give it a classname
//      var td = tr.insertCell();
//      td.appendChild(document.createTextNode(head_txt[i]));
//      td.appendChild(divContainer);
//  }
// document.getElementById('table_place').appendChild(inst_table);