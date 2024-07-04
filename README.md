

# Lista di progetti fatti con RabbitMQ per JavaScript


# Tabella dei contenuti

1. [Rabbit Routing HTML](#rabbit-routing-html)
2. [RabbitMQ StampaHTML su SCHERMO senza salvare file](#RabbitMQ-StampaHTMLsuSCHERMO)

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

## RabbitMQ-StampaHTMLsuSCHERMO


<img src="https://raw.githubusercontent.com/angelof-exe/RabbitMQ-esercitazione/main/RabbitMQ-StampaHTMLsuSCHERMO/screenshot/video_dimostrativo.gif" width="70%"/>

Secondo progetto in cui si cerca di stampare su schermo ciò che viene inserito inviando una oggetto JSON. 

**IMPORTANTE!**
>Per fare modo di inviare dati *SENZA* la necessità di dover salvare il file JSON, è stato utilizzata una WebSocket alla porta 8080, di conseguenza bisognerà importare il modulo `const  WebSocket  =  require('ws');`

### Descrizione
Ne file `server.js` non c'è granche di importante viene effettuata una connessione con `amqp.connect` e si invia tramite `channel.sendToQueue` il messaggio (JSON) 
```
var msg =  JSON.stringify({
	nome: nome,
	cognome: cognome,
	anno: anno
});
```

#### Spiegazione file client.js
Nel client viene aperta una WebSocket alla porta 8080 tramite 
`const  socket  =  new  WebSocket('ws://localhost:8080');`

IMPORTANTE!
In questo pezzo di codice sotto, viene "ascoltato" l'evento della socket, ovvero: Quando riceve un messaggio (Che viene inviato dal receiver.js) esso stamperà sull'HTML il contenuto che ha ricevuto.
```
socket.addEventListener('message', function (event) {
	console.log('Message from server ', event.data);
	const  data  =  JSON.parse(event.data);
	result.innerHTML  +=  createComponent(data);
});
```

#### Spiegazione receiver.js
Nel receiver ovviamente ci connettiamo alla WebSocket 
`const  wss  =  new WebSocket.Server({ port:  8080 });`

Questo pezzo di codice è **importante**, nella funzione "consume" vengono per l'appunto consumati i messaggi che si trovano nella queue (Chiamata per semplicità 'prova_json') . Quando il consumer riceve una messaggio dalla queue, la invia al web socket mediante la funzione `client.send(msg.content.toString());`

```
channel.consume(queue, function (msg) {
	var secs = msg.content.toString().split('.').length  -  1;  
	console.log(" [x] Received %s", msg.content.toString());  

	// Send the message to all connected WebSocket clients
	wss.clients.forEach(function (client) {
		if (client.readyState  === WebSocket.OPEN) {
			client.send(msg.content.toString());
		}
	});
	setTimeout(function () {
		console.log(" [x] Done");
		channel.ack(msg);
	}, secs *  1000);

}, {

	noAck:  false

});
```
