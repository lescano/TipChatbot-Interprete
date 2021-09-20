'use strict';

const dialogflow = require('@google-cloud/dialogflow');
// const intentsClient = new dialogflow.IntentsClient();

module.exports = {
    borrar_intent: async function (projectId, intentId) {

        const intentsClient = new dialogflow.IntentsClient({
            keyFilename: require("path").join('google-credentials.json')
        });

        const intentPath = intentsClient.intentPath(projectId, intentId);

        const request = { name: intentPath };

        // Send the request for deleting the intent.
        const result = await intentsClient.deleteIntent(request);
        console.log(`Intent ${intentPath} deleted`);
        return result;

    }
}
