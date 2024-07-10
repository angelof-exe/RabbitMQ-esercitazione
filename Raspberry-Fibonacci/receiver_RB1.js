// ****** LIBRERIE ******
amqp = require('amqplib/callback_api');
const dotenv = require('dotenv');
dotenv.config({ path: `config.env` });

// ****** COSTANTI DI AMBIENTE ******
const IP_addr = process.env.IP_address; // Indirizzo IP del server RabbitMQ
const IP_port = process.env.IP_port; // Porta del server RabbitMQ
const username = process.env.username; // Username del server RabbitMQ
const password = process.env.password; // Password del server RabbitMQ
const exchange = process.env.exchange; // Nome dello scambio
const queue_results = process.env.queue_results; // Nome della coda

amqp.connect(`amqp://${username}:${password}@${IP_addr}:${IP_port}`, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            channel.bindQueue(q.queue, exchange, 'RB1'); //CAMBIARE L'ULTIMO PARAMETRO A SECONDA DELLA SCELTA

            channel.consume(q.queue, function (msg) {
                var startTime = performance.now()
                var r = fibonacci(parseInt(msg.content.toString()));
                var endTime = performance.now()
                console.log(" [x] RB2: '%s'", r.toString());

                channel.sendToQueue(queue_results, Buffer.from(`${r.toString()} RB1\nTempo di calcolo: ${endTime - startTime} ms`));
            }, {
                noAck: true
            });
        });
    });
});

function fibonacci(n) {
    if (n == 0 || n == 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}