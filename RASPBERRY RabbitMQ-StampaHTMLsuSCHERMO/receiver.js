const fs = require('fs');
var amqp = require('amqplib/callback_api');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function (ws) {
    console.log('WebSocket connection established');
});

amqp.connect('amqp://raspberry:raspberry@192.168.2.163:5672', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'prova_json';
        var queue_raspberry = 'raspberry';
        var queue_raspberry2 = 'raspberry2';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.assertQueue(queue_raspberry, {
            durable: true
        });

        channel.assertQueue(queue_raspberry2, {
            durable: true
        });

        // console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue_raspberry2, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;
            console.log(" [x] Received %s", msg.content.toString());

            // Send the message to all connected WebSocket clients
            wss.clients.forEach(function (client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(msg.content.toString());
                }
            });

            setTimeout(function () {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        });

        channel.consume(queue, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;

            //#######################
            // Ri-invia al raspberry
            //#######################
            channel.sendToQueue(queue_raspberry, Buffer.from(msg.content.toString()));

            console.log(" [x] Received %s", msg.content.toString());

            // Send the message to all connected WebSocket clients
            wss.clients.forEach(function (client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(msg.content.toString());
                }
            });

            setTimeout(function () {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        });
    });
});
