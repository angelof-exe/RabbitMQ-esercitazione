// ****** LIBRERIE ******
const amqp = require('amqplib/callback_api');
const express = require('express');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
dotenv.config({ path: `config.env` });

// ****** COSTANTI DI AMBIENTE ******
const IP_addr = process.env.IP_address; // Indirizzo IP del server RabbitMQ
const IP_port = process.env.IP_port; // Porta del server RabbitMQ
const username = process.env.username; // Username del server RabbitMQ
const password = process.env.password; // Password del server RabbitMQ
const queue_numbers = process.env.queue_numbers; // Nome della coda
const SERVERPORT = 3000;
const app = express();

// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8080 });

app.use(express.static('public'));
app.use(express.json());

//##################################################################
//#     Evocazione dello script receiver.js e altre impostazioni   #
//##################################################################
const receiveLogs = spawn('node', ['main_receiver.js']); // Avvia lo script receiver.js

receiveLogs.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

receiveLogs.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

receiveLogs.on('close', (code) => {
    console.log(`main_receiver.js exited with code ${code}`);
});

//##############################################################
//#                    Richiesta di Post                       
//##############################################################

app.post('/somma', (req, res) => {
    var msg = req.body;
    console.log(msg);
    amqp.connect(`amqp://${username}:${password}@${IP_addr}:${IP_port}`, function (error0, connection) {
        if (error0) {
            throw error0;
        }

        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(queue_numbers);
            channel.sendToQueue(queue_numbers, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s", msg);
        });

        setTimeout(function () {
            connection.close();
        }, 500);
    });
    res.send('POST request to the homepage');
})

app.listen(SERVERPORT, () => console.log(`Example app listening at http://localhost:${SERVERPORT}`))