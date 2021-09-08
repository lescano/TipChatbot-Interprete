const dialogflow = require("dialogflow");
const { response } = require("express");
const uuid = require("uuid");

module.exports = {
  buscar_intent: async function (projectId, msg) {
    const sessionId = uuid.v4();
    // Create a new session
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: require("path").join('google-credentials.json')
    });
    // const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
    // La solicitud de consulta de texto.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // La consulta para enviar al agente de dialogflow
          text: msg,
          // El lenguaje utilizado por el cliente.
          languageCode: "es",
        },
      }, // Fin queryInput:
    }; // Fin const request
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    return result['fulfillmentText'];
  } // Fin of this function: async function
}//Fin exports
