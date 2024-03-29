const express = require('express');
const router = express.Router();

const consultar_intent = require('../src/consultar_intent');
const listar_intent = require('../src/listar_intent');
const crear_intent = require('../src/nuevo_intent');
const borrar_intent = require('../src/borrar_intent');
const fetch = require('node-fetch');
const { response } = require('express');
const chatbotID = "chatbot-pablot-290222";
const ServidorBackend = 'https://chatbot2-tip-backend.herokuapp.com/';
//const ServidorBackend = 'http://localhost:8080/';

let usuarioPregunton = 0;

router.get('/', (req, res) => {
    console.log("ERROR GET");
    res.send("ERROR GET");
});

router.post('/ultima', (req, res) => {
    /* if(this.respuesta == 'Debe iniciar sesion para responder esta pregunta')
       res.status(403).send('Debe iniciar sesion para responder esta pregunta');
     if(this.respuesta == 'A ocurido un error! No se encontro lo solicitado')
       res.status(404).send('A ocurido un error! No se encontro lo solicitado');*/
    res.send({ Reply: this.respuesta })
});

//Atiendo los intent que funcionan con webhook
router.post('/contexto', (req, res) => {
    const body = { id: usuarioPregunton };
    let acction = req.body.queryResult.intent.displayName;
    console.log(acction);

    //Solo se respondera este tipo de preguntas a usuarios logeados
    if (usuarioPregunton == "0") {
        this.respuesta = 'Debe iniciar sesion para responder esta pregunta';
    } else {
        switch (acction) {
            case "Wiki RPyL":
                let wikiapi = "http://wiki-rpl-tipy.jesusguibert.com/mediawiki/api.php?action=query&list=search&srwhat=text&format=json&srsearch=";
                let min = req.body.queryResult.queryText.toLowerCase();
                let buscar = min.split("wiki rpyl ");
                //this.respuesta = ;
                fetch(wikiapi + buscar[1]).then(res => res.json()) // expecting a json response
                    .then(json => {
                        let devolver = "";
                        if (json.query.search.length == 0) {
                            devolver = "No se han encontrado resultados en la wiki";
                        } else {
                            devolver = "He encontrado esto: <br>"
                            for (let i = 0; i < json.query.search.length; i++) {
                                devolver += json.query.search[i].title + ": <a target='_blank' href='http://wiki-rpl-tipy.jesusguibert.com/mediawiki/index.php/" + json.query.search[i].title + "'>Ver más<a>  <br>";
                            }
                        }
                        this.respuesta = devolver;
                    });
                break;
            case "Materias primer semestre":
                //Si el usuario quere saber a que materias se puede anotar de un semestre distindo al primero
                //se calcula que materias tiene aprobadas y se le responde
                let ingreso = req.body.queryResult.queryText;
                if (ingreso != "primero" || ingreso != "Primer" || ingreso != "1") {
                    fetch(ServidorBackend + 'preguntas/FAQcal6', {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: { 'Content-Type': 'application/json' }
                    })
                        .then(res => res.json()) // expecting a json response
                        .then(json => this.respuesta = json.Reply);
                    break;
                }
                //En caso de que quiera saber del primer semestre dialogflow se encarga de responder
                break;
            case "Cantidad de creditos":
                fetch(ServidorBackend + 'preguntas/FAQcal1', {
                    method: 'POST',
                    body: JSON.stringify({ id: usuarioPregunton }),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(res => res.json()) // expecting a json response
                    .then(json => this.respuesta = json.Reply);
                break;
            case "Creditos restantes":
                fetch(ServidorBackend + 'preguntas/FAQcal2', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(res => res.json()) // expecting a json response
                    .then(json => this.respuesta = json.Reply);
                break;
            case "Pasantia":
                fetch(ServidorBackend + 'preguntas/FAQcal3', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(res => res.json()) // expecting a json response
                    .then(json => this.respuesta = json.Reply);
                break;
            case "Proyecto Final":
                fetch(ServidorBackend + 'preguntas/FAQcal4', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(res => res.json()) // expecting a json response
                    .then(json => this.respuesta = json.Reply);
                break;
            case "Clases hoy":
                fetch(ServidorBackend + 'preguntas/FAQcal7', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(res => res.json()) // expecting a json response
                    .then(json => this.respuesta = json.Reply);
                break;
            case "Clases mañana":
                fetch(ServidorBackend + 'preguntas/FAQcal5', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(res => res.json()) // expecting a json response
                    .then(json => this.respuesta = json.Reply);
                break;
            default:
                console.log("ERROR POST");
                this.respuesta = 'A ocurido un error! No se encontro lo solicitado';
                break;
        }
    }
});

function getDateForHistory() {
    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();


    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return year + "" + month + "" + day;
}

function getTimeForHistory() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;

    return hours + ":" + minutes;
}


router.post('/send-msg', (request, response) => {
    usuarioPregunton = request.body.id;
    consultar_intent.buscar_intent(chatbotID, request.body.MSG)
        .then((resultDialogFlow) => {
            if (resultDialogFlow.includes("asignatura-") || resultDialogFlow.localeCompare("getFeriados") == 0)
                response.send({ Reply: resultDialogFlow })
            else if (resultDialogFlow.localeCompare('error') == 0) {
                fetch(ServidorBackend + 'preguntas/insertUnansweredQuestion', {
                    method: 'POST',
                    body: JSON.stringify({ question: request.body.MSG }),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(responseInsertQuestion => responseInsertQuestion.json())
                    .then(responseInsertQuestionJson => {
                        if (usuarioPregunton && usuarioPregunton != 0) {
                            fetch(ServidorBackend + 'historial/insertUserHistory', {
                                method: 'POST',
                                body: JSON.stringify({ idUser: usuarioPregunton, question: request.body.MSG, answer: "No tengo una respuesta para esta pregunta 😞", currentDate: getDateForHistory(), currentTime: getTimeForHistory(), subjectCode: null }),
                                headers: { 'Content-Type': 'application/json' }
                            })
                                .then(responseInsertHistory => responseInsertHistory.json())
                                .then(responseInsertHistoryJson => {
                                    response.send({ Reply: resultDialogFlow })
                                });
                        } else response.send({ Reply: resultDialogFlow });
                    });
            } else {
                if (usuarioPregunton && usuarioPregunton != 0) {
                    fetch(ServidorBackend + 'historial/insertUserHistory', {
                        method: 'POST',
                        body: JSON.stringify({ idUser: usuarioPregunton, question: request.body.MSG, answer: resultDialogFlow, currentDate: getDateForHistory(), currentTime: getTimeForHistory(), subjectCode: null }),
                        headers: { 'Content-Type': 'application/json' }
                    })
                        .then(responseInsertHistory => responseInsertHistory.json())
                        .then(responseInsertHistoryJson => {
                            response.send({ Reply: resultDialogFlow })
                        });
                } else response.send({ Reply: resultDialogFlow });
            }
        })
        .catch((err) => {
            response.status(500).send('A ocurido un error! Con el servidor');
            console.error("ERROR:", err);
        });
});

router.get('/listar-intent', (req, res) => {
    listar_intent.listar_intent(chatbotID)
        .then((results) => {
            res.send({ Reply: results })
        })
        .catch((err) => {
            res.status(500).send('A ocurido un error! Con el servidor');
            console.error("ERROR:", err);
        });
})

router.post('/nuevo-intent', (req, res) => {
    crear_intent.crear_intent(chatbotID, req.body.respuesta, req.body.pregunta, req.body.nombreIntent)
        .then((results) => {
            res.send({ Reply: results })
        }) //End of .then(results =>
        .catch((err) => {
            res.status(500).send('A ocurido un error! Con el servidor');
            console.error("ERROR:", err);
        });
})

router.post('/borrar-intent', (req, res) => {
    borrar_intent.borrar_intent(chatbotID, req.body.idIntent)
        .then((results) => {
            res.send({ Reply: results })
        }) //End of .then(results =>
        .catch((err) => {
            res.status(500).send('A ocurido un error! Con el servidor');
            console.error("ERROR:", err);
        }); // End of .catch
})

module.exports = router;
