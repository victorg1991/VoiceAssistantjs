const fs = require('fs');
const ps = require('./index').ps;

const modeldir = './node-pocketsphinx/dictionaries/';
const filename = './audios/tired.wav';

const cmuConfig = new ps.Decoder.defaultConfig();
cmuConfig.setString('-hmm', modeldir + 'en-us');
cmuConfig.setString('-dict', modeldir + 'cmudict-en-us.dict');
cmuConfig.setString('-lm', modeldir + 'en-us.lm.bin');

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
    while ((seg = it.next()) != null) {
        console.log(seg.word, seg.startFrame, seg.endFrame);
    }

    it = decoder.nbest().iter();
    for (i = 0; i < 10 && ((hyp = it.next()) != null); i++) {
        console.log(hyp.hypstr)
    }
});

