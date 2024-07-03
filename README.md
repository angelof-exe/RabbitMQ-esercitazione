
# Lista di progetti fatti con RabbitMQ per JavaScript


# Tabella dei contenuti

1. [Rabbit Routing HTML](#rabbit-routing-html)

## Rabbit Routing HTML
Primo progetto per mettere mano sul come far comunicare una semplice pagina HTML col server di AMQP tramite la libreria RabbitMQ per JavaScript
![ScreenShot_Progetto_1](https://raw.githubusercontent.com/angelof-exe/RabbitMQ-esercitazione/main/rabbitMQ-Routing-Html/screenshot/Schermata%20del%202024-07-03%2012-38-52.png)


### Descrizione

#### Spiegazione file Server.js
Il file `server.js` fa partire anche lo script per avviare il ricevitore ovvero il file`receive_logs_direct.js` tramite la libreria `child_process` e la funzione `spawn`, linea di codice:
```
const receiveLogs = spawn('node', ['receive_logs_direct.js', 'info', 'warning', 'error']);
```
Le seguenti stringe stampano sulla console ciò che viene stampato sulla console del file `receive_logs_direct.js`

```
receiveLogs.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

receiveLogs.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

receiveLogs.on('close', (code) => {
    console.log(`receive_logs_direct.js exited with code ${code}`);
});
```

#### Spiegazione file receive_logs_direct.js
```
      ['info', 'warning', 'error'].forEach(function (severity) {
        channel.bindQueue(q.queue, exchange, severity);
      });
```
Il seguente codice fa un binding tra l'exchange e la queue, ovvero la queue è interessato dei messaggi da questo exchange. [Per maggiori info clicca qui.](https://www.rabbitmq.com/tutorials/tutorial-four-javascript#bindings)
