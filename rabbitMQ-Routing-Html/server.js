const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const { spawn } = require('child_process');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Avvia lo script receive_logs_direct.js
const receiveLogs = spawn('node', ['receive_logs_direct.js', 'info', 'warning', 'error']);

receiveLogs.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

receiveLogs.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

receiveLogs.on('close', (code) => {
    console.log(`receive_logs_direct.js exited with code ${code}`);
});

app.post('/send', (req, res) => {
    const message = req.body.message;
    const typeMessage = req.body.typeMessage;

    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'direct_logs';

            channel.assertExchange(exchange, 'direct', {
                durable: false
            });
            channel.publish(exchange, typeMessage, Buffer.from(message));
            console.log(` [x] Sent ${typeMessage}: '${message}'`);
        });

        setTimeout(function () {
            connection.close();
        }, 500);
    });

    res.send('Message sent');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
