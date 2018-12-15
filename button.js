const Gpio = require('onoff').Gpio;
const led = new Gpio(4, 'out');
const button = new Gpio(21, 'in', 'both');

button.watch((err, value) => {
    console.log(`value received: ${value}`);
    if (err) {
        throw err;
    }
    led.writeSync(value);
});

process.on('SIGINT', () => {
    led.unexport();
    button.unexport();
});
