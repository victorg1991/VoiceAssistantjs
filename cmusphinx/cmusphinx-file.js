const cmusphinx = require('./raspberry-cmusphinx');

cmusphinx.detectFile('../audios/tired.wav').then(
    responses => console.log(responses.toString())
).catch(
    err => console.log(err)
);