const fs = require('fs');
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'prova_json';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());

            //#################################
            //SCRITTURA SUL FILE JSON
            //#################################

            // 1. read and write a .json file
            let filetesto_json = fs.readFileSync("file_testo.json", "utf-8");
            // 2. transform a json string into a javascript array
            let test = JSON.parse(filetesto_json);
            // 3. append an object to an array
            const arr = Array.from(test);
            arr.push(JSON.parse(msg.content.toString()));
            // 4. transform back the array into a json string
            filetesto_json = JSON.stringify(arr);
            // 5. save the json file
            fs.writeFileSync("file_testo.json", filetesto_json, "utf-8");


            setTimeout(function () {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            // manual acknowledgment mode,
            // see /docs/confirms for details
            noAck: false
        });
    });
});