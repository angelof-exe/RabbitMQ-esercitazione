
const inviaButton = document.getElementById('inviaButton');
const messaggio = document.getElementById('messaggio');
const sceltaInfo = document.getElementById('sceltaInfo');
const sceltaError = document.getElementById('sceltaError');
const sceltaWarning = document.getElementById('sceltaWarning');

inviaButton.addEventListener('click', function () {
    var scelta = '';
    var textMessaggio = messaggio.value;
    if (sceltaInfo.checked == true) {
        scelta = 'info';
    } else if (sceltaError.checked == true) {
        scelta = 'error';
    } else if (sceltaWarning.checked == true) {
        scelta = 'warning';
    }

    console.log(`Messaggio: ${textMessaggio} | Tipologia: ${scelta}`);

    //#####################################
    // Post sul server
    //#####################################

    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: textMessaggio, typeMessage: scelta })
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});
