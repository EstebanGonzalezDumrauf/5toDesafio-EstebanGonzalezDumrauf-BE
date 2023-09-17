const form = document.getElementById('loginForm');

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
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


form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(form);

    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    fetch('/session', { 
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: {
            'Content-type':'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.href = '/products'; //window.location.replace('/products')
        } else {
            const msjErrorLabel = document.getElementById('msjError');
            msjErrorLabel.textContent = "Usuario no encontrado o contraseña incorrecta";
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
})

const getCookie = () => {
    console.log(document.cookie);
}