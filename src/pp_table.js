const table_rows={
    acc_counter:	{val:-1,descr:"Счетчик воды,л",color: "#f00",checked:"checked"},
    pump_capacity:{val:-1,descr:"Производительность насоса, л/с",color: "#c06",checked:"checked"},
    pump_capacity_avg:{val:-1,descr:"Производительность \nнасоса средняя,л/с",color: "#30f",checked:"checked"},
    exp_tank_vol:{val:-1,descr:"Расчетный объем ГА,л",color: "#acf",checked:"unchecked"},
    alarms:	{val:-1,descr:"Алармы",color: "#fff",checked:"disabled"},
    last_time:	{val:-1,descr:"Время последней посылки",color: "#cf0",checked:"checked"},
    pp_work_between_pulses:	{val:-1,descr:"Полное время \nработы насоса,c",color: "#0f3",checked:"checked"},
    pp_longest_work:	{val:-1,descr:"Длиннейшее включение\nнасоса,с",color: "#c60",checked:"unchecked"},
    pp_shortest_work:	{val:-1,descr:"Кратчайшее включение\nнасоса,с",color: "#3ff",checked:"checked"},
    pp_working_at_pulse:	{val:-1,descr:"Время работы насоса\nв момент импульса,с",color: "#fff",checked:"disabled"},
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
    table_rows[key].checked=chk_box.checked? "checked" : "unchecked";
    // alert (key + " " + table_rows[key].checked);
    basic_trends.data.datasets.slice(1,1);
    basic_trends.update();
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