'use strict';

const dialogflow = require('./raspberry-dialogflow');

dialogflow.detectAudio().then(responses => {
    console.log('Detected intent:');
    console.log(responses[0].queryResult);
    return responses[0].queryResult;
}).then(result => {
    console.log(`Parameter: ${result['parameters']['fields']['number'] ? result['parameters']['fields']['number']['numberValue'] : ''}`);
    console.log(`Intent: ${result['intent']['displayName']}`);
}).catch(err => {
    console.error('ERROR:', err);
});