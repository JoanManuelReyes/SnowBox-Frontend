document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar el campo de usuario y contraseña
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Función para permitir solo números y un máximo de 8 caracteres en el campo de usuario
    usernameInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, ''); // Eliminar cualquier cosa que no sea un número
        if (this.value.length > 8) {
            this.value = this.value.slice(0, 8); // Limitar a 8 dígitos
        }
    });

    // Función para limitar el campo de contraseña a un máximo de 8 caracteres
    passwordInput.addEventListener('input', function () {
        if (this.value.length > 8) {
            this.value = this.value.slice(0, 8); // Limitar a 8 caracteres
        }
    });
});


function enviarDatos(event) {
    event.preventDefault();

    const data = {
        dni: document.getElementById('username').value,
        contrasenia: document.getElementById('password').value
    };

    fetch('https://snowbox-backend-production.up.railway.app/api/equipologistica/login', {
        method: "POST",
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
            localStorage.setItem('tipoUsuario', result.message);
            Swal.fire({
                icon: 'success',
                title: 'Listo',
                text: 'Inicio de sesión correcto'
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    window.location.href = `src/Dash/Inventario.html`;
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
                    window.location.href = 'index.html';
                }
            });
        });
}
