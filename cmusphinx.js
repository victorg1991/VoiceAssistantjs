const fs = require('fs');
const ps = require('./node-pocketsphinx/index').ps;

const modeldir = './node-pocketsphinx/dictionaries/';
const filename = './audios/tired.wav';

const config = new ps.Decoder.defaultConfig();
config.setString('-hmm', modeldir + 'en-us');
config.setString('-dict', modeldir + 'cmudict-en-us.dict');
config.setString('-lm', modeldir + 'en-us.lm.bin');

const decoder = new ps.Decoder(config);

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

