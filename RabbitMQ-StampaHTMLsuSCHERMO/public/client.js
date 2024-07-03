const nome = document.getElementById('nome');
const cognome = document.getElementById('cognome');
const anno = document.getElementById('anno');
const button = document.getElementById('button');

button.addEventListener('click', function () {
    console.log(`Nome: ${nome.value} Cognome: ${cognome.value} Anno: ${anno.value}`)
    fetch('/send',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome.value, cognome: cognome.value, anno: anno.value
            })
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});

