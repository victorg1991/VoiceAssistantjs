'use strict';

const util = require('util');
const fs = require('fs');
const dialogflow = require('dialogflow');
// const mic = require('mic');

let filename = 'test.wav';
// filename = 'audios/enciende_la_luz.wav';
filename = 'audios/apaga_la_luz_en_10_segundos.wav';
// filename = 'audios/enciende_el_servo.wav';

const config = {
    rate: 16000,
    channels: 1,
    debug: true,
    fileType: 'wav',
    exitOnSilence: 30
};

// const micInstance = mic(config);
// const stream = micInstance.getAudioStream();
//
// const outputFileStream = fs.WriteStream(filename);
//
// stream.pipe(outputFileStream);
//
// micInstance.start();

// stream.on('data', function (data) {
//     console.log('Recieved Input Stream: ' + data.length);
// });
//
// stream.on('error', function (err) {
//     console.log('Error in Input Stream: ' + err);
// });
//
// stream.on('startComplete', function () {
//     console.log('Received startComplete');
// });
//
// stream.on('stopComplete', function () {
//     console.log('Received stopComplete');
// });
//
// stream.on('pauseComplete', function () {
//     console.log('Received pauseComplete');
// });
//
// stream.on('resumeComplete', function () {
//     console.log('Received resumeComplete');
// });
//
// stream.on('silence', function () {
//     console.log('Received silence... let\'s process it');
//
//     micInstance.stop();
//
//     detectAudioIntent(filename);
// });
//
// stream.on('processExitComplete', function () {
//     console.log('Got SIGNAL processExitComplete');
//
//     micInstance.stop();
// });

const sessionClient = new dialogflow.SessionsClient();
const session = sessionClient.sessionPath('multilocalesample-a62ad', 'sessionId');

detectAudioIntent(session, filename);

function detectAudioIntent(session, filename) {
    const readFile = util.promisify(fs.readFile);

    readFile(filename).then(inputAudio => {
        const request = {
            session, inputAudio,
            queryInput: {
                audioConfig:
                    {audioEncoding: 'AUDIO_ENCODING_LINEAR_16', sampleRateHertz: 16000, languageCode: 'es-ES'}
            }
        };
        return sessionClient.detectIntent(request);
    }).then(
        responses => console.log(responses[0].queryResult)
    ).catch(err => console.error('ERROR:', err));
}
