'use strict';

const fs = require('fs');

function detectAudio(fileName, modelDir, hmm, dict, lm) {

    return new Promise((resolve, reject) => {
        const mic = require('mic');

        const config = {
            rate: 16000,
            channels: 1,
            debug: true,
            fileType: 'wav',
            exitOnSilence: 30
        };

        const micInstance = mic(config);
        const stream = micInstance.getAudioStream();

        const outputFileStream = fs.WriteStream(fileName);

        stream.pipe(outputFileStream);

        micInstance.start();

        stream.on('data', data => console.log('Recieved Input Stream: ' + data.length));
        stream.on('error', err => console.log('Error in Input Stream: ' + err));
        stream.on('startComplete', () => console.log('Received startComplete'));
        stream.on('stopComplete', () => console.log('Received stopComplete'));
        stream.on('pauseComplete', () => console.log('Received pauseComplete'));
        stream.on('resumeComplete', () => console.log('Received resumeComplete'));

        stream.on('silence', () => {
            console.log('Received silence... let\'s process it');

            micInstance.stop();

            detectFile(fileName, modelDir, hmm, dict, lm).then(
                responses => resolve(responses)
            );
        });

        stream.on('processExitComplete', () => {
            console.log('Got SIGNAL processExitComplete');
            micInstance.stop();

            reject();
        });
    });
}


function createDecoder(hmm, dict, lm) {
    const ps = require('./index').ps;

    const cmuConfig = new ps.Decoder.defaultConfig();
    cmuConfig.setString('-hmm', hmm);
    cmuConfig.setString('-dict', dict);
    cmuConfig.setString('-lm', lm);

    return new ps.Decoder(cmuConfig);
}

function detectFile(fileName, modelDir = './dictionaries/', hmm = modelDir + 'en-us', dict = modelDir + 'cmudict-en-us.dict', lm = modelDir + 'en-us.lm.bin') {

    const decoder = createDecoder(hmm, dict, lm);

    return new Promise((resolve, reject) => {

        fs.readFile(fileName, (err, data) => {
            if (err) reject(err);

            resolve(data);
        })
    }).then(data => {

            console.log(data);

            decoder.startUtt();
            decoder.processRaw(data, false, false);
            decoder.endUtt();

            const results = [];

            const it = decoder.nbest().iter();
            for (let hyp, i = 0; i < 10 && ((hyp = it.next()) != null); i++) {
                results.push(hyp.hypstr)
            }

            return results;
        }
    )
}

module.exports.detectAudio = detectAudio;
module.exports.detectFile = detectFile;
