// Llamar a la función para cargar datos al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatosUsuarios);

function cargarDatosUsuarios() {
    fetch('https://snowbox-backend-production.up.railway.app/api/equipologistica/listar')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos de la API');
            }
            return response.json();
        })
        .then(datos => {
            const tablaBody = document.getElementById('tabla-body');
            tablaBody.innerHTML = ''; // Limpiar contenido existente
            
            datos.forEach(item => {
                if(item.id !== 1){
                    const fila = `
                    <tr class="selectable-row" onclick="fillForm('${item.id}', '${item.nombre_completo}', '${item.dni}', '${item.telefono}')">
                        <td class="text-center">${item.id}</td>
                        <td>${item.nombre_completo}</td>
                        <td>${item.dni}</td>
                        <td class="text-center">****</td>
                        <td class="text-center">${item.telefono}</td>
                    </tr>
                `;
                tablaBody.innerHTML += fila;
                }
            });

            $(document).ready(function(){
                $('#example').DataTable({
                    "language": {
                        "decimal":        "",
                        "emptyTable":     "No hay datos disponibles en la tabla",
                        "info":           "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                        "infoEmpty":      "Mostrando 0 a 0 de 0 entradas",
                        "infoFiltered":   "(filtrado de _MAX_ entradas en total)",
                        "infoPostFix":    "",
                        "thousands":      ",",
                        "lengthMenu":     "Mostrar _MENU_ entradas",
                        "loadingRecords": "Cargando...",
                        "processing":     "Procesando...",
                        "search":         "Buscar:",
                        "zeroRecords":    "No se encontraron registros coincidentes",
                        "paginate": {
                            "first":      "Primera",
                            "last":       "Última",
                            "next":       "Siguiente",
                            "previous":   "Anterior"
                        },
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function fillForm(codigo, nombre, dni, telefono) {
    // Llenar los inputs con los datos de la fila seleccionada
    document.getElementById('codigo-input').value = codigo;
    document.getElementById('dni-input').value = dni;
    document.getElementById('telefono-input').value = telefono;
    document.getElementById('nombre-input').value = nombre;
}

function setMethodAndAction(method) {
    const form = document.getElementById('registrosForm');
    form.dataset.method = method;
    const id = document.getElementById('codigo-input').value;
    if (method === 'POST') {
        form.dataset.action = 'https://snowbox-backend-production.up.railway.app/api/equipologistica/crearUsuario';
    }
    if (method === 'PUT') {
        form.dataset.action = 'https://snowbox-backend-production.up.railway.app/api/equipologistica/modificarUsuario/'+ id;
    }
    if (method === 'DELETE') {
        form.dataset.action = 'https://snowbox-backend-production.up.railway.app/api/equipologistica/eliminarUsuario/'+ id;
    }
}

function enviarDatos(event) {
    event.preventDefault();

    const form = document.getElementById('registrosForm');

    const data = {
        id: document.getElementById('codigo-input').value,
        nombre: document.getElementById('nombre-input').value,
        dni: document.getElementById('dni-input').value,
        contrasenia: document.getElementById('contrasenia-input').value,
        telefono: document.getElementById('telefono-input').value
    };

    console.log(data);

    fetch(form.dataset.action, {
        method: form.dataset.method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la API: ${response.statusText}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Respuesta de la API:', result);
            Swal.fire({
                icon: 'success',
                title: 'Listo',
                text: 'Se hicieron los cambios correctamente'
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    window.location.href = `Configuracion.html`;
                }
            });
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Porfavor, revisa los datos'
            })
        });
}

function validarEntradas(input) {
    if (input.value < 0) {
        input.value = 0; // Restablecer a 0 si se intenta ingresar un número negativo
    }
}

function validarSalidas(input) {
    if (input.value < 0) {
        input.value = 0; // Restablecer a 0 si se intenta ingresar un número negativo
    }
}


