const Gpio = require('pigpio').Gpio;
const motor = new Gpio(10, {mode: Gpio.OUTPUT});

let pulseWidth = 1000;

setInterval(_ => motor.servoWrite(pulseWidth), 2000);

// we need setInterval or something that sleeps for some time until the servo finishes moving