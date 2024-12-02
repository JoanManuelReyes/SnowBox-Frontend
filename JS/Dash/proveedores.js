document.addEventListener('DOMContentLoaded', cargarDatosTabla);

function cargarDatosTabla() {
    fetch('https://snowbox-backend-production.up.railway.app/api/proveedor/listarTodos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos de la API');
            }
            return response.json();
        })
        .then(datos => {
            const tablaBody = document.getElementById('tabla-body');
            tablaBody.innerHTML = '';
            
            datos.forEach(item => {
                const fila = `
                    <tr class="selectable-row" onclick="fillForm('${item.id}', '${item.nombre}', '${item.ruc}', '${item.telefono}', '${item.correo}')">
                        <td class="text-center">${item.id}</td>
                        <td>${item.nombre}</td>
                        <td>${item.ruc}</td>
                        <td>${item.telefono}</td>
                        <td class="text-center">${item.correo}</td>
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

function fillForm(codigo,nombre,ruc,telefono,correo) {
    // Llenar los inputs con los datos de la fila seleccionada
    document.getElementById('codigo-input').value = codigo;
    document.getElementById('nombre-input').value = nombre;
    document.getElementById('ruc-input').value = ruc;
    document.getElementById('telefono-input').value = telefono;
    document.getElementById('correo_proveedor').value = correo;

    fetch('https://snowbox-backend-production.up.railway.app/api/producto/listarTodos')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Filtrar los productos por proveedor_id que coincida con 'codigo'
        const filteredProducts = data.filter(product => product.proveedor_id == codigo);

        // Limpiar la tabla antes de llenarla
        const table = document.getElementById('productos-table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Productos</th>
                </tr>
            </thead>
            <tbody>
                ${filteredProducts.map(product => `<tr><td>${product.nombre}</td></tr>`).join('')}
            </tbody>
        `;
    })
    .catch(error => {
        console.error('Error al consultar la API:', error);
    });

}

function setMethodAndAction(method) {
    const form = document.getElementById('registrosForm');
    form.dataset.method = method;
    if (method === 'POST') {
        form.dataset.action = 'https://snowbox-backend-production.up.railway.app/api/proveedor/registrarProveedor';
    } else {
        const id = document.getElementById('codigo-input').value;
        form.dataset.action = 'https://snowbox-backend-production.up.railway.app/api/proveedor/modificarProveedor/'+ id;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ruc-input').addEventListener('keypress', function(event) {
        // Solo permite números
        const keyCode = event.keyCode || event.which;
        if (keyCode < 48 || keyCode > 57) {
            event.preventDefault(); // Bloquea el ingreso si no es un número
        }
    });

    document.getElementById('telefono-input').addEventListener('keypress', function(event) {
        // Solo permite números
        const keyCode = event.keyCode || event.which;
        if (keyCode < 48 || keyCode > 57) {
            event.preventDefault(); // Bloquea el ingreso si no es un número
        }
    });

});


function enviarDatos(event) {
    event.preventDefault();

    const form = document.getElementById('registrosForm');

    const data = {
        id: document.getElementById('codigo-input').value,
        nombre: document.getElementById('nombre-input').value,
        ruc: document.getElementById('ruc-input').value,
        telefono: document.getElementById('telefono-input').value,
        correo: document.getElementById('correo_proveedor').value,
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
                    window.location.href = `Proveedores.html`;
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
