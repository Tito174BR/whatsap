class TextSender{
    static sendMsg(msg, num, client){
        return new Promise(function(resolve, reject){
            client
                .sendText(num, msg)
                .then((result) => {resolve(result)})
                .catch((error) => {reject(error)})
        })
    }

    static delivText = async function(texts, num, client){   //Envia uma array de mensagens de forma async
        try{
            let txt = (typeof(texts) == 'string')?[texts]:texts
            for (let v in txt)
                await this.sendMsg(txt[v], num, client)
        }
        catch(err){
            console.log(err)
        }
    }

    static notText(message, num, client){   //Tratamento no caso de uma mensagem recebida não ser texto
        if ((message.type != 'chat')){      //Depois vai receber docs tambem
            this.delivText('Não posso respondê-lo caso não envie mensagens de texto.', num, client)
            return true
        }
    }

}

export {TextSender}