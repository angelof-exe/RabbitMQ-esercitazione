// Inizializzazione express e server
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { spawn } = require('child_process'); // -> Libreria necessaria per chiamare lo script
const amqp = require('amqplib/callback_api');

//##############################################################
// Evocazione dello script receiver.js e altre impostazioni
//##############################################################

const receiveLogs = spawn('node', ['receiver.js']);// Avvia lo script receiver.js

//Stampa sulla console del server .js ciò che viene stampato sullo script receiver.js 
receiveLogs.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

receiveLogs.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

receiveLogs.on('close', (code) => {
    console.log(`receive_logs_direct.js exited with code ${code}`);
});

//##############################################################
// POST
//##############################################################

app.post('/send', function (req, res) {
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const anno = req.body.anno;
    console.log(`|SERVER| Nome: ${nome}, Cognome: ${cognome}, Anno: ${anno}`);

    // AMQP SEND MESSAGE
    amqp.connect('amqp://raspberry:raspberry@192.168.2.163:5672', function (error0, connection) {
        if (error0) {
            throw error0;
        }

        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'prova_json';
            var msg = JSON.stringify({
                nome: nome,
                cognome: cognome,
                anno: anno
            });

            channel.assertQueue(queue, {
                durable: true
            });

            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });

        setTimeout(function () {
            connection.close();
        }, 500);
    });

    res.send('POST request to the homepage');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
