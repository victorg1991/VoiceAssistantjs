'use strict';

const projectId = 'multilocalesample-a62ad';
const sessionId = 'sessionId';
const dialogflow = require('dialogflow');

const sessionClient = new dialogflow.SessionsClient();

const session = sessionClient.sessionPath(projectId, sessionId);

async function detectText(text, languageCode = 'es-ES') {

    const request = {
        session,
        queryInput: {
            text: {text, languageCode},
        },
    };

    return await sessionClient.detectIntent(request);
}

async function detectFile(filename) {

    const util = require('util');
    const fs = require('fs');

    const readFile = util.promisify(fs.readFile);

    let inputAudio = await readFile(filename);

    const request = {
        session, inputAudio,
        queryInput: {
            audioConfig:
                {audioEncoding: 'AUDIO_ENCODING_LINEAR_16', sampleRateHertz: 16000, languageCode: 'es-ES'}
        }
    };

    return await sessionClient.detectIntent(request);
}

function detectAudio(exitOnSilence = 30) {

    return new Promise(async (resolve, reject) => {

        const mic = require('mic');
        const fs = require('fs');

        const filename = 'test.wav';

        const config = {
            rate: 16000,
            channels: 1,
            debug: true,
            fileType: 'wav',
            exitOnSilence
        };

        const micInstance = mic(config);
        const stream = micInstance.getAudioStream();
        const outputFileStream = fs.WriteStream(filename);

        stream.pipe(outputFileStream);

        micInstance.start();

        stream.on('silence', async () => {
            console.log('Received silence... let\'s process it');
            micInstance.stop();

            const responses = await detectFile(filename);
            resolve(responses);
        });
        stream.on('data', data => console.log('Recieved Input Stream: ' + data.length));
        stream.on('error', err => console.log('Error in Input Stream: ' + err));
        stream.on('startComplete', () => console.log('Received startComplete'));
        stream.on('stopComplete', () => console.log('Received stopComplete'));
        stream.on('pauseComplete', () => console.log('Received pauseComplete'));
        stream.on('resumeComplete', () => console.log('Received resumeComplete'));
        stream.on('processExitComplete', () => {
            console.log('Got SIGNAL processExitComplete');
            micInstance.stop();
            reject();
        });
    });
}

module.exports.detectText = detectText;
module.exports.detectFile = detectFile;
module.exports.detectAudio = detectAudio;