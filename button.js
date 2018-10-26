const Gpio = require('onoff').Gpio;
const led = new Gpio(4, 'out');
const button = new Gpio(21, 'in', 'both');

let value = 0;
console.log(button);
button.watch((err, value) => {
	if (err) {
	  throw err;
	}
	value = value == 0 ? 1: 0
	led.writeSync(value);
  });

process.on('SIGINT', () => {
	led.unexport();
	button.unexport();
});
