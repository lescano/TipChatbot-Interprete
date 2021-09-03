'use strict';
const dialogflow = require("@google-cloud/dialogflow");

module.exports = {
    crear_intent: async function (projectId, respuesta, preguntas, nombreIntent) {
        const intentsClient = new dialogflow.IntentsClient({
            keyFilename: require("path").join('google-credentials.json')
        });

        // La ruta para identificar al agente que posee la intención creada.
        const agentPath = intentsClient.agentPath(projectId);
        const trainingPhrases = [];
        //preguntas = [preguntas];
        respuesta = [respuesta];

        preguntas.forEach(pregunta => {
            let part = {
                text: pregunta
            };

            // Aquí creamos una nueva frase de entrenamiento para cada parte proporcionada.
            let trainingPhrase = {
                type: 'EXAMPLE',
                parts: [part]
            };
            trainingPhrases.push(trainingPhrase);
        });
        const messageText = {
            text: respuesta,
        };
        const message = {
            text: messageText,
        };
        const intent = {
            displayName: nombreIntent,
            trainingPhrases: trainingPhrases,
            messages: [message],
        };

        // webhookState: 'WEBHOOK_STATE_ENABLED_FOR_SLOT_FILLING',
        const createIntentRequest = {
            parent: agentPath,
            intent: intent,
        };
        // Create the intent
        const [response] = await intentsClient.createIntent(createIntentRequest);
        return `Intent ${response.name} created`;
    }//Fin de la funcion
}//Fin exports
