const dialogflow = require("@google-cloud/dialogflow");

module.exports = {
  listar_intent: async function (projectId) {
    // La ruta para identificar al agente propietario de los intents.
    const intentsClient = new dialogflow.IntentsClient({
   keyFilename: require("path").join('google-credentials.json')
  });
    const projectAgentPath = intentsClient.agentPath(projectId);
    const request = {
      parent: projectAgentPath,
    };

    // Enviar la solicitud para listar las intenciones.
    return intentsClient.listIntents(request);
    // response.forEach(intent => {
    //   console.log('====================');
    //   console.log(`Intent name: ${intent.name}`);
    //   console.log(`Intent display name: ${intent.displayName}`);
    //   console.log(`Respuestas: ${intent.messages[0].text.text}`);
    //
    //   console.log('Input contexts:');
    //   intent.inputContextNames.forEach(inputContextName => {
    //     console.log(`\tName: ${inputContextName}`);
    //   });//Fin forEach
    //
    //   console.log('Output contexts:');
    //   intent.outputContexts.forEach(outputContext => {
    //     console.log(`\tName: ${outputContext.name}`);
    //   });//Fin forEach
    // });//Fin forEach
  }
}
