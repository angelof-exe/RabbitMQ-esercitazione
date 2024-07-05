amqp = require('amqplib/callback_api');

amqp.connect('amqp://raspberry:raspberry@192.168.2.163:5672', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'raspberry';

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;

            // channel.sendtoQueue('raspberry', Buffer.from(msg.content.toString()));



            console.log(" [x] Received %s", msg.content.toString());

            setTimeout(function () {
                const obj = JSON.parse(msg.content.toString());
                obj.nome = `${obj.nome} RASPBERRY`
                console.log(obj.nome);
                channel.sendToQueue('raspberry2', Buffer.from(JSON.stringify(obj)));

                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        });
    });
});