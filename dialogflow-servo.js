'use strict';

const dialogflow = require('./raspberry-dialogflow');

dialogflow.detectAudio().then(responses => {
    console.log('Detected intent:');
    console.log(responses[0].queryResult);
    return responses[0].queryResult;
}).then(result => {
    console.log(`Parameter: ${result['parameters']['fields']['number'] ? result['parameters']['fields']['number']['numberValue'] : ''}`);
    console.log(`Intent: ${result['intent']['displayName']}`);

    const Gpio = require('pigpio').Gpio;
    const motor = new Gpio(10, {mode: Gpio.OUTPUT});

    motor.servoWrite(result['parameters']['fields']['number']['numberValue']);

    setTimeout(_ => _, 1000)

}).catch(err => {
    console.error('ERROR:', err);
});