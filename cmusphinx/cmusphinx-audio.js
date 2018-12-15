/* pocketsphinx_continuous -hmm  /usr/local/share/pocketsphinx/model/en-us/en-us -lm 9865.lm -dict 9865.dic -samprate 16000/8000/48000 -inmic yes -logfn /dev/null*/
'use strict';

const cmusphinx = require('./raspberry-cmusphinx');

cmusphinx.detectAudio('file.wav', './my-dictionary/', '/usr/local/share/pocketsphinx/model/en-us/en-us', './my-dictionary/9865.dic', './my-dictionary/9865.lm').then(
    responses => console.log(responses.toString())
).catch(
    err => console.log(err)
);