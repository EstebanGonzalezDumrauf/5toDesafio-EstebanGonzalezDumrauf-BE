const form = document.getElementById('registerForm');

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const userField = document.getElementById('user');

    form.addEventListener('submit', function (event) {
        if (!validateEmail(userField.value)) {
            event.preventDefault();
            alert('Por favor, ingrese una dirección de correo electrónico válida.');
        }
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

// Cambia el manejador de eventos submit para que apunte a /session
form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(form);

    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    fetch('/registro', { // Cambia la ruta a /session para el inicio de sesión
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: {
            'Content-type':'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            // Redireccionar al usuario a la página de productos
            window.location.href = '/';
        } else {
            //console.log('Inicio de sesión fallido');
            const msjErrorLabel = document.getElementById('msjErrorRegistro');
            //console.log(result);
            msjErrorLabel.textContent = "Error al registrarse. Ya existe un usuario con ese e-mail.";
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
    
    //.then(result => result.json()).then(json=> console.log(json));
})
