'use strict';

const util = require('util');
const fs = require('fs');
const mic = require('mic');

const projectId = 'multilocalesample-a62ad';
const sessionId = 'sessionId';
const languageCode = 'es-ES';
const rate = 16000;
let filename = 'test.wav';
// filename = 'audios/enciende_la_luz.wav';
// filename = 'audios/apaga_la_luz_en_10_segundos.wav';
// filename = 'audios/enciende_el_servo.wav';

const config = {
    rate,
    channels: 1,
    debug: true,
    fileType: "wav",
    exitOnSilence: 30
};

const micInstance = mic(config);
const stream = micInstance.getAudioStream();

const outputFileStream = fs.WriteStream(filename);

stream.pipe(outputFileStream);

micInstance.start();

stream.on('data', function(data) {
    console.log("Recieved Input Stream: " + data.length);
});

stream.on('error', function(err) {
    console.log("Error in Input Stream: " + err);
});

stream.on('startComplete', function() {
    console.log("Received startComplete");
});

stream.on('stopComplete', function() {
    console.log("Received stopComplete");
});

stream.on('pauseComplete', function() {
    console.log("Received pauseComplete");
});

stream.on('resumeComplete', function() {
    console.log("Received resumeComplete");
});

stream.on('silence', function() {
    console.log("Received silence... let's process it");

    micInstance.stop();

    detectAudioIntent(projectId, sessionId, filename, 'AUDIO_ENCODING_LINEAR_16', rate, languageCode);
});

stream.on('processExitComplete', function() {
    console.log("Got SIGNAL processExitComplete");

    micInstance.stop();
});

// detectAudioIntent(projectId, sessionId, filename, 'AUDIO_ENCODING_LINEAR_16', rate, languageCode);

function detectAudioIntent(projectId, sessionId, filename, audioEncoding, sampleRateHertz, languageCode) {

    const dialogflow = require('dialogflow');

    const sessionClient = new dialogflow.SessionsClient();

    const session = sessionClient.sessionPath(projectId, sessionId);

    const readFile = util.promisify(fs.readFile);
    readFile(filename)
        .then(inputAudio => {
            const request = {
                session, inputAudio,
                queryInput: {audioConfig: {audioEncoding, sampleRateHertz, languageCode}},
            };
            return sessionClient.detectIntent(request);
        })
        .then(responses => {
            console.log('Detected intent:');
            console.log(sessionClient, responses[0].queryResult);
            return responses[0].queryResult;
        })
        .then(result => {
            console.log(`Parameter: ${result['parameters']['fields']['number'] ? result['parameters']['fields']['number']['numberValue'] : ''}`);
            console.log(`Intent: ${result['intent']['displayName']}`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}