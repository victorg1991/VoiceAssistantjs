

const query = 'apaga la luz';

const projectId = 'multilocalesample-a62ad';
const sessionId = 'sessionId';
const languageCode = 'es-ES';

const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const request = {
    session: sessionPath,
    queryInput: {
        text: {
            text: query,
            languageCode: languageCode,
        },
    },
};

sessionClient
    .detectIntent(request)
    .then(responses => {

        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
            console.log(`  Intent: ${result.intent.displayName}`);
        } else {
            console.log(`  No intent matched.`);
        }
    })
    .catch(err => {
        console.error('ERROR:', err);
    });