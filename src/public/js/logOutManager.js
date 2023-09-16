const form = document.getElementById('log-out-session-Form');

// Cambia el manejador de eventos submit para que apunte a /session
form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(form);

    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    fetch('/logout', { // Cambia la ruta a /session para el inicio de sesión
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
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
})
