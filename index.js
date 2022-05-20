import {create, Whatsapp} from 'venom-bot';
import { TextSender } from './utils.js';
import { Message, DataBase, User } from './services/Utils.js';

var data = new DataBase()

create({
   session: 'Direto',
   // multidevice: true
}).then((client) => start(client)).catch((err) => {
   console.error("Deu erro aqui",err);
})

async function start(client) {
   client.onMessage((message) => {
      try {
         let id = message.from
         if(!(data.users[id])) {
            data.registerUser = new User(id)
            TextSender.delivText(data.newMessage(new Message(message.body, message.type), id, true), id, client)
            return
         }
         if (TextSender.notText(message, id, client)) {
            return
         }
         TextSender.delivText(data.newMessage(new Message(message.body, message.type), id, false), client)
         
      } catch (err) {
         console.log("Deu erro aqui tambem ", err);
         console.log("escopo ", message.body)
      }
   });
}