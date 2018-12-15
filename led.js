const Gpio = require('onoff').Gpio;
const led = new Gpio(4, 'out');
const blinkInterval = setInterval(blinkled, 250);

function blinkled() {
    if (led.readSync() === 0) {
        led.writeSync(1);
    } else {
        led.writeSync(0);
    }
}

process.on('SIGINT', () => {
    clearInterval(blinkInterval);
    led.unexport();
});