const tbody = document.querySelector("tbody");
let datos = [];
let datosTabla = [];
let datosCargados = false;
document.addEventListener("DOMContentLoaded", cargarDatosDesdeArchivo());

 // Función para cargar los datos desde el archivo
function cargarDatosDesdeArchivo() {
    fetch("samples")
        .then(response => response.text())
        .then( data => 
            {            
                datos = data.split("\n").map(linea => 
                    {
                    const [name, phone, email] = linea.split(",");
                    return { name, phone, email };
                    });
                    construirJson(datos);                 
            })
        .catch(error => console.error("Error al cargar los datos:", error));   
                
}
function construirJson (futuroJson){
    const stringifyObj = [];
    futuroJson.forEach(item => {
        const objJsonSinConvertir = {
            name: item.name,
            email: item.email,
            phone: verificarCantidadPhone(item.phone)
        };
        stringifyObj.push(JSON.stringify(objJsonSinConvertir));   
        
    });
    enviarJson(stringifyObj);  
}

function verificarCantidadPhone(objPhone){ 
    
    while(objPhone.length < 10){
        objPhone = "0" + objPhone;
    }   
    return setPhoneFormat(objPhone);     
}

function setPhoneFormat(objPhone){
    const arrayPhone = Array.from(objPhone);
    for(let i=0; i<arrayPhone.length;i++){
        if(i==2 || i==5){
            arrayPhone[i] = objPhone[i]+"-"
        }
    }
    const correctPhone = arrayPhone.toString().replace(/,/g, "");
    return correctPhone;
}

async function okRequest(jsonItem){
    try{
        const response = await fetch('https://8j5baasof2.execute-api.us-west-2.amazonaws.com/production/tests/trucode/items', {
            method: 'POST', // Método de la solicitud, en este caso, POST
            headers: {
                'Content-Type': 'application/json' // Indica que estás enviando JSON en el cuerpo
            }, 
            body: jsonItem
        });
        if(!response.ok){
            okRequest(jsonItem);
        }    
    }catch(e){
        console.log(e);
    }
    
}

function enviarJson(jsonArr){ 
    jsonArr.forEach(jsonItem =>  okRequest(jsonItem));  
}

function recibirJson() 
{
    fetch ('https://8j5baasof2.execute-api.us-west-2.amazonaws.com/production/tests/trucode/items')
    .then(res => res.json()) 
    .then(data => 
        {          
            data.items.forEach(item => {
                datosTabla.push(item);                                
            });            
            crearTablaconDatos();
        })
    .catch(error => console.log ("Error al cargar datos", error));
}

function crearTablaconDatos(){
    if(!datosCargados && datosTabla.length == 10){
        datosCargados = true;
        tbody.innerHTML = "";  
        datosTabla.forEach((dato, index) => {                
            const fila = document.createElement("tr");
            const filaClassName = "tr-"+index;
            fila.setAttribute("id", filaClassName);
            fila.innerHTML = `
                <td id="nombre-${dato.name}">${dato.name}</td>
                <td id="email-${dato.email}">${dato.email}</td>
                <td id="phone-${dato.phone}">${dato.phone}</td>
            `;
            tbody.appendChild(fila);
        });
    }
}
