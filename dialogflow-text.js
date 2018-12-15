'use strict';

const dialogflow = require('./raspberry-dialogflow');

const text = 'apaga la luz';
const languageCode = 'es-ES';

dialogflow.detectText(text, languageCode).then(responses => {

    console.log('Detected intent!');

    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }
}).catch(err => {
    console.error('ERROR:', err);
});