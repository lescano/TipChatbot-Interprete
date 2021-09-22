const express = require('express');
const telegram = express.Router();

const { Telegraf } = require('telegraf');
const bot = new Telegraf('1810837157:AAFfqea8zY4A207Ye3-z22XCnStC-s_l_Lo');

const consultar_intent = require('../src/consultar_intent');
const fetch = require('node-fetch');
const { response } = require('express');
const chatbotID = "chatbot-pablot-290222";
const ServidorBackend = 'https://chatbot2-tip-backend.herokuapp.com/';
//const ServidorBackend = 'http://localhost:8080/';

/* VL 9/2021
*   SOBRE TELEGRAM: los id de telegram pueden llegar a ser distintos
*   el id del chat (telegram_chat_id) hace referencia al canal donde se están enviando los mensajes
*   y el ctx.from.id (id_telegram) es el id propiamente del usuario y su chat privado
*   en caso de que estos dos id sean iguales sabemos que los mensajes se están produciendo 
*   en el chat privado que tiene el usuario con el bot
*   en caso de que los id sean distintos puede ser que el usuario esté enviando mensajes en un grupo o canal de telegram
*/

let respuesta = "";
let telegram_chat_id = "";
let codigo_asignatura = "";
let cedula_usuario = "";
let id_telegram = "";




//este comando se usa para guardar el id de telegram en el usuario del sitio web
//luego desde el sitio web se completa la verificación del usuario
bot.command('verificar', ctx => {

    this.telegram_chat_id = ctx.chat.id;
    //console.log("mensaje: "+ctx.message);
    
    let mensaje = ctx.message.text.split(" ");
    let id_telegram = ctx.from.id;
    this.cedula_usuario = mensaje[1];

    //mediante esta llamada al backend obtengo el objeto usuario segun la cedula
    fetch(ServidorBackend + 'usuario/detalleC', {
    method: 'POST',
    body: JSON.stringify({ cedula: this.cedula_usuario }),
    headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json()) // expecting a json response
    .then(json => {
        console.log(json.usuario);
        if (json.usuario == null){
            bot.telegram.sendMessage(this.telegram_chat_id, 'La cédula '+this.cedula_usuario+' no se encuentras registrada en el sistema. Por favor registrate en: https://chatbot2-tip-frontend.herokuapp.com');
        }
        else {
            fetch(ServidorBackend + 'usuario/verifyTelegram', {
                method: 'POST',
                body: JSON.stringify({ 
                    id: json.usuario.id, 
                    id_telegram: id_telegram, 
                    activo_telegram:false,
                    frontend: false
                }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(json => {

                if (json.ok){
                    bot.telegram.sendMessage(this.telegram_chat_id, 'Podrás activar tu usuario de telegram desde tu perfil en: https://chatbot2-tip-frontend.herokuapp.com');
                }
                else if (!json.ok){
                    bot.telegram.sendMessage(this.telegram_chat_id, 'A ocurido un error al verificar el usuario, por favor intente más tarde');
                    console.error("ERROR:", json.err);
                }
            })
            .catch((err) => {
                bot.telegram.sendMessage(this.telegram_chat_id, 'A ocurido un error al verificar el usuario, por favor intente más tarde');
                console.error("ERROR:", err);
            });
        }
     })
    .catch((err) => {
        bot.telegram.sendMessage(this.telegram_chat_id, 'A ocurido un error! Con el servidor');
        console.error("ERROR:", err);
    });
});

bot.on('text', (ctx) => {

    this.telegram_chat_id = ctx.chat.id;

    if (ctx.message.text == "1" && this.codigo_asignatura != "") {
        //bot.telegram.sendMessage(this.telegram_chat_id, "Se está buscando información sobre quien dicta esta materia...");

        fetch(ServidorBackend + 'preguntas/FAQcal11', {
            method: 'POST',
            body: JSON.stringify({ codigo: this.codigo_asignatura }),
            //body: JSON.stringify({codigo : "i2"}),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json()) // expecting a json response
            .then(json => {
                this.respuesta = json.Reply
                bot.telegram.sendMessage(this.telegram_chat_id, this.respuesta);
                bot.telegram.sendMessage(this.telegram_chat_id, "¿Deseas saber algo más?: 1: ¿Quién la dicta?, 2: Horarios, 3: Evaluaciones, 4: Límite de inscripción, 5: Créditos que otorga");//, 6: ¿Puedo cursarla?");
            })
            .catch((err) => {
                bot.telegram.sendMessage(this.telegram_chat_id, 'A ocurido un error! Con el servidor');
                console.error("ERROR:", err);
            });
    }
    else if (ctx.message.text == "2" && this.codigo_asignatura != "") {

        //let cod = ctx.message.text.split("-");
        //let codigo = cod[1];

        fetch(ServidorBackend + 'preguntas/FAQcal9', {
            method: 'POST',
            body: JSON.stringify({ codigo: this.codigo_asignatura }),
            //body: JSON.stringify({codigo : "i2"}),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json()) // expecting a json response
            .then(json => {
                this.respuesta = json.Reply
                bot.telegram.sendMessage(this.telegram_chat_id, this.respuesta);
                bot.telegram.sendMessage(this.telegram_chat_id, "¿Deseas saber algo más?: 1: ¿Quién la dicta?, 2: Horarios, 3: Evaluaciones, 4: Límite de inscripción, 5: Créditos que otorga");//, 6: ¿Puedo cursarla?");
            })
            .catch((err) => {
                bot.telegram.sendMessage(this.telegram_chat_id, 'A ocurido un error! Con el servidor');
                console.error("ERROR:", err);
            });
    }
    else if (ctx.message.text == "3" && this.codigo_asignatura != "") {

        fetch(ServidorBackend + 'preguntas/FAQcal10', {
            method: 'POST',
            body: JSON.stringify({ codigo: this.codigo_asignatura }),
            //body: JSON.stringify({codigo : "i2"}),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json()) // expecting a json response
            .then(json => {
                this.respuesta = json.Reply
                bot.telegram.sendMessage(this.telegram_chat_id, this.respuesta);
                bot.telegram.sendMessage(this.telegram_chat_id, "¿Deseas saber algo más?: 1: ¿Quién la dicta?, 2: Horarios, 3: Evaluaciones, 4: Límite de inscripción, 5: Créditos que otorga");//, 6: ¿Puedo cursarla?");
            })
            .catch((err) => {
                bot.telegram.sendMessage(this.telegram_chat_id, 'A ocurido un error! Con el servidor');
                console.error("ERROR:", err);
            });
    }
    else if (ctx.message.text == "4" && this.codigo_asignatura != "") {

        fetch(ServidorBackend + 'preguntas/FAQcal12', {
            method: 'POST',
            body: JSON.stringify({ codigo: this.codigo_asignatura }),
            //body: JSON.stringify({codigo : "i2"}),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json()) // expecting a json response
            .then(json => {
                this.respuesta = json.Reply
                bot.telegram.sendMessage(this.telegram_chat_id, this.respuesta);
                bot.telegram.sendMessage(this.telegram_chat_id, "¿Deseas saber algo más?: 1: ¿Quién la dicta?, 2: Horarios, 3: Evaluaciones, 4: Límite de inscripción, 5: Créditos que otorga");//, 6: ¿Puedo cursarla?");
            })
            .catch((err) => {
                bot.telegram.sendMessage(this.telegram_chat_id, 'A ocurido un error! Con el servidor');
                console.error("ERROR:", err);
            });
    }
    else if (ctx.message.text == "5" && this.codigo_asignatura != "") {

        fetch(ServidorBackend + 'preguntas/FAQcal13', {
            method: 'POST',
            body: JSON.stringify({ codigo: this.codigo_asignatura }),
            //body: JSON.stringify({codigo : "i2"}),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json()) // expecting a json response
            .then(json => {
                this.respuesta = json.Reply
                bot.telegram.sendMessage(this.telegram_chat_id, this.respuesta);
                bot.telegram.sendMessage(this.telegram_chat_id, "¿Deseas saber algo más?: 1: ¿Quién la dicta?, 2: Horarios, 3: Evaluaciones, 4: Límite de inscripción, 5: Créditos que otorga");//, 6: ¿Puedo cursarla?");
            })
            .catch((err) => {
                bot.telegram.sendMessage(this.telegram_chat_id, 'A ocurido un error! Con el servidor');
                console.error("ERROR:", err);
            });
    }
    else if (ctx.message.text == "6" && this.codigo_asignatura!=""){

        this.id_telegram = ctx.from.id;
        //buscar en la base de datos si hay un usuario con este id de telegram
        fetch(ServidorBackend + 'usuario/detalleUT', {
            method: 'POST',
            body: JSON.stringify({ id_telegram: this.id_telegram }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json.usuario);
            if(json.usuario){       //en caso positivo se va a la FAQcalc8

                fetch(ServidorBackend + 'preguntas/FAQcal8',{
                    method: 'POST',
                    body: JSON.stringify({codigo : this.codigo_asignatura, id: json.usuario.id}),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(res => res.json()) // expecting a json response
                .then(json => {
                    this.respuesta = json.Reply
                    bot.telegram.sendMessage(this.id_telegram, this.respuesta);
                    bot.telegram.sendMessage(this.id_telegram, "¿Deseas saber algo más?: 1: ¿Quién la dicta?, 2: Horarios, 3: Evaluaciones, 4: Límite de inscripción, 5: Créditos que otorga, 6-cedula: ¿Puedo cursarla?");
                })
                .catch((err) => {
                    bot.telegram.sendMessage(this.id_telegram, 'A ocurido un error! Con el servidor');
                    console.error("ERROR:", err);
                });
            }
            else{               //en caso negativo se pide que verifique su usuario telegram
                bot.telegram.sendMessage(this.id_telegram, 'No se ha encontrado su usuario en el sistema.');
                bot.telegram.sendMessage(this.id_telegram, 'Por favor active sus usuario con el comando /verificar seguido de su cédula sin puntos ni guiones');
            }
        })

     }
    else {
        consultar_intent.buscar_intent(chatbotID, ctx.message.text)
            .then((results) => {
                if (results.includes("asignatura-")) {
                    let cod = results.split("-");
                    this.codigo_asignatura = cod[1];
                    bot.telegram.sendMessage(this.telegram_chat_id, "¿Qué deseas saber sobre esta asignatúra?: 1: ¿Quién la dicta?, 2: Horarios, 3: Evaluaciones, 4: Límite de inscripción, 5: Créditos que otorga");//, 6: ¿Puedo cursarla?");
                }
                else {
                    this.codigo_asignatura = "";
                    bot.telegram.sendMessage(this.telegram_chat_id, results);
                }
            })
    }
});


bot.launch();

module.exports = telegram;
