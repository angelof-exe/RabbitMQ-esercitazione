var amqp = require('amqplib/callback_api');
var fs = require('fs');
var logStream = fs.createWriteStream('log_generale.txt');

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

    channel.assertQueue('', {
      exclusive: true
    }, function (error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      // Binda le code per le tutte le attività specifiche
      ['info', 'warning', 'error'].forEach(function (severity) {
        channel.bindQueue(q.queue, exchange, severity);
      });

      channel.consume(q.queue, function (msg) {
        var logMessage = ` [x] ${msg.fields.routingKey}: '${msg.content.toString()}'\n`;
        console.log(logMessage);
        logStream.write(logMessage);  // Scrive il log nel file
      }, {
        noAck: true
      });
    });
  });
});
