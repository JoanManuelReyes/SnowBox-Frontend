document.addEventListener('DOMContentLoaded', cargarDatosTabla);
document.addEventListener('DOMContentLoaded', cargarDatosProducto);

function cargarDatosTabla() {
    fetch('https://snowbox-backend-production.up.railway.app/api/solicitud/listarSolicitudesModulo')
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
                    <tr>
                        <td class="text-center">${item.id}</td>
                        <td class="text-center">${item.usuario_id}</td>
                        <td>${item.producto_nombre} - ${item.producto_id}</td>
                        <td class="text-center">${item.fecha}</td>
                        <td class="text-center">${item.cantidad}</td>
                        <td class="text-center">${item.tipo}</td>
                        <td class="text-center">${item.estado}</td>
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

function cargarDatosProducto() {
    fetch('https://snowbox-backend-production.up.railway.app/api/producto/listarTodos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos de la API');
            }
            return response.json();
        })
        .then(datos => {
            const selectProveedores = document.getElementById('producto');
            selectProveedores.innerHTML = '';
            
            const option = document.createElement('option');
            option.value = 0;
            option.selected = true;
            option.disabled = true;
            option.textContent = `Producto`;
            selectProveedores.appendChild(option);

            datos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.id;
                option.textContent = `${producto.nombre} - ${producto.id}`;
                selectProveedores.appendChild(option);
            });

            $(document).ready(function(){
                $('#proveedores').select2();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function setMethodAndAction() {
    const form = document.getElementById('registrosForm');
    form.dataset.method = 'POST'
    const tipo = document.getElementById('tipo').value;
    if (tipo === "1"){
        form.dataset.action = 'https://snowbox-backend-production.up.railway.app/api/compra/generar';
    }else{
        form.dataset.action = 'https://snowbox-backend-production.up.railway.app/api/devolucion/generar';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cantidad-input').addEventListener('keypress', function(event) {
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
        id_usuario: localStorage.getItem('idUsuario'),
        id_producto: document.getElementById('producto').value,
        cantidad: document.getElementById('cantidad-input').value,
        descripcion: document.getElementById('descripcion_solicitud').value,
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
                    window.location.href = `ComprasDevoluciones.html`;
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
                    window.location.href = 'ComprasDevoluciones.html';
                }
            });
        });
}
