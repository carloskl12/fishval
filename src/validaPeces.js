const create = (name) => document.createElement(name);
function generaTabla(datos=[],table=null){
    if(datos.length == 0 || table==null)
        return datos.length
    let row0=datos.shift();
    row0.forEach(
        function(value,i){
            table.rows[1].cells[i].innerHTML=value;
        }
    )

    datos.forEach(function(row,ir){
        let newRow = table.insertRow(-1);
        row.forEach(function(itemValue,i){
            let newCell = newRow.insertCell(i);
            let newText = document.createTextNode(itemValue);
            newCell.appendChild(newText);
        })
        
    })
}

function testTabla(){
    let datos = [];
    for(let i =0;i<100;i++){
        datos.push([i+1,'pez'+(i+1), 'No se'])
    }
    let table = document.querySelector("#mainTb");
    generaTabla(datos,table);
}
// Inserta un nombre en la tabla de datos
function insertaNombre(nombre){
    if(nombre == ""){
        return;
    }
    let table = document.querySelector("#mainTb");
    let rowCount = table.rows.length;
    let firstRow =table.rows[1];
    if(firstRow.cells[1].innerHTML== ""){
        rowCount--;        
    } 
    let newRow= table.insertRow(-1);
    [rowCount,nombre,''].forEach(function(itemValue,i){
        let newCell = newRow.insertCell(i);
        let newText = document.createTextNode(itemValue);
        newCell.appendChild(newText);
    })

    if(firstRow.cells[1].innerHTML== ""){
        // Borra la primera fila vacia al final para no
        // perder el formato
        table.deleteRow(1);      
    }
    const table2 = document.querySelector("#tbckbt");
    let nButtons = table2.rows.length-1;
    if(nButtons < rowCount){
        const newRow= table2.insertRow(-1);
        const newCell = newRow.insertCell(0);
        newCell.appendChild(createCheckBt(0,rowCount));
    }
}

function btfunInsertarNombre(){
    insertaNombre(document.getElementById('fishName').value);
    btfunBorrar();
}
function btfunBorrar(){
    const el = document.getElementById('fishName');
    nobreEliminado = el.value;
    console.log("Eliminado:",nobreEliminado);
    el.value='';
}

function btfunRedo(){
    const el = document.getElementById('fishName');
    console.log("Retornado:",nobreEliminado);
    const tmp = el.value;
    el.value=nobreEliminado;
    nobreEliminado = tmp;    
}

const clearTabla = ()=>{
    let table = document.querySelector("#mainTb");
    let table2 = document.querySelector("#tbckbt");
    console.log("Num botones:", table2.rows.length);
    console.log("Nombres:", table.rows.length);
    let rowCount = table.rows.length;
    let tableHeaderRowCount = 2;
    for (let i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
        table2.deleteRow(tableHeaderRowCount);
    }
    let firstRow= table.rows[1];
    let celdas= firstRow.cells;
    for(let i=1;i<celdas.length;i++){
        celdas[i].innerHTML="";
    }

}

function btfunImportCsv(){
    const fileInput = document.querySelector("#csv-file");
    fileInput.click();

}
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const readCsv = async (file, sep) =>{
    // const sep = ','; //Separador de elementos en una fila
    if(sep == '') {
        sep = ',';
        console.log("Separador de columnas por defecto:", sep)
    }
    const stringSep = '"'; //Separador de strings
    const text = await file.text();
    const data = [];
    const lines = text.split("\n");
    lines.forEach(element => {
        const row = [];
        let value="";
        let state = 0;
        for(let i = 0;i < element.length;i++){
            const c = element.charAt(i);
            if(c === stringSep ){
                if(state === 0){
                    state = 1;
                }else if(state === 1){
                    state = 0;
                }
            } else if(state === 0){
                if ( c != sep){
                    value+=c;
                }else{
                    row.push(value.trim());
                    value = "";
                }
            } else if(state === 1){
                value+=c;
            }
        }
        row.push(value.trim());
        data.push(row);
    });
    const lastRow = data[data.length-1];
    if(lastRow.length===1 && lastRow[0]=="") 
        data.pop();

    return data;
};

const getDataFromTable = (tableId) => {
    const table = document.getElementById(tableId);
    const data = [];
    
    let numRows = 0;
    if(table && table.rows) numRows=table.rows.length;
    let numCols = 0;
    if(numRows>0) numCols = table.rows[0].cells.length;
    console.log('Filas:',numRows, '  Columnas:',numCols);
    for(let r = 0; r< numRows;r++){
        const row =[]
        for(let c=0;c< numCols;c++){
            row.push(table.rows[r].cells[c].textContent);
        }
        data.push(row);
    }
    if(data.length>2){
        for(let i=1;i<data.length;i++){
            const name = data[i][1];
            const name2= data[i][2];
            data[i][1]= name.charAt(0).toUpperCase()+name.substring(1);
            if(name2 != ""){
                data[i][2]= name2.charAt(0).toUpperCase()+name2.substring(1);
            }
        }
    }
    return data;
};



const dataArrayToCsv = (data,sep) => {
    if(sep == '') {
        sep = ',';
        console.log("dataArrayToCsv -- separador de columnas por defecto:", sep)
    }
    let s =''
    data.forEach(row => {
        rs=''
        row.forEach(cell => {
            if(rs) rs+=sep;
            if (typeof cell === 'string' || cell instanceof String){
                if( cell.indexOf(sep)>-1) cell='"'+cell+'"';
            }
            rs+= cell;
        });
        if(s) s+='\n';
        s+=rs;
    });
    return s;
}
const createCheckBt = (v,i) =>{
    const btcheck = create("button");
    if(v===0){
        btcheck.innerHTML = "✓";
        btcheck.setAttribute("title", "Nombre correcto");
    }else if(v === 1){
        btcheck.innerHTML = "✕";
        btcheck.setAttribute("title", "Nombre incorrecto con recomendación");
    }else if(v === 2){
        btcheck.innerHTML = "✕";
        btcheck.setAttribute("title", "Nombre incorrecto sin recomendación");
    }
    if(v===0)
        btcheck.setAttribute("class","btcheck");
    else btcheck.setAttribute("class","btcheckx");
    btcheck.setAttribute("id","btck"+i);
    btcheck.setAttribute("value",i);
    btcheck.addEventListener("click", funCorrige);
    return btcheck;
}
// Función que se ejecuta cuando un boton indica que se debe corregir
const funCorrige = (e) => {
    const bt = e.target;
    console.log("Id del boton:", bt.getAttribute("id"));
    console.log("Valor:",bt.value);
    if(bt.innerHTML === "✕"){
       
        const rowV = bt.value;
        // Obtiene el valor a corregir
        const table = document.getElementById("mainTb");
        const newName = table.rows[rowV].cells[2].innerHTML;
        // Si hay valor por corregir
        if(newName.length>4){
            table.rows[rowV].cells[2].innerHTML = "";
            table.rows[rowV].cells[1].innerHTML = newName;
            bt.innerHTML = "✓";
            bt.setAttribute("title", "Nombre correcto");
            bt.setAttribute("class","btcheck");
        }
        
    }
}

const funCorrigeTodo = ()=> {
    const table = document.getElementById("mainTb");
    let numRows = 0;
    if(table && table.rows) numRows=table.rows.length;
    let numCols = 0;
    if(numRows>0) numCols = table.rows[0].cells.length;
    // console.log('Filas:',numRows, '  Columnas:',numCols);
    let numCorr=0;
    for(let r = 1; r< numRows;r++){
        
        const newName = table.rows[r].cells[2].innerHTML;
        if(newName && newName.length>4){
            table.rows[r].cells[1].innerHTML = newName;
            table.rows[r].cells[2].innerHTML = "";
            numCorr ++;
            const bt = document.getElementById("btck"+r);
            bt.innerHTML = "✓";
            bt.setAttribute("title", "Nombre correcto");
            bt.setAttribute("class","btcheck");
        }
        
    }
    console.log("Numero de correcciones:", numCorr);
}
// Dibuja una tabla con botones a la izquierda
// que indican si el nombre es correcto o no
const drawTable = (data, checkList) =>{
    
    const tbl = document.createElement("table");
    const tblHead = document.createElement("thead");
    const tblBody = document.createElement("tbody");
    //Agrega el encabezado
    const headRow = document.createElement('tr');
    data[0].forEach( value =>{
        let cell = document.createElement("th");
        cell.appendChild(document.createTextNode(value))
        headRow.appendChild(cell);
    });
    tblHead.appendChild(headRow);
    for(let i = 1 ;i < data.length;i++){
        let row = document.createElement("tr");
        for(let j = 0; j< data[i].length;j++){
            let cell = document.createElement("td");
            cell.appendChild(document.createTextNode(data[i][j]))
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    tbl.setAttribute('class','normal');
    tbl.setAttribute('id','mainTb');
    const divTabla = document.getElementById('csv-output');
    divTabla.innerHTML = '';
    if(checkList){
        const tbcheck = create("table");

        const cellHead = create("th");
        cellHead.appendChild(document.createTextNode("#"));
        const tblr0 = create("tr");
        tblr0.appendChild(cellHead);
        const tblHead = create("thead");
        tblHead.appendChild(tblr0);

        const tblBody = document.createElement("tbody");
        for(let i =1;i<checkList.length;i++){
            const cell = create("td");
            cell.appendChild(createCheckBt(checkList[i],i));
            const row = create("tr");
            row.appendChild(cell);
            tblBody.appendChild(row);
        }
        tbcheck.appendChild(tblHead);
        tbcheck.appendChild(tblBody);
        tbcheck.setAttribute('class','tb-buttons-check');
        tbcheck.setAttribute('id','tbckbt');
        divTabla.appendChild(tbcheck);
    }

    divTabla.appendChild(tbl);
};

const btfunExportCsv = (evt) => {
    const data = getDataFromTable('mainTb');
    const sep = ',';
    const csvstring = dataArrayToCsv(data,sep);
    const bb = new Blob([csvstring], { type: 'text/plain' });
	const a = document.createElement('a');
    a.download = 'download.csv';
    a.href = window.URL.createObjectURL(bb);
    a.textContent = 'Download ready';
    a.style='display:none';
    a.click();    
}

// Valida una lista y ajusta el valor en la columna de recomendación
// Retorna una lista con valores enteros que indican:
// 0 : correcto
// 1 : incorrecto con un valor recomendado
// 2 : incorrecto sin valor recomendado
// -1: Formato incorrecto de la lista de datos
const validaLista = (lista) => {

    const checkList = []
    if(lista.length<2) return checkList;
    if(lista[0].length != 3){
        checkList.push(-1)
        console.log("Formato no válido");
        return checkList;
    }
    const c0 = lista[1][1].charAt(0);
    if(c0.toLowerCase() != c0){
        //Corrige todos los valores
        console.log("length",lista.length);
        for(let i=1;i<lista.length;i++){
            lista[i][1] = lista[i][1].toLowerCase();
        }
        console.log("Los datos se corrigieron a minúsculas");
    }

    const unmatched = [];
    lista.forEach( (e,i) => {
        if(i===0){
            checkList.push(0);
        }else if(pecesDB.indexOf(e[1]) > -1) checkList.push(0);
        else{
            checkList.push(2);
            unmatched.push(i);
        } 
    });
    const unmatchedId = [];
    unmatched.forEach( e => {
        const sn = lista[e][1];
        //transforma en un nombre
        const words = sn.split(" ");
        let snid=words[0].substring(0,3)+words[0].length;
        if (words.length >= 2)
            snid+= words[1].substring(0,3)+words[1].length;
        const imatch = pecesIdDB.indexOf(snid);
        if(imatch >-1){
            lista[e][2] = pecesDB[imatch];
            checkList[e] = 1;
        }
    });
    return checkList;
}


const showAbout = () =>{
    console.log("Acerca del validador de peces");
}