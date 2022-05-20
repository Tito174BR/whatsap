import {chat, ChatManager} from './ChatFlow.js'

class Message{              //Guarda utilidades da mensagem recebida
    constructor(str, type){
        this.msgbody = str
        this.wrds = this.cleanText(str)
        this.wrdslen = this.wrds.length
        this.type = type
        this.positive = (['sim', 'ok', 'certo', 'beleza', 'concordo'].some((x) => this.wrds.includes(x)) || 
             this.wrds.includes('tudo') && this.wrds.includes('bem')) &&
             !this.wrds.includes('nao')
        this.negative = (['nao', 'não', 'discordo', 'errado'].some((x) => this.wrds.includes(x))) &&
            !this.wrds.includes('sim')
        this.data = ''
    }

    checkTags(id){     //Testa se encontrou alguma das tags na mensagem
        try{
            if (/[~]/g.test(id)){
                switch(id){
                    case '~sim~':
                        return this.positive
                    case '~nao~':
                        return this.negative
                    case '~nome~':
                        this.data = this.wrds.reduce((acc, i) =>{acc += 
                            (!(['do', 'de', 'da'].includes(i)))?(i[0].toUpperCase()+i.slice(1)+' '):(i+' ')
                            return acc},'').trim()
                        return this.wrdslen > 1
                    case '~cpf~':
                        this.data = (this.msgbody.match(/\d/g)).reduce((acc, i)=>{acc+=i;return acc},'')
                        return this.data.length == 11
                    case '~def~':
                        return true
                    case '~num~':
                        return /\d+/g.test(this.msgbody)
                    case '~nop~':
                        return false
                }
            } else {
                return id.split('-').reduce((acc, i)=>{acc=(!this.wrds.includes(i)?false:acc);return acc},true)
            }
        }catch(err){
            console.log(err)
            return false
        }
    }

    validateDate(){
        let meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 
            'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
        this.data = this.msgbody.match(/\d+/g)
        if(this.data.length == 3){
            this.data = this.data.reduce((acc, i, k)=>{acc += ((k!=2)?((i.length==1)?'0':''+`${i}/`):
                ((i.length==2)?'19':''+`${i}`)); return acc}, '')
        } else {
            if(this.data.length == 1)
                return false
            else {
                let mes = this.wrds.reduce((acc, i)=>{let x = meses.indexOf(i); acc=(x!=-1)?
                    ((`${x+1}`.length!=2?'0':'')+`${x+1}`):acc; return acc}, 0)
                if(parseInt(mes) == 0)
                    return false
                this.data = `${(this.data[0].length==1)?'0':''+`${this.data[0]}`}/${mes}/`+
                    `${(this.data[1].length==2)?'19':''+`${this.data[1]}`}`
            }
        }
        let info = this.data.split('/')
        info[2] = (info[2].length == 2)?`19${info[2]}`:info[2]
        info = info.map((i)=>parseInt(i))
        let date = new Date()
        let test = info[0]>0 && info[1]>0 && info[2]>0 && info[1] <= 12 &&
            [1, 3, 5, 7, 8, 10, 12].includes(info[1])?(info[0]<=31):((info[1]==2)?
            ((info[2]%4==0)?info[0]<=29:info[0]<=28):info[0]<=30)
        test = test && (info[2] < (parseInt(date.getFullYear()) - 12))
        return test
    }

    cleanText(str){
        let txt = str.replace('ç', 'c')
        return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z]/g, ' ').split(' ').reduce((acc, i)=>{(!i=='')?acc.push(i):null; return acc},[])
    }
}

class DataBase{                 //Guarda todos os usuários
    constructor(){
        this.users = {}
    }

    /**
     * @param {User} obj
     */
    set registerUser(obj){      //Registra um usuário
        this.users[obj.id] = obj
    }

    resetUser(id){              //Reseta o usuário 
        this.users[id] = null
    }

    chatManag(id){
        return this.users[id].chat
    }

    newMessage(msg, id, first=false){
        let stuff = this.chatManag(id).newMessage(msg, this.users[id].data, first)
        console.log(stuff)
        switch(stuff.act){
            case 'set-usertype-cpf':
                this.users[id].type = 'cpf'
                break
            case 'validate-data':
                this.users[id].data[stuff.type] = this.chatManag(id).data
        }
        return stuff.msg
    }
}

class User{     //Guarda atributos sobre o usuário
    constructor(num){
        this.id = num
        //this.number = num.split('@')[0].slice(-8)
        this.type = 'new_user'
        this.chat = new ChatManager()
        this.data = {}
        this.data['~nome~'] = null
        this.data['~cpf~'] = null
    }
}

export { Message, DataBase, User }