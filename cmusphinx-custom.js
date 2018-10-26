/* pocketsphinx_continuous -hmm  /usr/local/share/pocketsphinx/model/en-us/en-us -lm 9865.lm -dict 9865.dic -samprate 16000/8000/48000 -inmic yes -logfn /dev/null*/

'use strict';

const fs = require('fs');
const ps = require('./node-pocketsphinx/index').ps;
const mic = require('mic');

const modeldir = './node-pocketsphinx/my-dictionary/';
const name = '9865';
const filename = 'file.wav';

const config = {
    rate: 16000,
    channels: 1,
    debug: true,
    fileType: 'wav',
    exitOnSilence: 30
};

const cmuConfig = new ps.Decoder.defaultConfig();
cmuConfig.setString('-hmm', '/usr/local/share/pocketsphinx/model/en-us/en-us');
cmuConfig.setString('-dict', `${modeldir}${name}.dic`);
cmuConfig.setString('-lm', `${modeldir}${name}.lm`);

const micInstance = mic(config);
const stream = micInstance.getAudioStream();

const outputFileStream = fs.WriteStream(filename);

stream.pipe(outputFileStream);

micInstance.start();

stream.on('data', function (data) {
    console.log('Recieved Input Stream: ' + data.length);
});

stream.on('error', function (err) {
    console.log('Error in Input Stream: ' + err);
});

stream.on('startComplete', function () {
    console.log('Received startComplete');
});

stream.on('stopComplete', function () {
    console.log('Received stopComplete');
});

stream.on('pauseComplete', function () {
    console.log('Received pauseComplete');
});

stream.on('resumeComplete', function () {
    console.log('Received resumeComplete');
});

stream.on('silence', function () {
    console.log('Received silence... let\'s process it');

    micInstance.stop();

    detectAudioIntent(filename);
});

stream.on('processExitComplete', function () {
    console.log('Got SIGNAL processExitComplete');

    micInstance.stop();
});

function detectAudioIntent(filename) {
    const decoder = new ps.Decoder(cmuConfig);

    fs.readFile(filename, function (err, data) {
        if (err) {
            throw err;
        }
        decoder.startUtt();
        decoder.processRaw(data, false, false);
        decoder.endUtt();

        console.log(decoder.hyp());

        let it = decoder.seg().iter();
        let seg, hyp;
        while ((seg = it.next()) != null) {
            console.log(seg.word, seg.startFrame, seg.endFrame);
        }

        it = decoder.nbest().iter();
        for (let i = 0; i < 10 && ((hyp = it.next()) != null); i++) {
            console.log(hyp.hypstr)
        }
    });
}