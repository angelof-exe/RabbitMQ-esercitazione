var amqp = require('amqplib/callback_api');

amqp.connect('amqp://raspberry:raspberry@192.168.2.163:5672', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'prova_direct_exchange';
        // console.log(process.argv);
        var args = process.argv.slice(2);

        var msg = args.slice(1).join(' ') || 'Hello World!';
        var severity = (args.length > 0) ? args[0] : 'info';

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);
    });

    setTimeout(function () {
        connection.close();
        process.exit(0)
    }, 500);
});