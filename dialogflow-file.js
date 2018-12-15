'use strict';

const dialogflow = require('./raspberry-dialogflow');

let filename = 'audios/apaga_la_luz_en_10_segundos.wav';
// filename = 'audios/enciende_la_luz.wav';
// filename = 'audios/enciende_el_servo.wav';

dialogflow.detectFile(filename).then(
    responses => console.log(responses[0].queryResult)
).catch(
    err => console.error('ERROR:', err)
);