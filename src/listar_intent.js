const dialogflow = require("@google-cloud/dialogflow");

module.exports = {
    listar_intent: async function (projectId) {
        const intentsClient = new dialogflow.IntentsClient({
            keyFilename: require("path").join('google-credentials.json')
        });
        const projectAgentPath = intentsClient.agentPath(projectId);
        const request = {
            parent: projectAgentPath,
        };
        return intentsClient.listIntents(request);
    }
}
