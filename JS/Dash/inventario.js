function cargarDatosTablaInv() {
    fetch('https://snowbox-backend-production.up.railway.app/api/producto/datosTablaInventario')
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
                const fila = `
                    <tr class="selectable-row" onclick="fillForm('${item.id}', '${item.nombre}', '${item.descripcion}', '${item.entradas}', '${item.salidas}', '${item.proveedor_id}')">
                        <td class="text-center">${item.id}</td>
                        <td>${item.nombre}</td>
                        <td>${item.descripcion}</td>
                        <td class="text-center">${item.entradas}</td>
                        <td class="text-center">${item.salidas}</td>
                        <td class="text-center">${item.devoluciones}</td>
                        <td class="text-center">${item.stock}</td>
                    </tr>
                `;
                tablaBody.innerHTML += fila;
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


function cargarDatosTablaRestock() {
    fetch('https://snowbox-backend-production.up.railway.app/api/producto/datosTablaRestock')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos de la API');
            }
            return response.json();
        })
        .then(datos => {
            const tablaBody = document.getElementById('tabla-restock');
            tablaBody.innerHTML = ''; // Limpiar contenido existente
            
            datos.forEach(item => {
                const fila = `
                    <tr class="selectable-row" onclick="fillForm('${item.id}', '${item.nombre}', '${item.descripcion}', '${item.entradas}', '${item.salidas}', '${item.proveedor_id}')">
                        <td>${item.id}</td>
                        <td>${item.nombre}</td>
                        <td>${item.stock}</td>
                    </tr>
                `;
                tablaBody.innerHTML += fila;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Llamar a la función para cargar datos al cargar la página
document.addEventListener('DOMContentLoaded', verificarUsuario);
document.addEventListener('DOMContentLoaded', cargarDatosTablaInv);
document.addEventListener('DOMContentLoaded', cargarDatosTablaRestock);


const tipoUsuario = localStorage.getItem('tipoUsuario');
console.log(tipoUsuario);

function verificarUsuario() {
    if (!localStorage.getItem('tipoUsuario')) {
        window.location.href = '../../index.html'; // Redirige a la página de inicio de sesión
    }
}

function fillForm(codigo, producto, descripcion, entradas, salidas, proveedor) {
    // Llenar los inputs con los datos de la fila seleccionada
    //console.log('Datos recibidos en fillForm:', { codigo, producto, descripcion, entradas, salidas, proveedor });
    document.getElementById('codigo-input').value = codigo;
    document.getElementById('producto-input').value = producto;
    document.getElementById('descripcion-input').value = descripcion;
    document.getElementById('entradas-input').value = entradas;
    document.getElementById('salidas-input').value = salidas;
    document.getElementById('codigo_proveedor').value = proveedor;
}

function setMethodAndAction(method) {
    const form = document.getElementById('productForm');
    form.dataset.method = method;
    if (method === 'post') {
        form.dataset.action = 'https://snowbox-backend-production.up.railway.app/api/producto/registrarProducto';
    } else {
        const id = document.getElementById('codigo-input').value;
        form.dataset.action = 'https://snowbox-backend-production.up.railway.app/api/producto/modificarProducto/'+ id;
    }
}

function enviarDatos(event) {
    event.preventDefault();

    const form = document.getElementById('productForm');

    const data = {
        id: document.getElementById('codigo-input').value,
        nombre: document.getElementById('producto-input').value,
        descripcion: document.getElementById('descripcion-input').value,
        entradas: document.getElementById('entradas-input').value,
        salidas: document.getElementById('salidas-input').value,
        proveedor: document.getElementById('codigo_proveedor').value
    };

    const method = form.dataset.method;
    const action = form.dataset.action;

    fetch(action, {
        method: method.toUpperCase(),
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
                    window.location.href = `Inventario.html`;
                }
            });
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Porfavor, revisa los datos'
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    window.location.href = 'Inventario.html';
                }
            });
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