// Obtiene el formulario
const form = document.querySelector('#login-form');

// Maneja el evento submit del formulario
form.addEventListener('submit', (event) => {
    // Previene el comportamiento predeterminado del formulario
    event.preventDefault();

    // Obtiene los valores de los campos de entrada de usuario
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Crea un nuevo objeto JSON con los valores de entrada de usuario
    const usuario = { email: email, password: password };

    // Muestra un mensaje de bienvenida usando SweetAlert
    Swal.fire({
        title: 'Bienvenido!',
        text: `Usuario: ${usuario.email}`,
        icon: 'success',
        confirmButtonText: 'Ok'
    });
});
function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.querySelector(".toggle-password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.innerHTML = "👁️";
    } else {
        passwordInput.type = "password";
        toggleButton.innerHTML = "👁️";
    }
}
