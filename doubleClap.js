const mic = require("mic");
const wavDecoder = require("wav-decoder");
const header = require("waveheader");

const Gpio = require('onoff').Gpio;
const led = new Gpio(4, 'out');

const config = {
  rate: 44100,
  channels: 1,
  device: `plughw:1`,
  fileType: "wav"
};

const clapsDelta = 2000;
const threshold = 0.7;

let clapsNum = 0;
let lastClapTime = 0;
let ledValue = 0;

const micInstance = mic(config);
const stream = micInstance.getAudioStream();

stream
  .on("data", async buffer => {
    const headerBuf = header(config.rate, config);
    const buffers = [headerBuf, buffer];
    const length = buffers.reduce((acc, x) => acc + x.length, 0);

    const audioData = await wavDecoder.decode(Buffer.concat(buffers, length));
    const wave = audioData.channelData[0];
	const maxAmplitude = Math.max(...wave);
	
    if (maxAmplitude > threshold) {
      const newTime = new Date().getTime();

      if (newTime - lastClapTime > clapsDelta) {
        clapsNum = 0;
      }

      clapsNum++;
      lastClapTime = new Date().getTime();

      if (clapsNum == 2) {
        ledValue = ledValue == 0 ? 1 : 0
        led.writeSync(ledValue);
        clapsNum = 0;
        lastClapTime = 0;
      }
    }
  });

micInstance.start();


process.on('SIGINT', () => {
	led.unexport();
});