const nome = document.getElementById('nome');
const cognome = document.getElementById('cognome');
const anno = document.getElementById('anno');
const button = document.getElementById('button');
const result = document.getElementById('result');

const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', function (event) {
    console.log('WebSocket is connected.');
});

// Quando nella Socket arriva un messaggio, viene aggiunto nel div result il contenuto del messaggio
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    const data = JSON.parse(event.data);
    result.innerHTML += createComponent(data);
});

button.addEventListener('click', function () {
    // console.log(`Nome: ${nome.value} Cognome: ${cognome.value} Anno: ${anno.value}`)
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome.value,
            cognome: cognome.value,
            anno: anno.value
        })
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});

function createComponent(componente) {
    return `
    <div class="card mx-4" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${componente.nome} ${componente.cognome}</h5>
            <p class="card-text">${componente.anno}</p>
        </div>
    </div>
    `;
}