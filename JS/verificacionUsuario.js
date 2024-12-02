document.addEventListener('DOMContentLoaded', verificarUsuario);

function verificarUsuario() {
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
        window.location.href = '../../index.html'; // Redirige a la página de inicio de sesión
    }

    if (idUsuario === '1') {
        document.getElementById('tipo-usuario').style.display = 'inline';
        document.getElementById('menu-configuracion').style.display = 'inline';
    } else {
        document.getElementById('tipo-usuario').style.display = 'none';
        document.getElementById('menu-configuracion').style.display = 'none';
    }

}

function cerrarSesion() {
    localStorage.removeItem('idUsuario');
    location.reload();
}