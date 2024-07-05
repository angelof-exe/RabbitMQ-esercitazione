const first_number = document.getElementById('first_number');
const second_number = document.getElementById('second_number');
const button = document.getElementById('button');
const socket = new WebSocket('ws://localhost:8080');
const result = document.getElementById('display');
//##################################################################
//#     Configurazione WebSocket per creare componeneti HTML       #
//##################################################################

socket.addEventListener('open', function (event) {
    console.log('WebSocket is connected.');
});

// Quando nella Socket arriva un messaggio, viene aggiunto nel div result il contenuto del messaggio
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    const data = JSON.parse(event.data);
    result.innerHTML += createComponent(data);
});

//##################################################################
//#        BUTTON CLICK EVENT PER INVIO DATI AL SERVER             #
//##################################################################

button.addEventListener('click', function () {
    obj = JSON.stringify({
        first_number: first_number.value,
        second_number: second_number.value
    })

    fetch('/somma', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: obj
    })
        .then(response => response.text())
        .then(data => console.log(data));
});

function createComponent(componente) {
    return `
    <div>
        <h1>SOMMA</h1>
        <h2>${componente.sum}</h2>
    </div>
    `;
}