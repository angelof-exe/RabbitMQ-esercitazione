const number_fibonacci = document.getElementById('number_fibonacci');
const button = document.getElementById('button');
const result_rb1 = document.getElementById('result_rb1');
const result_rb2 = document.getElementById('result_rb2');
const choice_rb1 = document.getElementById('choice_rb1');
const choice_rb2 = document.getElementById('choice_rb2');
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', function (event) {
    console.log('WebSocket is connected.');
});

socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    msg = event.data;
    console.log(`Messagio websocket: ${msg}`)

    if (msg.includes('RB1')) {
        msg = msg.replace('RB1', '')
        result_rb1.innerHTML = msg;
    } else if (msg.includes('RB2')) {
        msg = msg.replace('RB2', '')
        result_rb2.innerHTML = msg;
    }
});

button.addEventListener('click', function () {
    scelta = whichCoice();

    obj = JSON.stringify({
        number_fibonacci: number_fibonacci.value,
        scelta: scelta
    })

    fetch('/fibonacci', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: obj
    })
        .then(response => response.text())
        .then(data => console.log(data));
});

function whichCoice() {
    if (choice_rb1.checked == true) {
        return 'RB1';
    } else if (choice_rb2.checked == true) {
        return 'RB2';
    }
}