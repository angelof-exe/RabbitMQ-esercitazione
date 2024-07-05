// ****** LIBRERIE ******
amqp = require('amqplib/callback_api');
const dotenv = require('dotenv');
dotenv.config({ path: `config.env` });
const WebSocket = require('ws');

// ****** COSTANTI DI AMBIENTE ******
const IP_addr = process.env.IP_address; // Indirizzo IP del server RabbitMQ
const IP_port = process.env.IP_port; // Porta del server RabbitMQ
const username = process.env.username; // Username del server RabbitMQ
const password = process.env.password; // Password del server RabbitMQ
const queue_numbers = process.env.queue_numbers; // Nome della coda
const queue_results = process.env.queue_results; // Nome della coda
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function (ws) {
    console.log('WebSocket connection established');
});

amqp.connect(`amqp://${username}:${password}@${IP_addr}:${IP_port}`, function (error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queue_numbers);

        console.log(' [x] Sto aspettando risposta dal raspberry');
        channel.consume(queue_results, function reply(msg) {

            console.log(" [x] Received %s", msg.content.toString());

            webSocketSendMessage(msg); // Send the message to all connected WebSocket clients

            channel.ack(msg);
        });
    });
});

function webSocketSendMessage(msg) {
    wss.clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg.content.toString());
        }
    });
}