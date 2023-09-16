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
    fetch('/registro', {
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: {
            'Content-type':'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            // Redireccionar al usuario a la página de inicio
            //res.status(200);
            window.location.href = '/';
        } else if (result.status === 400) {
            // Usuario ya registrado
            const msjErrorLabel = document.getElementById('msjErrorRegistro');
            msjErrorLabel.textContent = "Error al registrarse. Ya existe un usuario con ese e-mail.";
        } else {
            console.log(result.status);
            // Manejar otros códigos de estado si es necesario
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
});
