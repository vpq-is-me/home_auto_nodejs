const table_rows={
    acc_couter:	{val:-1,descr:"Счетчик воды,л",color: "red",checked:false},
    pump_capacity:{val:-1,descr:"Производительность насоса, л/с",color: "red",checked:false},
    pump_capacity_avg:{val:-1,descr:"Производительность \nнасоса средняя,л/с",color: "red",checked:false},
    exp_tank_vol:{val:-1,descr:"Расчетный объем ГА,л",color: "red",checked:false},
    alarms:	{val:-1,descr:"Алармы",color: "red"},
    last_time:	{val:-1,descr:"Время последней посылки",color: "red",checked:false},
    pp_work_between_pulses:	{val:-1,descr:"Полное время \nработы насоса,c",color: "red",checked:false},
    pp_longest_work:	{val:-1,descr:"Длиннейшее включение\nнасоса,с",color: "red",checked:false},
    pp_shortest_work:	{val:-1,descr:"Кратчайшее включение\nнасоса,с",color: "red",checked:false},
    pp_working_at_pulse:	{val:-1,descr:"Время работы насоса\nв момент импульса,с",color: "red",checked:false},
}

function PumpTableDraw(jpump_data){
    if(jpump_data === undefined){//id="flexCheckDefault">
        //    let out_table = '<table border="2" class="table-striped  table-hover table-sm table-bordered ">'
        let inst_table = '<table border="2" id="inst_table_id" class="table table-sm table-hover table-bordered">'
        inst_table += '<thead class="table-info">                 \
                            <tr>                                \
                            <th scope="col">Параметр</th>        \
                            <th scope="col">Значение</th>         \
                            <th scope="col">График</th>       \
                            </tr>                               \
                        </thead>                              \
                        <tbody>'
        for (let t in table_rows) {
            inst_table += "<tr>"+
                                "<td>" + table_rows[t].descr + "</td>"+
                                '<td rel="cell_'+t.toString()+'">' + "</td>"+
                                // "<td>" + '<div id="cell_'+t.toString()+'">---</div>' + "</td>"+
                                "<td>" +  '<div class="form-check">' + 
                                        '<input class="form-check-input" type="checkbox" value="" id="chk_${table_rows[t].checked}"  checked>' +
                                        "</div>" + 
                                    "</td>"+
                            "</tr>";
        }
        inst_table += "</tbody> </table>";
 
        document.getElementById('table_place').innerHTML = inst_table;
    } else {   
        let df=document.getElementById("cell_acc_counter");
        df.textContent="uutt";   
        // for (let key in pump_data_obj) {
        //    // document.getElementById("cell_${key}").textContent=pump_data_obj[key];
        //     // out_table += "<tr><td>" + table_rows[key].descr + "</td><td>" + pump_data_obj[key] + "</td><td>" +      
        //     // '<div class="form-check">'+
        //     //     '<input class="form-check-input" type="checkbox"  value="" id="chk_${pump_data_obj[key].checked}"  checked >'+
        //     // "</div>" + "</td></tr>";
        // }
    }    
 }


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