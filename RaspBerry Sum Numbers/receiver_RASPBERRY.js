// ****** LIBRERIE ******
amqp = require('amqplib/callback_api');
const dotenv = require('dotenv');
dotenv.config({ path: `config.env` });

// ****** COSTANTI DI AMBIENTE ******
const IP_addr = process.env.IP_address; // Indirizzo IP del server RabbitMQ
const IP_port = process.env.IP_port; // Porta del server RabbitMQ
const username = process.env.username; // Username del server RabbitMQ
const password = process.env.password; // Password del server RabbitMQ
const queue_numbers = process.env.queue_numbers; // Queue dei numeri da calcolare
const queue_results = process.env.queue_results; // Queue dei risultati (nueri calcolati)

amqp.connect(`amqp://${username}:${password}@${IP_addr}:${IP_port}`, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queue_results);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue_numbers);
        channel.consume(queue_numbers, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());

            setTimeout(function () {
                const obj = JSON.parse(msg.content.toString());
                console.log(obj);
                sum_numbers = sumNumbers(obj.first_number, obj.second_number);
                channel.sendToQueue(queue_results, Buffer.from(JSON.stringify({ sum: sum_numbers })));
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        });
    });
});

function sumNumbers(first_number, second_number) {
    return parseInt(first_number) + parseInt(second_number);
}