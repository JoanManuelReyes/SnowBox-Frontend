document.addEventListener('DOMContentLoaded', cargarDatosTabla);
document.addEventListener('DOMContentLoaded', cargarDatosProductos);

function cargarDatosTabla() {
    fetch('https://snowbox-backend-production.up.railway.app/api/producto/datosTablaReportes')
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
                        <td>${item.id}</td>
                        <td>${item.tipo}</td>
                        <td class="text-center">${item.nombre_producto} - ${item.id_producto}</td>
                        <td class="text-center">${item.cantidad}</td>
                        <td class="text-center">${formatFecha(item.fecha)}</td>
                    </tr>
                `;
                tablaBody.innerHTML += fila;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function cargarDatosProductos() {
    fetch('https://snowbox-backend-production.up.railway.app/api/producto/listarTodos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos de la API');
            }
            return response.json();
        })
        .then(datos => {
            const selectProductos = document.getElementById('producto');
            selectProductos.innerHTML = '';
            
            const option1 = document.createElement('option');
            option1.selected = true;
            option1.disabled = true;
            option1.textContent = `Producto`;
            selectProductos.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = 0;
            option2.textContent = `Todos`;
            selectProductos.appendChild(option2);

            datos.forEach(producto => {
                const option = document.createElement('option');
                option.value = `${producto.nombre} - ${producto.id}`;
                option.textContent = `${producto.nombre} - ${producto.id}`;
                selectProductos.appendChild(option);
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

$(document).ready(function () {
    $('#producto').select2();
    // Variables para almacenar el filtro seleccionado
    let selectedProduct = "0";
    let startDate = moment("01-01-2021", "DD-MM-YYYY");
    let endDate = moment();

    // Función de filtrado combinada
    function applyFilters() {
        $('#registers-table tbody tr').each(function () {
            let productCell = $(this).find('td:eq(2)').text();
            let dateCell = $(this).find('td:eq(4)').text();
            let rowDate = moment(dateCell, 'DD-MM-YYYY');

            let productMatch = (selectedProduct == "0" || productCell == selectedProduct);
            let dateMatch = rowDate.isBetween(startDate, endDate, null, '[]');

            if (productMatch && dateMatch) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $('#producto').on('change', function () {
        selectedProduct = $(this).val(); // Actualiza el producto seleccionado
        applyFilters(); // Aplica los filtros combinados
    });

    // Configuración inicial de las fechas
    moment.locale('es');
    function cb(start, end) {
        $('#reportrange span').html(start.format('D MMMM YYYY') + ' - ' + end.format('D MMMM YYYY'));
    }

    // Inicializa el componente de rango de fechas
    $('#reportrange').daterangepicker({
        showDropdowns: true,
        minYear: 2021,
        linkedCalendars: false,
        startDate: startDate,
        endDate: endDate,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Mes Anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        locale: {
            format: 'DD-MM-YYYY',
            separator: ' - ',
            applyLabel: 'Aplicar',
            cancelLabel: 'Cancelar',
            fromLabel: 'Desde',
            toLabel: 'Hasta',
            customRangeLabel: 'Personalizado',
            daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            firstDay: 1
        }
    }, cb);

    cb(startDate, endDate);

    // Filtro por rango de fechas
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
        // Actualiza las fechas seleccionadas
        startDate = picker.startDate;
        endDate = picker.endDate;
        applyFilters(); // Aplica los filtros combinados
    });

    document.getElementById('savePdf').addEventListener('click', function () {
        const producto = document.getElementById('producto').value;
        const startDateFormatted = startDate.format('YYYY-MM-DD');
        const endDateFormatted = endDate.format('YYYY-MM-DD');

        const data = {
            producto: producto,
            dateRange: `${startDateFormatted} - ${endDateFormatted}`
        };
        
        fetch('https://snowbox-backend-production.up.railway.app/api/pdf/generar', {
            method: 'POST',
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
        
    });
});


function formatFecha(fecha) {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}-${mes}-${anio}`;
}