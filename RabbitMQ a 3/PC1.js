// ****** LIBRERIE ******
var amqp = require('amqplib/callback_api');
const dotenv = require('dotenv');
dotenv.config({ path: `config.env` });

// ****** COSTANTI DI AMBIENTE ******
const IP_addr = process.env.IP_address; // Indirizzo IP del server RabbitMQ
const IP_port = process.env.IP_port; // Porta del server RabbitMQ
const username = process.env.username; // Username del server RabbitMQ
const password = process.env.password; // Password del server RabbitMQ
const queue_send = process.env.queue_1; // Nome della query su cui inviare il messaggio
const queue_receive = process.env.queue_3; // Nome della query da ricevere

amqp.connect(`amqp://${username}:${password}@${IP_addr}:${IP_port}`, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var msg_send = "PC1"; // Messaggio da inviare
        var msg_received = ""; // Messaggio ricevuto

        // Creazione della query
        channel.assertQueue(queue_send, {
            durable: false
        });

        channel.assertQueue(queue_receive, {
            durable: false
        });

        console.log(" [*] Invio il messaggio nella query: %s.", queue_send);

        channel.consume(queue_receive, function (msg_received) {
            console.log(" [x] Received %s", msg_received.content.toString());
            msg_received = msg_received.content.toString();
        }, {
            noAck: true
        });

        channel.sendToQueue(queue_send, Buffer.from(msg_send));
    });
});